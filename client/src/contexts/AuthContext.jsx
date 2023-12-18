import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: {},
  isLoggedIn: false,
});

const AuthProvider = ({ children }) => {
  const localToken = localStorage.getItem("access-token");
  const localUser = JSON.parse(localStorage.getItem("current-user")) || null;

  const [user, setUser] = useState(localUser);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localToken);
  const navigate = useNavigate();

  const login = (values) => {
    localStorage.setItem(
      "current-user",
      JSON.stringify({
        avatar_url: values.avatar_url,
        classname: values.classname,
        cover_image_url: values.cover_image_url,
        created_at: values.created_at,
        grade: values.grade,
        id: values.id,
        name: values.name,
        password: values.password,
        updated_at: values.updated_at,
        username: values.username,
      })
    );
    setUser({
      avatar_url: values.avatar_url,
      classname: values.classname,
      cover_image_url: values.cover_image_url,
      created_at: values.created_at,
      grade: values.grade,
      id: values.id,
      name: values.name,
      password: values.password,
      updated_at: values.updated_at,
      username: values.username,
    });
    localStorage.setItem("access-token", "password");
    setIsLoggedIn(true);
    navigate("/");
    return true;
  };

  const logout = () => {
    localStorage.removeItem("current-user");
    localStorage.removeItem("access-token");
    navigate("/");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
