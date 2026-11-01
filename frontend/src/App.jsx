import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './Pages/SignUp.jsx'
import Signin from './Pages/Signin.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </div>
  )
}

export default App
