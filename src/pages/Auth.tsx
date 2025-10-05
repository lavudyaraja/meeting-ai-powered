import { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default Auth;
