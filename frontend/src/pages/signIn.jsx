import React, { useState, useContext } from "react";
import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios"


function SignIn() {
  //Doms properties in react
  const [showPassword, setShowPassword] = useState(false);
  const {serverUrl, userData, setUserData}= useContext(userDataContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  // for fetching the api's
  const handleSignIn = async (e)=> {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try{
      let result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email,
        password
      }, {withCredentials:true} )
      setLoading(false)
      setUserData(result.data)
      navigate("/")

    }catch (err) {
      console.log(err);
      setUserData(null)
      setLoading(false)
      setErr(err.response.data.message);
    }
  }
  return (
    <div
  className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex justify-center items-center"
  style={{ backgroundImage: `url(${bg})` }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  <form
    className="relative z-10 w-[90%] max-w-[450px]
    bg-white/5 backdrop-blur-x1
    p-10 rounded-2xl
    shadow-[0_20px_60px_rgba(0,0,0,0.6)]
    flex flex-col gap-6" onSubmit = {handleSignIn}
  >
    <h1 className="text-white text-2xl font-semibold text-center tracking-wide">
      Register to{" "}
      <span className="text-blue-400 font-bold">
        Virtual Assistant
      </span>
    </h1>

    <input
      type="email"
      placeholder="Enter your Email"
      className="h-12 px-4 rounded-full
      bg-white/10 text-white
      border border-white/30
      placeholder-gray-300
      focus:outline-none focus:border-blue-400
      transition duration-300" required onChange={(e)=>setEmail(e.target.value)}
      value={(email)}
    />
    
    <div className="w-full h-[50px] border-1 border-white/30 bg-transparent text-white rounded-full test-[18px] relative">
    <input
      type= {showPassword?"text":"password"}
      placeholder="Enter your Password"
      className="h-full px-4 rounded-full w-full 
      bg-white/10 text-white bg-transparent 
      border border-white/30
      placeholder-gray-300
      focus:outline-none focus:border-blue-400
      transition duration-300"required onChange={(e)=>setPassword(e.target.value)}
      value={(password)}
    />
    {!showPassword && <IoEye className="absolute top-[11px] right-[15px] text-[white] w-[25px] h-[25px] cursor-pointer " onClick={()=>setShowPassword(true)} /> }
    { showPassword && <IoEyeOff className="absolute top-[11px] right-[15px] text-[white] w-[25px] h-[25px] cursor-pointer" onClick={()=>setShowPassword(false)} /> }
    </div>
    {err.length > 0 && <p className="text-red-500 text-center text-[17px]" >
      {err}
      </p>}

    <button
      type="submit"
      className="h-12 rounded-full
      bg-gradient-to-r from-blue-500 to-blue-600
      hover:from-blue-600 hover:to-blue-700
      text-white font-semibold 
      transition duration-300 shadow-lg" disabled={loading}
    > {loading? "loading...": "Sign Up"}
    </button>
    <p className="text-[white] text-center alig text-[14px] cursor-pointer "
     onClick={()=>navigate("/signup")} >Want to create new Account? <span className="text-blue-400">Sign up</span> </p>
  </form>
</div>

  );
}

export default SignIn;
