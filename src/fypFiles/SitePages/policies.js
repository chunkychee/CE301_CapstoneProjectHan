import {React,useEffect,useState } from "react";
import axios from 'axios';
import {AiOutlineInsurance,AiTwotoneHome,} from "react-icons/ai";
import { ImBooks } from "react-icons/im";
import { GoFileSubmodule } from "react-icons/go";
import { RiMessage2Fill } from "react-icons/ri"; 
import { useUser } from "../JWTuserDetails";
import {useNavigate} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";
import moment from 'moment';
import Modal from 'react-modal';
Modal.setAppElement('#root');

 export const Policies = () => {
  const { loggedEmail, setLoggedEmail } = useUser();
  const { clientName, setclientName } = useUser();
  const defaultImageURL = `${process.env.PUBLIC_URL}/defaultimage.png`;
  const [selectedImage, setSelectedImage] = useState(defaultImageURL);
  const navigate = useNavigate()
  const [logout,setLogout] = useState({
    showBubble:true,
    logoutt:false
  })

  //sidebar dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);

  //main drop down
  const [DropdownPolicies, setDropdownPolicies] = useState({
    Critical:false,
    Hospital:false,
    PersonalAcc:false,
    Disability:false,
    LifeInsure:false,
    Investment:false,
  });

  ////////////////////////claim forms///////////////////////////////
  const [ClaimPolicy, setClaimPolicy] = useState({
    policyid:"",
    policyidDate: "",
    policyidAmt: "",
    policyImg:"",
    policyidImgType:"",
    policyidImgBool:false,
    successMsg:""
  });

   
  const handleFileUpload = (e) => {
    const name = e.currentTarget.getAttribute('name')
    const value = e.target.value
     if(name === "policyDate"){
      const convertDate = moment(value).format('YYYY-MM-DD')
      setClaimPolicy((prev) => ({
        ...prev,
        policyidDate: convertDate
       }));
    }else if(name === "policyAmt"){
      setClaimPolicy((prev) => ({
        ...prev,
        policyidAmt: value
       }));
    }else if(name === "policyImg"){
      const imageData = e.target.files[0];
      const imageformatMime = imageData.type; 
      const reader = new FileReader();
      reader.onload = async function(e) {
        let imageAsURL = e.target.result; // This is your image as a base64 string
        let blob = await (await fetch(imageAsURL)).blob();
        setClaimPolicy((prev) => ({
          ...prev,
          policyImg: blob,
          policyidImgType: imageformatMime,
          policyidImgBool: true
        }));
      };
      reader.readAsDataURL(imageData);
    }    
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ClaimPolicy.policyidDate && ClaimPolicy.policyidAmt && ClaimPolicy.policyImg && ClaimPolicy.policyidImgType !== "") {
      try {
        const formData = new FormData();
        for (const key in ClaimPolicy) {
          formData.append(key, ClaimPolicy[key]);
        }
        const sessionEmail = sessionStorage.getItem('clientemail')
        const sessionConEmail = sessionStorage.getItem('consultantemail')
        const sessionClientName = sessionStorage.getItem('clientname')
        formData.append('sessionEmail', sessionEmail);
        formData.append('sessionConEmail', sessionConEmail);
        formData.append('sessionClientName', sessionClientName);
        const payloadClaims = await axios.post("http://localhost:3004/Claims", formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Setting content type header
          }
        }); 
        if (payloadClaims.status === 201) {
          setClaimPolicy((prev) => ({
            ...prev,
            successMsg: "Claim submitted! Your consultant will review it shortly."
          }));
        } else if (payloadClaims.data.NoConsultantMsg) {
          setClaimPolicy((prev) => ({
            ...prev,
            successMsg: payloadClaims.data.NoConsultantMsg
          }));
        }
      } catch (err) {
        console.error("Error in one or more requests:", err);
        if (err.response && err.response.data.NoConsultantMsg) {
          setClaimPolicy((prev) => ({
            ...prev,
            successMsg: err.response.data.NoConsultantMsg
          }));
        }
      }
    } else {
      setClaimPolicy((prev) => ({
        ...prev,
        successMsg: "Input all the fields and submit again."
      }));
    }
  };
  
  
  const PoliciesDropdown =()=>{
    setDropdownVisible(prev => !prev);
  }

  //sidebar profile picture 
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(file);
     }
  }

  const nav=(e)=>{
    const click = e.currentTarget.getAttribute('name')
    if(click === "Home"){
      navigate("/usersite");
    }else if(click ==="policies"){
      navigate("/policies");
    }else if(click ==="buypolicies"){
      navigate("/Buypolicies");
    }else if(click === "log-out"){
      sessionStorage.clear()
      navigate("/signin")
    }else if(click ==="tripledot"){
       setLogout((prev) => ({
        ...prev,
        showBubble: !prev.showBubble
      }));
    } 
  }

 const toggleDropdown = (e) => {
  const name = e.currentTarget.getAttribute('name')
  switch (name) {
    case "Critical":
      setDropdownPolicies((prev) => ({
        ...prev,
        Critical: !prev.Critical,
        Hospital:false,
        PersonalAcc:false,
        Disability:false,
        LifeInsure:false,
        Investment:false
      }));
      setsubDropdown((prev) => ({
        ...prev,
        DropdownPolicyid1: false,
        DropdownPolicyid2: false
      }));
      break;
    case "Hospital":
      setDropdownPolicies((prev) => ({
        ...prev,
        Hospital: !prev.Hospital,
        Critical:false,
        PersonalAcc:false,
        Disability:false,
        LifeInsure:false,
        Investment:false
      }));
      setsubDropdown((prev) => ({
        ...prev,
        DropdownPolicyid3: false,
        DropdownPolicyid4: false
      }));
      break;
    case "PersonalAcc":
      setDropdownPolicies((prev) => ({
        ...prev,
        PersonalAcc: !prev.PersonalAcc,
        Critical:false,
        Disability:false,
        LifeInsure:false,
        Investment:false,
        Hospital:false
      }));
      setsubDropdown((prev) => ({
        ...prev,
        DropdownPolicyid5: false,
        DropdownPolicyid6: false
      }));
      break;
    case "Disability":
      setDropdownPolicies((prev) => ({
        ...prev,
        Disability: !prev.Disability,
        Critical:false,
        PersonalAcc:false,
        LifeInsure:false,
        Investment:false,
        Hospital:false
      }));
      setsubDropdown((prev) => ({
        ...prev,
        DropdownPolicyid7: false,
        DropdownPolicyid8: false
      }));
      break;
    case "LifeInsure":
      setDropdownPolicies((prev) => ({
        ...prev,
        LifeInsure: !prev.LifeInsure,
        Critical:false,
        PersonalAcc:false,
        Disability:false,
        Investment:false,
        Hospital:false
      }));
      setsubDropdown((prev) => ({
        ...prev,
        DropdownPolicyid9: false,
        DropdownPolicyid10: false
      }));
      break;
    case "Investment":
      setDropdownPolicies((prev) => ({
        ...prev,
        Investment: !prev.Investment,
        Critical:false,
        Disability:false,
        LifeInsure:false,
        PersonalAcc:false,
        Hospital:false
      }));
      setsubDropdown((prev) => ({
        ...prev,
        DropdownPolicyid11: false,
        DropdownPolicyid12: false
      }));
      break;
    default:
      break;
      }
    };

    useEffect(()=>{
      const fetchboughtpolicy = async () => {
      try {
        const response = await fetch('http://localhost:3004/showPurchasePolicies',{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: {
              sessionEmail: sessionStorage.getItem('clientemail')
            }
          })
        })
        const data = await response.json();//response=return res.status(201).json(activePoliciesObject);
        console.log(data)
        const entriesArray = Object.entries(data);//if you want an array of [key, value] pairs: objs in an array
        for(let i = 0; i < entriesArray.length; i++){
          if(entriesArray[i][1] === "Active"){
            setsubDropdown((prev) => ({
              ...prev,
              retrievePolicy: {
                ...prev.retrievePolicy,
                [entriesArray[i][0]]: true,
              },
            }));
          }
        }
        // Assuming response.data is an array and you want to set the state with the first policy object
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const fetchValidatedPolicies = async () => {
        try {
          const response = await fetch('http://localhost:3004/fetchClaimStatus',{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionEmail: sessionStorage.getItem('clientemail')
            })
          })
          const data = await response.json();//response=return res.status(201).json(activePoliciesObject);
          const arrayClient = []
          for(let i = 0; i < data.length; i++){
            let dateTime = new Date(data[i]['dateandtimecreated']);
            let ClaimSubmitDate = new Date(data[i]['claimdate']);
            let dateOnly = dateTime.toLocaleDateString();
            let dateOnlyClaim = ClaimSubmitDate.toLocaleDateString();
             const client = {
              ClaimId: data[i].claimid,
              ClaimStatus: data[i].claimstatus,
              ClaimDate: dateOnlyClaim,//date of the accident happening
              ClaimImage: data[i].claimimage,
              ImageFormat: data[i].imageformat,//dont need in FE
              ClaimAmount: data[i].claimamount,
              PolicyId: data[i].policyid,
              ClientEmail: data[i].clientemail,
              ClientName: data[i].clientname,
              ConsultantEmail: data[i].consultantemail,
              DateCreated: dateOnly
            }
             arrayClient.push(client) 
           }
           setRetrieveListArray(arrayClient) 
           console.log(RetrieveListArray)
          // Assuming response.data is an array and you want to set the state with the first policy object
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
     fetchValidatedPolicies();
     fetchboughtpolicy(); 
  },[])

  const [RetrieveListArray,setRetrieveListArray] = useState([])
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clickedClaimImage, setClickedClaimImage] = useState(null);
  
  const openModal = (client) => {
    setClickedClaimImage(client);
    setIsOpen(true);
  };
   const closeModal = () => {
    setIsOpen(false);
  };

  const renderTableRowsClient = () => {
    
    return RetrieveListArray.map((client,index) => (
      <tr key={index} className="border-2 border-black">
        <td className="border-2 border-black">{client.ClaimStatus}</td>
        <td className="border-2 border-black">{client.ClaimId}</td>
        <td className="border-2 border-black">{client.ClaimDate}</td>
        <td className="border-2 border-black">
        <img
            src={createObjectURLFromBinary(client.ClaimImage, client.ImageFormat)}
            alt="Claim"
            onClick={() => openModal(client)}
          />  
        </td>
        <td className="border-2 border-black">{client.ClaimAmount}</td>
        <td className="border-2 border-black">{client.PolicyId}</td>
        <td className="border-2 border-black">{client.ClientEmail}</td>
        <td className="border-2 border-black">{client.ClientName}</td>        
        <td className="border-2 border-black">{client.ConsultantEmail}</td>
        <td className="border-2 border-black">{client.DateCreated}</td>
      </tr>
    ));
  }

  const createObjectURLFromBinary = (ClaimImage, ImageFormat) => {
    if (ClaimImage && ClaimImage.data) {
      const arrayBuffer = new Uint8Array(ClaimImage.data).buffer;
      const blob = new Blob([arrayBuffer], { type: ImageFormat });
      const objectURL = URL.createObjectURL(blob);
      return objectURL;
    }
    return null;
  };

 const [subDropdown, setsubDropdown] = useState({
    DropdownPolicyid1:false,
    DropdownPolicyid2:false,
    DropdownPolicyid3:false,
    DropdownPolicyid4:false,
    DropdownPolicyid5:false,
    DropdownPolicyid6:false,
    DropdownPolicyid7:false,
    DropdownPolicyid8:false,
    DropdownPolicyid9:false,
    DropdownPolicyid10:false,
    retrievePolicy:{
      policyid1:false,
      policyid2:false,
      policyid3:false,
      policyid4:false,
      policyid5:false,
      policyid6:false,
      policyid7:false,
      policyid8:false,
      policyid9:false,
      policyid10:false
    }
  });
  
  const subToggleDropdown = (e) => {
      e.stopPropagation();
      const name = e.currentTarget.getAttribute('name');
      switch (name) { 
      case "DropdownPolicyid1":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid2:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:1
        }));
        break;
      case "DropdownPolicyid2":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid1:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:2
        }));
        break;
      case "DropdownPolicyid3":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid4:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:3
        }));
        break;
      case "DropdownPolicyid4":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid3:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:4
        }));
        break;
      case "DropdownPolicyid5":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid6:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:5
        }));
        break;
      case "DropdownPolicyid6":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid5:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:6
        }));
        break;
      case "DropdownPolicyid7":
          setsubDropdown((prev) => ({
            ...prev,
            [name]: !prev[name],
            DropdownPolicyid8:false
          }));
          setClaimPolicy((prev) => ({
            ...prev,
             policyid:7
          }));
        break;
      case "DropdownPolicyid8":
        setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid7:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:8
        }));
        break;
      case "DropdownPolicyid9":
          setsubDropdown((prev) => ({
            ...prev,
            [name]: !prev[name],
            DropdownPolicyid10:false
          }));
          setClaimPolicy((prev) => ({
            ...prev,
             policyid:9
          }));
        break;
      case "DropdownPolicyid10":
          setsubDropdown((prev) => ({
          ...prev,
          [name]: !prev[name],
          DropdownPolicyid9:false
        }));
        setClaimPolicy((prev) => ({
          ...prev,
           policyid:10
        }));
        break;  
        default:
        break;
     }
 
     setClaimPolicy((prev) => ({
      ...prev,
      policyidDate:"",
      policyidAmt:"",
      policyidImg:"",
      policyidImgType:"",
      policyidImgBool:false
    }));
  };

 

return (
  <div className="fixed h-screen w-screen flex justify-center items-center">
    <div className="fixed h-full w-5/6 bg-blue-200">
      <div className="fixed border-r-2 border-black flex-initial w-64 flex place-items-center gap-4 flex-col h-full">
        <div>
          <AiOutlineInsurance className="font-sans text-7xl"/>
        </div>
        <div className="space-y-8 cursor-pointer">
          <div type="button" onClick={nav} name="Home">
            <AiTwotoneHome className="font-sans text-4xl absolute -mx-9"/>
            <span className="font-sans text-3xl ml-5">Home</span>
          </div>

          <div onClick={PoliciesDropdown}>
            <ImBooks className="font-sans text-4xl absolute -mx-9"/>
            <span className="font-sans text-3xl ml-5">Policies</span>
            {dropdownVisible && (
              <div
                className={`${dropdownVisible ? 'opacity-100' : 'opacity-0'
                } transform transition-opacity duration-1 ease-in-out origin-top ${
                  dropdownVisible ? 'scale-100' : 'scale-75'
                } transition-transform bg-gray-100 mt-2 p-4 rounded`}
              >
                <ul>
                  <li onClick={nav} name="policies" className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300">View Policies</li>
                  <li onClick={nav} name="buypolicies" className="outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300">Buy Policies</li>
                </ul>
              </div>
            )}
          </div> 
        </div>
        <div className="m-3 relative mt-auto flex justify-content-center">
          <div className="w-2/5 h-16 border-4 border-solid border-cyan-300 rounded-full overflow-hidden">
            <label htmlFor="uploadIcon">
              <img
                className="object-cover min-h-0 min-w-0"
                src={selectedImage}
                alt="Profile"
              />
            </label>
            <input
              className="hidden"
              accept="image/jpeg, image/png"
              type="file"
              id="uploadIcon"
              onChange={onImageChange}
            />
          </div>
          <div className="container relative justify-items-start">
            {!logout.showBubble && (
              <div name="log-out" onClick={nav} className="cursor-pointer absolute bg-red-500 text-white rounded w-16 h-6 right-2 mt-[-30px]">
                <span className="p-1" >Log out</span>
              </div>
            )}
            <BsThreeDots className="absolute ml-28 mt-1 cursor-pointer" name="tripledot" onClick={nav}/>
            <span className="font-bold font-sans">{clientName}</span>
            <span className="flex break-all font-sans text-sm">{loggedEmail}</span>
          </div>
        </div>
      </div>
      <div className="relative left-72 place-self-center w-1/2">
        Open up to make your claims!
        <div className="flex flex-col space-y-2 border-4 border-solid border-black">
         <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Critical" onClick={toggleDropdown}>
            <span className="font-sans text-3xl ml-5">Critical-illness</span>
            {DropdownPolicies.Critical && (
              <div
                className={`${DropdownPolicies.Critical ? 'opacity-100' : 'opacity-0'
                } transform transition-opacity duration-1 ease-in-out origin-top ${
                  DropdownPolicies.Critical ? 'scale-100' : 'scale-75'
                } transition-transform bg-gray-100 mt-2 p-4 rounded`}
              > 
                  <ul>
                  {subDropdown.retrievePolicy.policyid1 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid1" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy1</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                          ${subDropdown.DropdownPolicyid1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                          transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid1 ? 'block' : 'hidden'}`} 
                          > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input accept=".jpeg, .jpg, .png" type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div> 
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}  
                          </form>
                        </div>  
                  </div>
                  )}
                  </ul>
                  <ul>
                  {subDropdown.retrievePolicy.policyid2 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid2" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy2</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid2 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid2 ? 'block' : 'hidden'}`} 
                        > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>
              </div>
            )}
          </div>
 
          <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Hospital" onClick={toggleDropdown}>
            <span className="font-sans text-3xl ml-5">Hospitalisation</span>
            {DropdownPolicies.Hospital && (
              <div
                className={`${DropdownPolicies.Hospital ? 'opacity-100' : 'opacity-0'
                } transform transition-opacity duration-1 ease-in-out origin-top ${
                  DropdownPolicies.Hospital ? 'scale-100' : 'scale-75'
                } transition-transform bg-gray-100 mt-2 p-4 rounded`}
              >
               <ul>
                  {subDropdown.retrievePolicy.policyid3 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid3" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy3</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid3 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid3 ? 'block' : 'hidden'}`} 
                        > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} >
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>
                  <ul>
                  {subDropdown.retrievePolicy.policyid4 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid4" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy4</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid4 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid4 ? 'block' : 'hidden'}`} 
                        > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} >
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>
              </div>
            )}
          </div>

          <div className="border-4 border-solid border-cyan-300 cursor-pointer background" name="PersonalAcc" onClick={toggleDropdown}>
            <span className="font-sans text-3xl ml-5">Personal-Accident</span>
            {DropdownPolicies.PersonalAcc && (
              <div
                className={`${DropdownPolicies.PersonalAcc ? 'opacity-100' : 'opacity-0'
                } transform transition-opacity duration-1 ease-in-out origin-top ${
                  DropdownPolicies.PersonalAcc ? 'scale-100' : 'scale-75'
                } transition-transform bg-gray-100 mt-2 p-4 rounded`}
              >
                <ul>
                  {subDropdown.retrievePolicy.policyid5 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid5" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy5</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid5 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid5 ? 'block' : 'hidden'}`} 
                        > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                             < div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>
                  <ul>
                  {subDropdown.retrievePolicy.policyid6 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid6" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy6</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid6 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid6 ? 'block' : 'hidden'}`} 
                        > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>
              </div>
            )}
          </div>

          <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Disability" onClick={toggleDropdown}>
            <span className="font-sans text-3xl ml-5">Disability</span>
            {DropdownPolicies.Disability && (
              <div
                className={`${DropdownPolicies.Disability ? 'opacity-100' : 'opacity-0'
                } transform transition-opacity duration-1 ease-in-out origin-top ${
                  DropdownPolicies.Disability ? 'scale-100' : 'scale-75'
                } transition-transform bg-gray-100 mt-2 p-4 rounded`}
              >
                <ul>
                {subDropdown.retrievePolicy.policyid7 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid7" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy7</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid7 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid7 ? 'block' : 'hidden'}`} > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>
                  <ul>
                {subDropdown.retrievePolicy.policyid8 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid8" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy8</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid8 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid8 ? 'block' : 'hidden'}`} > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="PolicyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul>  
              </div>
            )}
          </div>
          <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="LifeInsure" onClick={toggleDropdown}>
            <span className="font-sans text-3xl ml-5">Life-insurance</span>
            {DropdownPolicies.LifeInsure && (
              <div
                className={`${DropdownPolicies.LifeInsure ? 'opacity-100' : 'opacity-0'
                } transform transition-opacity duration-1 ease-in-out origin-top ${
                  DropdownPolicies.LifeInsure ? 'scale-100' : 'scale-75'
                } transition-transform bg-gray-100 mt-2 p-4 rounded`}
              >
                <ul>
                {subDropdown.retrievePolicy.policyid9 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid9" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy9</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid9 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid9 ? 'block' : 'hidden'}`} > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul> 
                  <ul>
                  {subDropdown.retrievePolicy.policyid10 && ( 
                   <div>
                      <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="DropdownPolicyid10" onClick={subToggleDropdown}>
                        <span className="font-sans text-3xl ml-5">Policy10</span>
                      </div> 
                      <div className={`transform transition-all duration-500 ease-in-out origin-top 
                        ${subDropdown.DropdownPolicyid10 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} 
                        transition-transform bg-gray-100 p-4 rounded ${subDropdown.DropdownPolicyid10 ? 'block' : 'hidden'}`} > 
                          <form  onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="">
                              <div>
                                <label htmlFor="claim-date" className="block text-sm font-medium text-gray-700">Claim Date:</label>
                                <input type="date" name="policyDate" value={ClaimPolicy.policyidDate} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">Claim Amount:</label>
                                <input type="number" name="policyAmt" value={ClaimPolicy.policyidAmt} onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                              </div>
                              <div>
                                <label htmlFor="claim-image" className="block text-sm font-medium text-gray-700">Claim Image:</label>
                                <input type="file" name="policyImg" onChange={handleFileUpload} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                {ClaimPolicy.policyidImgBool && <img src={ClaimPolicy.policyImg} alt="Preview" className="w-24 h-24 mt-2" />}
                              </div>
                              {ClaimPolicy.successMsg && (
                                <div className={ClaimPolicy.successMsg === "Claim submitted! Your consultant will review it shortly." ? "alert alert-success" : "alert alert-warning"}>
                                  {ClaimPolicy.successMsg}
                                </div>
                              )}

                              {ClaimPolicy.successMsg !== "Pick a consultant before making a claim" && (
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                               )}                           </form>
                        </div>  
                  </div>
                  )}
                  </ul> 
              </div>
            )}
          </div>
        </div>
        <table className="mt-10 border-collapse border-2 border-black">
            <thead>
              <tr className="border-2 border-black">
                <th className = "border-2 border-black">Claim Status</th>
                <th className = "border-2 border-black">Claim ID</th>
                <th className = "border-2 border-black">Date of Claim</th>
                <th className = "border-2 border-black">Claim Image</th>
                <th className = "border-2 border-black">Claim Amount</th>
                <th className = "border-2 border-black">Policy ID</th>
                <th className = "border-2 border-black">Client Email</th>
                <th className = "border-2 border-black">Client Name</th>
                <th className = "border-2 border-black">Consultant Email</th>
                <th className = "border-2 border-black">Submitted Date</th>
              </tr>
            </thead>
            <tbody>
            {renderTableRowsClient()} 
            </tbody>
          </table>
          <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Claim Image"
            >
              {clickedClaimImage && (
                <img
                  src={createObjectURLFromBinary(clickedClaimImage.ClaimImage, clickedClaimImage.ImageFormat)}
                  alt=""
                />
              )}
              <button onClick={closeModal}>Close</button>
            </Modal>
      </div>
    </div>
  </div>
)}
