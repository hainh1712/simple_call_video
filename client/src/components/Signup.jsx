import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Select, message } from 'antd';
const Signup = () => {
  const navigate = useNavigate();
  const [dataUsers, setDataUsers] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/`)
        if (response.ok) {
          const data = await response.json();
          setDataUsers(data);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUser();
  },[]);
  const usernameUsers = dataUsers.map((user) => user.username);
  console.log(usernameUsers)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    classname: 'Việt Nhật 01',
    grade: 'K65',
    avatar_url: '',
    cover_image_url: '',
  });
  
  const [confirmPass, setConFirmPass] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password != confirmPass) {
      alert("Password and Confirm Password must be the same")
      return;
    }
    if(usernameUsers.includes(formData.username)){
      message.error("Username already exists")
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        message.success("Signup success");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        message.error('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen w-screen bg-[#e7e5e4] flex justify-center items-center">
        <div className="bg-white w-3/5 h-fit rounded">
          <div className="font-bold text-3xl text-center my-4">Signup</div>
          <div className="w-4/5 mx-auto mb-2">
            <div>Name <span className="text-red-600">*</span></div>
            <div className="border rounded-lg py-2 flex">
              <input
                type="text"
                placeholder="Enter your Name"
                className="ml-2 flex-grow outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="w-4/5 mx-auto">
            <div>Grade <span className="text-red-600">*</span></div>
            <Select
              style={{ width: '100%', height: '100%', paddingTop: '0.5rem', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}
              defaultValue={{ value: formData.grade, label: formData.grade }}
              onSelect={(value) => setFormData({ ...formData, grade: value })}
              options={[
                { value: 'K63', label: 'K63' },
                { value: 'K64', label: 'K64' },
                { value: 'K65', label: 'K65'},
                { value: 'K66', label: 'K66'},
                { value: 'K67', label: 'K67'},
                { value: 'K68', label: 'K68'},
              ]}
            />
          </div>
          
          <div className="w-4/5 mx-auto">
            <div>Class <span className="text-red-600">*</span></div>
            <Select
              style={{ width: '100%', height: '100%', paddingTop: '0.5rem', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}
              defaultValue={{ value: formData.classname, label: formData.classname }}
              onSelect={(value) => setFormData({ ...formData, classname: value })}
              options={[
                { value: 'Việt Nhật 01', label: 'Việt Nhật 01' },
                { value: 'Việt Nhật 02', label: 'Việt Nhật 02' },
                { value: 'Việt Nhật 03', label: 'Việt Nhật 03'},
                { value: 'Việt Nhật 04', label: 'Việt Nhật 04'},
                { value: 'Việt Nhật 05', label: 'Việt Nhật 05'},
              ]}
            />
          </div>

          <div className="w-4/5 mx-auto mb-2">
            <div>Username <span className="text-red-600">*</span></div>
            <div className="border rounded-lg py-2 flex">
              <input
                type="text"
                placeholder="Enter your Username"
                className="ml-2 flex-grow outline-none"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="w-4/5 mx-auto mb-2">
            <div>Password <span className="text-red-600">*</span></div>
            <div className="border rounded-lg py-2 flex">
              <input
                type="password"
                placeholder="Enter Your Password"
                className="ml-2 flex-grow outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="w-4/5 mx-auto mb-2">
            <div>Confirm Password <span className="text-red-600">*</span></div>
            <div className="border rounded-lg py-2 flex">
              <input
                type="password"
                placeholder="Enter Your Confirm Password"
                className="ml-2 flex-grow outline-none"
                value={confirmPass}
                onChange={(e) => setConFirmPass(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-4/5 mx-auto bg-[#0e64d2] rounded-lg flex items-center justify-center text-white font-bold mb-2">
              Signup
            </button>
          </div>
          <div className="w-3/5 mx-auto flex items-center justify-center pb-2">
            <p>Already have an account?</p>
            <button className="ml-2  font-bold">
              <Link to="/login">Login Here</Link>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Signup;
