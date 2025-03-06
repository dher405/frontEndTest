import React, { useState } from "react";

const ComplianceChecker = () => {
  const [url, setUrl] = useState("https://");
  const [complianceData, setComplianceData] = useState(null);
  const [error, setError] = useState(null);

  const extractDomain = (inputUrl) => {
    try {
      let parsedUrl = new URL(inputUrl);
      return parsedUrl.origin; // Extracts only the base domain
    } catch (e) {
      return ""; // Return empty string if URL is invalid
    }
  };

  const onClick = async () => {
    setError(null);
    setComplianceData(null);
    
    let sanitizedUrl = extractDomain(url); // Extract domain only
    if (!sanitizedUrl) {
      setError("Invalid URL. Please enter a valid website URL.");
      return;
    }

    try {
      const response = await fetch(
        `https://tcr-api-bzn4.onrender.com/check_compliance?website_url=${encodeURIComponent(sanitizedUrl)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("API request failed");
      }
      
      const data = await response.json();
      setComplianceData(data);
    } catch (err) {
      setError("Failed to fetch compliance data. Please try again.");
    }
  };

  return (
    <div>
      <h2>Compliance Checker</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
      />
      <button onClick={onClick}>Check Compliance</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {complianceData && (
        <pre>{JSON.stringify(complianceData, null, 2)}</pre>
      )}
    </div>
  );
};

export default ComplianceChecker;
