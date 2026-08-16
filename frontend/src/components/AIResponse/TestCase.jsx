import React from "react";

function TestCase({ problem }) {
  const testCases = [
    {
      title: "Basic Case",
      input: "[2,7,11,15], target = 9"
    },
    {
      title: "Duplicate Values",
      input: "[3,3], target = 6"
    },
    {
      title: "Negative Values",
      input: "[-1,2,5], target = 4"
    },
    {
      title: "No Answer",
      input: "[1,2,3], target = 100"
    },
    {
      title: "Large Input",
      input: "100000 numbers"
    }
  ];

  return (
    <div className="ai-response-content">

      <h2>🧪 Generated Test Cases</h2>

      <div className="test-case-list">

        {testCases.map((testCase, index) => (
          <div className="test-case-card" key={index}>

            <div className="test-case-title">
              ✓ {testCase.title}
            </div>

            <div className="test-case-input">
              {testCase.input}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default TestCase;