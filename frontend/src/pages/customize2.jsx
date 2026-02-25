import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md"

function customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
  const navigate = useNavigate("")
  const [loading, setLoading] = useState(false)

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {

      let formData = new FormData()
      formData.append("assistantName", assistantName)
      
      formData.append("imageUrl", selectedImage)
      if (backendImage instanceof File) {
        formData.append("assistantImage", backendImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`,
        formData, { withCredentials: true })
      setLoading(false)
      console.log(result.data);
      setUserData(result.data);
      navigate('/')
    } catch (error) {
      setLoading(false)
      console.log(error.message);
    }
  }
  return (
  <div className="w-full min-h-screen px-6 bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col relative">

    <MdKeyboardBackspace
      className="absolute top-5 left-5 text-white w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
      onClick={() => navigate(-1)}
    />

    <h1 className="text-xl sm:text-3xl font-semibold text-white mb-6 text-center">
      Enter Your Assistant Name
    </h1>

    <input
      type="text"
      placeholder={`eg."Jarvis"`}
      className="
        h-12 px-4 
        w-full max-w-md
        rounded-full
        bg-white/10 text-white
        border border-white/30
        placeholder-gray-300
        focus:outline-none focus:border-blue-400
        transition duration-300
      "
      required
      onChange={(e) => setAssistantName(e.target.value)}
      value={assistantName}
    />

    {assistantName.length > 0 && (
      <button
        className="
          w-full max-w-md
          h-12
          mt-6
          text-black font-semibold 
          bg-white 
          rounded-full 
          text-base sm:text-lg 
          cursor-pointer
          transition duration-300
          hover:scale-105
        "
        disabled={loading}
        onClick={handleUpdateAssistant}
      >
        {!loading ? "Finally Create Your Assistant" : "Loading..."}
      </button>
    )}
  </div>
)
}

export default customize2

