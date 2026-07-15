import { toast } from "react-hot-toast";

const baseStyle = {
  borderRadius: "8px",
  fontWeight: 600,
  fontFamily: "inherit",
  fontSize: "1rem",
  padding: "16px 24px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
  background: "#161925",
  color: "#ffffff",
};

export const showSuccess = (message) =>
  toast.success(message, {
    style: {
      ...baseStyle,
      border: "1px solid #4CAF50",
    },
    iconTheme: {
      primary: "#4CAF50",
      secondary: "#161925",
    },
  });

export const showError = (message) =>
  toast.error(message, {
    style: {
      ...baseStyle,
      border: "1px solid #C1292E",
    },
    iconTheme: {
      primary: "#C1292E",
      secondary: "#fff",
    },
  });

export const showInfo = (message) =>
  toast(message, {
    style: {
      ...baseStyle,
      border: "1px solid #2196F3",
    },
    iconTheme: {
      primary: "#2196F3",
      secondary: "#161925",
    },
  });
