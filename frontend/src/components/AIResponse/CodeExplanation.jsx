import React from "react";

function CodeExplanation({ problem }) {
  return (
    <div className="ai-response-content">

      <h2>📝 Explain My Code</h2>

      <textarea
        className="buddy-question-input"
        placeholder="Paste your code here..."
      />

      <button className="buddy-submit-button">
        Explain Code
      </button>

      <div className="code-explanation-result">

        <h3>Line 1</h3>

        <p>
          Iterates through every element of the input.
        </p>

        <hr />

        <h3>Line 2</h3>

        <p>
          Calculates the complementary value required
          to satisfy the target condition.
        </p>

        <hr />

        <h3>Overall</h3>

        <p>
          The algorithm uses a HashMap for efficient lookup.
        </p>

      </div>

    </div>
  );
}

export default CodeExplanation;