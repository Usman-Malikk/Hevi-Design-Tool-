import { useState } from "react";


function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signIn = (token) => {
    localStorage.setItem("jwt", token);
    setUser(token);
  };
  const signout = () => {
    localStorage.clear();
    setUser(null);
  };
  const verifyToken = () => {
    let token = localStorage.getItem("jwt");
    setUser(token);
  };

  // verifyToken()

  return {
    user, 
    verifyToken,
    signout, 
    signIn,
   
  }
}

export default useProvideAuth;

