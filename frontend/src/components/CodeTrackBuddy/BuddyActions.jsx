import React from "react";

import {
    FaBrain,
    FaLightbulb,
    FaSyncAlt,
    FaChartBar,
    FaVial,
    FaCode,
    FaBullseye,
    FaComments
} from "react-icons/fa";

import "./BuddyActions.css";


function BuddyActions({ onAction }) {

    const actions = [

        {
            id: "EXPLAIN",
            icon: <FaBrain />,
            title: "Explain Problem",
            description: "Understand what the problem is asking"
        },

        {
            id: "HINT",
            icon: <FaLightbulb />,
            title: "Progressive Hint",
            description: "Get hints without revealing the solution"
        },

        {
            id: "DRY_RUN",
            icon: <FaSyncAlt />,
            title: "Dry Run",
            description: "See the algorithm step by step"
        },

        {
            id: "COMPLEXITY",
            icon: <FaChartBar />,
            title: "Complexity Analysis",
            description: "Understand time and space complexity"
        },

        {
            id: "TEST_CASES",
            icon: <FaVial />,
            title: "Generate Test Cases",
            description: "Generate useful test cases"
        },

        {
            id: "EXPLAIN_CODE",
            icon: <FaCode />,
            title: "Explain My Code",
            description: "Understand your submitted code"
        },

        {
            id: "SIMILAR",
            icon: <FaBullseye />,
            title: "Similar Problems",
            description: "Find related coding problems"
        },

        {
            id: "ASK",
            icon: <FaComments />,
            title: "Ask Buddy",
            description: "Ask anything about this problem"
        }

    ];


    return (

        <div className="buddy-actions">

            {actions.map((action) => (

                <button
                    key={action.id}
                    className="buddy-action-card"
                    onClick={() => onAction(action.id)}
                >

                    <div className="buddy-action-icon">
                        {action.icon}
                    </div>

                    <div className="buddy-action-content">

                        <div className="buddy-action-title">
                            {action.title}
                        </div>

                        <div className="buddy-action-description">
                            {action.description}
                        </div>

                    </div>

                </button>

            ))}

        </div>

    );
}


export default BuddyActions;