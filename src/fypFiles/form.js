import axios from 'axios';
import {React,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';
import { BiMale,BiFemale } from 'react-icons/bi';
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai';
 
export function SignUpDiv(){
   //input is an obj that represents the current state of the component, and it has several (variables)properties: consultantname...
    //setInput is a function that is used to update the STATE of the obj through the obj properties
    const [visible, setvisible] = useState(true);
 
    const [input, setInput] = useState({
    clientname:"",    
    clientusername:"", 
    clientpassword:"",
    clientgender:"",
    clientnumber:"",
    clientlifestyle:"",
    clientoccupation:"",
    clientemail:"",
    DOB:"",
    errors:{
        errClientName:"",
        errClientName2:"",
        errClientUsername:"",
        errClientPassword:"",
        errClientPassword2:"",
        errClientNumber:"",
        errClientNumber2:"",
        errClientLifestyle:"",
        errClientLifestyle2:"",
        errClientOccupation:"",
        errClientEmail:"",
        errClientEmail2:"",
        errClientGender:"",
        errDOB:"",
        errEmailTaken:""
      }
  });

  const handleEvent = (e) =>{
    e.preventDefault();
    const name = e.target.name
    const value = e.target.value
    if(name ==="clientname"){
    setInput(prev => ({
      ...prev, [name]:value,errors: {
       ...prev.errors,
       errClientName: !/^[a-zA-Z]+$/.test(value)?"Input only in Alphabets":"",
       errClientName2: value.length<3?"Input must be more than 3 Alphabets":""
       }
    }));
   }else if(name === "clientusername"){
    setInput(prev => ({
      ...prev,[name]:value,errors: {
        ...prev.errors,
        errClientUsername:value.length<8?"Input must be more than 8 characters":""
      }
    }));
  
   }else if(name === "clientpassword"){
    const specialCharRegex = /[!@#$%^&*]/;
    const capitalLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    if((specialCharRegex.test(value) && capitalLetterRegex.test(value) && numberRegex.test(value)) &&value.length>8){
      setInput(prev => ({
        ...prev, [name]:value, errors: {
          ...prev.errors,
          errClientPassword2:""
        }
      }));
    }else{
      setInput(prev => ({
        ...prev, [name]:value, errors: {
          ...prev.errors,
          errClientPassword2:"Password at least 1 capital letter,1 symbol and 1 number"
        }
      }));
     }
   }else if(name === "clientgender"){
    setInput(prev => ({
      ...prev, [name]:value, errors: {
        ...prev.errors,
      }
    }));
   }else if(name === "clientnumber"){
    setInput(prev => ({
      ...prev, [name]:value, errors: {
        ...prev.errors,
        errClientNumber2:!(/^[0-9\b]+$/).test(value)?"Input only in Numbers":""
      }
    }));      
   }else if(name === "clientlifestyle"){
    setInput(prev => ({
      ...prev, [name]:value, errors: {
        ...prev.errors,
        errClientLifestyle2:value === "Select an option"?"Please select an option":""
      }
    }));
   }else if(name === "clientoccupation"){
    setInput(prev => ({
      ...prev, [name]:value, errors: {
        ...prev.errors,
        errClientOccupation2: !/^[a-zA-Z]+$/.test(value)?"Input only in Alphabets":"",
      }
    }));
   }else if(name === "clientemail"){
      setInput(prev => ({
        ...prev, [name]:value, errors: {
          ...prev.errors,
          errClientEmail2:!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(value)?"Email not valid":""
        }
      }));
    }
    else if(name === "DOB"){
      const convertDate = moment(value).format('YYYY-MM-DD')
      setInput(prev => ({
        ...prev, [name]:convertDate, errors: {
          ...prev.errors,
        }
      }));
    }
  }   
  //navigate to another page
  const navigate = useNavigate() 

  //making API req to put user inpt into sql
  //Asynchronous functions  perform multiple tasks at the same time and don't block the execution of other code. This allows the program to continue running while the async function completes its task.
  const submitbtn = async e =>{
    console.log(input)
    e.preventDefault();
    if((input.clientgender && input.clientlifestyle && input.DOB !=="") && input.clientemail !==""){
      try{
        await axios.post("http://localhost:3004/addinclientsignup",input)
        navigate("/submitted")
      }catch(error){
        setInput((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            errEmailTaken: error.response.data.message
          }
        }));
      }
    }else{
      setInput(prev => ({
        ...prev, errors: {
          ...prev.errors,
          errClientName2:"Name field cant be empty",
          errClientUsername:"Username field cant be empty",
          errClientPassword:"Password field cant be empty",
          errClientGender:"Select a gender", 
          errClientNumber:"Mobile number field cant be empty",
          errClientLifestyle:"Lifestyle field cant be empty", 
          errClientOccupation:"Occupation field cant be empty",
          errClientEmail:"Email field cant be empty",  
          errDOB:"Date Of Birth cant be empty",
        }
      }));
    }
  }

  return (
      <div className = "h-screen bg-gradient-to-r from-purple-500 to-pink-500 grid place-content-center">
        <div className='h-fit w-fit bg-gradient-to-r from-sky-700 to-indigo-700 border-4 border-white-500/100'>
         <form onSubmit={submitbtn}>
          <div>
            <h1 className = "font-sans font- text-3xl text-center">Get started with us today!</h1>
            <p className = "text-s text-center">Join us today to be in control of your insurances needs.</p>
            <br/>
          </div>
          <div className=''>
           <h3 className= "font-sans font- text-2xl">Name: <input name="clientname" placeholder='Name'onChange={handleEvent}></input></h3>
           {input.clientname.length<3?<span className='text-red-500'>{input.errors.errClientName2}</span> :""}
           {!/^[a-zA-Z]+$/.test(input.clientname)?<span className='text-red-500'>{input.errors.errClientName}</span> :""}<br/>
          </div>

          <div>
          <h3 className= "font-sans font- text-2xl">Username: <input name="clientusername" placeholder='Username'onChange={handleEvent}></input></h3>
          {input.clientusername.length<8?<span className='text-red-500'>{input.errors.errClientUsername}</span> :""}<br/>
          </div>

          <div className='relative'>
            <h3 className= "font-sans font- text-2xl">Password:<input name="clientpassword" type={visible? "password" : "text"} placeholder='Password'onChange={handleEvent}>
              
            </input></h3>
            {input.clientpassword === ""?<span className='text-red-500'>{input.errors.errClientPassword}</span> :""}<br/>
            {input.clientpassword?<span className='text-red-500'>{input.errors.errClientPassword2}</span> :""}<br/>

            <div className='text-2xl absolute top-1 right-12 w-10' onClick={() => setvisible(!visible)}>
            {visible? <AiFillEyeInvisible/>:<AiFillEye/>}
            </div>
          </div>
           
          <div>
           <h3 className= "font-sans font- text-2xl">Gender:</h3>
           <BiMale/><input type ="radio" name="clientgender" value="M"checked={input.clientgender === "M"} onChange={handleEvent}></input>
           <BiFemale/><input type ="radio" name="clientgender"value ="F"checked={input.clientgender === "F"}onChange={handleEvent}></input><br/>
           {input.clientgender === ""?<span className='text-red-500'>{input.errors.errClientGender}</span> :""}<br/>
          </div>

          <div>
          <h3 className= "font-sans font- text-2xl">Mobile number:<input name="clientnumber" type="" placeholder='Mobile Number'onChange={handleEvent}></input></h3>
           {input.clientnumber === ""?<span className='text-red-500'>{input.errors.errClientNumber}</span> :""}<br/>
           {!(/^[0-9\b]+$/).test(input.clientnumber)?<span className='text-red-500'>{input.errors.errClientNumber2}</span> :""}
          </div>

          <div>
           <h3 className= "font-sans font- text-2xl">Lifestyle:<select name="clientlifestyle" placeholder="Select an option" onChange={handleEvent}>
           <option>Select an option</option> 
           <option>Active</option>  
           <option>Moderately-Active </option>  
           <option>Partially-Active</option>  
           <option>Sedentary</option>  
           </select></h3>
           {input.clientlifestyle === ""?<span className='text-red-500'>{input.errors.errClientLifestyle}</span> :""}<br/>
           {input.clientlifestyle === "Select an option"?<span className='text-red-500'>{input.errors.errClientLifestyle2}</span> :""}<br/>
          </div>
          <div>
           <h3 className= "font-sans font- text-2xl">Occupation:<input name="clientoccupation" placeholder='Occupation'onChange={handleEvent}></input></h3>
           {input.clientoccupation === ""?<span className='text-red-500'>{input.errors.errClientOccupation}</span> :""}<br/><br/>
          </div>
          <div>
           <h3 className = "font-sans font- text-2xl">Email:<input name="clientemail" placeholder='Email Address'onChange={handleEvent}></input></h3>
           {input.clientemail === ""?<span className='text-red-500'>{input.errors.errClientEmail}</span> :""}
           {!(/[a-zA-Z0-0.%+-]+@[a-z0-9-]+\.[a-z]{2,8}(.[a-z{2,8}])?/).test(input.clientemail)?<span className='text-red-500'>{input.errors.errClientEmail2}</span> :""}<br/>
           {input.clientemail && <span className='text-red-500'>{input.errors.errEmailTaken}</span>}
          </div>

          <div>
           <h3 className = "font-sans font- text-2xl">Date Of Birth:<input name="DOB" type="date" placeholder='Date Of Birth'onChange={handleEvent}></input></h3>
           {input.DOB === ""?<span className='text-red-500'>{input.errors.errDOB}</span> :""}<br/><br/>
          </div>
         <div className='justify-center flex items-center'> 
          <button className = "w-2/5 h-10 text-white font-semibold bg-green-700 rounded-full items-center">SUBMIT</button>
         </div>
        </form>
        </div>
      </div>
   );
}

