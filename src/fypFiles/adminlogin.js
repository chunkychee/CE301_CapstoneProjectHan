import {React,useState} from 'react';
 import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export const AdminLoginPage = () => {
    const navigate = useNavigate();

    const[logindetails,setlogindetails] = useState({
        username:"",
        password:"",
        errusername:"",
        errpassword:"",
        errpassanduser:""
    })
    const userpass= (e) =>{
        const click = e.target.name
        if (click === "username"){
            setlogindetails((prev) => ({
                ...prev,
                username: e.target.value,
              }));
        }else{
            setlogindetails((prev) => ({
                ...prev,
                password: e.target.value,
              }));
         }
    }

    const login = async (e) => {
        e.preventDefault();            
        if (logindetails.username.trim() === '' || logindetails.password.trim() === '') {
            setlogindetails((prev) => ({
                ...prev,
                errusername:"Username cannot be empty",
                errpassword:"password cannot be empty"
              }));
        }else{
          try {
            await axios.post('http://localhost:3004/loginadmin', logindetails);
            navigate('/Adminsite');
          } catch (err) {
            if (err.response && err.response.status === 401) {
              setlogindetails((prev) => ({
                ...prev,
                errpassanduser: 'Invalid username or password',
              }));
            } else {
              console.error('An unexpected error occurred:', err);
            }
          }
      };
    }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={login}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label>
                Username
              </label>
              <input
                onChange={userpass}
                name="username"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            {logindetails.username ===""? <span className='text-red-500'>{logindetails.errusername}</span>:""}<br/><br/>
            <div>
              <label>
                Password
              </label>
              <input
                onChange={userpass}
                name="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          {logindetails.password ===""? <span className='text-red-500'>{logindetails.errpassword}</span>:""}
          <div>
          {logindetails.errpassanduser && (
              <div className="text-red-500 mt-2">
                {logindetails.errpassanduser}
              </div>
            )}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

 