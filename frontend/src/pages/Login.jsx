import React, { useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../auth.css";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to continue</p>

        {error && <p className="error">{error}</p>}

        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e)=>setUsername(e.target.value)} 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)} 
        />

        <button onClick={handleLogin}>Login</button>

        <p className="switch">
          New here? <span onClick={()=>navigate("/register")}>Create Account</span>
        </p>
      </motion.div>
    </div>
  );
}
