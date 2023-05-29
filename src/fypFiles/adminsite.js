import {React,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
  
export const Adminsite = () => {
  const [textfield, setTextfields] = useState(() => {
    const storedData = localStorage.getItem('TextFieldsDataKey');
    return storedData ? JSON.parse(storedData) : {
      policyid1: '',
      policyid2: '',
      policyid3: '',
      policyid4: '',
      policyid5: '',
      policyid6: '',
      policyid7: '',
      policyid8: '',
      policyid9: '',
      policyid10: '',
      policyid11: '',
      policyid12: ''
    };
  });
    const navigate = useNavigate()
    const gobacktologin=()=>{
        navigate("/AdminLoginPage")
    }
    const implementChanges = (e) => {
        const click = e.target.name;
        const input = e.target.value;
        switch (click) {
          case 'policyid1':
            setTextfields((prev) => ({
              ...prev,
              policyid1: input
            }));
            break;
          case 'policyid2':
            setTextfields((prev) => ({
              ...prev,
              policyid2: input,
            }));
            break;
            case 'policyid3':
            setTextfields((prev) => ({
              ...prev,
              policyid3: input,
            }));
            break;
            case 'policyid4':
            setTextfields((prev) => ({
              ...prev,
              policyid4: input,
            }));
            break;
            case 'policyid5':
            setTextfields((prev) => ({
              ...prev,
              policyid5: input,
            }));
            break;
            case 'policyid6':
            setTextfields((prev) => ({
              ...prev,
              policyid6: input,
            }));
            break;
            case 'policyid7':
            setTextfields((prev) => ({
              ...prev,
              policyid7: input,
            }));
            break;
            case 'policyid8':
            setTextfields((prev) => ({
              ...prev,
              policyid8: input,
            }));
            break;
            case 'policyid9':
            setTextfields((prev) => ({
              ...prev,
              policyid9: input,
            }));
            break;
            case 'policyid10':
            setTextfields((prev) => ({
              ...prev,
              policyid10: input,
            }));
            break;
            case 'policyid11':
            setTextfields((prev) => ({
              ...prev,
              policyid11: input,
            }));
            break;
            case 'policyid12':
            setTextfields((prev) => ({
              ...prev,
              policyid12: input,
            }));
            break;
          default:
            break;
        }
       };
 
      useEffect(() => {
        localStorage.setItem('TextFieldsDataKey',JSON.stringify(textfield));
      }, [textfield]);
 
    const saveNimplement = async e =>{
        e.preventDefault();
         try{
             await axios.post("http://localhost:3004/changefields",textfield)
          }catch(err){
            let error = err.response.status
            console.log(error)
          }
    }
    const [PolicyReview, setPolicyReview] = useState(() => {
      const storedDataPolicy = localStorage.getItem('PolicyTextFieldsDataKey');
      return storedDataPolicy ? JSON.parse(storedDataPolicy) : {
          policyImage1:"",
          imageformat1:"",
          policyDescription1:"",
          policyCoverage1:"",
          policyPrice1:"",
          policyImage2:"",
          imageformat2:"",
          policyDescription2:"",
          policyCoverage2:"",
          policyPrice2:"",
          policyImage3:"",
          imageformat3:"",
          policyDescription3:"",
          policyCoverage3:"",
          policyPrice3:"",
          policyImage4:"",
          imageformat4:"",
          policyDescription4:"",
          policyCoverage4:"",
          policyPrice4:"",
          policyImage5:"",
          imageformat5:"",
          policyDescription5:"",
          policyCoverage5:"",
          policyPrice5:"",
          policyImage6:"",
          imageformat6:"",
          policyDescription6:"",
          policyCoverage6:"",
          policyPrice6:"",
          policyImage7:"",
          imageformat7:"",
          policyDescription7:"",
          policyCoverage7:"",
          policyPrice7:"",
          policyImage8:"",
          imageformat8:"",
          policyDescription8:"",
          policyCoverage8:"",
          policyPrice8:"",
          policyImage9:"",
          imageformat9:"",
          policyDescription9:"",
          policyCoverage9:"",
          policyPrice9:"",
          policyImage10:"",
          imageformat10:"",
          policyDescription10:"",
          policyCoverage10:"",
          policyPrice10:"",
          policyImage11:"",
          imageformat11:"",
          policyDescription11:"",
          policyCoverage11:"",
          policyPrice11:"",
          policyImage12:"",
          imageformat12:"",
          policyDescription12:"",
          policyCoverage12:"",
          policyPrice12:"",
        };
      });

      useEffect(() => {
        localStorage.setItem('PolicyTextFieldsDataKey',JSON.stringify(PolicyReview));
      }, [PolicyReview]);
 
      const policySubmit = async (e) => {
        e.preventDefault();
         try{
          const formData = new FormData();
          for (const key in PolicyReview) {
            formData.append(key, PolicyReview[key]);
          }
         
           const response = await fetch('http://localhost:3004/changeBuyPolicies', {
            method: 'PUT',
            body: formData,
          });
          const result = await response.json(); 
           // Handle the response from the server
        } catch (err) {
          console.log(err.response);
        }
      }

      const policyReviewSegment = (e) => {
        const click = e.target.name;
        const input = e.target.value;
         const matches = click.match(/(policyImage|policyDescription|policyCoverage|policyPrice)(\d+)/);
        if (matches) {
          if (/(policyImage(\d+))/.test(click)) {
            const [, fieldType, policyIndex] = matches;
            const imageData = e.target.files[0];
            console.log( imageData)

            const imageformatMime = imageData.type; 
            const reader = new FileReader()
            reader.readAsDataURL(imageData);
            reader.onload = () => {
              localStorage.setItem(`image${policyIndex}`, reader.result);
            };
            setPolicyReview((prev) => ({
              ...prev,
              [`${fieldType}${policyIndex}`]: imageData, // Store the File object directly
              [`imageformat${policyIndex}`]: imageformatMime
            }));
            //console.log(PolicyReview.policyImage1)
          } else {
            const [_, fieldType, policyIndex] = matches;
            setPolicyReview((prev) => ({
              ...prev,
              [`${fieldType}${policyIndex}`]: input,
            }));
          }
         }
      }
    
  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <h1 className="text-white">Admin Page</h1>
              </div>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <p onClick={gobacktologin} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="grid max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">
      <div className="border-4 border-indigo-500/100 px-4 py-6 sm:px-0">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Buy Policies segment</h2>
            <p className="mb-4">
                Changes on this segment will reflect on the user end when browsing the
                "buy policy" menu.
            </p>
            <form onSubmit={saveNimplement}>
                <div className="flex-row space-y-4">
                    <div className='m-3'>Critical-illness text fields:
                        <input className='border-2 border-black' name='policyid1' value={textfield.policyid1} type="text" onChange={implementChanges}></input>
                        <input className='border-2 border-black' name='policyid2' value={textfield.policyid2} type="text" onChange={implementChanges}></input>
                    </div>
                     <div className='m-3'>Hospitalisation text fields:
                        <input className='border-2 border-black' name='policyid3' value={textfield.policyid3} type="text" onChange={implementChanges}></input>
                        <input className='border-2 border-black'  name='policyid4'value={textfield.policyid4} type="text" onChange={implementChanges}></input>
                    </div>
                    <div className='m-3'>Personal Accident text fields:
                        <input className='border-2 border-black' name='policyid5' value={textfield.policyid5} type="text" onChange={implementChanges}></input>
                        <input className='border-2 border-black' name='policyid6' value={textfield.policyid6} type="text" onChange={implementChanges}></input>
                    </div> 
                    <div className='m-3'>Disability text fields:
                        <input className='border-2 border-black' name='policyid7' value={textfield.policyid7} type="text" onChange={implementChanges}></input>
                        <input className='border-2 border-black' name='policyid8' value={textfield.policyid8} type="text" onChange={implementChanges}></input>
                    </div> 
                    <div className='m-3'>Life Insurance text fields:
                        <input className='border-2 border-black' name='policyid9' value={textfield.policyid9} type="text" onChange={implementChanges}></input>
                        <input className='border-2 border-black' name='policyid10' value={textfield.policyid10} type="text" onChange={implementChanges}></input>
                    </div> 
                    <div className='m-3'>Investment text fields:
                        <input className='border-2 border-black' name='policyid11' value={textfield.policyid11} type="text" onChange={implementChanges}></input>
                        <input className='border-2 border-black' name='policyid12' value={textfield.policyid12} type="text" onChange={implementChanges}></input>
                    </div> 
                    
                </div>
                <div>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline-blue'type='submit'>save</button>
                </div>
            </form>
            </div>
        </div>
        </div>
        <div className="border-4 border-indigo-500/100 px-4 py-6 sm:px-0">
          <div className=" bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Policy Review segment</h2>
              <p className="mb-4">Changes here will be reflected when user finds out more about a policy.</p>
              <p className="mb-4">
                    Please{' '}
                    <span className="font-bold text-red-500">
                      upload only JPEG or PNG files
                    </span>{' '}
                    for policy images.
                  </p>
              <div className="flex-row space-y-4">
                <div className="border-4 border-blue-500 p-3">
                  <form onSubmit={policySubmit}>
                  {Array.from({ length: 1 }, (_, index) => (
                  <div key={`policy${index + 1}`}>
                    <p className="text-center border-2 border-black">Critical-illness Policies fields:</p>
                    <p className='text-center font-bold text-xl'>Policy {index + 1}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage1" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription1" value={PolicyReview.policyDescription1} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage1" value={PolicyReview.policyCoverage1} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice1"
                              type="number"
                              value={PolicyReview.policyPrice1}
                              onChange={policyReviewSegment}
                            />
                    </div>  
                    <div className="mt-3 border-2 border-[thickness] border-red-500"></div> 
                    <p className='text-center font-bold text-xl'>Policy {index + 2}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage2" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription2" value={PolicyReview.policyDescription2} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage2" value={PolicyReview.policyCoverage2} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice2"
                              value={PolicyReview.policyPrice2}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>   
                    <p className="mt-3 text-center border-2 border-black">Hospitalization Policies fields:</p>
                    <p className='text-center font-bold text-xl'>Policy {index + 3}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage3" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription3" value={PolicyReview.policyDescription3} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage3" value={PolicyReview.policyCoverage3} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice3"
                              value={PolicyReview.policyPrice3}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>                  
                    <div className="mt-3 border-2 border-[thickness] border-red-500"></div>
                    <p className='text-center font-bold text-xl'>Policy {index + 4}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage4" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full"  value={PolicyReview.policyDescription4} name="policyDescription4" type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage4" value={PolicyReview.policyCoverage4} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice4"
                              value={PolicyReview.policyPrice4}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>   
                    <p className="mt-3 text-center border-2 border-black">Personal Accident Policies fields:</p>
                    <p className='text-center font-bold text-xl'>Policy {index + 5}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage5" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription5"  value={PolicyReview.policyDescription5} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage5" value={PolicyReview.policyCoverage5} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice5"
                              value={PolicyReview.policyPrice5}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>                  
                    <div className="mt-3 border-2 border-[thickness] border-red-500"></div>
                    
                    <p className='text-center font-bold text-xl'>Policy {index + 6}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage6" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription6" value={PolicyReview.policyDescription6} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage6" value={PolicyReview.policyCoverage6} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice6"
                              value={PolicyReview.policy6}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>    
                    
                    <p className="mt-3 text-center border-2 border-black">Permanant Disability/Disabilities Policies fields:</p>
                    <p className='text-center font-bold text-xl'>Policy {index + 7}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage7" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription7" value={PolicyReview.policyDescription7} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage7" value={PolicyReview.policyCoverage7} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice7"
                              value={PolicyReview.policyPrice7}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>                  
                    <div className="mt-3 border-2 border-[thickness] border-red-500"></div>
                    
                    <p className='text-center font-bold text-xl'>Policy {index + 8}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage8" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription8" value={PolicyReview.policyDescription8} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage8" value={PolicyReview.policyCoverage8} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice8"
                              value={PolicyReview.policyPrice8}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>    
                    <p className="mt-3 text-center border-2 border-black">Life Insurance Policies fields:</p>
                    <p className='text-center font-bold text-xl'>Policy {index + 9}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage9" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription9"  value={PolicyReview.policyDescription9} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage9" value={PolicyReview.policyCoverage9} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice9"
                              value={PolicyReview.policyPrice9}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>                  
                    <div className="mt-3 border-2 border-[thickness] border-red-500"></div>
                    
                    <p className='text-center font-bold text-xl'>Policy {index + 10}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage10" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription10"  value={PolicyReview.policyDescription10} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage10" value={PolicyReview.policyCoverage10} type="text" onChange={policyReviewSegment}></textarea>

                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice10"
                              value={PolicyReview.policyPrice10}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>    
                    <p className="mt-3 text-center border-2 border-black">Investment Policies fields:</p>
                    <p className='text-center font-bold text-xl'>Policy {index + 11}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage11" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription11"  value={PolicyReview.policyDescription11} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage11" value={PolicyReview.policyCoverage11} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice11"
                              value={PolicyReview.policyPrice11}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>                  
                    <div className="mt-3 border-2 border-[thickness] border-red-500"></div>
                    
                    <p className='text-center font-bold text-xl'>Policy {index + 12}:</p>
                    <p>policy image:</p><input className="border-2 border-black" name="policyImage12" type="file" accept=".png, .jpg, .jpeg" data-max-file-size="0.416" onChange={policyReviewSegment}></input>
                    <p>policy description:</p><textarea className="border-2 border-black h-20 w-full" name="policyDescription12" value={PolicyReview.policyDescription12} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy coverage:</p><textarea className="border-2 border-black h-44 w-full" name="policyCoverage12" value={PolicyReview.policyCoverage12} type="text" onChange={policyReviewSegment}></textarea>
                    <p>policy monthly premium:</p>
                    <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              className="pl-6 border-2 border-black"
                              name="policyPrice12"
                              value={PolicyReview.policyPrice12}
                              type="number"
                              onChange={policyReviewSegment}
                            />
                    </div>   
                    <div className="text-right">
                      <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline-blue' type='submit'>save</button>
                    </div>
                     </div>
                    ))}
                  </form>
                </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

  