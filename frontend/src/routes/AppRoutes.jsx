import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import JoinRoomPage from "../pages/JoinRoomPage";
import LobbyPage from "../pages/LobbyPage";
import GamePage from "../pages/GamePage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLoginPage from "../pages/AdminLoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminHomePage from "../pages/AdminHomePage";
import CreateRoomPage from "../pages/CreateRoomPage";
import AdminQuestionsPage from "../pages/AdminQuestionsPage";
import AdminCreateQuestionPage from "../pages/AdminCreateQuestionPage";
import AdminEditQuestionPage from "../pages/AdminEditQuestionPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/join"
          element={<JoinRoomPage />}
        />

        <Route
          path="/lobby"
          element={<LobbyPage />}
        />

        <Route
          path="/game"
          element={<GamePage />}
        />

        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute>
              <AdminQuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/questions/create"
          element={
            <ProtectedRoute>
              <AdminCreateQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/questions/:id/edit"
          element={
            <ProtectedRoute>
              <AdminEditQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rooms/:roomId"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-room"
          element={
            <ProtectedRoute>
              <CreateRoomPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;