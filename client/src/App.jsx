import React from 'react'
import { Route, Routes, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { HomePage, LoginPage, ProfilePage } from './pages'
import { useAuthContext } from './context/AuthContext.jsx'

function App() {

  const { authUser } = useAuthContext();

  return (
    <div className="min-h-screen bg-[url('./assets/bgImage.svg')] bg-no-repeat bg-cover">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App