import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Notices from "./pages/Notices";
import Exams from "./pages/Exams";
import Library from "./pages/Library";
import Accounts from "./pages/Accounts";
import IDCards from "./pages/IDCards";
import Guardian from "./pages/Guardian";
import Diary from "./pages/Diary";
import Settings from "./pages/Settings";
import MobileMenu from "./pages/MobileMenu";
import NotFound from "./pages/NotFound";
import SMS from "./pages/SMS";
import Transport from "./pages/Transport";
import Certificates from "./pages/Certificates";
import Calendar from "./pages/Calendar";
import Alumni from "./pages/Alumni";
import Medical from "./pages/Medical";
import Scholarship from "./pages/Scholarship";
import Hostel from "./pages/Hostel";
import Subjects from "./pages/Subjects";
import ClassRoutine from "./pages/ClassRoutine";
import SchoolStaff from "./pages/SchoolStaff";
import Administration from "./pages/Administration";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isLoading ? <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div> : isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
      <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
      <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
      <Route path="/id-cards" element={<ProtectedRoute><IDCards /></ProtectedRoute>} />
      <Route path="/guardian" element={<ProtectedRoute><Guardian /></ProtectedRoute>} />
      <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><MobileMenu /></ProtectedRoute>} />
      <Route path="/sms" element={<ProtectedRoute><SMS /></ProtectedRoute>} />
      <Route path="/transport" element={<ProtectedRoute><Transport /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/alumni" element={<ProtectedRoute><Alumni /></ProtectedRoute>} />
      <Route path="/medical" element={<ProtectedRoute><Medical /></ProtectedRoute>} />
      <Route path="/scholarship" element={<ProtectedRoute><Scholarship /></ProtectedRoute>} />
      <Route path="/hostel" element={<ProtectedRoute><Hostel /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
      <Route path="/class-routine" element={<ProtectedRoute><ClassRoutine /></ProtectedRoute>} />
      <Route path="/school-staff" element={<ProtectedRoute><SchoolStaff /></ProtectedRoute>} />
      <Route path="/administration" element={<ProtectedRoute><Administration /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
