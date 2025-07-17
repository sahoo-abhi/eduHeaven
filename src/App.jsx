import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import './styles/animations.css';
import BranchSelection from "./pages/BranchSelection";
import Dashboard from "./pages/Dashboard";
import SubjectNotes from "./pages/SubjectNotes";
import UploadNotes from "./pages/UploadNotes";
import ViewNotes from "./pages/ViewNotes";
import QuestionPapers from "./pages/QuestionPapers";
import SubjectQuestionPapers from "./pages/SubjectQuestionPapers";
import UploadPapers from "./pages/UploadPapers";
import ViewPapers from "./pages/ViewPapers";
import UploadSchedule from "./pages/UploadSchedule";
import ViewSchedules from "./pages/ViewSchedules";
import ReferenceBooks from "./pages/ReferenceBooks";
import UploadReferenceBooks from "./pages/UploadReferenceBooks";
import ViewReferenceBooks from "./pages/ViewReferenceBooks";
import Contact from "./pages/Contact";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/branch-selection" element={<BranchSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subject-notes" element={<SubjectNotes />} />
          <Route path="/upload-notes/:subject" element={<UploadNotes />} />
          <Route path="/view-notes/:subject" element={<ViewNotes />} />
          <Route path="/question-papers" element={<QuestionPapers />} />
          <Route path="/question-papers/:subject" element={<SubjectQuestionPapers />} />
          <Route path="/upload-papers/:subject/:paperType" element={<UploadPapers />} />
          <Route path="/view-papers/:subject/:paperType" element={<ViewPapers />} />
          <Route path="/upload-schedule" element={<UploadSchedule />} />
          <Route path="/view-schedules" element={<ViewSchedules />} />
          <Route path="/reference-books" element={<ReferenceBooks />} />
          <Route path="/upload-reference-books/:subject" element={<UploadReferenceBooks />} />
          <Route path="/view-reference-books/:subject" element={<ViewReferenceBooks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
