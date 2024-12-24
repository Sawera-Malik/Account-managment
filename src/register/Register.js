import React, { useState } from "react";
import "./register.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    let existingUser = [];
    try {
      const userCookie = Cookies.get("User");
      existingUser = userCookie ? JSON.parse(userCookie) : [];
     
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      existingUser = [];
    }

    const userExist = existingUser.some((user) => user.email === email);
    if (userExist) {
      setMessage("Error: User Already Exists!");
      setTimeout(() => setMessage(""), 2000); 
      return;
    }

    const newUser = { username, email, password, userType };
    const updatedUsers = [...existingUser, newUser];

    Cookies.set("User", JSON.stringify(updatedUsers), { expires: 30 });

    setMessage("User Registered!");
    setUsername("");
    setEmail("");
    setPassword("");
    setUserType("");

    setTimeout(() => {
      setMessage("");
      navigate("/login");
    }, 2000); 
  };

  return (
    <div className="register">
      <h2>Registration Form</h2>
      {message && (
        <p className={`message ${message.startsWith("Error:") ? "error" : "success"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          className="reg-input"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          className="reg-input"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          className="reg-input"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="userType">User Type:</label>
        <select
          id="userType"
          name="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="reg-input"
          required
        >
          <option value="" disabled>
            Select User Type
          </option>
          <option value="Admin">Admin</option>
          <option value="Owner">Owner</option>
          <option value="User">User</option>
        </select>

        <button type="submit" className="reg-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
