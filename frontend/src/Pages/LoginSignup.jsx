import React, { useState } from 'react'

import './CSS/LoginSignup.css'
import MenuBottomTabs from '../Components/MenuBottomTabs/MenuBottomTabs';
import axios from 'axios';

function LoginSignup() {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const login = async () => {
    let resData;
    await axios.post('http://localhost:4000/user/login', formData, {
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => resData = res.data);

    if (resData.success) {
      if (resData.role === "admin") {
        // Tạo URL mới bằng cách thêm auth-token là một tham số
        const adminURL = `http://localhost:5173/?auth-token=${resData.token}`;
        window.location.replace(adminURL);
      } else {
        localStorage.setItem('auth-token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.userInfo));
        window.location.replace("/");
      }
    } else {
      alert(resData.errors);
    }
  };

  const signup = async () => {
    let resData;
    await axios.post('http://localhost:4000/user/signup', formData, {
      headers: {
        Accept: 'application/form-data',
        'Content-type': 'application/json'
      }
    })
      .then((res) => resData = res.data);

    if (resData.success) {
      localStorage.setItem('auth-token', resData.token);
      localStorage.setItem('user', JSON.stringify(resData.userInfo));
      window.location.replace("/");
    } else {
      alert(resData.errors);
    }
  };

  return (
    <>
      <div className='loginsignup'>
        <div className="loginsignup-container">
          <h1>{state}</h1>
          <div className="loginsignup-fields">
            {
              state === "Sign Up" ? 
              <input name='username' value={formData.username} onChange={(e) => handleChange(e)} type="text" placeholder='Username' /> :  
              <></>
            }
            <input name='email' value={formData.email} onChange={(e) => handleChange(e)} type="text" placeholder='Email Address' />
            <input name='password' value={formData.password} onChange={(e) => handleChange(e)} type="password" placeholder='Password' />
          </div>
          <button onClick={() => {
            state ==="Login" ? login() : signup();
          }}>
            Continue
          </button>
          {state === "Sign Up" ? <p className="loginsignup-login">Already have an account?&nbsp;
                                    <span onClick={() => setState("Login")}>Login here</span>
                                  </p> : 
                                  <></>}
          {state === "Login" ? <p className="loginsignup-login">Create an account?&nbsp;
                                  <span onClick={() => setState("Sign Up")}>Sign up here</span>
                                </p> : 
                                <></>}
          <div className="loginsignup-agree">
            <input type="checkbox" name="" id="" />
            <p>By continuing, I agree to the Terms of Use and Privacy Policy.</p>
          </div>
        </div>
      </div>
      <MenuBottomTabs active={'Login'} />
    </>
  )
}

export default LoginSignup