import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {SignUpDiv} from './fypFiles/form';
import {Submitted} from './fypFiles/submitted';
import {SignUpConsultant} from './fypFiles/consultantform';
import {Consubmitted} from './fypFiles/submittedcon';


function App(){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path ="/signup" element={<SignUpDiv/>}/>
          <Route path ="/submitted" element={<Submitted/>}/>
          <Route path ="/consultantsignup" element={<SignUpConsultant/>}/>
          <Route path ="/consultantsubmitted" element={<Consubmitted/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App;

