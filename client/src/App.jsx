import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Settings from "./pages/Settings";
import ResearchMaterials from "./pages/Research";
import Announcements from "./pages/Announcements";
import Tutors from "./pages/Tutors";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboards */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["school"]} />}>
          <Route path="/school/dashboard" element={<SchoolDashboard />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Research -> admin + student */}
        <Route element={<ProtectedRoutes allowedRoles={["admin", "student"]} />}>
          <Route path="/pages/research" element={<ResearchMaterials />} />
        </Route>

        {/* Announcements -> everyone */}
        <Route
          element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
        >
          <Route path="/pages/announcements" element={<Announcements />} />
        </Route>

        {/* Tutors -> admin + student */}
        <Route element={<ProtectedRoutes allowedRoles={["admin", "student"]} />}>
          <Route path="/pages/tutors" element={<Tutors />} />
        </Route>

        {/* Settings -> everyone */}
        <Route
          element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
        >
          <Route path="/pages/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
