import { SignupInput } from "@swapnilsoni1704/medium-common"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import {BACKEND_URL} from "../config"

const Auth = ({type} : {type : "signin" | "signup"}) => {
    const navigate = useNavigate();

    const [postInputs,setPostInputs] = useState<SignupInput>({
        name : "",
        email : "",
        password : ""
    })

    const sendRequest = async ()=>{
        try {
            const res = await axios.post(`${BACKEND_URL}/user/${type === 'signup' ?'signup' : 'signin' }`,postInputs);
            const jwt  = res.data;
            localStorage.setItem("token",jwt);
            navigate("/blogs");
        } catch (error) {
            alert("Error while signing up!")
        }
    }

  return (
    <div>
        <div className="my-4 px-10">
            <div className="font-bold text-3xl text-center">
                {type === "signup" ? "Create an account" : "Signin to your account"}
            </div>
            <div className="text-md text-slate-500 px-2 py-1">
                {type === "signup" ? "Already have an account?" : "Dont't have an account?"}
                <Link className="pl-2 underline" to={type === "signup" ? "/signin" : "/signup"}> 
                    {type === "signup" ? "Sign in" : "Sign up"} 
                </Link>
            </div>
        </div>

        <div> 
            {type === "signup" && <div>
                <Inputs  label="Name" placeholder="John Doe..." onChange={(e)=> {
                    setPostInputs(prev => ({...prev, name: e.target.value}))
                }}/>
            </div>}
            <div className="my-4">
            <Inputs label="Email" placeholder="john12@gmail.com" onChange={(e)=> {
                setPostInputs(prev => ({...prev, email: e.target.value}))
            }}/>
            </div>
            <div className="my-4">
                <Inputs label="Password" type="password" placeholder="123456" onChange={(e)=> {
                    setPostInputs(prev => ({...prev, password: e.target.value}))
                }}/>
            </div>
        </div>
        <div>
        <button onClick={sendRequest} type="button" className="w-full mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
        {type === "signup" ? "Sign up" : "Sign In"}</button>
        </div>
    </div>
  )
}

export default Auth

const  Inputs =  ({label,placeholder,type,onChange} : {label:string,placeholder:string,type?:string,onChange:(e : ChangeEvent<HTMLInputElement>)=>void}) => {
    return <div>
    <label className="block mb-2 text-sm font-semibold text-gray-900 ">{label}</label>
    <input  onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-black block w-full p-2.5" placeholder={placeholder} required />
</div>
}