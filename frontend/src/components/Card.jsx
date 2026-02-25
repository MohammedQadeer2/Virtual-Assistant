import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {serverUrl, userData, setUserData,
      frontendImage, setFrontendImage,
      backendImage, setBackendImage,
    selectedImage, setSelectedImage} = useContext(userDataContext)
  return (
    <div className={`
      /* Layout & Sizing */
      w-[100px]        /* Increased base size for better tap target on mobile */
      sm:w-32 
      lg:w-32
      aspect-[2/3] 
      
      /* Base Styling */
      bg-[#020220] 
      border-2 
      border-[#0000ff66] 
      rounded-2xl 
      overflow-hidden 
      cursor-pointer
      transition-all 
      duration-300
      
      @media(hover:hover) {
        hover:scale-105 
        hover:border-white 
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
      }

      active:scale-95 
      active:border-blue-400
      ${selectedImage==image?"scale-105 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)]":null}
    `} onClick={()=>setSelectedImage(image)}>
      <img
        src={image}
        alt="assistant"
        className="h-full w-full object-cover pointer-events-none" 
      />
    </div>
  );
}

export default Card;
