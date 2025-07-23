import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UserProfile from "./pages/UserProfile";
import ChatPage from "./pages/ChatPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import ChatDashboard from "./pages/ChatDashboard";
import CompanyPage from "./pages/CompanyPage";
import NotFoundPage from "./pages/NotFound";
import CompanyProfile from "./pages/CompanyProfile";

function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} /> 
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
    </>
  );
}

export default App;
