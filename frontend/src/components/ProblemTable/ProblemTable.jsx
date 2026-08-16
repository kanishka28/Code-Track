import ProblemRow from "../ProblemRow/ProblemRow";

import "./ProblemTable.css";

function ProblemTable({
    problems,
    onComplete,
    onRevision
}) {

    return (

        <div className="problem-table-container">

            <div className="problem-table-header">

                <div>
                    Status
                </div>

                <div>
                    Problem
                </div>

                <div>
                    Topic
                </div>

                <div>
                    Difficulty
                </div>

                <div>
                    Platform
                </div>

                <div>
                    Company
                </div>

                <div>
                    Revision
                </div>

                {/* CodeTrack Buddy */}

                <div>
                    CodeTrack Buddy
                </div>

            </div>

            {
                problems.map(
                    (problem) => (

                        <ProblemRow

                            key={
                                problem.id
                            }

                            problem={
                                problem
                            }

                            onComplete={
                                onComplete
                            }

                            onRevision={
                                onRevision
                            }

                        />

                    )
                )
            }

        </div>

    );

}

export default ProblemTable;                                                                                        