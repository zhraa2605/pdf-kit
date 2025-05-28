import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Header from "./components/Header";
import MergeFiles from "./components/merge/Merge";
import PdfSplitter from "./components/Split/pdfSplitter";
import GenerateBlocksPage from "./components/generatePdf/generate";
import HomePage from "./components/HomePage";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/merge" element={<MergeFiles />} />
          <Route path="/split" element={<PdfSplitter />} />
          <Route path="/pdf" element={<GenerateBlocksPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
