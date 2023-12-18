import { createContext, useState, useEffect, useContext } from "react";

const PostContext = createContext({
    posts: [],
});

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

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

  return (
    <PostContext.Provider value={{ posts }}>
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider };

export const usePosts = () => useContext(PostContext);

