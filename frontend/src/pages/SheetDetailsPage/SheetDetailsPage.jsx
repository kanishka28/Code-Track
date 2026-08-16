import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import ProblemTable from "../../components/ProblemTable/ProblemTable";

import {
    getSheetById,
    getSheetProblems
} from "../../services/sheetService";

import {
    getProgress,
    updateProgress,
    toProgressMap
} from "../../services/progressService";

import { useProgress } from "../../context/ProgressContext";

import { FiSearch } from "react-icons/fi";

import "./SheetDetailsPage.css";

// ============================================================
// SHEET ID -> PROGRESS PROBLEM TYPE
// Mirrors the branching in sheetService.getSheetProblems, since
// NeetCode 150 + Blind 75 share one backend table (Problem),
// while Striver A2Z and CSES have their own tables.
// ============================================================

function getProblemType(sheetId) {

    const id = String(sheetId).trim();

    if (id === "striver-a2z") return "STRIVER";
    if (id === "cses") return "CSES";

    return "NEETCODE";
}


function SheetDetailsPage() {

    const { id } = useParams();

    const [sheet, setSheet] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [topicFilter, setTopicFilter] = useState("All");
    const [diffFilter, setDiffFilter] = useState("All");

    const problemType = useMemo(
        () => getProblemType(id),
        [id]
    );

    const { refreshSummary } = useProgress();


    // ============================================================
    // LOAD SHEET + PROBLEMS + PER-USER PROGRESS
    // ============================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                const sheetData = await getSheetById(id);

                if (!sheetData) {

                    console.error(
                        "Sheet not found:",
                        id
                    );

                    setSheet(null);
                    setProblems([]);

                    return;
                }

                const data = await getSheetProblems(id);


                // ====================================================
                // Convert backend response into flat problems array
                // ====================================================

                let flatProblems = [];


                if (Array.isArray(data)) {

                    if (
                        data.length > 0 &&
                        data[0]?.problems &&
                        Array.isArray(data[0].problems)
                    ) {

                        flatProblems = data.flatMap(
                            topicGroup => {

                                const topicName =
                                    topicGroup?.topic || "—";

                                return topicGroup.problems.map(
                                    problem => ({

                                        ...problem,

                                        topic:
                                            problem.topic ||
                                            topicName

                                    })
                                );

                            }
                        );

                    } else {

                        flatProblems = data.map(
                            problem => ({
                                ...problem,
                                topic:
                                    problem.topic || "—"
                            })
                        );

                    }

                }


                // ====================================================
                // Merge in this user's saved progress for this sheet
                // ====================================================

                let progressMap = {};

                try {

                    const progressList =
                        await getProgress(problemType);

                    progressMap = toProgressMap(progressList);

                } catch (progressError) {

                    console.error(
                        "Failed to load progress:",
                        progressError
                    );

                    // Fall through with an empty map rather than
                    // blocking the whole page on a progress failure.

                }

                flatProblems = flatProblems.map(problem => {

                    const saved = progressMap[problem.id];

                    return {
                        ...problem,
                        solved: saved?.solved || false,
                        revision: saved?.markedForRevision || false
                    };

                });


                setSheet(sheetData);
                setProblems(flatProblems);

            } catch (error) {

                console.error(
                    "Failed to load sheet:",
                    error
                );

                setSheet(null);
                setProblems([]);

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [id, problemType]);


    // ============================================================
    // MARK PROBLEM SOLVED / UNSOLVED
    // ============================================================

    const handleComplete = async (problemId) => {

        try {

            const problem =
                problems.find(
                    p => p.id === problemId
                );

            if (!problem) return;

            const nextSolved = !problem.solved;

            // Optimistic update
            setProblems(prev =>
                prev.map(p =>
                    p.id === problemId
                        ? { ...p, solved: nextSolved }
                        : p
                )
            );

            await updateProgress(
                problemType,
                problemId,
                { solved: nextSolved }
            );

            refreshSummary();

        } catch (error) {

            console.error(
                "Failed to update problem:",
                error
            );

            // Roll back on failure
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

            const problem =
                problems.find(
                    p => p.id === problemId
                );

            if (!problem) return;

            const nextRevision = !problem.revision;

            // Optimistic update
            setProblems(prev =>
                prev.map(p =>
                    p.id === problemId
                        ? { ...p, revision: nextRevision }
                        : p
                )
            );

            await updateProgress(
                problemType,
                problemId,
                { markedForRevision: nextRevision }
            );

            refreshSummary();

        } catch (error) {

            console.error(
                "Failed to update revision:",
                error
            );

            // Roll back on failure
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
    // STATISTICS
    // ============================================================

    const stats = useMemo(() => {

        const byDifficulty = (difficulty) =>
            problems.filter(
                p =>
                    p.difficulty?.toLowerCase() ===
                    difficulty.toLowerCase()
            );


        const easy = byDifficulty("Easy");
        const medium = byDifficulty("Medium");
        const hard = byDifficulty("Hard");


        return {

            easy: {
                total: easy.length,
                solved:
                    easy.filter(
                        p => p.solved
                    ).length
            },

            medium: {
                total: medium.length,
                solved:
                    medium.filter(
                        p => p.solved
                    ).length
            },

            hard: {
                total: hard.length,
                solved:
                    hard.filter(
                        p => p.solved
                    ).length
            },

            total: problems.length,

            solved:
                problems.filter(
                    p => p.solved
                ).length

        };

    }, [problems]);


    // ============================================================
    // TOPIC FILTER OPTIONS
    // ============================================================

    const topicOptions = useMemo(() => {

        const topics = new Set(
            problems
                .map(p => p.topic)
                .filter(
                    topic =>
                        topic &&
                        topic !== "—"
                )
        );


        return [
            "All",
            ...Array.from(topics).sort()
        ];

    }, [problems]);


    // ============================================================
    // FILTER PROBLEMS
    // ============================================================

    const filtered = useMemo(() => {

        return problems.filter(problem => {

            const matchSearch =
                search === "" ||
                problem.problem
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const matchTopic =
                topicFilter === "All" ||
                problem.topic === topicFilter;


            const matchDifficulty =
                diffFilter === "All" ||
                problem.difficulty
                    ?.toLowerCase() ===
                diffFilter.toLowerCase();


            return (
                matchSearch &&
                matchTopic &&
                matchDifficulty
            );

        });

    }, [
        problems,
        search,
        topicFilter,
        diffFilter
    ]);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="sheet-loading">
                Loading...
            </div>
        );

    }


    // ============================================================
    // SHEET NOT FOUND
    // ============================================================

    if (!sheet) {

        return (
            <div className="not-found">
                Sheet not found
            </div>
        );

    }


    // ============================================================
    // OVERALL PROGRESS
    // ============================================================

    const overallPct =
        stats.total === 0
            ? 0
            : Math.round(
                stats.solved * 100 /
                stats.total
            );


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="sheet-details-page">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="sheet-header">

                <div className="sheet-info">

                    <h1>
                        {sheet.name}
                    </h1>

                    <p>
                        {sheet.description}
                    </p>

                    <div className="sheet-meta">

                        <span>
                            {sheet.problemCount}
                            {" "}
                            Problems
                        </span>

                        <span>
                            {sheet.category}
                        </span>

                        <span>
                            {sheet.level}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    PROGRESS CARD
                ================================================== */}

                <div className="progress-card">

                    <div className="progress-header">

                        <h3>
                            Progress
                        </h3>

                        <span className="progress-pct">
                            {overallPct}%
                        </span>

                    </div>


                    {/* Segmented progress bar */}

                    <div className="progress-bar-segmented">

                        {/* Easy */}

                        <div
                            className="seg easy"
                            style={{
                                width:
                                    stats.total
                                        ? `${stats.easy.total * 100 / stats.total}%`
                                        : "0%"
                            }}
                        >

                            <div
                                className="seg-fill"
                                style={{
                                    width:
                                        stats.easy.total
                                            ? `${stats.easy.solved * 100 / stats.easy.total}%`
                                            : "0%"
                                }}
                            />

                        </div>


                        {/* Medium */}

                        <div
                            className="seg medium"
                            style={{
                                width:
                                    stats.total
                                        ? `${stats.medium.total * 100 / stats.total}%`
                                        : "0%"
                            }}
                        >

                            <div
                                className="seg-fill"
                                style={{
                                    width:
                                        stats.medium.total
                                            ? `${stats.medium.solved * 100 / stats.medium.total}%`
                                            : "0%"
                                }}
                            />

                        </div>


                        {/* Hard */}

                        <div
                            className="seg hard"
                            style={{
                                width:
                                    stats.total
                                        ? `${stats.hard.total * 100 / stats.total}%`
                                        : "0%"
                            }}
                        >

                            <div
                                className="seg-fill"
                                style={{
                                    width:
                                        stats.hard.total
                                            ? `${stats.hard.solved * 100 / stats.hard.total}%`
                                            : "0%"
                                }}
                            />

                        </div>

                    </div>


                    {/* Difficulty counts */}

                    <div className="diff-counts">

                        <span className="diff-count easy">

                            <span className="dot" />

                            Easy&nbsp;

                            <strong>
                                {stats.easy.solved}/
                                {stats.easy.total}
                            </strong>

                        </span>


                        <span className="diff-count medium">

                            <span className="dot" />

                            Medium&nbsp;

                            <strong>
                                {stats.medium.solved}/
                                {stats.medium.total}
                            </strong>

                        </span>


                        <span className="diff-count hard">

                            <span className="dot" />

                            Hard&nbsp;

                            <strong>
                                {stats.hard.solved}/
                                {stats.hard.total}
                            </strong>

                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                SEARCH + FILTERS
            ====================================================== */}

            <div className="search-filter-bar">

                <div className="search-input-wrap">

                    <FiSearch
                        className="search-icon"
                    />

                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={
                            e =>
                                setSearch(
                                    e.target.value
                                )
                        }
                        className="search-input"
                    />

                </div>


                {/* Topic */}

                <select
                    className="filter-select"
                    value={topicFilter}
                    onChange={
                        e =>
                            setTopicFilter(
                                e.target.value
                            )
                    }
                >

                    {topicOptions.map(topic => (

                        <option
                            key={topic}
                            value={topic}
                        >

                            {
                                topic === "All"
                                    ? "All Topics"
                                    : topic
                            }

                        </option>

                    ))}

                </select>


                {/* Difficulty */}

                <select
                    className="filter-select"
                    value={diffFilter}
                    onChange={
                        e =>
                            setDiffFilter(
                                e.target.value
                            )
                    }
                >

                    <option value="All">
                        All Difficulties
                    </option>

                    <option value="Easy">
                        Easy
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="Hard">
                        Hard
                    </option>

                </select>

            </div>


            {/* =====================================================
                PROBLEM TABLE
            ====================================================== */}

            <div className="problem-section">

                <ProblemTable
                    problems={filtered}
                    onComplete={handleComplete}
                    onRevision={handleRevision}
                />

            </div>

        </div>

    );

}

export default SheetDetailsPage;