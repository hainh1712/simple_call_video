import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { Select, message } from 'antd';
import { Button, Dropdown, Space} from 'antd';
import { DownOutlined } from '@ant-design/icons';
const CreatePost = () => {
  const navigateTo = useNavigate();
  const authInfo = useAuth();
  const navigate = useNavigate();
  const {user, isLoggedIn, logout } = authInfo
    ? authInfo
    : { isLoggedIn: false, logout: () => {} };
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImageUrls = Array.from(files).map((file) => file.name);
      setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
      setUploadImage((prevImages) => [...prevImages, ...files]);
    }
  };
  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/tags/')
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        } else {
          console.error("Failed to fetch tags");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTag();
  },[]);
  // const tagNames = tags.map((tag) => tag.name);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      console.log(uploadImage)
      uploadImage.forEach((image) => {
        formData.append('files', image);
      });

      const upload = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const responseUpload = await upload.json();
      // console.log(responseUpload)
      const response = await fetch(`http://localhost:8000/posts/user/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post: {
            user_id: user.id,
            title: title,
            description: description,
            image_url: responseUpload.urls[0],
            is_deleted: false
          },
          post_tags: tag.map(tag_id => ({ post_id: 0, tag_id: tag_id.id }))
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if(data){
          message.success ('Create success');
          navigateTo('/');
        }
      } else {
        console.error('Creat failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
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
  return (
    <>
    <div className="h-screen w-screen bg-[#e7e5e4]">
      <div className="bg-white h-14 flex items-center justify-between">
        <div className="font-bold text-[20px] leading-5 pl-6">HEDSOCIAL</div>
        <div className="flex items-center text-center mr-4">
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
        <div className="text-3xl">
          Create a new post
        </div>
        <div className="h-1 bg-white my-2"></div>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '50%', marginBottom: '20px'}}
            placeholder="Select tags"
            // onChange={(value) => setTag(value)}
            // options={tagNames.map((tag) => ({ value: tag }))}
            onChange={(value, options) => setTag(options.map(option => ({ id: option.id, value: option.value })))}
            options={tags.map((tag) => ({ value: tag.name, id: tag.id }))}
          />
        <div className="bg-white h-4/5 px-4 py-2 rounded">
          <div className="mb-1">
            <span>Title</span><span className="text-red-600 ml-1">*</span>
            <input 
              onChange = {(e) => setTitle(e.target.value)}
              type="text" className="w-full border border-gray-300 flex items-center p-2 rounded-lg" required></input>
          </div>
          <div className="h-[50%] mb-1">
            <span>Description</span><span className="text-red-600 ml-1">*</span>
            <textarea 
              onChange={(e) => setDescription(e.target.value)}
              type="text" className="w-full border border-gray-300 flex items-center p-2 rounded-lg h-[90%]" required></textarea>
          </div>
          <div className="mb-1">
            <span>Image</span>
            <div className="">
              <div className="flex flex-col items-start overflow-auto">
                <input
                  type="file"
                  onChange={handleImageChange}
                  multiple
                  // className="mb-4"
                />
                <div className="flex w-full mt-2">
                  {selectedImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Uploaded"
                      className="w-[40px] h-[40px] mx-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-1 bg-[#d9d9d9] mb-2"></div>
          <div className="flex items-center text-center justify-end">
            <button
              to="/"
              className="bg-[#0e64d2] text-white rounded-lg px-4 py-2 "
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default CreatePost;
