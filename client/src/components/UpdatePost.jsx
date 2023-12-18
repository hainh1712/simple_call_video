import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Select, message, Button } from "antd";
const UpdatePost = () => {
  const navigateTo = useNavigate();
  const authInfo = useAuth();
  const { user } = authInfo;
  const [dataPost, setDataPost] = useState();
  const [dataPostTag, setDataPostTag] = useState();
  const [tags, setTags] = useState([]);
  const { postId } = useParams();
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [isEditImage, setIsEditImage] = useState(false);
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
        const response = await fetch("http://127.0.0.1:8000/tags/");
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTag();
  }, []);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setDataPost(data);
          const tagData = data.post_tag.map((postTag) => ({
            id: postTag.tag.id,
            name: postTag.tag.name,
          }));
          setDataPostTag(tagData);
        } else {
          console.error("Failed to fetch post");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPost();
  }, [postId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      uploadImage.forEach((image) => {
        formData.append("files", image);
      });
      if(uploadImage.length != 0) {
        const upload = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });
        const responseUpload = await upload.json();
        const response = await fetch(
          `http://127.0.0.1:8000/posts/change/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post: {
                user_id: user.id,
                title: dataPost.title,
                description: dataPost.description,
                image_url: responseUpload.urls[0],
                is_deleted: false,
              },
              post_tags: dataPostTag.map((tag_id) => ({
                post_id: 0,
                tag_id: tag_id.id,
              })),
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data) {
            message.success("update success");
            navigateTo("/");
          }
        } else {
          console.error("Update failed");
        }
      }else{
        const response = await fetch(
        `http://127.0.0.1:8000/posts/change/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post: {
              user_id: user.id,
              title: dataPost.title,
              description: dataPost.description,
              image_url: dataPost.image_url,
              is_deleted: false,
            },
            post_tags: dataPostTag.map((tag_id) => ({
              post_id: 0,
              tag_id: tag_id.id,
            })),
          }),
        }
      );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data) {
            message.success("update success");
            navigateTo("/");
          }
        } else {
          console.error("Update failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const removeDuplicates = (array) => {
    const uniqueArray = array.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
    return uniqueArray;
  };
  const handleEditImage = () => {
    setIsEditImage(true);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="h-screen w-screen bg-[#e7e5e4]">
        <div className="bg-white h-14 flex items-center justify-between">
          <div className="font-bold text-[20px] leading-5 pl-6">HEDSOCIAL</div>
          <div className="flex mr-10">
            <img
              src={user?.avatar_url ? user.avatar_url : "/social-media.png"}
              alt="user"
              width={20}
              height={20}
              className="mr-2"
            ></img>
            <span className="font-bold">{user?.name}</span>
          </div>
        </div>
        <div className="create post w-3/5 h-[85%] mx-auto mt-4">
          <div className="text-3xl">Update Post</div>
          <div className="h-1 bg-white my-2"></div>
          {dataPost ? (
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%", marginBottom: "20px" }}
              placeholder="Select tags"
              defaultValue={dataPost?.post_tag.map((tag) => ({
                value: tag.tag.name,
                id: tag.tag.id,
              }))}
              options={tags.map((tag) => ({ value: tag.name, id: tag.id }))}
              // onChange={(values, options) => {
              //   const newTagObjects = options.map((option) => ({
              //     id: option.id,
              //     name: option.value,
              //   }));
              //   setDataPostTag((prevData) => [...prevData, ...newTagObjects]);
              // }}
              onChange={(value, options) => {
                setDataPostTag((prevData) =>
                  removeDuplicates([
                    ...prevData,
                    ...options.map((option) => ({
                      id: option.id,
                      value: option.value,
                    })),
                  ])
                );
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
          <div className="bg-white h-4/5 px-4 py-2 rounded">
            <div className="mb-1">
              <span>Title</span>
              <span className="text-red-600 ml-1">*</span>
              <input
                value={dataPost?.title || ""}
                onChange={(e) =>
                  setDataPost((prevData) => ({
                    ...prevData,
                    title: e.target.value,
                  }))
                }
                type="text"
                className="w-full border border-gray-300  flex items-center p-2 rounded-lg"
              ></input>
            </div>
            <div className="h-[50%] mb-1">
              <span>Description</span>
              <span className="text-red-600 ml-1">*</span>
              <textarea
                value={dataPost?.description || ""}
                onChange={(e) =>
                  setDataPost((prevData) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
                type="text"
                className="w-full border border-gray-300  flex items-center p-2 h-[90%] rounded-lg"
              ></textarea>
            </div>
            {/* <div className="border border-[#DAE0E6] mt-10 mb-4 w-1/6 rounded-2xl">
            <button className="w-full"> + Image</button>
          </div> */}
            <div className="mb-1 w-full flex mt-2">
              {!isEditImage ? (
                <>
                  <img
                    src={dataPost?.image_url}
                    alt="post"
                    className="h-[60px] w-[60px] object-cover"
                  ></img>
                  <Button
                    style={{ border: 0 }}
                    onClick={() => handleEditImage()}
                  >
                    <img src="/delete.png" alt="delete"></img>
                  </Button>
                </>
              ) : (
                <div>
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
                            src={`/${image}`}
                            alt="Uploaded"
                            className="w-[30px] h-[30px] mx-2"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="h-1 bg-[#d9d9d9] mb-4"></div>
            <div className="flex items-center text-center justify-end">
              <button
                to="/"
                className="bg-[#0e64d2] text-white rounded-lg px-4 py-2"
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
export default UpdatePost;
