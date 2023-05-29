import {React,useState,useEffect} from "react";
import {AiOutlineInsurance,AiTwotoneHome} from "react-icons/ai";
import {ImBooks} from "react-icons/im";
 import {RiMessage2Fill} from "react-icons/ri"; 
import {useUser} from "../JWTuserDetails";
import {useNavigate} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";
import axios from 'axios'

 export const UserSite = () => {
  const { loggedEmail, setLoggedEmail } = useUser();
  const { clientName, setclientName } = useUser();

  const defaultImageURL = `${process.env.PUBLIC_URL}/defaultimage.png`;
  const [selectedImage, setSelectedImage] = useState(defaultImageURL);
  const navigate = useNavigate()
  const [logout,setLogout] = useState({
    showBubble:true,
    logoutt:false
  })
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [greeting, setGreeting] = useState('');
  const[ArrayConsultantDetails, setConsultantDetails] = useState([]);
  const [SelectedConsultant, setSelectedConsultant] = useState(null);
  const[RemoveBtn, setRemoveBtn]=useState(false)

  const handleSelect = async(consultant) => {
    setSelectedConsultant(consultant);
    sessionStorage.setItem('SelectedConsultant', JSON.stringify(consultant));
    sessionStorage.setItem('consultantemail',consultant.ConsultantEmail)
    console.log(consultant.ConsultantEmail)
      try {
        const response = await axios.post(`http://localhost:3004/postSelectConsultant`, {
          PayloadClientEmail: sessionStorage.getItem('clientemail'),
          PayloadConsultantEmail:(consultant.ConsultantEmail),
          PayloadClientName:sessionStorage.getItem('clientname'),
      });
      if (response.status === 200) {
          console.log('Successfully posted data');
       } else {
          console.log('Error posting data');
      }
    } catch (error) {
        console.error('Error posting data:', error);
    }
  };
  
  const ChooseConsultants = ({ consultant, onSelect }) => {
    const handleSelect = () => {
      onSelect(consultant);
    }; 
    return (
      <div
        className={`p-4 mb-4 border-2 rounded-lg ${
          SelectedConsultant === consultant.ConsultantID ? 'border-green-500' : 'border-gray-300'
        }`}
      >
        <h3 className="font-semibold">Consultant no{consultant.ConsultantID}</h3>
        <p><strong>Email:</strong> {consultant.ConsultantEmail}</p>
        <p><strong>Name:</strong> {consultant.ConsultantName}</p>
        <p><strong>Number:</strong> {consultant.ConsultantNumber}</p>
        <p><strong>Gender:</strong> {consultant.ConsultantGender}</p>
        <p><strong>Hear From Us:</strong> {consultant.HearFromUs}</p>
        {!SelectedConsultant  && !RemoveBtn && (
          <button
            className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white"
            onClick={handleSelect}
          >
            Select Agent
          </button>
        )}
      </div>
    );
  };
   
 useEffect(() => {
  const updateGreeting = () => {
    setGreeting(HeaderGreeting());
  };
  updateGreeting(); // Set the initial greeting

  const intervalId = setInterval(updateGreeting, 59000); // Update every 59000 milliseconds

  const fetchConsultantdetails = async () => {
    try {
      const response = await axios.get('http://localhost:3004/displayConsultants');
      if (response.data) { 
        const results = response.data;
        const newConsultantDetails = [];
        for (let i = 1; i <= Object.keys(results).length; i++) {
          const consultantDetail = {  
            ConsultantID: i,
            ConsultantEmail: results[i].consultantemail,
            ConsultantName: results[i].consultantname,
            ConsultantNumber: results[i].consultantnumber,
            ConsultantGender: results[i].consultantgender,
            HearFromUs: results[i].hearfromus,
          };
          newConsultantDetails.push(consultantDetail);
        } 
        setConsultantDetails(newConsultantDetails);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSelectedConsultant = async () => { 
    try {
      const response = await axios.post(`http://localhost:3004/checkSelectedConsultant`,{
        clientEmail: sessionStorage.getItem('clientemail')
      });
      if (response.data) { 
        const results = [response.data];
        const consultantDetail = {  
          ConsultantID: results[0].consultantid,
          ConsultantEmail: results[0].consultantemail,
          ConsultantName: results[0].consultantname,
          ConsultantNumber: results[0].consultantnumber,
          ConsultantGender: results[0].consultantgender,
          HearFromUs: results[0].hearfromus,
        }
        const arrayedRetrieveCon = [consultantDetail]
        setConsultantDetails(arrayedRetrieveCon);
        sessionStorage.setItem('consultantemail', arrayedRetrieveCon[0].ConsultantEmail)
        setRemoveBtn(true)
        return true; // return true if data was found
       }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return false; // return false if no data was found
  };
  
  // First check if a selected consultant already exists in the session storage
  const storedSelectedConsultant = JSON.parse(sessionStorage.getItem('SelectedConsultant'));

  if (storedSelectedConsultant) {
    // If selected consultant is in the session storage, set it in your state
    setSelectedConsultant(storedSelectedConsultant);
  } else {
    // If not, fetch the selected consultant from the DB
    fetchSelectedConsultant()
      .then((dataFound) => {
        // If no selected consultant is returned from DB, fetch the consultant details
        if (!dataFound) {
          fetchConsultantdetails();
        }
      })
      .catch((err) => console.error('Error fetching selected consultant:', err));
  }

  return () => {
    clearInterval(intervalId); // Clean up the interval when the component unmounts
  };
}, []);


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
    }else if(click ==="Messages"){
      navigate("/messages");
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
  return (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-start">
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
          <div name ="Messages" onClick={nav}>
            <RiMessage2Fill className="font-sans text-4xl absolute -mx-10" />
            <span className="font-sans text-3xl ml-5">Messages</span>
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
      <div className="flex flex-col flex-grow pl-72 pr-10 py-10">
        <div className="flex w-51 flex-col">
          <h1 className="text-5xl font-light">{greeting}!</h1>
          <span className="font-bold font-sans text-3xl">{clientName}</span>
          <div className="flex-1 overflow-auto max-h-[calc(100vh-200px)]">
              {SelectedConsultant === null? (
                <> 
                  {ArrayConsultantDetails.map((consultant) => (
                    <ChooseConsultants
                      key={consultant.ConsultantID}
                      consultant={consultant}
                      onSelect={handleSelect}
                      SelectedConsultantId={SelectedConsultant}
                    />
                  ))}
                </>
              ) : (
                <>
                <div className="p-4 mb-4 border-2 rounded-lg border-green-500">
                  <h3 className="font-semibold">Consultant no{SelectedConsultant.ConsultantID}</h3>
                  <p><strong>Email:</strong> {SelectedConsultant.ConsultantEmail}</p>
                  <p><strong>Name:</strong> {SelectedConsultant.ConsultantName}</p>
                  <p><strong>Number:</strong> {SelectedConsultant.ConsultantNumber}</p>
                  <p><strong>Gender:</strong> {SelectedConsultant.ConsultantGender}</p>
                  <p><strong>Hear From Us:</strong> {SelectedConsultant.HearFromUs}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}


