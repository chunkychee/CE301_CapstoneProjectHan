import {React,useEffect,useState } from "react";
import axios from 'axios'
 
export function Policy1(){
  const [policyNames, setPolicyNames] = useState([]);

  useEffect(() => {
    const fetchpolicy = async () => {
      try {
        const response = await axios.get('http://localhost:3004/policyname/policyid1');
        // Assuming response.data is an array and you want to set the state with the first policy object
        if (response.data && response.data.length > 0) {
          const result = response.data[0];
          setPolicyNames({
            policyname: result.policyname,
            policyimage: result.policyimage,
            policydescription: result.policydescription,
            pricemonthly: result.pricemonthly,
          });
        }
        console.log(policyNames)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
     };
    fetchpolicy();
  }, []);

  //const imageData = Buffer.from(policyNames.policyimage, 'base64');
 // const imageFormat = imageType(imageData);
  //let imageSrc;
  //if (imageFormat && imageFormat.mime === 'image/jpeg') {
   // imageSrc = `data:image/jpeg;base64,${policyNames.policyimage}`;
  //} else if (imageFormat && imageFormat.mime === 'image/png') {
   // imageSrc = `data:image/png;base64,${policyNames.policyimage}`;
  //} else {
   // console.error('Invalid image format');
  //}

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="static h-full w-5/6 bg-blue-200 flex flex-col p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6">Insurance Policy</h1>
        <div className="flex flex-col">
          <div className="w-full mb-4">
            <h2 className="text-2xl font-semibold mb-4">Policy Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Policy Number</label>
              <span className="text-gray-700">1234567890</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Policy Type</label>
              <span className="text-gray-700">Health Insurance</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Coverage</label>
              <span className="text-gray-700">$50,000</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Start Date</label>
              <span className="text-gray-700">01/01/2022</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">End Date</label>
              <span className="text-gray-700">12/31/2022</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Premium</label>
              <span className="text-gray-700">$1,000 per year</span>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <span className="text-gray-700">Active</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">Update Policy</button>
        </div>
      </div>
    </div>
  );
};