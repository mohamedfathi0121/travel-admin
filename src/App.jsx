import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UserProfile from "./pages/UserProfile";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "react-hot-toast";

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
