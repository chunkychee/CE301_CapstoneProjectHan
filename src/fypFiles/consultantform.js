import axios from 'axios';
import {React,useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function SignUpConsultant(){
    //coninput is an obj that represents the current state of the component, and it has several (variables)properties: consultantname...
    //consetInput is a function that is used to update the STATE of the obj through the obj properties
    const [coninput, consetInput] = useState({
      consultantname:"",
      consultantnumber:"",
      consultantemail:"",
      consultantgender:"",
      DOB:"",
      hearfromus:""
    });

//consultantnumbererr:number,
      //consultantemailerr,
      //consultantgendererr,
      //DOBerr
    const [conerrors, consetErrors] = useState({
      consultantnameerr:"",
    });

    //get user input from frontend
    const validatorName = (e)=>{

    }


    const getUserInput =(e) =>{
      consetErrors({...prev,[e.target.consultantnameerr]:e.target.value});
      const input = consultantnameerr == isNaN;
          if(input == false){
            validator();
          }
    };
  
  
    //navigate to another page
    const navigate = useNavigate();
  
    //making API req to put user inpt into sql
    //Asynchronous functions  perform multiple tasks at the same time and don't block the execution of other code. This allows the program to continue running while the async function completes its task.
    const consubmitbtn = async e =>{
      e.preventDefault();
      console.log("api run");
      try{
        await axios.post("http://localhost:3004/addinconsultants",coninput)
        navigate("/consultantsubmitted");
      }catch(err){
        console.log(err);
      }
    }
  
    return (
      <div className = 'w-screen h-screen flex justify-center items-center'>
        <div className = "bg-blue-300 w-[90vh] h-[95vh]">
            <h1 className = "font-sans font- text-3xl text-center">Join Us Today!</h1>
            <p className = "text-xs text-center">Join us on a path for client empowerment</p>
            <div className = "space-y-4">
              <h3 className= "font-sans font- text-2xl"> 
                Name: <input name="consultantname" placeholder='Name'onChange={getUserInput}></input>
                <div>
                  {validatorName()}
                  <p>Input only alphabets!</p>
                </div>
              </h3>
              <h3 className= "font-sans font- text-2xl">Number:<input name="consultantnumber" placeholder='HPnumber'onChange={getUserInput}></input></h3>
              <h3 className= "font-sans font- text-2xl">Email:<input name="consultantemail" placeholder='Email'onChange={getUserInput}></input></h3>
              <h3 className= "font-sans font- text-2xl">Gender:<input name="consultantgender" placeholder='Gender'onChange={getUserInput}></input></h3>
              <h3 className= "font-sans font- text-2xl">Date of birth:<input name="DOB" placeholder='Date of birth'onChange={getUserInput}></input></h3>
              <h3 className= "font-sans font- text-2xl">How did you find out about us?:<input name="hearfromus" placeholder='Where did you hear from us?'onChange={getUserInput}></input></h3>
          </div>
          <button onClick={consubmitbtn}>SUBMIT</button>
  
        </div>
      </div>
    )
  }
   