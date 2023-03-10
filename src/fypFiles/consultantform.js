import axios from 'axios';
import {React,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { BiMale,BiFemale } from 'react-icons/bi';
import moment from 'moment';



export function SignUpConsultant(){
    //coninput is an obj that represents the current state of the component, and it has several (variables)properties: consultantname...
    //consetInput is a function that is used to update the STATE of the obj through the obj properties
    //e.value.target -> obj -> consetInput(obj) 
    const [coninput, consetInput] = useState({
      consultantname:"",
      consultantnumber:"",
      consultantemail:"",
      consultantgender:"",
      DOB:"",
      hearfromus:"",
      errors:{
        errconsultantname:"",
        errconsultantname2:"",
        errconsultantnumber:"",
        errconsultantnumber2:"",
        errconsultantemail:"",
        errconsultantemail2:"",
        errconsultantgender:"",
        errDOB:""
      }
    });
    
    const handleEvent = (e) =>{
      e.preventDefault();
      const name = e.target.name
      const value = e.target.value
      if(name ==="consultantname"){
      consetInput(prev => ({
        ...prev, [name]:value,errors: {
         ...prev.errors,
          errconsultantname: !/^[a-zA-Z]+$/.test(value)?"Input only in Alphabets":"",
          errconsultantname2: value.length<3?"Input must be more than 3 Alphabets":""
         }
      }));
    }else if(name === "consultantnumber"){
      consetInput(prev => ({
        ...prev,[name]:value,errors: {
          ...prev.errors,
          errconsultantnumber:!(/^[0-9\b]+$/).test(value)?"Input only in Numbers":""
        }
      }));
    }else if(name === "consultantemail"){
      consetInput(prev => ({
        ...prev, [name]:value, errors: {
          ...prev.errors,
          errconsultantemail:!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(value)?"Email not valid":""
        }
      }));
    }else if(name === "consultantgender"){
      consetInput(prev => ({
        ...prev, [name]:value, errors: {
          ...prev.errors,
        }
      }));
    }else if(name === "DOB"){
      const convertDate = moment(value).format('YYYY-MM-DD')
      consetInput(prev => ({
        ...prev, [name]:convertDate, errors: {
          ...prev.errors,
        }
      }));      
    }else if(name === "hearfromus"){
      consetInput(prev => ({
        ...prev, [name]:value, errors: {
          ...prev.errors,
        }
      }));
    }
  }
    //navigate to another page
    const navigate = useNavigate();
  
    //making API req to put user inpt into sql
    //Asynchronous functions  perform multiple tasks at the same time and don't block the execution of other code. This allows the program to continue running while the async function completes its task.
    const consubmitbtn = async e =>{
      e.preventDefault();
      if(coninput.consultantname && coninput.consultantemail && coninput.consultantnumber && coninput.consultantgender && coninput.DOB !== ""){
        try{
          console.log(coninput)
          navigate("/consultantsubmitted")
          await axios.post("http://localhost:3004/addinconsultants",coninput)
        }catch(err){
         console.log(err);
        }
      }else{
        consetInput(prev => ({
          ...prev, errors: {
            ...prev.errors,
            errconsultantname2: "Input field cant be empty",
            errconsultantnumber2: "Input field cant be empty",
            errconsultantemail2: "Input field cant be empty",  
            errconsultantgender: "Select a gender",
            errDOB: "Date Of Birth cant be empty",
          }
        }));      
      }    
    }
    return (
      <div>
          <h1 className = "font-sans font- text-3xl text-center">Join Us Today!</h1>
            <p className = "text-xs text-center">Join us on a path for client empowerment</p>
            <div className = "space-y-4 flex justify-center">
            <form onSubmit={consubmitbtn}>
              <h3 className= "font-sans text-2xl w-96 mt-9">Name:<input name="consultantname" placeholder='Name'onChange={handleEvent}></input></h3>
              {/*conUserErr? = is conUserErr true? if so, then <span> will render otherwise nth happens*/}
              {coninput.consultantname.length<3?<span className='text-red-500'>{coninput.errors.errconsultantname2}</span> :""}<br/>
              {!/^[a-zA-Z]+$/.test(coninput.consultantname)?<span className='text-red-500'>{coninput.errors.errconsultantname}</span> :""}<br/>
              
              <h3 className= "font-sans font- text-2xl w-96 mt-3">Number:<input name="consultantnumber" placeholder='HPnumber'onChange={handleEvent} ></input></h3>
              {!(/^[0-9\b]+$/).test(coninput.consultantnumber)?<span className='text-red-500'>{coninput.errors.errconsultantnumber}</span> :""}
              {coninput.consultantnumber===""?<span className='text-red-500'>{coninput.errors.errconsultantnumber2}</span> :""}<br/>

              <h3 className= "font-sans font- text-2xl w-96 mt-3">Email:<input type ="email" name="consultantemail" placeholder='Email' onChange={handleEvent}></input></h3>
              {!(/[a-zA-Z0-0.%+-]+@[a-z0-9-]+\.[a-z]{2,8}(.[a-z{2,8}])?/).test(coninput.consultantemail)?<span className='text-red-500'>{coninput.errors.errconsultantemail}</span> :""}<br/>
              {coninput.consultantemail === ""?<span className='text-red-500'>{coninput.errors.errconsultantemail2}</span> :""}

              <h3 className= "font-sans font-text-2xl w-96 mt-3">Gender:
              <BiMale/><input type ="radio" name="consultantgender" value="M"checked={coninput.consultantgender === "M"} onChange={handleEvent}></input>
              <BiFemale/><input type ="radio" name="consultantgender"value ="F"checked={coninput.consultantgender === "F"}onChange={handleEvent}></input><br/>
              {coninput.consultantgender === ""?<span className='text-red-500'>{coninput.errors.errconsultantgender}</span> :""}
              </h3><br/><br/>

              <h3 className= "font-sans font- text-2xl rounded-full w-96 mt-3">Date of birth:<input name="DOB" type ="date" placeholder='Date of birth' onChange={handleEvent} ></input></h3>
              {coninput.DOB === ""?<span className='text-red-500'>{coninput.errors.errDOB}</span> :""}
              
              <h3 className= "font-sans font- text-2xl w-96 mt-3">How did you find out about us?:<input name="hearfromus" placeholder='Where did you hear from us?' onChange={handleEvent}></input></h3><br/>
              <div className='justify-center flex'>
                <button className = "w-2/5 h-10 text-white font-semibold bg-green-700 rounded-full items-center"> SUBMIT</button>
              </div>
          </form>
          </div>
     </div>
    )
}
   