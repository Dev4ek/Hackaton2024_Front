// App.tsx
import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/login/login";
import SignupForm from "./components/auth/register/register";
import PrivateRoute from "./components/auth/PrivateRoute";
import Mainpage from "./pages/mainPage";
import ProjectsPage from "./pages/progectPage";
import AdminDashboard from "./components/admin/AdminDashboard";



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<ProjectsPage/>} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/tasks/:projectId" element={<PrivateRoute element={<Mainpage/>} />} />
      </Routes>
    </Router>
  );
};

export default App;
