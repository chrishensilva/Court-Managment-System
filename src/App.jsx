import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import Lawyers from "./Lawyers";
import DashboardPage from "./DashboardPage";
import UserPage from "./UserPage";
import Cases from "./Cases";
import AddUser from "./AddUser";
import AddLawyer from "./AddLawyer";
import Login from "./Login";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="lawyers" element={<Lawyers />} />
          <Route path="clients" element={<UserPage />} />
          <Route path="cases" element={<Cases />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="addlawyer" element={<AddLawyer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
