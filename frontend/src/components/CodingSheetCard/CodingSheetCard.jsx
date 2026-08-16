import "./CodingSheetCard.css";
import { useNavigate } from "react-router-dom";

import {
    FaBookOpen,
    FaClipboardList,
    FaClock,
    FaArrowRight
} from "react-icons/fa";

function CodingSheetCard({ sheet }) {

    const navigate = useNavigate();

    const difficulty =
        sheet.level || "Intermediate";


    // ============================================================
    // DURATION
    // ============================================================

    const duration =
        sheet.id === "striver-a2z"
            ? "8-12 Weeks"
            : sheet.id === "cses"
                ? "6-10 Weeks"
                : "4-6 Weeks";


    // ============================================================
    // BADGE
    // ============================================================

    let badge = "";

    const sheetName =
        sheet.name || sheet.title || "";


    if (sheetName.includes("Striver")) {

        badge = "⭐ Recommended";

    }
    else if (sheetName.includes("Blind")) {

        badge = "🔥 Trending";

    }
    else if (sheetName.includes("NeetCode")) {

        badge = "💼 Interview Favorite";

    }
    else if (sheetName.includes("Love Babbar")) {

        badge = "📚 Comprehensive";

    }
    else if (sheet.id === "cses") {

        badge = "🏆 CP Focus";

    }
    else {

        badge = "🏆 CP Focus";

    }


    // ============================================================
    // NAVIGATION
    // ============================================================

    const handleStartSolving = () => {

        /*
         * CSES has its own page because its problems
         * are fetched from /cses/problems.
         *
         * All existing sheets continue using
         * /sheet/:id exactly as before.
         */

        if (String(sheet.id).trim() === "cses") {

            navigate("/cses");

            return;
        }


        navigate(`/sheet/${sheet.id}`);

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="coding-sheet-card">


            {/* ====================================================
                TOP
            ===================================================== */}

            <div className="card-top">

                <span className="sheet-badge">

                    {badge}

                </span>


                <span className="difficulty-badge">

                    {difficulty}

                </span>

            </div>


            {/* ====================================================
                ICON
            ===================================================== */}

            <div className="sheet-icon">

                <FaBookOpen />

            </div>


            {/* ====================================================
                TITLE
            ===================================================== */}

            <h2>

                {sheetName}

            </h2>


            {/* ====================================================
                DESCRIPTION
            ===================================================== */}

            <p>

                {sheet.description}

            </p>


            {/* ====================================================
                META
            ===================================================== */}

            <div className="sheet-meta">


                <div className="meta-item">

                    <FaClipboardList />

                    <span>

                        {sheet.problemCount || sheet.problems}
                        {" "}
                        Problems

                    </span>

                </div>


                <div className="meta-item">

                    <FaClock />

                    <span>

                        {duration}

                    </span>

                </div>


            </div>


            {/* ====================================================
                BUTTON
            ===================================================== */}

            <button
                className="sheet-btn"
                onClick={handleStartSolving}
            >

                Start Solving

                <FaArrowRight />

            </button>


        </div>

    );
}

export default CodingSheetCard;