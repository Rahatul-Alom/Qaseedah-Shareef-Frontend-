import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useLogin } from "@/lib/actions";
import { loginValidation } from "@/lib/validations";

import { Form } from "@/components";
import axios from "axios";
import { toast } from "react-toastify";


export default function Login() {
  const { isSubmitting, login } = useLogin();
  // const navigate = useNavigate();


  const handleSubmit = async (values) => {
    login(values);
    console.log(values)

  //   await axios.post('http://127.0.0.1:8000/api/v1/login',(values))
  //   .then(res => {
  //     if(res.data.success){
  //       console.log(res.data)
  //       localStorage.setItem('token',res.data.data.token);
  //        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
  //       toast.success('user logedin successfull')
  //       navigate(location?.state ? location?.state : "/" )
  //     }
  //     else{
  //       console.error();
        
  //     }
  //   })
  //   .catch( error =>{
  //     console.log(error)
  //     toast(error.message)
  // })
    
  
  };

  const list = useMemo(() => {
    return [
      {
        type: "input",
        name: "email",
        label: "Email address",
        props: {
          type: "email",
          placeholder: "",
        },
      },

      {
        type: "input",
        name: "password",
        label: "Password",
        props: { type: "password", placeholder: "" },
      },
    ];
  }, []);

  // console.log(list)

  return (
    <section className="login_section">
      <div className="flex items-center justify-center gap-4 my-6 divider">
        <div className="h-[1px] bg-divider flex-1" />
        <span className="text-sm text-onNeutralBg">or</span>
        <div className="h-[1px] bg-divider flex-1" />
      </div>
      <Form
        list={list}
        btnTxt="Login"
        isSubmitting={isSubmitting}
        schema={loginValidation}
        onSubmit={handleSubmit}
        // defaultValues={{
        //   email: "demo@grooveit.com",
        //   password: "password@123",
        // }}
      />
      <div className="flex flex-col items-center justify-center gap-2 mt-4 text-sm text-onNeutralBg">
        <div>
          Forgot Password?{" "}
          <Link
            to="/reset-password"
            className="text-primary hover:underline underline-offset-2"
          >
            Reset
          </Link>
        </div>
        <div>
          No Account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline underline-offset-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}
