import React, { useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../auth.css";


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [created, setCreated] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/api/auth/register", { username, password });
      setCreated(true);
    } catch (err) {
      alert("User already exists or invalid input");
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

        {!created ? (
          <>
            <h2>Create Account ✨</h2>
            <p className="subtitle">Join us in seconds</p>

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

            <button onClick={handleRegister}>Register</button>

            <p className="switch">
              Already have account? <span onClick={()=>navigate("/login")}>Login</span>
            </p>
          </>
        ) : (
          <>
            <h2>🎉 Account Created!</h2>
            <p className="subtitle">Your account was created successfully.</p>

            <button onClick={()=>navigate("/login")}>
              Go to Login
            </button>
          </>
        )}

      </motion.div>
    </div>
  );
}
