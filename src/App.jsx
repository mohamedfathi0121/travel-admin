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
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public Route */}

              {/* Protected Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="chat-dashboard" element={<ChatDashboard />} />
                  <Route path="companies" element={<CompanyPage />} />

                  <Route path="/companies/:id" element={<CompanyProfile />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="users/:id" element={<UserProfile />} />
                </Route>
              </Route>
              <Route path="/*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
