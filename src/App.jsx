import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import TawkToWidget from "./pages/TwakToWidget";
import DashboardRoutes from "./route/DashboardRoutes";
import UserRoute from "./route/UserRoute";
import VendorRoutes from "./route/VendorRoutes";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <DashboardRoutes />
        <VendorRoutes />
        <UserRoute />
        <TawkToWidget />
      </Router>
    </>
  );
}

export default App;
