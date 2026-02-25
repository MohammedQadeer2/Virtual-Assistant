import React, { useContext, useRef, useState } from "react";
import image1 from "../assets/pic-1.jpg";
import image2 from "../assets/pic-2.jpg";
import image3 from "../assets/pic-3.jpg";
import image4 from "../assets/pic-4.jpg";
import image5 from "../assets/pic-5.jpg";
import image6 from "../assets/authBg.png";
import { MdKeyboardBackspace } from "react-icons/md"
import { RiImageAddLine } from "react-icons/ri";
import Card from "../components/Card.jsx"; // make sure path is correct
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

function Customize() {
  const { serverUrl, userData, setUserData,
    frontendImage, setFrontendImage,
    backendImage, setBackendImage,
    selectedImage, setSelectedImage } = useContext(userDataContext)
  const inputImage = useRef()
  const navigate = useNavigate("")

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file))
  }
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col">
      <MdKeyboardBackspace
        className="absolute top-5 left-5 text-white w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-3xl font-semibold text-white mb-6">
        Select your Assist
      </h1>

      <div className="w-full max-w-[800px] flex justify-center items-center flex-wrap gap-[15px]">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />

        {/* Optional Add Custom Image Card */}
        <div className={`
        w-[100px] sm:w-32 lg:w-32 aspect-[2/3]  bg-[#111] 
        border-2  border-gray-500 rounded-xl
         flex justify-center items-center cursor-pointer 
         hover:border-white 
         hover:scale-105 transition ${selectedImage == "input" ? "scale-105 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" : null}`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}>
          {!frontendImage && <RiImageAddLine className="text-3xl text-gray-400" />}
          {frontendImage && <img src={frontendImage} className="h-full rounded-xl object-cover" />}
        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      </div>
      {selectedImage && <button className='
      min-w-[120px] h-[40px] mt-[30px] 
      text-black font-semibold bg-white 
      rounded-full text-[19px] cursor-pointer'
        onClick={() => navigate("/customize2")}
      >
        Next
      </button>}

    </div>

  );
}

export default Customize;
