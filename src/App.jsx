import { useState } from 'react'
import './App.css'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import AuthDetails from './components/auth/AuthDetails'

function App() {
  
  return (
    <>
      <SignUp/>
      <SignIn/>
      <AuthDetails/>
    </>
  )
}

export default App
