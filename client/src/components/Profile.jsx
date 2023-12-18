import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  DeleteOutlined,
  EditOutlined,
  DownCircleOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import { Modal, message, Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const authInfo = useAuth();
  const { user } = authInfo;
  const [posts, setPosts] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [tags, setTags] = useState([]);
  const handleEditClick = (postId) => {
    navigate(`/update-post/${postId}`);
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/posts/");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tags/");
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
    fetchTags();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const confirmDeleteRef = useRef(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    confirmDeleteRef.current = true;
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    confirmDeleteRef.current = false;
    setIsModalOpen(false);  
  };
  const handleDelete = async (postId) => {
    showModal();
    console.log(confirmDeleteRef.current)
    if(!confirmDeleteRef.current) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_deleted: true,
        }),
      });
      if (response.ok) {
        window.location.reload(true)
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleVotePost = async (postId, type_vote) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/post_vote/vote/?type_vote=${type_vote}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            post_id: postId,
            upvote: 0,
            downvote: 0,
          }),
        }
      );
      if (response.ok) {
        message.success("Vote success");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Vote failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCommentVote = async (commentId, type_vote) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comment_vote/vote/?type_vote=${type_vote}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          comment_id: commentId,
          upvote: 0,
          downvote: 0,
        }),
      });
      if (response.ok) {
        window.location.reload(true)
      } else {
        console.error("Failed to vote comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRestorePost = async (postId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/restore/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        message.success("Restore success");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Failed to vote comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [contentMap, setContentMap] = useState({});
  const [postID, setPostID] = useState("");
  const handleContentChange = (postId) => (e) => {
    const newContentMap = { ...contentMap, [postId]: e.target.value };
    setContentMap(newContentMap);
    setPostID(postId);
    console.log(contentMap);
  };
  const handleComment = async (e) => {
    const content = contentMap[postID];
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          user_id: user.id,
          post_id: postID,
        }),
      });
      if (response.ok) {
        // const data = await response.json();
        window.location.reload(true);
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const predefinedColors = [
    '#FF5733', '#33FF57', '#5733FF', '#FF3364', '#33A0FF',
    '#FFD133', '#FF33A5', '#33FFB2', '#8E33FF', '#FF8C33'
  ];
  const tagColors = {};
  tags.forEach((tag, index) => {
    tagColors[tag.id] = predefinedColors[index % predefinedColors.length];
  });
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
    console.log(searchValue);
  };
  const searchPost = (posts) => {
    const searchFilter = (post) => {
      const searchTerm = searchValue.toLowerCase();
      return (
        post.post_tag?.some(tag => tag.tag.name.toLowerCase().includes(searchTerm)) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.title.toLowerCase().includes(searchTerm)
      );
    };
    const searchPosts = posts.filter(searchFilter);
    return searchPosts;
  }
  const searchPosts = searchPost(posts);
  const handleUpdateProfile = () => {
    navigate(`/update-profile/${user.id}`);
  }
  const customStyles = {
    mask: {
      opacity: '0.2',
    },
  };
  return (
    <div className="w-screen h-screen bg-[#e7e5e4] overflow-y-auto">
      <Header onSearch={handleSearch}/>
      <div className="w-4/5 mx-auto mt-6 flex h-4/5 justify-between">
        <div className="post-view w-[70%] bg-white">
          <div className="h-14 border-b border-r">
            <div className="px-1 py-1.5 mx-10 flex items-center text-center">
              <button
                className={`w-fit ${
                  showDeleted
                    ? "font-bold text-[14px] text-black opacity-50"
                    : "bg-[#eeeeee] rounded-lg text-[#0079D3] font-bold text-[14px]"
                }`}
                onClick={() => setShowDeleted(false)}
              >
                POST
              </button>
              <button
                className={`w-fit ${
                  showDeleted
                    ? "bg-[#ff0000] rounded-lg font-bold text-[14px] text-white"
                    : "font-bold text-[14px] text-black opacity-50"
                }`}
                onClick={() => setShowDeleted(true)}
              >
                DELETED
              </button>
            </div>
          </div>
          <div className="h-full">
            {showDeleted
              ?
              <div> 
                {searchPosts.filter((post) => post.is_deleted == true && post.user_id === user?.id).length === 0 ? (
                  <div className=""><Empty/></div>
                ) : (
                searchPosts.filter((post) => post.is_deleted == true && post.user_id === user?.id).map((post) => (
                      <div key={post.id} className="post-view bg-white z-0">
                        <div className="p-4 ml-6 border-b items-center flex-r ">
                          <div className="header-post flex items-center">
                            <div className="user-icon mr-2">
                              <img
                                src={
                                  post.user?.avatar_url
                                    ? post.user.avatar_url
                                    : "/social-media.png"
                                }
                                alt="icon"
                                width={20}
                                height={20}
                              ></img>
                            </div>
                            <div className="user-name font-medium text-base mr-2">
                              <div>{post.user.name}</div>
                            </div>
                            <div className="time-post font-light text-xs mr-2">
                              {/* <div>Posted at {post.created_at}</div> */}
                              <div>
                                Posted at{" "}
                                {formatDistanceToNow(new Date(post.created_at))}{" "}
                                ago
                              </div>
                            </div>
                            <div className="post-tag flex mr-2">
                              {post.post_tag?.map((tag) => (
                                <div
                                  key={tag.id}
                                  className="tag text-xs mr-1 border border-gray-200 p-1 rounded-lg bg-neutral-700 text-white"
                                  style={{ backgroundColor: tagColors[tag.tag.id] }}
                                >
                                  {tag.tag.name}
                                </div>
                              ))}
                            </div>
                            <div className="flex ">
                              <button
                                className="text-white bg-[#0e64d2]"
                                onClick={() => handleRestorePost(post.id)}
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                          <div className="content-post flex">
                            <div className="w-[5%] mr-6 font-bold flex flex-col items-center">
                              <button
                                className="w-fit"
                                onClick={() => handleVotePost(post.id, "up")}
                              >
                                <UpCircleOutlined />
                              </button>
                              <span>
                                {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) > 0 ? "+" : ""}
                                {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) ?? 0}
                              </span>
                              <button
                                className="w-fit"
                                onClick={() => handleVotePost(post.id, "down")}
                              >
                                <DownCircleOutlined />
                              </button>
                            </div>
                            <div className="w-[85%]">
                              <div className="post-title font-bold mb-1">
                                {post.title}
                              </div>
                              <div className="description mb-1">
                                {post.description}
                              </div>
                              <div className="image mb-1 w-full">
                                {post.image_url && <img src={post.image_url} alt="" className="h-[200px] w-[300px] object-scale-down"/>}
                              </div>
                              <div className="image mb-1">{post.image}</div>
                              <div className="comment flex">
                                <img src="/cmt.png" alt=""></img>
                                <span className="ml-2">
                                  {post.comments?.length ?? 0} Comments
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="comment-post h-[30%] flex">
                            <div className="border-l-2 border-gray-400">
                              {post.comments?.length ? (
                                <div className="h-20 overflow-y-auto">
                                  {post.comments?.map((comment) => (
                                    <div
                                      key={comment.id}
                                      className="comment-item ml-4"
                                    >
                                      <div className="comment header flex">
                                        <div className="mr-2">
                                          <img
                                            // src="/social-media.png"
                                            src={
                                              comment.user?.avatar_url
                                                ? comment.user.avatar_url
                                                : "/social-media.png"
                                            }
                                            alt="cmt icon"
                                            width={32}
                                            height={32}
                                          ></img>
                                        </div>
                                        <div className="flex items-center justify-center font-bold">
                                          {comment.user.name}
                                        </div>
                                        <div className="mr-2 ml-2 font-light text-xs flex items-center justify-center">
                                          {formatDistanceToNow(
                                            new Date(comment.created_at)
                                          )}{" "}
                                          ago
                                        </div>
                                      </div>
                                      <div className="comment content mr-2 border-dotted border-l-2 border-gray-400 pl-4">
                                        {comment.content}
                                      </div>
                                      <div className="vote font-bold flex flex-row items-center">
                                        <button
                                          className="w-fit"
                                          onClick={() =>
                                            handleCommentVote(comment.id, "up")
                                          }
                                        >
                                          <UpCircleOutlined />
                                        </button>
                                        {post.comments
                                          .map(
                                            (comment) =>
                                              comment.comment_vote?.reduce(
                                                (acc, vote) => acc + vote.upvote,
                                                0
                                              ) ?? 0
                                          )
                                          .reduce((acc, curr) => acc + curr, 0)}
                                        <button
                                          className="w-fit"
                                          onClick={() =>
                                            handleCommentVote(comment.id, "down")
                                          }
                                        >
                                          <DownCircleOutlined />
                                        </button>
                                        {post.comments
                                          .map(
                                            (comment) =>
                                              comment.comment_vote?.reduce(
                                                (acc, vote) =>
                                                  acc + vote.downvote,
                                                0
                                              ) ?? 0
                                          )
                                          .reduce((acc, curr) => acc + curr, 0)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                              <div className="text comment flex mt-4 ml-4">
                                <img
                                  // src="/social-media.png"
                                  src={
                                    user?.avatar_url
                                      ? user.avatar_url
                                      : "/social-media.png"
                                  }
                                  alt="cmt icon"
                                  width={32}
                                  height={32}
                                ></img>
                                <input
                                  type="text"
                                  key={post.id}
                                  className="p-1 border border-gray-400 ml-2 rounded-lg w-[90vh]"
                                  placeholder="Send message"
                                  id={post.id}
                                  value={contentMap[post.id] || ""}
                                  onChange={handleContentChange(post.id)}
                                ></input>
                                <button
                                  style={{ height: "32px" }}
                                  className="flex items-center"
                                  onClick={handleComment}
                                >
                                  <img src="/send.png" alt="send cmt"></img>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#e7e5e4] h-2"></div>
                      </div>
                    )))}
              </div>
              :
              <div>
                {searchPosts.filter((post) => post.is_deleted == false && post.user_id === user?.id).length === 0 ? (
                  <div className=""><Empty/></div>
                ) : (
                searchPosts.filter((post) => post.is_deleted == false && post.user_id === user?.id
                    )
                  .map((post) => (
                    <div key={post.id} className="post-view bg-white z-0">
                      <div className="p-4 border-r">
                        <div className="header-post flex items-center">
                          <div className="user-icon mr-2">
                            <img
                              src={
                                post.user?.avatar_url
                                  ? post.user.avatar_url
                                  : "/social-media.png"
                              }
                              alt="icon"
                              width={20}
                              height={20}
                            ></img>
                          </div>
                          <div className="user-name font-medium text-base mr-2">
                            <div>{post.user.name}</div>
                          </div>
                          <div className="time-post font-light text-xs mr-2">
                            {/* <div>Posted at {post.created_at}</div> */}
                            <div>
                              Posted at{" "}
                              {formatDistanceToNow(new Date(post.created_at))}{" "}
                              ago
                            </div>
                          </div>
                          <div className="post-tag flex mr-2">
                            {post.post_tag?.map((tag) => (
                              <div
                                key={tag.id}
                                className="tag text-xs mr-1 border border-gray-200 p-1 rounded-lg bg-neutral-700 text-white"
                                style={{ backgroundColor: tagColors[tag.tag.id] }}
                              >
                                {tag.tag.name}
                              </div>
                            ))}
                          </div>
                          <div className="flex">
                            <>
                              <button
                                onClick={() =>
                                  handleEditClick(post.id, post.post_tag)
                                }
                              >
                                <EditOutlined />
                              </button>
                              <button onClick={() => handleDelete(post.id)}>
                                <DeleteOutlined />
                              </button>
                              <Modal
                                title="Are you sure about that"
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                styles={customStyles}
                                okButtonProps={{
                                  style: {
                                    background: "#DC2626",
                                    borderColor: "#FFFFFF",
                                  },
                                }}
                                cancelButtonProps={{
                                  style: {
                                    background: "#e2e2e2",
                                    borderColor: "#e2e2e2",
                                  },
                                }}
                              >
                                <div className="bg-gray-500 border mt-1 mb-4"></div>
                                <div className="flex items-center justify-center text-center">
                                  <div className="flex flex-col items-center">
                                    <img src="/warning.png" alt="Warning"></img>
                                    <span className="font-bold mt-2">
                                      Do you really want to delete this post?{" "}
                                      <br />
                                      This process cannot be redone
                                    </span>
                                  </div>
                                </div>
                              </Modal>
                            </>
                          </div>
                        </div>
                        <div className="content-post flex">
                          <div className="w-[5%] mr-6 font-bold flex flex-col items-center">
                            <button
                              className="w-fit"
                              onClick={() => handleVotePost(post.id, "up")}
                            >
                              <UpCircleOutlined />
                            </button>
                            <span>
                              {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) > 0 ? "+" : ""}
                              {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) ?? 0}
                            </span>
                            <button
                              className="w-fit"
                              onClick={() => handleVotePost(post.id, "down")}
                            >
                              <DownCircleOutlined />
                            </button>
                          </div>
                          <div className="w-[85%]">
                            <div className="post-title font-bold mb-1">
                              {post.title}
                            </div>
                            <div className="description mb-1">
                              {post.description}
                            </div>
                            <div className="image mb-1 w-full">
                              {post.image_url && <img src={post.image_url} alt="" className="h-[200px] w-[300px] object-scale-down"/>}
                            </div>
                            <div className="image mb-1">{post.image}</div>
                            <div className="comment flex">
                              <img src="/cmt.png" alt=""></img>
                              <span className="ml-2">
                                {post.comments?.length ?? 0} Comments
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="comment-post flex mt-2">
                          <div className="border-l-2 border-gray-400">
                            {post.comments?.length > 0 && (
                            <div className="h-20 overflow-y-auto">
                              {post.comments?.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="comment-item ml-4"
                                >
                                  <div className="comment header flex">
                                    <div className="mr-2">
                                      <img
                                        // src="/social-media.png"
                                        src={
                                          comment.user?.avatar_url
                                            ? comment.user.avatar_url
                                            : "/social-media.png"
                                        }
                                        alt="cmt icon"
                                        width={32}
                                        height={32}
                                      ></img>
                                    </div>
                                    <div className="flex items-center justify-center font-bold">
                                      {comment.user.name}
                                    </div>
                                    <div className="mr-2 ml-2 font-light text-xs flex items-center justify-center">
                                      {formatDistanceToNow(
                                        new Date(comment.created_at)
                                      )}{" "}
                                      ago
                                    </div>
                                  </div>
                                  <div className="comment content mr-2 border-dotted border-l-2 border-gray-400 pl-4">
                                    {comment.content}
                                  </div>
                                  <div className="vote font-bold flex flex-row items-center">
                                    <button
                                      className="w-fit"
                                      onClick={() =>
                                        handleCommentVote(comment.id, "up")
                                      }
                                    >
                                      <UpCircleOutlined />
                                    </button>
                                    {post.comments
                                      .map(
                                        (comment) =>
                                          comment.comment_vote?.reduce(
                                            (acc, vote) => acc + vote.upvote,
                                            0
                                          ) ?? 0
                                      )
                                      .reduce((acc, curr) => acc + curr, 0)}
                                    <button
                                      className="w-fit"
                                      onClick={() =>
                                        handleCommentVote(comment.id, "down")
                                      }
                                    >
                                      <DownCircleOutlined />
                                    </button>
                                    {post.comments
                                      .map(
                                        (comment) =>
                                          comment.comment_vote?.reduce(
                                            (acc, vote) => acc + vote.downvote,
                                            0
                                          ) ?? 0
                                      )
                                      .reduce((acc, curr) => acc + curr, 0)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            )}
                            <div className="text comment flex mt-4 ml-4">
                              <img
                                // src="/social-media.png"
                                src={
                                  user?.avatar_url
                                    ? user.avatar_url
                                    : "/social-media.png"
                                }
                                alt="cmt icon"
                                width={32}
                                height={32}
                              ></img>
                              <input
                                type="text"
                                key={post.id}
                                className="p-1 border border-gray-400 ml-2 rounded-lg w-[90vh]"
                                placeholder="Send message"
                                id={post.id}
                                value={contentMap[post.id] || ""}
                                onChange={handleContentChange(post.id)}
                              ></input>
                              <button
                                style={{ height: "32px" }}
                                className="flex items-center"
                                onClick={handleComment}
                              >
                                <img src="/send.png" alt="send cmt"></img>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#e7e5e4] h-2"></div>
                    </div>
                  )))}
              </div>
              }
          </div>
        </div>
        <div className="info w-[25%] h-3/4 bg-white">
          <div className="h-14 border-b font-bold items-center flex">
            <span className="w-[90%] mx-auto">Info</span>
          </div>
          <div className="">
            <div className="w-[90%] mt-4 mx-auto rounded p-1 border border-gray-200">
              <div className="mb-2 relative">
                {user?.avatar_url && (
                  <img
                    src={user.avatar_url}
                    className={`h-[100px] w-[100px] object-scale-down rounded-full ${
                      user.cover_image_url ? 'absolute left-[15%] top-[60%]' : ''
                    }`}
                    alt=""
                  />
                )}

                {user?.cover_image_url && (
                  <img
                    src={user.cover_image_url}
                    className="h-[200px] w-full object-scale-down"
                    alt=""
                  />
                )}
              </div>
              <div className="ml-2 pt-4">{user?.name}</div>
              <div className="ml-2">
                Lớp: {user?.classname} - {user?.grade}
              </div>
            </div>
            <div className="w-full mt-2 flex justify-center items-center">
              <Button type="primary" icon={<EditOutlined />} size={"large"} style={{color: '#000'}} onClick={() => handleUpdateProfile()} >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
