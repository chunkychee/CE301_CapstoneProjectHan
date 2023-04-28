import {React} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {UserProvider} from './fypFiles/JWTuserDetails'; 
import {SignUpDiv} from './fypFiles/form';
import {Submitted} from './fypFiles/submitted';
import {SignUpConsultant} from './fypFiles/consultantform';
import {Consubmitted} from './fypFiles/submittedcon';
import {Signin} from './fypFiles/signin';
import {UserSite} from './fypFiles/SitePages/usersite';
import {ConsultantSite} from './fypFiles/consultantsite';
import {Policies} from './fypFiles/SitePages/policies';
import {Services} from './fypFiles/SitePages/services';
import {Messages} from './fypFiles/SitePages/messages';
import {Buypolicies} from './fypFiles/SitePages/buypolicies';
import {Policy1} from './fypFiles/SitePages/listofpolicies/policy1';
import {AdminLoginPage} from './fypFiles/adminlogin'
import {Adminsite}from './fypFiles/adminsite'

function App(){
  return (
    <div> 
      <UserProvider>
      <BrowserRouter>
        <Routes>
            <Route path ="/signup" element={<SignUpDiv/>}/>
            <Route path ="/submitted" element={<Submitted/>}/>
            <Route path ="/consultantsignup" element={<SignUpConsultant/>}/>
            <Route path ="/consultantsubmitted" element={<Consubmitted/>}/>
            <Route path ="/signin" element={<Signin/>}/> 
            <Route path ="/consultantsite" element={<ConsultantSite/>}/>
            <Route path ="/usersite" element={<UserSite/>}/>
            <Route path ="/policies" element={<Policies/>}/>
            <Route path ="/Buypolicies" element={<Buypolicies/>}/>
            <Route path ="/policy1" element={<Policy1/>}/>
            <Route path ="/services" element={<Services/>}/>
            <Route path ="/messages" element={<Messages/>}/>
            <Route path ="/Adminsite" element={<Adminsite/>}/>
            <Route path ="/AdminLoginPage" element={<AdminLoginPage/>}/>

        </Routes>
      </BrowserRouter> 
      </UserProvider>
    </div>
  )
}
export default App;

