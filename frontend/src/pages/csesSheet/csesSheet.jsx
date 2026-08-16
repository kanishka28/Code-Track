import { useEffect, useMemo, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

import { getCsesProblems } from "../../services/sheetService";
import {
    getProgress,
    updateProgress,
    toProgressMap
} from "../../services/progressService";
import { useProgress } from "../../context/ProgressContext";

import BuddyButton from "../../components/CodeTrackBuddy/BuddyButton";
// NOTE: adjust this import path to wherever Progressbar actually lives
import Progressbar from "../../components/Progressbar/Progressbar";

import "./csesSheet.css";

function CSESPage() {

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const { refreshSummary } = useProgress();

    useEffect(() => {

        const loadProblems = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getCsesProblems();

                console.log("CSES problems received:", data);

                if (!Array.isArray(data)) {
                    setProblems([]);
                    setError("Invalid CSES data received from server.");
                    return;
                }


                // ====================================================
                // Merge in this user's saved progress for CSES
                // ====================================================

                let progressMap = {};

                try {

                    const progressList = await getProgress("CSES");
                    progressMap = toProgressMap(progressList);

                } catch (progressError) {

                    console.error(
                        "Failed to load CSES progress:",
                        progressError
                    );

                    // Fall through with an empty map rather than
                    // blocking the whole page on a progress failure.

                }

                const merged = data.map(problem => {

                    const saved = progressMap[problem.id];

                    return {
                        ...problem,
                        solved: saved?.solved || false,
                        revision: saved?.markedForRevision || false
                    };

                });

                setProblems(merged);

            } catch (err) {

                console.error(
                    "Failed to load CSES problems:",
                    err
                );

                setError(
                    "Failed to load CSES problems."
                );

            } finally {

                setLoading(false);

            }

        };

        loadProblems();

    }, []);


    // ============================================================
    // MARK PROBLEM SOLVED / UNSOLVED
    // ============================================================

    const handleComplete = async (problemId) => {

        try {

            const problem = problems.find(p => p.id === problemId);
            if (!problem) return;

            const nextSolved = !problem.solved;

            setProblems(prev =>
                prev.map(p =>
                    p.id === problemId
                        ? { ...p, solved: nextSolved }
                        : p
                )
            );

            await updateProgress("CSES", problemId, { solved: nextSolved });

            refreshSummary();

        } catch (err) {

            console.error("Failed to update CSES problem:", err);

            setProblems(prev =>
                prev.map(p =>
                    p.id === problemId
                        ? { ...p, solved: !p.solved }
                        : p
                )
            );

        }

    };


    // ============================================================
    // TOGGLE REVISION
    // ============================================================

    const handleRevision = async (problemId) => {

        try {

            const problem = problems.find(p => p.id === problemId);
            if (!problem) return;

            const nextRevision = !problem.revision;

            setProblems(prev =>
                prev.map(p =>
                    p.id === problemId
                        ? { ...p, revision: nextRevision }
                        : p
                )
            );

            await updateProgress("CSES", problemId, { markedForRevision: nextRevision });

            refreshSummary();

        } catch (err) {

            console.error("Failed to update CSES revision:", err);

            setProblems(prev =>
                prev.map(p =>
                    p.id === problemId
                        ? { ...p, revision: !p.revision }
                        : p
                )
            );

        }

    };


    // ============================================================
    // PROGRESS (based on the full sheet, not the filtered view)
    // ============================================================

    const solvedCount = useMemo(
        () => problems.filter(p => p.solved).length,
        [problems]
    );


    // ============================================================
    // CATEGORY OPTIONS (derived from loaded problems)
    // ============================================================

    const categories = useMemo(() => {

        const unique = new Set(
            problems
                .map(p => p.category)
                .filter(Boolean)
        );

        return ["All", ...Array.from(unique).sort()];

    }, [problems]);


    // ============================================================
    // SEARCH + CATEGORY FILTERING (table rows only)
    // ============================================================

    const filteredProblems = useMemo(() => {

        const query = search.trim().toLowerCase();

        return problems.filter(problem => {

            const matchesSearch =
                query === "" ||
                problem.title?.toLowerCase().includes(query) ||
                String(problem.id).toLowerCase().includes(query);

            const matchesCategory =
                category === "All" || problem.category === category;

            return matchesSearch && matchesCategory;

        });

    }, [problems, search, category]);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="cses-page">

                <div className="cses-loading">
                    Loading CSES problems...
                </div>

            </div>
        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (
            <div className="cses-page">

                <div className="cses-error">
                    {error}
                </div>

            </div>
        );

    }


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="cses-page">

            <div className="cses-header">

                <div className="cses-header-info">

                    <h1>
                        CSES Problem Set
                    </h1>

                    <p>
                        Practice competitive programming
                        problems from the CSES Problem Set.
                    </p>

                </div>


                <div className="cses-count">

                    <strong>
                        {problems.length}
                    </strong>

                    <span>
                        Problems
                    </span>

                </div>

            </div>


            <div className="cses-top-row">

                <div className="cses-filters">

                    <input
                        type="text"
                        className="cses-search-input"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="cses-category-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        {categories.map((cat) => (

                            <option key={cat} value={cat}>
                                {cat}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="cses-progress-wrapper">

                    <Progressbar
                        solved={solvedCount}
                        total={problems.length}
                    />

                </div>

            </div>


            <div className="cses-table-container">

                <table className="cses-table">

                    <thead>

                        <tr>

                            <th className="cses-status-header">
                                Status
                            </th>

                            <th>
                                Rank
                            </th>

                            <th>
                                ID
                            </th>

                            <th>
                                Problem
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Problem Link
                            </th>

                            <th className="cses-revision-header">
                                Revision
                            </th>

                            <th className="cses-buddy-header">
                                CodeTrack Buddy
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {problems.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="cses-empty"
                                >
                                    No CSES problems found.
                                </td>

                            </tr>

                        ) : filteredProblems.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="cses-empty"
                                >
                                    No problems match your search/filter.
                                </td>

                            </tr>

                        ) : (

                            filteredProblems.map((problem) => (

                                <tr key={problem.id}>

                                    {/* Status */}

                                    <td className="cses-status">

                                        <input
                                            type="checkbox"
                                            checked={problem.solved || false}
                                            onChange={() => handleComplete(problem.id)}
                                        />

                                    </td>


                                    {/* Rank */}

                                    <td className="cses-rank">
                                        {problem.rank}
                                    </td>


                                    {/* ID */}

                                    <td className="cses-id">
                                        {problem.id}
                                    </td>


                                    {/* Title */}

                                    <td className="cses-title">
                                        {problem.title}
                                    </td>


                                    {/* Category */}

                                    <td>

                                        <span className="cses-category">
                                            {problem.category}
                                        </span>

                                    </td>


                                    {/* Link */}

                                    <td>

                                        <a
                                            href={problem.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cses-link"
                                        >
                                            Solve →
                                        </a>

                                    </td>


                                    {/* Revision */}

                                    <td
                                        className="cses-revision"
                                        onClick={() => handleRevision(problem.id)}
                                    >

                                        {problem.revision
                                            ? <FaStar />
                                            : <FaRegStar />}

                                    </td>


                                    {/* CodeTrack Buddy */}

                                    <td className="cses-buddy">

                                        <BuddyButton
                                            problem={{
                                                ...problem,
                                                problem: problem.title,
                                                solveUrl: problem.url,
                                                platform: "CSES"
                                            }}
                                        />

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default CSESPage;