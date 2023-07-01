import {React,useState,useEffect} from "react";
import axios from 'axios'
import {AiOutlineInsurance,AiTwotoneHome} from "react-icons/ai";
 import {RiMessage2Fill} from "react-icons/ri"; 
import {useUser} from "./JWTuserDetails";
import {useNavigate} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";
import Modal from 'react-modal';
Modal.setAppElement('#root');

 export const ConSite = () => {
  const { consultantEmail, setConsultantEmail } = useUser();
  const { consultantName, setConsultantName } = useUser();
  const defaultImageURL = `${process.env.PUBLIC_URL}/defaultimage.png`;
  const [selectedImage, setSelectedImage] = useState(defaultImageURL);
  const navigate = useNavigate()
  const [logout,setLogout] = useState({
    showBubble:true,
    logoutt:false
  })
  const [greeting, setGreeting] = useState('');
  const [ClientListArray,setClientListArray] = useState([])
  const [ClickClaimImage, setClickClaimImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [claimStatuses, setClaimStatuses] = useState({});

  const handleStatusChange = async (claimId, newStatus) => {
    setClaimStatuses(prevStatuses => ({
      ...prevStatuses,
      [claimId]: newStatus
    }));

    const foundClient = ClientListArray.find(c => c.ClaimId === claimId);

    if (!foundClient) {
      // Handle the error if no client was found
      console.error('No client found with this claim id:', claimId);
      return;
    }

    // Define these variables before your API call
    const clientEmail = foundClient.ClientEmail;
    const consultantEmail = sessionStorage.getItem('consultantemail');
    console.log('ClaimId:', claimId);
    console.log('ClientListArray:', ClientListArray);
    console.log(clientEmail, claimId, consultantEmail)
    
    // Make the API call to post the data
    try {
      console.log(clientEmail, consultantEmail, claimId)
      const response = await axios.post('http://localhost:3004/ChangeClaimStatus', {
        claimId: claimId,
        clientEmail: clientEmail,
        consultantEmail: consultantEmail,
        status: newStatus
      });

       console.log('Data posted successfully:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const openModal = (client) => {
    setClickClaimImage(client);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const renderTableRows = () => {
    return ClientListArray.map((client) => (
      <tr key={client.ClaimId} className="border-2 border-black">
        <td className="border-2 border-black">
          <div className="flex">
            <button
              className={`mr-2 p-2 ${
                claimStatuses[client.ClaimId] === 'valid' ? 'bg-green-500' : ''
                }`}
              onClick={() => handleStatusChange(client.ClaimId, 'valid')}
            >
              Valid
            </button>
            <button
              className={`p-2 ${
                claimStatuses[client.ClaimId] === 'reject' ? 'bg-red-500' : ''
                }`}
              onClick={() => handleStatusChange(client.ClaimId, 'reject')}
            >
              Reject
            </button>
          </div>
        </td>
        <td className="border-2 border-black">{client.ClaimId}</td>
        <td className="border-2 border-black">{client.ClaimDate}</td>
        <td className="border-2 border-black">
          <img
            src={createObjectURLFromBinary(client.ClaimImage, client.ImageFormat)}
            alt="Claim" // Changed alt attribute to remove the ESLint warning
            onClick={() => openModal(client)}
          />
        </td>
        <td className="border-2 border-black">{client.ClaimAmount}</td>
        <td className="border-2 border-black">{client.PolicyId}</td>
        <td className="border-2 border-black">{client.ClientEmail}</td>
        <td className="border-2 border-black">{client.ClientName}</td>
        <td className="border-2 border-black">{client.DateCreated}</td>
      </tr>
    ));
  };
 //1. useEffect will render what you put in the first argument.
 //2. useEffect will render what you put in the first argument,THEN will render again or not dependent on the dependencies in the array.
  useEffect(() => {
      const updateGreeting = () => {
        setGreeting(HeaderGreeting());
    };
    updateGreeting(); // Set the initial greeting
    const intervalId = setInterval(updateGreeting, 59000); // Update every 59000 milliseconds
    
    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
}, []);

  useEffect(() => {
    const fetchClient = async () => { 
      try {
          const response = await axios.post(`http://localhost:3004/checkClients`,{
          consultantEmail: sessionStorage.getItem('consultantemail')
        });
        if (response.data) { 
            const results = response.data
            const arrayClient = []
            for (let i = 0; i < results.length; i++) {
                const client = {
                  ClaimId: results[i].Claimid,
                  ClaimStatus: results[i].ClaimStatus,
                  ClaimDate: results[i].ClaimDate, //date of the accident happening
                  ClaimImage: results[i].ClaimImage,
                  ImageFormat: results[i].ImageFormat,//dont need in FE
                  ClaimAmount: results[i].ClaimAmount,
                  PolicyId: results[i].PolicyId,
                  ClientEmail: results[i].ClientEmail,
                  ClientName: results[i].ClientName,
                  DateCreated: results[i].DateCreated
                }
                arrayClient.push(client) 
              }
              setClientListArray(arrayClient)
              sessionStorage.setItem('clientListArray', JSON.stringify(arrayClient));
              console.log(ClientListArray[0].ClaimId)
          }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      return false; // return false if no data was found
    };
    const clientData = sessionStorage.getItem('clientListArray');
  
    if(clientData) {
      setClientListArray(JSON.parse(clientData));
    } else {
      fetchClient();
    }
    }, []);


const createObjectURLFromBinary = (binaryData, mimeType) => {
  if (binaryData && binaryData.data) {
    const arrayBuffer = new Uint8Array(binaryData.data).buffer;
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  }
  return null;
};

const HeaderGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

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
      navigate("/consite");
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
            <span className="font-bold font-sans">{consultantName}</span>
            <span className="flex break-all font-sans text-sm">{consultantEmail}</span>
          </div>
        </div>
      </div>
      <div className="relative left-72 h-32 w-32">
        <div className="flex w-48 flex-col space-y-2">
          <h1 className="text-5xl font-light">{greeting}!</h1>
          <span className="font-bold font-sans text-3xl">{consultantName}</span>
        </div>
        <div className = "h-screen overflow-y-auto w-min relative place-self-center">
          <table className="border-collapse border-2 border-black">
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
                <th className = "border-2 border-black">Submitted Date</th>
              </tr>
            </thead>
            <tbody>
            {renderTableRows()}
            </tbody>
          </table>
          <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Claim Image"
            >
              {ClickClaimImage && (
                <img
                src={createObjectURLFromBinary(
                  ClickClaimImage.ClaimImage,
                  ClickClaimImage.ImageFormat
                )}
                alt=""
              />
              
              )}
              <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
      </div>
    </div>
  </div>  
)}