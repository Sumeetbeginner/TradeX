
import React from 'react'
import {BrowserRouter, Routes , Route} from 'react-router-dom'
import Home from '../src/components/Home/Home'
import Welcome from './components/Welcome/Welcome'
import Signup from './components/Auth/Signup'
import Login from './components/Auth/Login'
import Portfolio from './components/Portfolio/Portfolio'
import Wishlist from './components/Wishlist/Wishlist'
import Profile from './components/Profile/Profile'
import Setting from './components/Setting/Setting'
import Wallet from './components/Wallet/Wallet'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/welcome' element={<Welcome/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/portfolio' element={<Portfolio/>}/>
      <Route path='/wishlist' element={<Wishlist/>}/>
      <Route path='/setting' element={<Setting/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/wallet' element={<Wallet/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App