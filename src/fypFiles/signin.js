import axios from 'axios';
 import React from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom';

export const Signin = () => {
 
  const [ChangeFieldlogin, SetChangeFieldLogin] = useState({
        clientemail:"", 
        clientpassword:"",
        consultantemail:"",
        consultantpassword:"",
        clickoncon:false,
        errors:{
          errclientemail:"",
          errclientpassword:"",
          errconemail:"",
          errconsultantpassword:"",
          errLoginMsg:""
        }
    })
  const UserFieldHandle=(e)=>{
        const click = e.target.name;
         if(click === "conbtn"){
            SetChangeFieldLogin(prevState => ({
                ...prevState,
                clientemail:"",
                clientpassword:"",
                clickoncon: true,errors: {
                  ...prevState.errors,
                  errconemail:"",    
                  errconsultantpassword:""
                 }
              }));
          }else{
            SetChangeFieldLogin(prevState => ({
                ...prevState,
                consultantemail:"",
                consultantpassword:"",
                clickoncon: false,errors: {
                  ...prevState.errors,
                  errclientemail:"",    
                  errclientpassword:""
                 }
               }));
          }
    }

  const fieldchange=(e)=>{
    const click = e.target.name;
    const clickValue = e.target.value;
    if(click === "consultantemail"){
      SetChangeFieldLogin(prevState => ({
        ...prevState,
        [click]: clickValue,
      }));
     }else{
        SetChangeFieldLogin(prevState => ({
        ...prevState,
        [click]: clickValue,
      }));
     }    
  }
  const directuserbtn=(e)=>{
    const click = e.target.name;
    if(click === "usersignup"){
      navigate("/signup");
    }else{
      navigate("/consultantsignup")
    }
  }
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ChangeFieldlogin.consultantemail && ChangeFieldlogin.consultantpassword !== "") {
      // Consultant login
      try {
        await axios.post("http://localhost:3004/conlogin", ChangeFieldlogin);
        navigate("/usersite");
      } catch (err) {
        // Handle errors
        SetChangeFieldLogin((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            errLoginMsg: err.response.data,
          },
        }));
        console.log(err)
      }
    } else if (ChangeFieldlogin.clientemail && ChangeFieldlogin.clientpassword !=="") {
      // Client login
      try {
        await axios.post("http://localhost:3004/login", ChangeFieldlogin);
        const response = await axios.post('/login', {
          name: Name,
          email: ChangeFieldlogin.clientemail
        });
        const { accessToken, email, password } = response.data;
        localStorage.setItem('accessToken', accessToken);
        navigate("/usersite");

       } catch (err) {
        // Handle errors
        SetChangeFieldLogin((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            errLoginMsg: err.response.data
          }
        }));
      }
    } else {
      // Empty fields
      SetChangeFieldLogin((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          errclientemail: "Email field is empty",
          errclientpassword: "Password field is empty",
          errconemail: "Username field is empty",
          errconsultantpassword: "Password field is empty",
        },
      }));
    }
  };

  return (
    <div className='h-screen w-screen grid place-content-center'>{/*parent div*/}
       <form onSubmit={handleSubmit}> 
        <div className='m-2 h-auto content-between grid grid-cols bg-gradient-to-r from-cyan-500 to-blue-500 '>{/*child div*/}
            <div className='col-start-1 col-span-2 flex justify-evenly'>
                <button name="userbtn" type="button" onClick={UserFieldHandle} 
                className="m-2 font-semibold text-3xl text-white  bg-gradient-to-r from-violet-400 to-fuchsia-700 hover:from-purple-500 hover:to-pink-500">
                    User Sign in
                </button>

                <button name="conbtn" type="button" onClick={UserFieldHandle} 
                className="w-48 m-2 font-semibold text-3xl text-white bg-gradient-to-r from-cyan-400 to-blue-700 hover:from-sky-500 hover:to-indigo-500">
                    Consultant Sign in
                </button>
            </div>


            <div className='place-self-center col-start-1 col-span-2'>
                {!ChangeFieldlogin.clickoncon &&(
                  <div className=''>
                    <p className='indent-12'>Email Address:</p>
                    <input type="text" name ="clientemail" onChange={fieldchange}/><br/>
                    {ChangeFieldlogin.clientemail ===""?<span className='text-red-500'>{ChangeFieldlogin.errors.errclientemail}</span> :""}<br/>

                    <p className='mt-4 indent-14'>Password:</p>
                    <input type="password" name ="clientpassword" onChange={fieldchange}/><br/>
                    {ChangeFieldlogin.clientpassword ===""?<span className='text-red-500'>{ChangeFieldlogin.errors.errclientpassword}</span> :""}<br/>

                  </div>
                )}
                
                {ChangeFieldlogin.clickoncon &&(
                  <div>
                    <p>Email Address:</p>
                    <input type="text" name ="consultantemail" onChange={fieldchange}/><br/>
                    {ChangeFieldlogin.consultantemail ===""?<span className='text-red-500'>{ChangeFieldlogin.errors.errconemail}</span> :""}<br/>


                    <p className='mt-4'>Password:</p>
                    <input type="password" name ="consultantpassword" onChange={fieldchange}/><br/>
                    {ChangeFieldlogin.consultantpassword ===""?<span className='text-red-500'>{ChangeFieldlogin.errors.errconsultantpassword}</span> :""}<br/>


                  </div>
                )}
                {ChangeFieldlogin.errors.errLoginMsg && <span className=' text-red-500'>{ChangeFieldlogin.errors.errLoginMsg}</span>}<br/>
                <button className = "ml-1 w-44 h-10  text-white font-semibold bg-green-700 rounded-full"> Sign In</button>
            </div>

            <div className='col-start-1 col-span-2 flex'>
              <div className='grid justify-items-center'>
                <div className='m-3'>
                  <p className='text-xs font-light text-center'>Looking for a fuss free way of getting insured?</p>
                </div>
                <div className=' '>
                    <button name="usersignup" type="button" onClick={directuserbtn} 
                      className="p-2 font-semibold text-3xl text-white bg-gradient-to-r from-cyan-400 to-blue-700 hover:from-sky-500 hover:to-indigo-500">
                      Join us!
                    </button>
                </div>
              </div>

              <div className='grid justify-items-center'> 
              <div className='m-3 '>
                  <p className='text-xs font-light'>Looking for a purpose in your career? Join our growing community of consultants!</p>
              </div> 
              <div className=''>
                <button name="consignup" type="button" onClick={directuserbtn} className="p-2 font-semibold text-3xl text-white bg-gradient-to-r from-cyan-400 to-blue-700 hover:from-sky-500 hover:to-indigo-500">
                    Sign Up
                </button>
              </div>
              </div>
            </div>
        </div>
        </form>
    </div>
  )
}