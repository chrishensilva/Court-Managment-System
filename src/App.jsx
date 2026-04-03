import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Marketing Website ─────────────────────────────────────────
import MarketingLayout from "./MarketingLayout";
import MarketingHome     from "./marketing/pages/Home";
import MarketingFeatures from "./marketing/pages/Features";
import MarketingPricing  from "./marketing/pages/Pricing";
import MarketingSecurity from "./marketing/pages/Security";
import MarketingContact  from "./marketing/pages/Contact";

// ── System (CMS) ──────────────────────────────────────────────
import DashboardLayout from "./DashboardLayout";
import DashboardPage   from "./DashboardPage";
import Lawyers         from "./Lawyers";
import UserPage        from "./UserPage";
import Cases           from "./Cases";
import AddUser         from "./AddUser";
import AddLawyer       from "./AddLawyer";
import GenerateReport  from "./GenerateReport";
import AddEditor       from "./AddEditor";
import ActivityLogs    from "./ActivityLogs";
import Login           from "./Login";
import Register        from "./Register";
import Account         from "./Account";
import { useAuth }     from "./AuthContext";

function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* ── Marketing Website (public) ─────────────────── */}
        <Route element={<MarketingLayout />}>
          <Route path="/"          element={<MarketingHome />} />
          <Route path="/features"  element={<MarketingFeatures />} />
          <Route path="/pricing"   element={<MarketingPricing />} />
          <Route path="/security"  element={<MarketingSecurity />} />
          <Route path="/contact"   element={<MarketingContact />} />
        </Route>

        {/* ── Auth Pages ─────────────────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected Dashboard (CMS) ──────────────────── */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index              element={<DashboardPage />} />
          <Route path="lawyers"     element={<Lawyers />} />
          <Route path="clients"     element={<UserPage />} />
          <Route path="cases"       element={<Cases />} />
          <Route path="adduser"     element={<AddUser />} />
          <Route path="addlawyer"   element={<AddLawyer />} />
          <Route path="report"      element={<GenerateReport />} />
          <Route path="addeditor"   element={<AddEditor />} />
          <Route path="logs"        element={<ActivityLogs />} />
          <Route path="account"     element={<Account />} />
        </Route>

        {/* ── Fallback ───────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </HashRouter>
  );
}

export default App;
