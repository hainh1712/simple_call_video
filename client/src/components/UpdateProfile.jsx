import { useAuth } from "../contexts/AuthContext";
import { Button, Dropdown, Space, Input, Select, message} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useRef } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const authInfo = useAuth();
  const navigateTo = useNavigate();
  const {user, isLoggedIn, logout } = authInfo
    ? authInfo
    : { isLoggedIn: false, logout: () => {} };
  console.log(user)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name,
    classname: user.classname,
    grade: user.grade,
    avatar_url: user.avatar_url,
    cover_image_url: user.cover_image_url,
  });
  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1': 
        navigate('/profile');
        break;
      case '2':
        logout();
        break;
      default:
        break;
    }
  };
  const items = [
    {
      label: 'Profile',
      key: '1',
    },
    {
      label: 'Log out',
      key: '2',
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const fileAvatarRef = useRef(null);
  const fileCoverRef = useRef(null);
  const handleEditAvatar = () => {
    fileAvatarRef.current.click();
  };
  const handleEditCover = () => {
    fileCoverRef.current.click();
  };
  const handleAvatarChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formDataAvatar = new FormData();
    formDataAvatar.append("files", selectedFile);
    if(selectedFile.length != 0) {
      const upload = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formDataAvatar,
      });
      const responseUpload = await upload.json();
      setFormData({ ...formData, avatar_url: responseUpload.urls[0] });
    }
  };
  const handleCoverChange = async (event) => {
    const selectedFile = event.target.files[0];
    const formDataCover = new FormData();
    formDataCover.append("files", selectedFile);
    if(selectedFile.length != 0) {
      const upload = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formDataCover,
      });
      const responseUpload = await upload.json();
      setFormData({ ...formData, cover_image_url: responseUpload.urls[0] });
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            username: user.username,
            password: user.password,
            classname: formData.classname,
            grade: formData.grade,
            avatar_url: formData.avatar_url,
            cover_image_url: formData.cover_image_url,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("current-user", JSON.stringify(data));
        if (data) {
          message.success("update success");
          setTimeout(() => {
            navigateTo("/profile");
            window.location.reload(true)
          }, 3000);  
        }
      } else {
        console.error("Update failed");
      }
    }catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="w-screen h-screen bg-[#e7e5e4]">
        <div className="bg-white h-14 flex items-center justify-between">
          <div className="font-bold text-[20px] leading-5 pl-6">HEDSOCIAL</div>
          <div className="flex items-center text-center w-1/6">
            {isLoggedIn ? (
              <div className="flex items-center justify-center">
                <Space wrap>
                  <Dropdown menu={menuProps} className="border-0 shadow-none">
                    <Button>
                      <Space>
                        <img
                          src={user?.avatar_url ? user.avatar_url : "/social-media.png"}
                          alt="user"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        <span className="font-bold mr-4">{user?.name}</span>
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </Space>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#0e64d2] text-white rounded-lg px-4 py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="create post w-3/5 h-[85%] mx-auto mt-4">
          <div className="text-3xl">Update Profile</div>
          <div className="h-1 bg-white my-3"></div>
          <div className="bg-white h-[80%] px-8 py-4 rounded-lg">
            <div className=" mx-auto">
              <div>
                Name <span className="text-red-600">*</span>
              </div>
              <Input
                type="text"
                className="my-2"
                value={user.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className=" mx-auto">
              <div>
                Grade <span className="text-red-600">*</span>
              </div>
              <Select
                style={{
                  width: "100%",
                  height: "100%",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                defaultValue={{ value: user.grade, label: user.grade }}
                onSelect={(value) => setFormData({ ...formData, grade: value })}
                options={[
                  { value: "K63", label: "K63" },
                  { value: "K64", label: "K64" },
                  { value: "K65", label: "K65" },
                  { value: "K66", label: "K66" },
                  { value: "K67", label: "K67" },
                  { value: "K68", label: "K68" },
                ]}
              />
            </div>

            <div className=" mx-auto">
              <div>
                Class <span className="text-red-600">*</span>
              </div>
              <Select
                style={{
                  width: "100%",
                  height: "100%",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                defaultValue={{ value: user.classname, label: user.classname }}
                onSelect={(value) =>
                  setFormData({ ...formData, classname: value })
                }
                options={[
                  { value: "Việt Nhật 01", label: "Việt Nhật 01" },
                  { value: "Việt Nhật 02", label: "Việt Nhật 02" },
                  { value: "Việt Nhật 03", label: "Việt Nhật 03" },
                  { value: "Việt Nhật 04", label: "Việt Nhật 04" },
                  { value: "Việt Nhật 05", label: "Việt Nhật 05" },
                ]}
              />
            </div>

            <div className="flex mb-2 justify-between h-1/3">
              <div className="w-1/4">
                <div>Avatar
                  <button type="button" onClick={handleEditAvatar}><EditOutlined/></button>
                  <input
                    type="file"
                    ref={fileAvatarRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </div> 
                <div>
                  <img src={formData?.avatar_url ? formData.avatar_url : "/social-media.png"} alt="avatar" className="h-[100px] w-[200px] object-scale-down"></img>
                </div>
              </div>
              <div className="w-1/2">
                <div>Cover 
                  <button type="button" onClick={handleEditCover}><EditOutlined/></button>
                  <input
                    type="file"
                    ref={fileCoverRef}
                    style={{ display: "none" }}
                    onChange={handleCoverChange}
                  />
                </div> 
                <div>
                  <img src={formData?.cover_image_url ? formData.cover_image_url : "/social-media.png"} alt="cover" className="h-[100px] w-[200px] object-scale-down"></img>
                </div>
              </div>
            </div>
            <div className="h-[2px] bg-gray-200"></div>
            <div className="flex items-center text-center justify-end mt-4">
              <button
                className="bg-[#0e64d2] text-white rounded-lg px-4 py-2"
                // onSubmit={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
export default UpdateProfile;
