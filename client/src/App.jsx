import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner"; // ✅ Import the Sonner toast renderer

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Settings from "@/pages/Settings";
import ResearchMaterials from "./pages/Resource";
import Announcements from "./pages/Announcements";
import Lostnfound from "./pages/Lostnfound";
import Tutors from "./pages/Tutors";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

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
            <Route path="/resources" element={<ResearchMaterials />} />
          </Route>

          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
          >
            <Route path="/announcements" element={<Announcements />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["admin", "student"]} />}>
            <Route path="/tutors" element={<Tutors />} />
          </Route>

          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
          >
            <Route path="/lostnfound" element={<Lostnfound />} />
          </Route>

          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "student", "school"]} />}
          >
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
