import React from "react";

function Explanation({ problem }) {
  return (
    <div className="ai-response-content">
      <h2>🧠 What is the problem asking?</h2>

      <p>
        The problem is asking you to understand the given input,
        identify the required relationship between the values,
        and produce the expected output.
      </p>

      <h3>Example</h3>

      <div className="ai-example-box">
        <p>
          <strong>Problem:</strong>{" "}
          {problem?.problem || "Coding Problem"}
        </p>

        <p>
          The AI will explain the example step by step here.
        </p>
      </div>

      <h3>Key Observation</h3>

      <p>
        The important part of solving this problem is identifying
        the underlying pattern rather than immediately writing code.
      </p>
    </div>
  );
}

export default Explanation;