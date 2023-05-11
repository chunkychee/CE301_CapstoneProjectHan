import {React,useState,useEffect,useContext} from "react";
import {AiOutlineInsurance,AiTwotoneHome} from "react-icons/ai";
import {GoFileSubmodule} from "react-icons/go";
import {RiMessage2Fill} from "react-icons/ri"; 
import {useUser} from "../JWTuserDetails";
import {useNavigate} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";
 
  export const MessagesCon = () => {
  const { consultantEmail, consultantName } = useUser();
  const defaultImageURL = `${process.env.PUBLIC_URL}/defaultimage.png`;
  const [selectedImage, setSelectedImage] = useState(defaultImageURL);
  const navigate = useNavigate()
  const [logout,setLogout] = useState({
    showBubble:true,
    logoutt:false
  })
   
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
    }else if(click ==="Services"){
      navigate("/services");
    }else if(click ==="Messages"){
      navigate("/messagescon");
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

          <div onClick={nav} name ="Services">
            <GoFileSubmodule className="font-sans text-4xl absolute -mx-10"/>
            <span  onClick={nav} className="font-sans text-3xl ml-5">Services</span>
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
            <span className="font-bold font-sans">{consultantName}</span>
            <span className="flex break-all font-sans text-sm">{consultantEmail}</span>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  </div>  
)}