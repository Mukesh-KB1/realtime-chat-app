import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router'
import {HomePage, LoginPage , ProfilePage} from './pages/index.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={ <App /> } >
      <Route path="" element={ <HomePage /> } />
      <Route path="login" element={ <LoginPage /> } />
      <Route path="profile" element={ <ProfilePage /> } />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
