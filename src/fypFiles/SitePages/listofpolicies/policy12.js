import {React,useEffect,useState } from "react";
import axios from 'axios'

export function Policy12(){
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [policy12Data, setpolicy12Data] = useState({
    sessionEmail:"",
    NRIC:"",
    policyid:12,
    policyActive:"Active",
    errmsgMax9:"",
    errmsgCantEmpty:"",
    userAlrdSignUp:"",
    });
  const [policyNames, setPolicyNames] = useState()// policy details sent from server and stored in OBJ
  const [showNRICBox, setShowNRICBox] = useState(false);
   useEffect(() => {
    const fetchpolicy = async () => {
      try { 
        const response = await axios.get('http://localhost:3004/policesData');
        // Assuming response.data is an array and you want to set the state with the first policy object
        if (response.data && response.data.length > 0) {
           const result = response.data[11];
            setPolicyNames({ 
            policyimage: result.policyimage.data,
            imageformat:  result.imageformat,
            policyname: result.policyname,
            policydescription: result.policydescription,
            policycoverage: result.policycoverage,
            pricemonthly: result.pricemonthly
          });
         }
       } catch (error) {
        console.error('Error fetching data:', error);
      }
     };
    fetchpolicy(); 
  },[]);

  function createObjectURLFromBinary(binaryData, mimeType) {
    const arrayBuffer = new Uint8Array(binaryData).buffer;
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  }

  const paymentPage = (e) => {
    e.preventDefault();
    if (policy12Data.NRIC !== null && policy12Data.NRIC !== "") {
        const retrieveClientEmail = sessionStorage.getItem("clientemail");
        const updatedPolicyData = {
          ...policy12Data,
          sessionEmail: retrieveClientEmail
        };
         fetch('http://localhost:3004/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            policyDetails: {
              sessionEmail: updatedPolicyData.sessionEmail,
              NRIC: updatedPolicyData.NRIC,
              policyid: updatedPolicyData.policyid,
              policyActive: updatedPolicyData.policyActive
            },
            policy1details: [{ id: policy12Data.policyid, name: policyNames.policyname, price: policyNames.pricemonthly, quantity: 1}]
          }),
        })
        .then(async (res) => {
          if (res.ok) return res.json();
          const json = await res.json();
          return Promise.reject(json);
        })
        .then(({ url }) => {
          window.location = url;
        })
        .catch((e) => {
          console.error(e);
          if (e.incorrectNRIC) {
            setpolicy12Data((prev) => ({
              ...prev,
              userAlrdSignUp: e.incorrectNRIC
            }));
          } else {
            setpolicy12Data((prev) => ({
              ...prev,
              userAlrdSignUp: e.userAlrdSignUp
            }));
          }
        });        
    } else {
      setpolicy12Data((prev) => ({
        ...prev,
        userAlrdSignUp: "Input your NRIC before submitting",
       }));
    }
  }; 

  const NRICinput = (e)=>{
     const value = e.target.value
         setpolicy12Data((prev) => ({
          ...prev,
          errmsgMax9:value.length<9 || value.length > 9 ? "NRIC inputs must only be 9 characters long":"",
          NRIC: value.length === 9 ? value : null
        }));
   }
 
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="static h-full w-5/6 bg-blue-200 flex flex-col p-8 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6">
        <span>{policyNames && policyNames.policyname}</span>
      </h1>
          <div className="mb-4">
           {policyNames && (
             <img
               src={createObjectURLFromBinary(policyNames.policyimage, policyNames.imageformat)}
               alt="Policy"
             />
           )}
         </div>         
        <div className="flex flex-col">
          <div className="w-full mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Policy Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Policy Description:</label>
              {policyNames && policyNames.policydescription}
            </div> 
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Coverage:</label>
              {policyNames && policyNames.policycoverage}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Monthly Premium:</label>
              <span>$</span>{policyNames && policyNames.pricemonthly}
            </div>
          </div>
        </div>
        {!showNRICBox && (
        <div className="mt-8">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600" onClick={() => setShowNRICBox(true)}>Purchase policy</button>
        </div>
        )}
               {showNRICBox && (
                <div className="relative bg-white p-4 rounded shadow-md">
                  <button
                    className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
                    onClick={() => {
                      setShowNRICBox(false);
                      // additional useState here
                      setpolicy12Data((prev) => ({
                        ...prev,
                        userAlrdSignUp: "",
                        errmsgMax9:"",
                        errmsgCantEmpty:""
                      }));
                    }}
                  >
                    <span className="font-bold text-3xl mr-4">x</span>
                  </button>
                  <div className="mb-4">
                  <p className="text-center underline">Input your NRIC number for policy registration</p>
                    <label htmlFor="nric" className="block mb-1 font-bold">
                      NRIC:
                    </label>                    
                    {policy12Data.errmsgMax9 ? <span className='text-sm underline text-black'> {policy12Data.errmsgMax9}</span> : ""}<br/>
                     <input
                      type="text"
                      name="NRIC"
                      onChange={NRICinput}
                      className="w-full p-2 border border-gray-300 rounded"
                    />      
                    <div className="mb-1"> 
                    {policy12Data.errmsgCantEmpty ? <span className='text-red-500'> {policy12Data.errmsgCantEmpty}</span> : ""}<br/>                     
                    {policy12Data.userAlrdSignUp ? <span className='text-red-500'> {policy12Data.userAlrdSignUp}</span> : ""}<br/>                     
                    </div>
                    <div>
                      {submitSuccess ?  
                        <div>
                          <span className="text-2xl font-bold text-green-500 text-center block">Submission successful!</span>
                        </div>: <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-20" onClick={paymentPage}>Enter</button>
                      }
                    </div>
                   </div>
                </div>
              )}
      </div>
    </div>
  );
};