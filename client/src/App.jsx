import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"; // ✅ Import the Sonner toast renderer

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Settings from "./pages/Settings";
import ResearchMaterials from "./pages/Research";
import Announcements from "./pages/Announcements";
import Lostnfound from "./pages/Lostnfound";
import Tutors from "./pages/Tutors";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Role-based protected routes */}
          <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["school"]} />}>
            <Route path="/school/dashboard" element={<SchoolDashboard />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["admin", "student"]} />}>
            <Route path="/api/research" element={<ResearchMaterials />} />
          </Route>

          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
          >
            <Route path="/api/announcements" element={<Announcements />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["admin", "student"]} />}>
            <Route path="/api/tutors" element={<Tutors />} />
          </Route>

          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
          >
            <Route path="/api/lostnfound" element={<Lostnfound />} />
          </Route>

          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
          >
            <Route path="/api/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* ✅ Toast renderer (must be outside Router) */}
      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
