import {Link, useNavigate} from "react-router-dom"
import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { message } from 'antd';
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const authInfo = useAuth();
  const { login } = authInfo ? authInfo : { login: (values) => Boolean };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/login/?username=${username}&password=${password}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        if(data){
          login(data);
          navigateTo('/');
        }else{
          message.error('Login failed');
        }
      } else {
        message.error('Login failed');
      }
    } catch (error) {
      message.error('Error:', error);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
    <div className="h-screen w-screen bg-[#e7e5e4] flex justify-center items-center">
      <div className="bg-white w-3/5 h-4/5 rounded">
        <div className="font-bold text-3xl text-center mt-16 mb-8">LOGIN</div>
        <div className="w-4/5 mx-auto h-12 mb-8">
          <p>Username</p>
          <div className="border rounded-lg py-2 flex">
            <input
              type="text"
              placeholder="Enter your Username"
              className="ml-2 flex-grow outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="w-4/5 mx-auto h-12 mb-8">
          <p>Password</p>
          <div className="border rounded-lg py-2 flex">
            <input
              type="password"
              placeholder="Enter your Password"
              className="ml-2 flex-grow outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="pt-4">
          <button className="w-4/5 mx-auto bg-[#0e64d2] rounded-lg h-12 flex items-center justify-center text-white font-bold mb-4">Login</button>
        </div>
        <div className="w-3/5 mx-auto flex items-center justify-center pb-2">
            <p>Don’t have an account?</p>
            <button className="ml-2 font-bold">
              <Link to="/signup">Sign Up</Link>
            </button>
          </div>
      </div>
    </div>
    </form>
  );
};
export default Login;
