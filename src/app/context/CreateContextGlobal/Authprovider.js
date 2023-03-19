import AuthContext from "./CreateContextGlobal";
import useProvideAuth from "../useContext/useContextProvider";
const AuthProvider = ({ children }) => {
  let auth = useProvideAuth();
  return(
      <AuthContext.Provider value={auth}>
        {children}
        </AuthContext.Provider>
  )
}
export default AuthProvider;
