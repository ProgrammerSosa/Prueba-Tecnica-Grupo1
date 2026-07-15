import { toast } from "react-hot-toast";

const baseStyle = {
  borderRadius: "12px",
  fontWeight: 600,
  fontFamily: '"Barlow", ui-sans-serif, system-ui, sans-serif',
  fontSize: "0.95rem",
  padding: "14px 20px",
  boxShadow: "0 8px 24px rgba(51, 36, 29, 0.35)",
  background: "#33241D",
  color: "#EFE7DA",
};

export const showSuccess = (message) =>
  toast.success(message, {
    style: {
      ...baseStyle,
      border: "1px solid #F9B825",
    },
    iconTheme: {
      primary: "#F9B825",
      secondary: "#33241D",
    },
  });

export const showError = (message) =>
  toast.error(message, {
    style: {
      ...baseStyle,
      border: "1px solid #C45C4A",
    },
    iconTheme: {
      primary: "#C45C4A",
      secondary: "#EFE7DA",
    },
  });

export const showInfo = (message) =>
  toast(message, {
    style: {
      ...baseStyle,
      border: "1px solid #82CFFD",
    },
    iconTheme: {
      primary: "#82CFFD",
      secondary: "#33241D",
    },
  });
