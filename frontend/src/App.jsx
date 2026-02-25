import React, { useContext } from "react";
import { userDataContext } from "./context/UserContext";
import { Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/signIn.jsx";
import SignUp from "./pages/signUp.jsx";
import Home from "./pages/Home.jsx";
import Customize from "./pages/customize.jsx";
import Customize2 from "./pages/customize2.jsx";

function App() {
  const { userData } = useContext(userDataContext);

  const isLoggedIn = !!userData;
  const isCustomized =
    userData?.assistantImage && userData?.assistantName;

  return (
    <Routes>

      {/* Home Route */}
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <Navigate to="/signin" />
          ) : !isCustomized ? (
            <Navigate to="/customize" />
          ) : (
            <Home />
          )
        }
      />

      {/* Auth Routes */}
      <Route
        path="/signin"
        element={isLoggedIn ? <Navigate to="/" /> : <SignIn />}
      />

      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to="/" /> : <SignUp />}
      />

      {/* Customize Routes */}
      <Route
        path="/customize"
        element={
          !isLoggedIn ? <Navigate to="/signin" /> : <Customize />
        }
      />

      <Route
        path="/customize2"
        element={
          !isLoggedIn ? <Navigate to="/signin" /> : <Customize2 />
        }
      />

    </Routes>
  );
}

export default App;
