import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

function getEmailAndNameFromSessionStorage() {
  const consultantemail = sessionStorage.getItem('consultantemail');
  const consultantname = sessionStorage.getItem('consultantname');
  const clientemail = sessionStorage.getItem('clientemail');
  const clientname = sessionStorage.getItem('clientname');
  return { clientemail ,clientname,consultantname,consultantemail};
}

function getTokenFromSessionStorage() {
  return sessionStorage.getItem('accessToken');
}

export const UserProvider = ({ children }) => {
  const [consultantName, setconsultantName] = useState(getEmailAndNameFromSessionStorage().consultantname);
  const [consultantEmail, setconsultantEmail] = useState(getEmailAndNameFromSessionStorage().consultantemail);
  const [clientName, setclientName] = useState(getEmailAndNameFromSessionStorage().clientname);
  const [loggedEmail, setLoggedEmail] = useState(getEmailAndNameFromSessionStorage().clientemail);
  const [accessToken, setAccessToken] = useState(getTokenFromSessionStorage());

  return (
    <UserContext.Provider value={{consultantName,setconsultantName,consultantEmail,setconsultantEmail,clientName,setclientName,loggedEmail, setLoggedEmail, accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
