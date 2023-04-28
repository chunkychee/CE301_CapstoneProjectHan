import {createContext,useContext,useEffect,useState} from 'react';

const UserContext = createContext(); //UserContext holds the createContext hook

//children componenet = anything that is wrapped inside of <UserProvider><UserProvider/>
function getEmailAndNameFromSessionStorage() {
  const clientemail = sessionStorage.getItem("clientemail");
  const clientname = sessionStorage.getItem("clientname");
  return { clientemail, clientname };
}

export const UserProvider = ({ children }) => {
  const [loggedName, setLoggedName] = useState(null);
  const [loggedEmail, setLoggedEmail] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const { clientemail, clientname } = getEmailAndNameFromSessionStorage();
    setLoggedEmail(clientemail);
    setLoggedName(clientname);
  }, []);

  return (
    <UserContext.Provider value={{loggedName,setLoggedName,loggedEmail,setLoggedEmail,accessToken,setAccessToken}}>
      {children}
    </UserContext.Provider>
  );
};
//the return part is where UserContext(hook)hitch on a function that is embedded with values that are shared with the parent's children

export const useUser = () => {
  return useContext(UserContext)
};