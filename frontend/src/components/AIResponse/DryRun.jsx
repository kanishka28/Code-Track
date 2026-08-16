import React, { useState } from "react";

function DryRun({ problem }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      current: 2,
      need: 7,
      map: "{}",
      message: "Store 2 → 0"
    },
    {
      current: 7,
      need: 2,
      map: "{2 → 0}",
      message: "2 already exists. Found the answer!"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="ai-response-content">

      <h2>🔄 Dry Run</h2>

      <div className="dry-run-input">
        <strong>Input</strong>

        <p>nums = [2, 7, 11, 15]</p>
        <p>target = 9</p>
      </div>

      <div className="dry-run-array">
        {[2, 7, 11, 15].map((value, index) => (
          <div
            key={index}
            className={`array-value ${
              index === step ? "active" : ""
            }`}
          >
            {value}
          </div>
        ))}
      </div>

      <div className="dry-run-step">

        <div>
          <span>Current Number</span>
          <strong>{currentStep.current}</strong>
        </div>

        <div>
          <span>Need</span>
          <strong>{currentStep.need}</strong>
        </div>

        <div>
          <span>HashMap</span>
          <strong>{currentStep.map}</strong>
        </div>

      </div>

      <div className="dry-run-message">
        {currentStep.message}
      </div>

      <div className="dry-run-controls">

        <button
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          ← Previous
        </button>

        <span>
          Step {step + 1} / {steps.length}
        </span>

        <button
          disabled={step === steps.length - 1}
          onClick={() => setStep(step + 1)}
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default DryRun;