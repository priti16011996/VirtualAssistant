
import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import SignUp from "./Pages/SignUp.jsx";
import Signin from "./Pages/Signin.jsx";
import Home from "./Pages/Home.jsx";
import Customize from "./Pages/Customize.jsx";

import { userDataContext } from "./context/UserContext.jsx";
import CustomizeName from "./Pages/CustomizeName.jsx";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData
            ? userData.virtualAssistantProfile &&
              userData.virtualAssistantName
              ? <Home />
              : <Navigate to="/customize" replace />
            : <Navigate to="/signin" replace />
        }
      />

      <Route
        path="/signup"
        element={
          !userData
            ? <SignUp />
            : <Navigate to="/" replace />
        }
      />

      <Route
        path="/signin"
        element={
          !userData
            ? <Signin />
            : <Navigate to="/" replace />
        }
      />

      <Route
        path="/customize"
        element={
          userData
            ? <Customize />
            : <Navigate to="/signup" replace />
        }
      />
      <Route
        path="/customizeName"
        element={
          userData
            ? <CustomizeName />
            : <Navigate to="/signup" replace />
        }
      />
    </Routes>
  );
}

export default App;
