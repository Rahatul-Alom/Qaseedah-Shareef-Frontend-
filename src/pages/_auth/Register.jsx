import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRegister } from "@/lib/actions";
import { registerValidation } from "@/lib/validations";

import { Form } from "@/components";
import axios from "axios";
import { toast } from "react-toastify";


export default function Register() {
  const { isSubmitting, register } = useRegister();
  const navigate = useNavigate();


  const handleSubmit = async (values) => {
     register(values);
     console.log(values)

    // // create user entry in database
    //   const userInfo = {
    //      name: data.name,
    //       email: data.email
    //     }

    await axios.post('http://127.0.0.1:8000/api/v1/register',(values))
      .then(res => {
      localStorage.setItem('token',res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      console.log(res.data)
      if(res.data.insertedId){
        
        toast.success('user register successfull')
        navigate("/" )
      }
      else{
        console.error();
        
      }
    })
    .catch( error =>{
      console.log(error.response.data)
      toast(error.message)
  })
  };

  const list = useMemo(() => {
    return [
      {
        type: "input",
        name: "username",
        label: "Username",
        props: {
          type: "text",
          placeholder: "",
        },
      },
      {
        type: "input",
        name: "email",
        label: "Email Address",
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

  return (
    <section className="register_section">
      <div className="gap-4 my-6 divider flex_justify_center">
        <div className="h-[1px] bg-divider flex-1" />
        <span className="text-sm text-onNeutralBg">or</span>
        <div className="h-[1px] bg-divider flex-1" />
      </div>
      <Form
        list={list}
        btnTxt="Register"
        isSubmitting={isSubmitting}
        schema={registerValidation}
        onSubmit={handleSubmit}
      />
      <div className="mt-4 text-xs text-center flex_justify_center text-secondary">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </div>
      <div className="flex-col gap-2 mt-4 text-sm flex_justify_center text-onNeutralBg">
        <div>
          All ready have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
