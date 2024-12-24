
import React, { useEffect, useState } from 'react';
import './add.css';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [select, setSelect] = useState(null);
const navigate = useNavigate();

useEffect(()=>{
  const fetchCompanyId = async() => {
    const res = JSON.parse(Cookies.get('selectedCompany')) || {};
    if(res?.id){
       setSelect(res.id);
    console.log('comaonyId', res.id)
    }
   
  }
  fetchCompanyId();
},[])


const handleSubmit = (e) => {
  e.preventDefault();

  if (!username.trim() || !email.trim() || !role.trim()) {
    setMessage("Error: All fields are required!");
    setTimeout(() => setMessage(""), 2000);
    return;
  }

  if (!select) {
    setMessage("Error: No company selected");
    return;
  }

  const allCompanyUsers = JSON.parse(Cookies.get('ComapnyUserData') || '{}');
  if (!allCompanyUsers[select]) {
    allCompanyUsers[select] = []; 
  }

  const existingUsers = allCompanyUsers[select];

  const userExist = existingUsers.some((user) => user.email === email);
  if (userExist) {
    setMessage("Error: User Already Exists!");
    setTimeout(() => setMessage(""), 2000);
    return;
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    role,
    companyId: select,
  };

  allCompanyUsers[select].push(newUser);

  Cookies.set('ComapnyUserData', JSON.stringify(allCompanyUsers), { expires: 30, path: '/' });

  setMessage("User Added!");
  setUsername('');
  setEmail('');
  setRole('');

  setTimeout(() => {
    setMessage("");
    navigate("/account");
  }, 2000);
};

    
    const handleClick = () =>{
        navigate('/account')
    }

  return (
      <div className="register">
         {message && (
        <p className={`message ${message.startsWith("Error:") ? "error" : "success"}`}>
          {message}
        </p>
      )}
        <h2>Add User Form</h2>
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

        <label htmlFor="password">Role:</label>
        <input
          type="text"
          id="role"
          value={role}
          className="reg-input"
          placeholder="Enter User Role in company"
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <button type="submit" className="reg-button"  >Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
