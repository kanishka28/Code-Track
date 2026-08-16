import "./StatisticsCards.css";

import {
    FaBookOpen,
    FaCheckCircle,
    FaStar,
    FaClock
} from "react-icons/fa";

function StatisticsCards({ total, solved, revision }) {

    const remaining = total - solved;

    return (

        <div className="stats-grid">

            <div className="stat-card">

                <div className="stat-icon total">
                    <FaBookOpen />
                </div>

                <div>

                    <h3>{total}</h3>

                    <p>Total Problems</p>

                </div>

            </div>

            <div className="stat-card solved">

                <div className="stat-icon solved-icon">
                    <FaCheckCircle />
                </div>

                <div>

                    <h3>{solved}</h3>

                    <p>Solved</p>

                </div>

            </div>

            <div className="stat-card revision">

                <div className="stat-icon revision-icon">
                    <FaStar />
                </div>

                <div>

                    <h3>{revision}</h3>

                    <p>Revision</p>

                </div>

            </div>

            <div className="stat-card remaining">

                <div className="stat-icon remaining-icon">
                    <FaClock />
                </div>

                <div>

                    <h3>{remaining}</h3>

                    <p>Remaining</p>

                </div>

            </div>

        </div>

    );

}

export default StatisticsCards;