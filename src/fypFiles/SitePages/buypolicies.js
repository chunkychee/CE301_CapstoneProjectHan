import {React,useEffect,useState } from "react";
import axios from 'axios'
import {AiOutlineInsurance,AiTwotoneHome,} from "react-icons/ai";
import { ImBooks } from "react-icons/im";
 import { RiMessage2Fill } from "react-icons/ri"; 
import { useUser } from "../JWTuserDetails";
import {useNavigate} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";

 

 export const Buypolicies = () => {
  const { loggedEmail, setLoggedEmail } = useUser();
  const { clientName, setclientName } = useUser();  const defaultImageURL = `${process.env.PUBLIC_URL}/defaultimage.png`;
  const [selectedImage, setSelectedImage] = useState(defaultImageURL);
  const navigate = useNavigate()
  const [logout,setLogout] = useState({
    showBubble:true,
    logoutt:false
  })
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [DropdownPolicies, setDropdownPolicies] = useState({
    Critical:false,
    Hospital:false,
    PersonalAcc:false,
    Disability:false,
    LifeInsure:false,
    Investment:false
  });
  const [policyNames, setPolicyNames] = useState([]);

  useEffect(()=>{
    const fetchpolicy = async () => {
      try {
        const response = await axios.get('http://localhost:3004/getpolicyname/policynames');
        setPolicyNames(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchpolicy()
  },[])


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
        break;
      default:
        break;
    }
  };
  const PoliciesDropdown =()=>{
    setDropdownVisible(prev => !prev);
  }
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(file);
      e.target.value = null;
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
      console.log(logout)
      setLogout((prev) => ({
        ...prev,
        showBubble: !prev.showBubble
      }));
   } 
 } 
 const policyBrief = (e) => {
  const click = e.currentTarget.getAttribute('name');
  let url;

  switch (click) {
    case "policyid0":
      url = "/policy1";
      break;
    case "policyid1":
      url = "/policy2";
      break;
    case "policyid2":
      url = "/policy3";
      break;
    case "policyid3":
      url = "/policy4";
      break;
    case "policyid4":
      url = "/policy5";
      break;
    case "policyid5":
      url = "/policy6";
      break;
    case "policyid6":
      url = "/policy7";
      break;
    case "policyid7":
      url = "/policy8";
      break;
    case "policyid8":
      url = "/policy9";
      break;
    case "policyid9":
      url = "/policy10";
      break;
    case "policyid10":
      url = "/policy11";
      break;
    case "policyid11":
      url = "/policy12";
      break;
    default:
      url = "/";
  }

  window.open(url, '_blank');
}


  return (
  <div className="fixed h-screen w-screen flex justify-center items-center">
    <div className="static h-full w-5/6 bg-blue-200 flex">
      <div className="fixed border-r-2 border-black flex-initial w-64 flex place-items-center gap-4 flex-col h-full">
        <div>
          <AiOutlineInsurance className="font-sans text-7xl"/>
        </div>
        <div className="space-y-8 cursor-pointer">
          <div type="button" onClick={nav} name ="Home">
            <AiTwotoneHome className="font-sans text-4xl absolute -mx-9"/>
            <span className="font-sans text-3xl ml-5">Home</span>  
          </div>

          <div onClick={PoliciesDropdown} >
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
                      <li onClick={nav} name ="policies" className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300">View Policies</li>
                      <li onClick={nav} name ="buypolicies" className="outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300">Buy Policies</li>
                    </ul>
                  </div>
                )}
          </div>
        </div>
        <div className="m-3 relative mt-auto flex justify-content-center">  
          <div className="w-2/5 h-16 border-4 border-solid border-cyan-300 rounded-full overflow-hidden">
            <label htmlFor="uploadIcon"> 
              <img
                className="object-cover min-h-0 min-w-0	"
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
      <div className="relative left-72 place-self-center">
      Embark on Your Insurance Journey according to your needs
        <div className="flex flex-col space-y-2 border-4 border-solid border-black">
            <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Critical" onClick={toggleDropdown}>
                  <span className=" font-sans text-3xl ml-5">Critical-illness</span>
                  {DropdownPolicies.Critical && (
                        <div
                          className={`${DropdownPolicies.Critical ? 'opacity-100' : 'opacity-0'
                        } transform transition-opacity duration-1 ease-in-out origin-top ${
                          DropdownPolicies.Critical ? 'scale-100' : 'scale-75'
                        } transition-transform bg-gray-100 mt-2 p-4 rounded`}
                        >
                          <ul>
                            {policyNames.map((policyNameid0, indexZero) => (
                              indexZero === 0 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300" 
                              onClick={policyBrief} name ="policyid0" key={indexZero}>{policyNameid0}</li> : null
                            ))}
                          </ul>
                          <ul>
                            {policyNames.map((policyNameid1, indexOne) => (
                              indexOne === 1 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid1" key={indexOne}> {policyNameid1}</li> : null
                            ))}
                          </ul>
                        </div>
                      )}
            </div>
            <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Hospital" onClick={toggleDropdown}>
                <span className="font-sans text-3xl ml-5">Hospitalisation</span>
                {DropdownPolicies.Hospital && (
                      <div
                        className={`${DropdownPolicies.Hospital ? 'opacity-100' : 'opacity-0'
                      } transform transition-all ease-in-out duration-1 origin-top ${
                        DropdownPolicies.Hospital ? 'scale-100' : 'scale-75'
                      } transition-transform bg-gray-100 mt-2 p-4 rounded`}
                      >
                        <ul>
                            {policyNames.map((policyNameid2, indexTwo) => (
                              indexTwo === 2 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid2" key={indexTwo}> {policyNameid2}</li> : null
                            ))}
                          </ul>
                          <ul>
                            {policyNames.map((policyNameid3, indexThree) => (
                              indexThree === 3 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid3" key={indexThree}> {policyNameid3}</li> : null
                            ))}
                          </ul>
                      </div>
                    )}
            </div>
            <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="PersonalAcc" onClick={toggleDropdown}>
                <span className="font-sans text-3xl ml-5">Personal Accident</span>
                {DropdownPolicies.PersonalAcc && (
                      <div
                        className={`${DropdownPolicies.PersonalAcc ? 'opacity-100' : 'opacity-0'
                      } transform transition-all ease-in-out duration-1 origin-top ${
                        DropdownPolicies.PersonalAcc ? 'scale-100' : 'scale-75'
                      } transition-transform bg-gray-100 mt-2 p-4 rounded`}
                      > 
                        <ul>
                            {policyNames.map((policyNameid4, indexFour) => (
                              indexFour === 4 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid4" key={indexFour}> {policyNameid4}</li> : null
                            ))}
                          </ul>
                          <ul>
                            {policyNames.map((policyNameid5, indexFive) => (
                              indexFive === 5 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid5" key={indexFive}> {policyNameid5}</li> : null
                            ))}
                          </ul>
                      </div>
                    )}
            </div>           
            <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Disability" onClick={toggleDropdown}>
                <span className="font-sans text-3xl ml-5">Disability</span>
                {DropdownPolicies.Disability && (
                      <div
                        className={`${DropdownPolicies.Disability ? 'opacity-100' : 'opacity-0'
                      } transform transition-all ease-in-out duration-1 origin-top ${
                        DropdownPolicies.Disability ? 'scale-100' : 'scale-75'
                      } transition-transform bg-gray-100 mt-2 p-4 rounded`}
                      > 
                        <ul>
                            {policyNames.map((policyNameid6, indexSix) => (
                              indexSix === 6 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid6" key={indexSix}> {policyNameid6}</li> : null
                            ))}
                          </ul>
                          <ul>
                            {policyNames.map((policyNameid7, indexSeven) => (
                              indexSeven === 7 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid7" key={indexSeven}> {policyNameid7}</li> : null
                            ))}
                          </ul>
                      </div>
                    )}
            </div>
            <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="LifeInsure" onClick={toggleDropdown}>
                <span className="font-sans text-3xl ml-5">Life insurance</span>
                {DropdownPolicies.LifeInsure && (
                      <div
                        className={`${DropdownPolicies.LifeInsure ? 'opacity-100' : 'opacity-0'
                      } transform transition-all ease-in-out duration-1 origin-top ${
                        DropdownPolicies.LifeInsure ? 'scale-100' : 'scale-75'
                      } transition-transform bg-gray-100 mt-2 p-4 rounded`}
                      > 
                        <ul>
                            {policyNames.map((policyNameid8, indexEight) => (
                              indexEight === 8 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid8" key={indexEight}> {policyNameid8}</li> : null
                            ))}
                          </ul>
                          <ul>
                            {policyNames.map((policyNameid9, indexNine) => (
                              indexNine === 9 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid9" key={indexNine}> {policyNameid9}</li> : null
                            ))}
                          </ul>
                      </div>
                    )}
            </div>
            <div className="border-4 border-solid border-cyan-300 cursor-pointer" name="Investment" onClick={toggleDropdown}>
                <span className="font-sans text-3xl ml-5">Investment</span>
                {DropdownPolicies.Investment && (
                      <div
                        className={`${DropdownPolicies.Investment ? 'opacity-100' : 'opacity-0'
                      } transform transition-all ease-in-out duration-1 origin-top ${
                        DropdownPolicies.Investment ? 'scale-100' : 'scale-75'
                      } transition-transform bg-gray-100 mt-2 p-4 rounded`}
                      > 
                         <ul>
                            {policyNames.map((policyNameid10, indexTen) => (
                              indexTen === 10 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid10" key={indexTen}> {policyNameid10}</li> : null
                            ))}
                          </ul>
                          <ul>
                            {policyNames.map((policyNameid11, indexEleven) => (
                              indexEleven === 11 ? <li className="mb-3 outline outline-offset-2 outline-2 rounded-md py-1 transition ease-in-out delay-150 bg-slate-200 hover:-translate-y-1 hover:scale-110 hover:bg-slate-400 duration-300"
                              onClick={policyBrief} name ="policyid11" key={indexEleven}> {policyNameid11}</li> : null
                            ))}
                          </ul>
                      </div>
                    )}
            </div>
         </div>   
      </div>
    </div>
  </div>  
  );
}
