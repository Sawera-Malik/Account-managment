import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    let users = [];
    try {
      const cookieData = Cookies.get("User");
      users = cookieData ? JSON.parse(cookieData) : [];
      if (!Array.isArray(users)) {
        users = [];
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setMessage("Error: Unable to process login!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setMessage("User Login Successfully!");
      Cookies.set('LoggedInUser', JSON.stringify(user), { expires: 1 }); 
      setTimeout(() => {
        setMessage("");
        navigate("/company");
      }, 2000);
    } else {
      setMessage("Error: User does not exist or invalid credentials!");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  return (
    <div className='login' >
      <h2>Login Form</h2>
      {message && (
        <p className={`message ${message.startsWith("Error:") ? "error" : "success"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          className="log-input"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          className="log-input"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="log-button">Login</button>
        <p className='link' > If you don't have account register first <Link style={{ textDecoration: "none", color: " #ff9980", fontWeight: "bold" }} to='/register'>Register</Link>   </p>
      </form>
    </div>
  )
}

export default Login
