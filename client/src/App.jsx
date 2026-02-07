import React from 'react'
import { Outlet } from 'react-router'

function App() {
  return (
    <div className="min-h-screen bg-[url('./assets/bgImage.svg')] bg-no-repeat bg-cover">
      <Outlet />
    </div>
  )
}

export default App