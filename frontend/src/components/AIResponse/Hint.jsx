import React, { useState } from "react";

function Hint({ problem }) {
  const [hintLevel, setHintLevel] = useState(1);

  const hints = [
    "Start by understanding what information you need while processing the input.",

    "Think about whether you can avoid checking every possible combination.",

    "Look for a data structure that can help you quickly check whether a required value has already appeared.",

    "Try using a HashMap to store previously encountered values."
  ];

  return (
    <div className="ai-response-content">

      <h2>💡 Progressive Hint</h2>

      <p className="hint-level">
        Hint {hintLevel} of {hints.length}
      </p>

      <div className="hint-box">
        {hints[hintLevel - 1]}
      </div>

      {hintLevel < hints.length && (
        <button
          className="buddy-submit-button"
          onClick={() => setHintLevel(hintLevel + 1)}
        >
          Show Next Hint
        </button>
      )}

      {hintLevel === hints.length && (
        <p className="hint-complete">
          You've reached the final hint.
        </p>
      )}

    </div>
  );
}

export default Hint;