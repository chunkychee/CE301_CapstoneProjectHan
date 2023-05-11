import React, { useState } from "react";
import {AiOutlineInsurance,AiTwotoneHome,} from "react-icons/ai";
import { ImBooks } from "react-icons/im";
import { GoFileSubmodule } from "react-icons/go";
import { RiMessage2Fill } from "react-icons/ri"; 
import { useUser } from "../JWTuserDetails";
import {useNavigate} from "react-router-dom";
import {BsThreeDots} from "react-icons/bs";

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
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
    }else if(click ==="Services"){
      navigate("/services");
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
    <div className="fixed h-screen w-screen flex justify-center items-center">
    <div className="fixed h-full w-5/6 bg-blue-200">
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
            <span className="font-bold font-sans">{clientName}</span>
            <span className="flex break-all font-sans text-sm">{loggedEmail}</span>
          </div>
        </div>
      </div>
      <div className="relative flex left-72 w-72 flex-initial">
        
        <div className="bg-gray-100 rounded shadow-md p-6 mb-6 w-77">
          <h2 className="text-2xl font-bold mb-4">Life Insurance</h2>
          <p>Life insurance policies provide financial protection for your loved ones in the event of your death.</p>
        </div>
        <div className="bg-gray-100 rounded shadow-md p-6 mb-6 w-32">
          <h2 className="text-2xl font-bold mb-4">Investment</h2>
          <p>Investment policies allow you to save and grow your wealth for various life goals such as retirement, education, or buying a home.</p>
        </div>
        <div className="bg-gray-100 rounded shadow-md p-6 mb-6 w-32">
          <h2 className="text-2xl font-bold mb-4">Disability</h2>
          <p>Disability policies provide financial support if you become disabled and are unable to work.</p>
        </div>
        
      </div>
    </div>
  </div>  
  );
}
