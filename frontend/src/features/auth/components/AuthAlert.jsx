export const AuthAlert = ({ children }) => {
  if (!children) return null;
  return <div className="auth-error-box mb-4">{children}</div>;
};
