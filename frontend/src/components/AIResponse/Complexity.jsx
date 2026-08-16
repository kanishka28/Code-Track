import React from "react";

function Complexity({ problem }) {
  return (
    <div className="ai-response-content">

      <h2>📊 Complexity Analysis</h2>

      <div className="complexity-grid">

        <div className="complexity-card">
          <h3>Brute Force</h3>

          <div>
            <span>Time</span>
            <strong>O(n²)</strong>
          </div>

          <div>
            <span>Space</span>
            <strong>O(1)</strong>
          </div>
        </div>

        <div className="complexity-card">
          <h3>Optimal</h3>

          <div>
            <span>Time</span>
            <strong>O(n)</strong>
          </div>

          <div>
            <span>Space</span>
            <strong>O(n)</strong>
          </div>
        </div>

      </div>

      <h3>Why?</h3>

      <p>
        The optimal solution processes the input once while
        maintaining additional information for fast lookup.
      </p>

    </div>
  );
}

export default Complexity;