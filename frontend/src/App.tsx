import "@/styles/globals.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IBMMasthead } from "@/components/ui/ibm-masthead";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans antialiased">
        <IBMMasthead />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
