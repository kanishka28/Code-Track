import React from "react";

function SimilarProblems({ problem }) {
  const problems = [
    {
      name: "Two Sum II",
      pattern: "Two Pointers"
    },
    {
      name: "3Sum",
      pattern: "Two Pointers"
    },
    {
      name: "4Sum",
      pattern: "Two Pointers"
    },
    {
      name: "Subarray Sum Equals K",
      pattern: "Prefix Sum + HashMap"
    }
  ];

  return (
    <div className="ai-response-content">

      <h2>🎯 Similar Problems</h2>

      <div className="similar-problems-list">

        {problems.map((item, index) => (
          <div
            className="similar-problem-card"
            key={index}
          >
            <div>
              <strong>{item.name}</strong>

              <span>
                {item.pattern}
              </span>
            </div>

            <button>
              View
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default SimilarProblems;