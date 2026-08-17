import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import CodingSheetCard from "../../components/CodingSheetCard/CodingSheetCard";

import { getAllSheets } from "../../services/sheetService";

import "./CodingSheetsPage.css";

function CodingSheetsPage() {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = [
        "All",
        "Beginner",
        "Interview",
        "Competitive Programming"
    ];


    // ============================================================
    // SHEET -> CATEGORY MAPPING
    // ============================================================
    // Matched by id/name rather than a backend "category" field,
    // since the backend sheets don't reliably carry one.
    //
    //   Beginner               -> Striver A2Z
    //   Interview               -> Blind 75, NeetCode 150
    //   Competitive Programming -> CSES
    //
    // Any sheet that doesn't match one of these (e.g. Love Babbar 450)
    // simply won't show under a specific filter, only under "All".
    // ============================================================

    const getSheetCategory = (sheet) => {

        const id = String(sheet.id || "").toLowerCase();
        const name = String(sheet.name || "").toLowerCase();

        if (id.includes("striver") || name.includes("striver")) {
            return "Beginner";
        }

        if (
            id.includes("blind") || name.includes("blind") ||
            id.includes("neetcode") || name.includes("neetcode")
        ) {
            return "Interview";
        }

        if (id.includes("cses") || name.includes("cses")) {
            return "Competitive Programming";
        }

        return null;

    };


    // ============================================================
    // LOAD SHEETS
    // ============================================================

    useEffect(() => {

        const loadSheets = async () => {

            try {

                const data = await getAllSheets();

                /*
                 * Keep all existing backend sheets exactly as they are.
                 *
                 * Add CSES only if it is not already returned
                 * by the backend.
                 */

                const existingCses =
                    data.find(
                        sheet =>
                            String(sheet.id).trim() === "cses"
                    );


                if (existingCses) {

                    // Backend already contains CSES
                    setSheets(data);

                } else {

                    // Add CSES without modifying existing sheets
                    setSheets([
                        ...data,

                        {
                            id: "cses",
                            name: "CSES Problem Set",
                            problemCount: 300,
                            category: "Competitive Programming",
                            level: "Advanced",
                            description:
                                "A comprehensive collection of competitive programming problems from the CSES Problem Set."
                        }
                    ]);

                }

            } catch (error) {

                console.error(
                    "Failed to load sheets",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadSheets();

    }, []);


    // ============================================================
    // SEARCH + FILTER
    // ============================================================

    const filteredSheets = sheets.filter((sheet) => {

        const sheetName =
            sheet.name || "";

        const matchesSearch =
            sheetName
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                );

        const matchesFilter =
            filter === "All" ||
            getSheetCategory(sheet) === filter;

        return (
            matchesSearch &&
            matchesFilter
        );

    });


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="home-container">

            <Sidebar />

            <div className="home-content">

                <Navbar />

                <main className="coding-sheets-page">


                    {/* ==================================================
                        PAGE HEADER
                    ================================================== */}

                    <div className="page-header">

                        <h1>
                            DSA & Competitive Programming Sheets
                        </h1>

                        <p>
                            Explore curated learning paths,
                            master Data Structures & Algorithms,
                            prepare for coding interviews,
                            and level up your competitive
                            programming skills.
                        </p>

                    </div>


                    {/* ==================================================
                        SEARCH + FILTERS
                    ================================================== */}

                    <div className="search-filter-container">

                        <div className="search-box">

                            <FaSearch />

                            <input
                                type="text"
                                placeholder="Search coding sheets..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <div className="filter-chips">

                            {filters.map((item) => (

                                <button
                                    key={item}
                                    className={
                                        filter === item
                                            ? "chip active-chip"
                                            : "chip"
                                    }
                                    onClick={() =>
                                        setFilter(item)
                                    }
                                >
                                    {item}
                                </button>

                            ))}

                        </div>

                    </div>


                    {/* ==================================================
                        SHEETS
                    ================================================== */}

                    {loading ? (

                        <div className="sheet-loading">
                            Loading sheets...
                        </div>

                    ) : (

                        <div className="sheet-grid">

                            {filteredSheets.map(
                                (sheet) => (

                                    <CodingSheetCard
                                        key={sheet.id}
                                        sheet={{
                                            ...sheet,

                                            // CodingSheetCard expects title
                                            title:
                                                sheet.title ||
                                                sheet.name,

                                            // Make sure CSES has the
                                            // correct problem count
                                            problems:
                                                sheet.problems ||
                                                sheet.problemCount
                                        }}
                                    />

                                )
                            )}

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}

export default CodingSheetsPage;