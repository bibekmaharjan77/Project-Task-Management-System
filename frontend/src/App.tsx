import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import "./App.css";
import UserTable from "./components/Users";
import ProjectTable from "./components/Projects/ProjectsTable";
import ForgotPassword from "./components/Auth/ForgetPassword";
import ChangePassword from "./components/Auth/ChangePassword";
import AuthLayout from "./AuthLayout";
import Profile from "./components/profile/Profile";
import NotFound from "./PageNotFound";
import ProjectShow from "./components/Projects/ProjectShow";


function App() {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/changepassword/:email/:otp" element={<ChangePassword />} />
          </Route>
        </Route>


        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserTable />} />
            <Route path="/projects" element={<ProjectTable />} />
            <Route path="/projects/:id" element={<ProjectShow />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
