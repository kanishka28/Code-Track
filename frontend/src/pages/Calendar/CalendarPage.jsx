import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import CalendarGrid from "../../components/CalendarGrid/CalendarGrid";
import ContestCard from "../../components/ContestCard/ContestCard";

import { getContests } from "../../services/contestService";

import "./CalendarPage.css";

const PLATFORMS = [
    "All",
    "Codeforces",
    "LeetCode",
    "AtCoder",
    "CodeChef",
    "HackerRank",
    "HackerEarth"
];

function CalendarPage() {

    const [currentDate, setCurrentDate] =
        useState(new Date());

    const [search, setSearch] =
        useState("");

    const [platformFilter, setPlatformFilter] =
        useState("All");

    const [contests, setContests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // ============================================================
    // FETCH CONTESTS WHEN MONTH CHANGES
    // ============================================================

    useEffect(() => {

        const year =
            moment(currentDate).year();

        const month =
            moment(currentDate).month() + 1;


        setLoading(true);
        setError(null);


        getContests(year, month)

            .then(res => {

                setContests(res.data);

            })

            .catch(err => {

                console.error(
                    "Failed to fetch contests:",
                    err
                );

                setError(
                    "Could not load contests. Is the backend running?"
                );

                setContests([]);

            })

            .finally(() => {

                setLoading(false);

            });


    }, [
        currentDate
    ]);


    // ============================================================
    // MONTH NAVIGATION
    // ============================================================

    const previousMonth = () => {

        setCurrentDate(
            moment(currentDate)
                .subtract(1, "month")
                .toDate()
        );

    };


    const nextMonth = () => {

        setCurrentDate(
            moment(currentDate)
                .add(1, "month")
                .toDate()
        );

    };


    // ============================================================
    // FILTER
    // ============================================================

    const filteredContests =
        useMemo(() => {

            return contests.filter(c => {

                const matchSearch =
                    search === "" ||
                    c.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    c.platform
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );


                const matchPlatform =
                    platformFilter === "All" ||
                    c.platform
                        .toLowerCase()
                        .includes(
                            platformFilter.toLowerCase()
                        );


                return (
                    matchSearch &&
                    matchPlatform
                );

            });

        }, [
            contests,
            search,
            platformFilter
        ]);


    // ============================================================
    // TODAY / TOMORROW
    // ============================================================

    const todayStr =
        moment().format("YYYY-MM-DD");

    const tomorrowStr =
        moment()
            .add(1, "day")
            .format("YYYY-MM-DD");


    const todayContests =
        filteredContests.filter(c =>
            moment(c.startTime)
                .format("YYYY-MM-DD")
            === todayStr
        );


    const tomorrowContests =
        filteredContests.filter(c =>
            moment(c.startTime)
                .format("YYYY-MM-DD")
            === tomorrowStr
        );


    const upcomingContests =
        filteredContests.filter(c =>
            moment(c.startTime)
                .format("YYYY-MM-DD")
            > tomorrowStr
        );


    return (

        <div className="home-container">

            <Sidebar />

            <div className="home-content">

                <Navbar />


                <main className="calendar-page">


                    {/* PAGE HEADER */}

                    <div className="page-header">

                        <h1>
                            Contest Calendar
                        </h1>

                        <p>
                            Explore coding contests
                            and never miss a challenge.
                        </p>

                    </div>


                    <div className="calendar-layout">


                        {/* ====================================================
                            LEFT SIDEBAR
                        ==================================================== */}

                        <div className="calendar-sidebar">


                            <div className="search-filter-row">

                                <input
                                    type="text"
                                    placeholder="Search contest..."
                                    value={search}
                                    onChange={e =>
                                        setSearch(e.target.value)
                                    }
                                />


                                <select
                                    value={platformFilter}
                                    onChange={e =>
                                        setPlatformFilter(
                                            e.target.value
                                        )
                                    }
                                    className="platform-filter"
                                >

                                    {PLATFORMS.map(platform => (

                                        <option
                                            key={platform}
                                            value={platform}
                                        >
                                            {platform}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* LOADING */}

                            {loading && (

                                <p className="empty-message">

                                    Loading contests...

                                </p>

                            )}


                            {/* ERROR */}

                            {error && (

                                <p className="error-message">

                                    {error}

                                </p>

                            )}


                            {!loading &&
                                !error && (

                                    <>

                                        {/* TODAY */}

                                        <div className="contest-section">

                                            <h3>
                                                Today
                                            </h3>

                                            {todayContests.length > 0

                                                ? todayContests.map(c => (

                                                    <ContestCard
                                                        key={c.id}
                                                        contest={c}
                                                    />

                                                ))

                                                : (

                                                    <p className="empty-message">
                                                        No contests today.
                                                    </p>

                                                )
                                            }

                                        </div>


                                        {/* TOMORROW */}

                                        <div className="contest-section">

                                            <h3>
                                                Tomorrow
                                            </h3>

                                            {tomorrowContests.length > 0

                                                ? tomorrowContests.map(c => (

                                                    <ContestCard
                                                        key={c.id}
                                                        contest={c}
                                                    />

                                                ))

                                                : (

                                                    <p className="empty-message">
                                                        No contests tomorrow.
                                                    </p>

                                                )
                                            }

                                        </div>


                                        {/* UPCOMING */}

                                        <div className="contest-section">

                                            <h3>
                                                Upcoming
                                            </h3>

                                            {upcomingContests.length > 0

                                                ? upcomingContests.map(c => (

                                                    <ContestCard
                                                        key={c.id}
                                                        contest={c}
                                                    />

                                                ))

                                                : (

                                                    <p className="empty-message">
                                                        No upcoming contests.
                                                    </p>

                                                )
                                            }

                                        </div>

                                    </>

                                )}

                        </div>


                        {/* ====================================================
                            CALENDAR
                        ==================================================== */}

                        <div className="calendar-container">


                            <div className="calendar-top">

                                <h2>
                                    {moment(currentDate)
                                        .format("MMMM YYYY")}
                                </h2>


                                <div className="calendar-nav">

                                    <button
                                        onClick={previousMonth}
                                        aria-label="Previous month"
                                    >
                                        <FaChevronLeft />
                                    </button>


                                    <button
                                        onClick={nextMonth}
                                        aria-label="Next month"
                                    >
                                        <FaChevronRight />
                                    </button>

                                </div>

                            </div>


                            <div className="calendar-grid-wrapper">

                                <CalendarGrid
                                    currentDate={currentDate}
                                    onNavigate={setCurrentDate}
                                    contests={filteredContests}
                                />

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );
}

export default CalendarPage;