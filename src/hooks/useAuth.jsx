import { useContext } from "react";
import {useAuthState} from "../lib/actions/auth.action";

const useAuth = () => {
    const auth = useContext(useAuthState);
    return auth;
};

export default useAuth;