import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import FloatingShape from "./components/FloatingShape";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import NotFoundPage from "./pages/NotFoundPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
// kimlik doğrulaması gerektiren rotaları koru
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  if (!user || !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

//giriş yapanlar için
const RedirectUser = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { user, checkUser, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkUser();
  }, [checkUser]);
  if (isCheckingAuth) <LoadingSpinner />;
  return (
    <div
      className="min-h-screen bg-gradient-to-br
  from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="5%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectUser>
              <SignUpPage />
            </RedirectUser>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectUser>
              <SignInPage />
            </RedirectUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
