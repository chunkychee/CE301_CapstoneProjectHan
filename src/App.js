import {React} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {UserProvider} from './fypFiles/JWTuserDetails'; 
import {SignUpDiv} from './fypFiles/form';
import {Submitted} from './fypFiles/submitted';
import {SignUpConsultant} from './fypFiles/consultantform';
import {Consubmitted} from './fypFiles/submittedcon';
import {Signin} from './fypFiles/signin';
import {UserSite} from './fypFiles/SitePages/usersite';
import {ConSite} from './fypFiles/consultantsite';
import {Policies} from './fypFiles/SitePages/policies';
import {Services} from './fypFiles/SitePages/services';
import {MessagesClient} from './fypFiles/SitePages/messagesClient';
import {MessagesCon} from './fypFiles/SitePages/messagesCon';
import {Buypolicies} from './fypFiles/SitePages/buypolicies';
import {Policy1} from './fypFiles/SitePages/listofpolicies/policy1';
import {Policy2} from './fypFiles/SitePages/listofpolicies/policy2';
import {Policy3} from './fypFiles/SitePages/listofpolicies/policy3';
import {Policy4} from './fypFiles/SitePages/listofpolicies/policy4';
import {Policy5} from './fypFiles/SitePages/listofpolicies/policy5';
import {Policy6} from './fypFiles/SitePages/listofpolicies/policy6';
import {Policy7} from './fypFiles/SitePages/listofpolicies/policy7';
import {Policy8} from './fypFiles/SitePages/listofpolicies/policy8';
import {Policy9} from './fypFiles/SitePages/listofpolicies/policy9';
import {Policy10} from './fypFiles/SitePages/listofpolicies/policy10';
import {Policy11} from './fypFiles/SitePages/listofpolicies/policy11';
import {Policy12} from './fypFiles/SitePages/listofpolicies/policy12';
import {AdminLoginPage} from './fypFiles/adminlogin';
import {Adminsite}from './fypFiles/adminsite';

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
            <Route path ="/usersite" element={<UserSite/>}/>
            <Route path ="/consite" element={<ConSite/>}/>
            <Route path ="/policies" element={<Policies/>}/>
            <Route path ="/Buypolicies" element={<Buypolicies/>}/>
            <Route path ="/policy1" element={<Policy1/>}/>
            <Route path ="/policy2" element={<Policy2/>}/>
            <Route path ="/policy3" element={<Policy3/>}/>
            <Route path ="/policy4" element={<Policy4/>}/>
            <Route path ="/policy5" element={<Policy5/>}/>
            <Route path ="/policy6" element={<Policy6/>}/>
            <Route path ="/policy7" element={<Policy7/>}/>
            <Route path ="/policy8" element={<Policy8/>}/>
            <Route path ="/policy9" element={<Policy9/>}/>
            <Route path ="/policy10" element={<Policy10/>}/>
            <Route path ="/policy11" element={<Policy11/>}/>
            <Route path ="/policy12" element={<Policy12/>}/>
            <Route path ="/services" element={<Services/>}/>
            <Route path ="/messagescon" element={<MessagesCon/>}/>
            <Route path ="/messagesclient" element={<MessagesClient/>}/>
            <Route path ="/Adminsite" element={<Adminsite/>}/>
            <Route path ="/AdminLoginPage" element={<AdminLoginPage/>}/>
        </Routes>
       </BrowserRouter> 
      </UserProvider>
    </div>
  )
}
export default App;

