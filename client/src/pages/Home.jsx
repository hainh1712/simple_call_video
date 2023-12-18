import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import {
  DeleteOutlined,
  EditOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
} from "@ant-design/icons";
import { Modal, message, Empty } from "antd";
import { usePosts } from "../contexts/PostContext";
const Home = () => {
  const postInfo = usePosts();
  const { postsTest } = postInfo;
  const navigate = useNavigate();
  const authInfo = useAuth();
  const { user, isLoggedIn } = authInfo;
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [contentMap, setContentMap] = useState({});
  const [postID, setPostID] = useState("");
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

  const predefinedColors = [
    '#FF5733', '#33FF57', '#5733FF', '#FF3364', '#33A0FF',
    '#FFD133', '#FF33A5', '#33FFB2', '#8E33FF', '#FF8C33'
  ];
  const tagColors = {};
  tags.forEach((tag, index) => {
    tagColors[tag.id] = predefinedColors[index % predefinedColors.length];
  });
  const handleCreatePostClick = () => {
    if (isLoggedIn) {
      navigate("/create-post");
    } else {
      alert("Cannot create post. User is not logged in.");
    }
  };
  const handleContentChange = (postId) => (e) => {
    const newContentMap = { ...contentMap, [postId]: e.target.value };
    setContentMap(newContentMap);
    setPostID(postId);
    console.log(contentMap);
  };
  const handleSubmit = async (e) => {
    if (isLoggedIn === false) {
      alert("Cannot create comment. User is not logged in.");
      return;
    }
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
        window.location.reload(true)
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleEditClick = (postId) => {
    navigate(`/update-post/${postId}`);
  };
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
      const response = await fetch(`http://127.0.0.1:8000/post_vote/vote/?type_vote=${type_vote}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          post_id: postId,
          upvote : 0,
          downvote: 0
        }),
      });
      if (response.ok) {
        message.success("Vote success")
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Vote failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleCommentVote = async (commentId, type_vote) => {
    if(!isLoggedIn) {
      alert("Cannot vote comment. User is not logged in.");
      return;
    }
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
  const customStyles = {
    mask: {
      opacity: '0.2',
    },
  };
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
    console.log(searchValue);
  };
  const [sortCriteria, setSortCriteria] = useState("new");
  const handleSortClick = (criteria) => {
    setSortCriteria(criteria);
  };
  const sortPosts = (posts) => {
    const filteredPosts = posts?.filter(post => post.is_deleted != true);
    const searchFilter = (post) => {
      const searchTerm = searchValue.toLowerCase();
      return (
        post.post_tag?.some(tag => tag.tag.name.toLowerCase().includes(searchTerm)) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.title.toLowerCase().includes(searchTerm)
      );
    };
    const searchFilteredPosts = filteredPosts.filter(searchFilter);
    // const searchFilteredPosts = posts.filter(searchFilter);
    switch (sortCriteria) {
      case "best":
        return searchFilteredPosts.sort((a, b) => b.id - a.id);
      case "hot":
        return searchFilteredPosts.sort((a, b) => b.post_vote?.length - a.post_vote?.length);
      case "new":
        return searchFilteredPosts.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "top":
        return searchFilteredPosts.sort(
          (a, b) => (b.comments?.length ?? 0) - (a.comments?.length ?? 0)
        );
      default:
        return searchFilteredPosts;
    }
  };
  const sortedPosts = sortPosts(posts);
  const recentPosts = [...posts]
  .filter(post => isLoggedIn ? post.user_id === user.id && post.is_deleted === false : true) 
  .sort((a, b) => {
    const dateA = new Date(a.update_at || a.created_at);
    const dateB = new Date(b.update_at || b.created_at);

    return dateB - dateA;
  })
  .slice(0, 3).reverse();
  return (
    <div className="h-screen w-screen bg-gray-100 overflow-y-auto ">
      <Header onSearch={handleSearch}/>
      <div className="w-3/5 flex mt-4 mx-auto">
        <div className="main-view-page w-2/3 mr-10">
          <div className="sticky top-[56px] z-10">
            <div className="h-14 bg-white p-2 border border-gray-100 flex rounded backdrop-blur-[4px]" style={{backgroundColor: 'rgba(255,255,255,0.8)'}}>
              {isLoggedIn ? (
                <img src={user?.avatar_url ? user.avatar_url : "/social-media.png"} alt="" className="mx-2" />
              ) : (
                <img src="/social-media.png" alt="" className="mx-2" />
              )}
              <button
                style={{ borderRadius: "0px" }}
                className="w-full border border-gray-300 text-gray-400 flex items-center p-2"
                onClick={handleCreatePostClick}
              >
                Create Post
              </button>
            </div>
          </div>
          <div className="filter sticky top-[112px] z-10">
            <div className=" bg-white py-2 border border-gray-100 flex rounded backdrop-blur-[4px]" style={{backgroundColor: 'rgba(255,255,255,0.8)'}}>
              <div className="flex ml-10">
                <div className="mr-2">
                  <button
                    className={`flex items-center justify-center ${
                      sortCriteria === "best" ? "bg-[#eeeeee]" : ""
                    }`}
                    onClick={() => handleSortClick("best")}
                  >
                    <img src="/star.png" alt="" className="mr-2"></img>
                    Best
                  </button>
                </div>
                <div className="mr-2">
                  <button
                    className={`flex items-center justify-center ${
                      sortCriteria === "hot" ? "bg-[#eeeeee]" : ""
                    }`}
                    onClick={() => handleSortClick("hot")}
                  >
                    <img src="/fire.png" alt="" className="mr-2"></img>
                    Hot
                  </button>
                </div>
                <div className="mr-2">
                  <button
                    className={`flex items-center justify-center ${
                      sortCriteria === "new" ? "bg-[#eeeeee]" : ""
                    }`}
                    onClick={() => handleSortClick("new")}
                  >
                    <img src="/thunder.png" alt="" className="mr-2"></img>
                    New
                  </button>
                </div>
                <div>
                  <button
                    className={`flex items-center justify-center ${
                      sortCriteria === "top" ? "bg-[#eeeeee]" : ""
                    }`}
                    onClick={() => handleSortClick("top")}
                  >
                    <img src="/up.png" alt="" className="mr-2"></img>Top
                  </button>
                </div>
              </div>
            </div>
          </div>
          {sortedPosts.map((post) => (
            <div key={post.id} className="post-view bg-white mt-4">
              <div className="p-4 pb-4">
                <div className="header-post flex items-center">
                  <div className="user-icon mr-2">
                    <img
                      // src="/social-media.png"
                      src={post.user?.avatar_url ? post.user.avatar_url : "/social-media.png"}
                      alt=""
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
                      Posted at {formatDistanceToNow(new Date(post.created_at))}{" "}
                      ago
                    </div>
                  </div>
                  <div className="post-tag flex mr-2">
                    {post.post_tag?.map((tag) => (
                      <div
                        key={tag.id}
                        className="tag text-xs mr-1 border border-gray-200 p-1 rounded-lg bg-neutral-700 text-white font-bold"
                        style={{ backgroundColor: tagColors[tag.tag.id] }}
                      >
                        {tag.tag.name}
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    {isLoggedIn && post.user_id === user?.id && (
                      <>
                        <button onClick={() => handleEditClick(post.id, post.post_tag)}>
                          <EditOutlined />
                        </button>
                        <button onClick={() => handleDelete(post.id)}>
                          <DeleteOutlined />
                        </button>
                        {/* <button onClick={handleDelete}>
                          <DeleteOutlined/>
                        </button> */}
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
                              <img src="/warning.png" alt=""></img>
                              <span className="font-bold mt-2">
                                Do you really want to delete this post? <br />
                                This process cannot be redone
                              </span>
                            </div>
                          </div>
                        </Modal>
                      </>
                    )}
                  </div>
                </div>
                <div className="content-post flex">
                  <div className="w-[5%] mr-6 font-bold flex flex-col items-center">
                    <button className="w-fit" onClick={() => handleVotePost(post.id, "up")}>
                      <UpCircleOutlined />
                    </button>
                    {/* {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) ?? 0} */}
                    <span>
                      {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) > 0 ? "+" : ""}
                      {post.post_vote?.reduce((acc, vote) => acc + (vote.upvote - vote.downvote), 0) ?? 0}
                    </span>
                    <button className="w-fit" onClick={() => handleVotePost(post.id, "down")}>
                      <DownCircleOutlined />
                    </button>
                  </div>
                  <div className="w-[85%]">
                    <div className="post-title font-bold mb-1">
                      {post.title}
                    </div>
                    <div className="description mb-1">{post.description}</div>
                    <div className="image mb-1 w-full">
                      {post.image_url && <img src={post.image_url} alt="" className="h-[200px] w-[300px] object-scale-down"/>}
                    </div>
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
                        <div key={comment.id} className="comment-item ml-4">
                          <div className="comment header flex">
                            <div className="mr-2">
                              <img
                                // src="/social-media.png"
                                src={comment.user?.avatar_url ? comment.user.avatar_url : "/social-media.png"}
                                alt=""
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
                            <button className="w-fit" onClick={() => handleCommentVote(comment.id, "up")}><UpCircleOutlined/></button>
                            {post.comments.map((comment) => comment.comment_vote?.reduce((acc, vote) => acc + vote.upvote, 0) ?? 0)
                            .reduce((acc, curr) => acc + curr, 0)}
                            <button className="w-fit" onClick={() => handleCommentVote(comment.id, "down")}><DownCircleOutlined/></button>
                            {post.comments.map((comment) => comment.comment_vote?.reduce((acc, vote) => acc + vote.downvote, 0) ?? 0)
                            .reduce((acc, curr) => acc + curr, 0)}
                          </div>
                        </div>
                      ))}
                    </div>
                    )}
                    <div className="text comment flex mt-2 ml-4">
                      <img
                        // src="/social-media.png"
                        src={user?.avatar_url ? user.avatar_url : "/social-media.png"}
                        alt=""
                        width={32}
                        height={32}
                      ></img>
                      <input
                        type="text"
                        key={post.id}
                        className="p-1 border border-gray-400 ml-2 rounded-lg w-[60vh]"
                        placeholder="Send message"
                        id={post.id}
                        value={contentMap[post.id] || ""}
                        onChange={handleContentChange(post.id)}
                      ></input>
                      <button
                        style={{ height: "32px" }}
                        className="flex items-center"
                        onClick={handleSubmit}
                      >
                        <img src="/send.png" alt=""></img>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="recent-post w-1/3 bg-white p-4 sticky top-[72px] h-min">
          <div>
            <p className="font-bold text-black">RECENT POST</p>
          </div>
          {isLoggedIn && (
            <div>
              {recentPosts.length === 0 ? (
                <div className=""><Empty/></div>
              ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="post-item flex mt-4">
                  <div className="">
                    <div className="flex">
                      <img
                        src={post.user?.avatar_url ? post.user.avatar_url : "/social-media.png"}
                        alt=""
                        width={24}
                        height={24}
                      ></img>
                      <div className="ml-2">{post.user.name}</div>
                    </div>
                    <div className="mt-1">
                      <div className="font-bold">{post.title}</div>
                      <div className="truncate">
                        {post.description}
                      </div>
                      <div className="flex items-center">
                      {post.image_url && <img src={post.image_url} alt="" className="h-[50px] w-[100px] object-scale-down "/>}
                      </div>
                      <div className="flex justify-end">
                        <div className="text-xs mr-1">
                          {post.comments?.length ?? 0} Comments -{" "}
                        </div>
                        <div className="text-xs">
                          {post?.updated_at && new Date(post.updated_at) > new Date(post.created_at) ? (
                            <>
                              Updated at {formatDistanceToNow(new Date(post.updated_at))} ago
                            </>
                          ) : (
                            <>
                              Posted at {formatDistanceToNow(new Date(post.created_at))} ago
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
