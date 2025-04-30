import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  // Check if token is expired
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return token;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};

export const logout = (navigate) => {
  localStorage.removeItem("token");
  if (navigate) {
    navigate("/");
  }
};

export const handleRedirect = (navigate) => {
  const token = getToken();
  if (!token) {
    navigate("/login");
    return;
  }

  const decodedToken = decodeToken(token);
  console.log("Decoded Token:", decodedToken);
  if (!decodedToken) {
    navigate("/login");
    return;
  }

  if (decodedToken.role === "admin") {
    navigate("/admin/dashboard");
  } else if (decodedToken.role === "user") {
    navigate("/");
  } else if (decodedToken.role === "vendor") {
    navigate("/vendor/dashboard");
  } else {
    navigate("/");
  }
};
