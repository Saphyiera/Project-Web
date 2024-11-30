import React from 'react'

import './Navbar.css'

import navLogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'

function Navbar() {
  const logout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace('http://localhost:3000');
  }

  return (
    <div className='navbar'>
        <img src={navLogo} alt="" className="nav-logo" />
        <img onClick={() => logout()} src={navProfile} alt="" className="nav-profile" />
    </div>
  )
}

export default Navbar