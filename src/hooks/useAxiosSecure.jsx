import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
})
const useAxiosSecure = () => {
    const navigate = useNavigate()
    const {logOut} = useAuth()
    // request interceptore 
    axiosSecure.interceptors.request.use(function(config){
        const token = localStorage.getItem('access token')
        // console.log('req stoped by interceptors', token)
        config.headers.authorization = `Bearer ${token}`
        return config;
    }, function(error){
        // Do something with request error
        return Promise.reject(error);
    })

        // intercepts 401 and 403 status
        axiosSecure.interceptors.response.use(function(response){
            return response;
        },async (error)=>{
            const status = error.response.status;
            console.log('status error in the interceptor', status)
            // for 401 or 403 logout the user and move the login page
            if(status === 401 || status === 403){
                await logOut()
                navigate('/login')
            }
            return Promise.reject(error);
        }
        )

    return axiosSecure;


};

export default useAxiosSecure;