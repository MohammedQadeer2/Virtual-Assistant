import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import aiImage from "../assets/AI.gif"
import userImage from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const synth = window.speechSynthesis
  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signup");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');

    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition(); // ⏳ Delay se race condition avoid hoti hai
      }, 800);

    }
    synth.cancel(); // 🔴 pehle se koi speech ho to
    synth.speak(utterence)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }

    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }

    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition

    let isMounted = true;


    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };


    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };



    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)

        // 🔥 update history immediately in frontend
        setUserData(prev => ({
          ...prev,
          history: [...prev.history, transcript]
        }))

        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    };
    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    };

  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="
         w-full h-screen
         bg-gradient-to-b from-[#000000] via-[#010122] to-[#02023d]
         flex flex-col lg:flex-row
         items-center lg:items-center
         justify-center
         px-6
         overflow-hidden"
         >
      {/* Top Right Buttons */}
      {/* Desktop Buttons */}
      <div className="hidden lg:flex absolute top-6 right-6 gap-4 z-20">
        <button
          onClick={() => navigate("/customize")}
          className="px-6 py-2 rounded-full 
          bg-white/10 backdrop-blur-xl
          border border-white/20
          text-white font-semibold
          hover:bg-white hover:text-black
          transition-all duration-300
          hover:scale-105 shadow-lg"
        >
          Customize
        </button>

        <button
          onClick={handleLogOut}
          className="px-6 py-2 rounded-full 
          bg-red-500/20 backdrop-blur-xl
          border border-red-400/30
          text-red-400 font-semibold
          hover:bg-red-500 hover:text-white
          transition-all duration-300
          hover:scale-105 shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* Mobile / Tablet Hamburger */}
      <div className="lg:hidden absolute top-6 right-6 z-20">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white"
        >
          ☰
        </button>
      </div>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        {/* Dark background blur */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-[260px] sm:w-[300px] 
          bg-[#010122]/80 backdrop-blur-2xl 
          border-l border-white/10 
          shadow-2xl 
          flex flex-col p-6 gap-6
          transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >~
          {/* Close Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-xl hover:text-red-400 transition"
            >
              ✕
            </button>
          </div>

          {/* Customize Button */}
          <button
            onClick={() => {
              navigate("/customize");
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg 
            bg-white/5 hover:bg-white/10 
            text-white transition"
          >
            Customize
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLogOut();
              setMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 rounded-lg 
            bg-red-500/10 hover:bg-red-500/20 
            text-red-400 transition"
          >
            Logout
          </button>

          {/* Divider */}
          <div className="w-full h-[1px] bg-white/10"></div>

          {/* History Section */}
          {/* History Section */}
          <div className="flex flex-col gap-3 max-h-[490px] overflow-y-auto pr-2 custom-scroll">

            <h3 className="text-white font-semibold text-sm tracking-wide sticky top-0 bg-[#010122] py-1">
              History
            </h3>

            {userData?.history?.length === 0 && (
              <p className="text-gray-500 text-sm">No history yet</p>
            )}

            {userData?.history?.map((his, index) => (
              <div
                key={index}
                className="bg-white/5 px-3 py-2 rounded-lg 
                 text-gray-300 text-sm 
                 hover:bg-white/10 hover:text-white
                 transition-all duration-300 
                 cursor-pointer"
              >
                {his}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* left side of home page in lg screen */}
      <div className="flex flex-col items-center lg:w-1/2 lg:pl-20">
        <div className="w-[220px] sm:w-[280px] md:w-[320px] 
           h-[320px] sm:h-[380px] md:h-[420px] 
           flex justify-center items-center 
           overflow-hidden rounded-3xl 
           shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900
           border border-white/10
           transition-all duration-500 
           hover:scale-105 hover:shadow-blue-500/30">
          <img
            src={userData?.assistantImage}
            alt="assistant"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center tracking-wider drop-shadow-lg">
          I'm {userData?.assistantName}
        </h1>
        <button onClick={() => {
          window.speechSynthesis.speak(
            new SpeechSynthesisUtterance("Assistant activated")
          );
        }} className="">
          Start Assistant
        </button>
      </div>


      {/* right side of home page in lg screen */}
      <div className="flex flex-col items-center justify-center lg:w-1/2 lg:pr-20">
        <div className=" flex justify-center items-center relative">
          {!aiText && (
            <img
              src={userImage}
              alt=""
              className="w-[140px] sm:w-[180px] md:w-[200px] 
      mix-blend-screen opacity-90"
            />
          )}
          {aiText && (
            <img
              src={aiImage}
              alt=""
              className="w-[140px] sm:w-[180px] md:w-[200px] 
      mix-blend-screen opacity-95 animate-pulse"
            />
          )}
        </div>

        {(userText || aiText) && (
          <h1 className="text-white text-[16px] sm:text-[18px] 
            px-4 sm:px-6 py-3 
            bg-white/5 backdrop-blur-md 
            border border-white/10 
            rounded-xl 
            max-w-[90%] sm:max-w-[600px] 
            text-center shadow-lg 
            flex items-center justify-center">
            {userText ? userText : aiText}
          </h1>
        )}
      </div>
    </div>



  );
}

export default Home;