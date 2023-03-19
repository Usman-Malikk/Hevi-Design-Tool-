import { useContext } from 'react';
import AuthContext from '../CreateContextGlobal/CreateContextGlobal';

const useAuth = () => useContext(AuthContext);

export default useAuth;