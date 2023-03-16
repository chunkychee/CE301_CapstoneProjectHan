import React from 'react'
import { useState } from 'react'


export const Signin = () => {
    const [ChangeFieldlogin, SetChangeFieldLogin] = useState({
        clientusername:"", 
        clientpassword:"",
        conusername:"",
        OTP:"",
        clickoncon:false,
    })
    const UserFieldHandle=(e)=>{
        const click = e.target.name;
        const clickValue = e.target.value;
        if(click === "conbtn"){
            SetChangeFieldLogin(prevState => ({
                ...prevState,
                clickoncon: true,
              }));
         }else if(click ==="userbtn"){
            SetChangeFieldLogin(prevState => ({
                ...prevState,
                clickoncon: false,
               }));
        }
    }

  return (
    <div className='h-screen w-screen grid place-content-center'>{/*parent div*/}
       <form className=''> 
        <div className='h-96 content-between grid grid-cols bg-gradient-to-r from-cyan-500 to-blue-500 '>{/*child div*/}
            <div className='col-start-1 col-span-2 flex justify-evenly'>
                <button name="userbtn" type="button" onClick={UserFieldHandle} 
                className="w-48 m-2 font-semibold text-3xl text-white  bg-gradient-to-r from-violet-400 to-fuchsia-700 hover:from-purple-500 hover:to-pink-500">
                    User Sign in
                </button>

                <button name="conbtn" type="button" onClick={UserFieldHandle} 
                className="w-48 m-2 font-semibold text-3xl text-white bg-gradient-to-r from-cyan-400 to-blue-700 hover:from-sky-500 hover:to-indigo-500">
                    Consultant Sign in
                </button>
            </div>


            <div className='col-start-1 col-span-2'>
                {!ChangeFieldlogin.clickoncon &&(
                  <div>
                    <p>Username:</p>
                    <input type="text" />
                    <p>Password:</p>
                    <input type="password" />
                  </div>
                )}
                
                {ChangeFieldlogin.clickoncon &&(
                  <div>
                    <p>Consultant ID:<input></input></p>
                    <p>One-time-password:<input></input></p>
                  </div>
                )}
                <button className = "w-2/5 h-10 text-white font-semibold bg-green-700 rounded-full"> Sign In</button>
            </div>

            <div className=' col-start-1 col-span-2 m-2 flex justify-evenly '>
              <p className='text-xs font-light text-center'>Looking for a fuss free way of getting insured?</p>
              <button name="conbtn" type="button" onClick={UserFieldHandle} 
              className=" font-semibold text-3xl text-white m-2  bg-gradient-to-r from-cyan-400 to-blue-700 hover:from-sky-500 hover:to-indigo-500">
                    Join us!
                </button>
        
              <p className='text-xs font-light text-center'>Looking for a purpose in your career? Join our growing community of consultants!</p>
              <button name="conbtn" type="button" onClick={UserFieldHandle} className="font-semibold text-3xl text-white m-2  bg-gradient-to-r from-cyan-400 to-blue-700 hover:from-sky-500 hover:to-indigo-500">
                    Sign Up
                </button>
            </div>
        </div>
        </form>
    </div>
  )
}