import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import FileUpload from "./components/Upload";
import ReportForm from "./components/ReportForm";
import PdfSplitter from "./components/pdfSplitter";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/generate" replace />} />
          <Route path="/generate" element={<ReportForm />} />
          <Route path="/merge" element={<FileUpload />} />
          <Route path="/split" element={<PdfSplitter />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
