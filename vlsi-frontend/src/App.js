import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [designName, setDesignName] = useState("");
  const [rtlFile, setRtlFile] = useState(null);
  const [layoutFile, setLayoutFile] = useState(null);
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    const res = await axios.get("http://localhost:8000/results");
    setResults(res.data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSubmit = async () => {
    if (!designName) {
      alert("Please enter design name");
      return;
    }

    const formData = new FormData();
    formData.append("design_name", designName);
    if (rtlFile) formData.append("rtl_file", rtlFile);
    if (layoutFile) formData.append("layout_image", layoutFile);

    await axios.post("http://localhost:8000/analyze", formData);
    setDesignName("");
    fetchResults();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>VLSI AI Design Analyzer</h1>
        <p>AI-powered PPA & hotspot analysis platform</p>
      </header>

      <div className="card">
        <h2>Analyze New Design</h2>

        <input
          className="input"
          placeholder="Design Name"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
        />

        <label className="file-label">
          RTL File
          <input type="file" onChange={(e) => setRtlFile(e.target.files[0])} />
        </label>

        <label className="file-label">
          Layout Image
          <input type="file" onChange={(e) => setLayoutFile(e.target.files[0])} />
        </label>

        <button className="btn" onClick={handleSubmit}>
          Run Analysis
        </button>
      </div>

      <div className="card">
        <h2>Analyzed Designs</h2>

        {results.length === 0 && (
          <p className="muted">Submit a design to view analysis results here.</p>
        )}

        {results.map((r, i) => (
          <div key={i} className="result-card">
            <h3>{r.design_name}</h3>

            <table>
              <tbody>
                <tr>
                  <td>Power</td>
                  <td>{r.metrics.power}</td>
                </tr>
                <tr>
                  <td>Area</td>
                  <td>{r.metrics.area}</td>
                </tr>
                <tr>
                  <td>Timing</td>
                  <td>{r.metrics.timing}</td>
                </tr>
              </tbody>
            </table>

            <a
              className="link"
              href={`http://localhost:8000/download_pdf/${r.design_name}`}
              target="_blank"
              rel="noreferrer"
            >
              Download Report (PDF)
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
