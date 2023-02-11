import axios from 'axios';
import {React,useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function SignUpDiv(){
  //input is a variable 
  //setInput is a method
  const [input, setInput] = useState({
    clientname:"",
    clientgender:"",
    clientnumber:"",
    clientaddress:"",
    clientlifestyle:"",
    clientoccupation:"",
    clientemail:"",
    DOB:""
  });


  //get user input from frontend
  const getUserInput =(e) =>{
    setInput(prev=>({...prev,[e.target.name]:e.target.value}))
  };
  console.log(input);


  //navigate to another page
  const navigate = useNavigate() 

  //making API req to put user inpt into sql
  const submitbtn = async e =>{
    e.preventDefault();
    console.log("api run")
    try{
      await axios.post("http://localhost:3004/addinclientsignup",input)
      navigate("/submitted");
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className = 'w-screen h-screen flex justify-center items-center'>
      <div className = "bg-blue-300 w-[90vh] h-[95vh]">

          <h1 className = "font-sans font- text-3xl text-center">Get started with us today!</h1>
          <p className = "text-xs text-center">Join us today to be in control of your insurances needs.</p>
          <div className = "space-y-4">
            <h3 className= "font-sans font- text-2xl"> 
              Name: <input name="clientname" placeholder='name'onChange={getUserInput}></input>
            </h3>
            <h3 className= "font-sans font- text-2xl">Gender:<input name="clientgender" placeholder='Gender'onChange={getUserInput}></input></h3>
            <h3 className= "font-sans font- text-2xl">Number:<input name="clientnumber" placeholder='Hpnumber'onChange={getUserInput}></input></h3>
            <h3 className= "font-sans font- text-2xl">Address:<input name="clientaddress" placeholder='Address'onChange={getUserInput}></input></h3>
            <h3 className= "font-sans font- text-2xl">Lifestyle:<input name="clientlifestyle" placeholder='Lifestyle'onChange={getUserInput}></input></h3>
            <h3 className= "font-sans font- text-2xl">Occupation:<input name="clientoccupation" placeholder='Occupation'onChange={getUserInput}></input></h3>
            <h3 className = "font-sans font- text-2xl">Email:<input name="clientemail" placeholder='Email Address'onChange={getUserInput}></input></h3>
            <h3 className = "font-sans font- text-2xl">Date Of Birth:<input name="DOB" placeholder='DOB'onChange={getUserInput}></input></h3>
        </div>
        <button onClick={submitbtn}>SUBMIT</button>

      </div>
    </div>
  )
}
 