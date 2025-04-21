// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Pages
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import EventFeedPage from "./pages/EventFeedPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarViewPage from "./pages/CalendarViewPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import PostEventPage from "./pages/PostEventPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import MyProfilePage from "./pages/MyProfilePage";
import EditEventPage from "./pages/EditEventPage";
import EventResponsesPage from "./pages/EventResponsesPage";
import AdminPost from "./pages/AdminPost";
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<CalendarViewPage />} />


          {/* Protected Routes */}

          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["student", "coordinator", "superadmin", "staff"]}>
                <EventFeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <ProtectedRoute allowedRoles={["student", "coordinator", "superadmin", "staff"]}>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student", "coordinator", "superadmin", "staff"]}>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-event"
            element={
              <ProtectedRoute allowedRoles={["coordinator", "superadmin"]}>
                <PostEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["coordinator", "superadmin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-post"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <AdminPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:eventId"
            element={
              <ProtectedRoute allowedRoles={["coordinator", "superadmin"]}>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-responses/:eventId"
            element={
              <ProtectedRoute allowedRoles={["coordinator", "superadmin"]}>
                <EventResponsesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
