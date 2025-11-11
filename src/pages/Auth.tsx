import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import UpdatePassword from "@/components/auth/update-password";
import OAuthCallback from "@/components/auth/OAuthCallback";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/callback" element={<OAuthCallback />} />
    </Routes>
  );
};

export default Auth;