import "./ProblemRow.css";

import DifficultyBadge from "../DifficultyBadge/DifficultyBadge";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import CompanyPill from "../CompanyPill/CompanyPill";
import BuddyButton from "../CodeTrackBuddy/BuddyButton";

import { FaStar, FaRegStar } from "react-icons/fa";

function ProblemRow({
    problem,
    onComplete,
    onRevision
}) {

    const visibleCompanies =
        problem.companies?.slice(0, 2) || [];

    return (

        <div className="problem-row">

            {/* Status */}

            <div className="problem-status">

                <input
                    type="checkbox"
                    checked={problem.solved || false}
                    onChange={() =>
                        onComplete(problem.id)
                    }
                />

            </div>


            {/* Problem */}

            <div className="problem-name">

                {problem.problem}

            </div>


            {/* Topic */}

            <div>

                <span className="topic-pill">
                    {problem.topic || "—"}
                </span>

            </div>


            {/* Difficulty */}

            <div>

                <DifficultyBadge
                    difficulty={problem.difficulty}
                />

            </div>


            {/* Platform */}

            <div className="platform-cell">

                {problem.solveUrl ? (

                    <a
                        href={problem.solveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="platform-link"
                    >

                        <PlatformBadge
                            platform="LeetCode"
                        />

                    </a>

                ) : (

                    <PlatformBadge
                        platform="LeetCode"
                    />

                )}

            </div>


            {/* Companies */}

            <div className="company-list">

                {
                    visibleCompanies.map(company => (

                        <CompanyPill
                            key={company}
                            company={company}
                        />

                    ))
                }

            </div>


            {/* Revision */}

            <div
                className="revision-star"
                onClick={() =>
                    onRevision(problem.id)
                }
            >

                {
                    problem.revision
                        ? <FaStar />
                        : <FaRegStar />
                }

            </div>


            {/* CodeTrack Buddy */}

            <div className="buddy-cell">

                <BuddyButton
                    problem={problem}
                />

            </div>

        </div>

    );
}

export default ProblemRow;