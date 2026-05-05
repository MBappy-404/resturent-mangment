import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/library" element={<Library />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/id-cards" element={<IDCards />} />
            <Route path="/guardian" element={<Guardian />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/menu" element={<MobileMenu />} />
            <Route path="/sms" element={<SMS />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/hostel" element={<Hostel />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/class-routine" element={<ClassRoutine />} />
            <Route path="/school-staff" element={<SchoolStaff />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
