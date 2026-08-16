import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarGrid.css";

const localizer = momentLocalizer(moment);

// Platform colors
const PLATFORM_COLORS = {
    codeforces: "#1a8fff",
    leetcode: "#f59e0b",
    atcoder: "#10b981",
    codechef: "#8b5cf6",
    hackerrank: "#22c55e",
    hackerearth: "#3b82f6",
};

function getPlatformColor(platform = "") {
    const key = platform
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(".com", "")
        .replace(".org", "")
        .replace(".io", "");

    return PLATFORM_COLORS[key] || "#2563eb";
}

function CalendarGrid({
    currentDate,
    onNavigate,
    contests = [],
}) {

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT use the actual contest endTime
     * for the calendar event.
     *
     * If a contest lasts 5 days / 1 week, React Big Calendar
     * normally stretches it across all those dates.
     *
     * We want:
     *
     *         Contest starts on Aug 13
     *                  ↓
     *         Show it ONLY on Aug 13
     *
     * The actual endTime is still preserved inside `resource`
     * and can be used by ContestCard / details.
     */

    const events = contests.map((contest) => {

        const start = new Date(contest.startTime);

        /*
         * Make the event extremely short.
         *
         * This prevents React Big Calendar from treating the
         * contest as a multi-day event.
         */
        const end = new Date(start.getTime() + 60 * 1000);

        return {
            id: contest.id,

            title: contest.title,

            start: start,

            end: end,

            /*
             * Force this to behave as a single-day calendar item.
             */
            allDay: true,

            /*
             * Keep the complete backend object available.
             * Therefore actual endTime is NOT lost.
             */
            resource: contest,
        };
    });


    // ------------------------------------------------------------
    // EVENT COLORS
    // ------------------------------------------------------------

    const eventPropGetter = (event) => {

        const color = getPlatformColor(
            event.resource?.platform
        );

        return {
            style: {
                backgroundColor: color,

                border: `1px solid ${color}`,

                color: "#ffffff",

                borderRadius: "999px",

                fontSize: "11px",

                fontWeight: "600",

                padding: "2px 8px",

                lineHeight: "18px",

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",

                cursor: "pointer",

                boxSizing: "border-box",
            },
        };
    };


    // ------------------------------------------------------------
    // EVENT CLICK
    // ------------------------------------------------------------

    const handleEventClick = (event) => {

        if (event.resource?.url) {

            window.open(
                event.resource.url,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };


    return (

        <div className="calendar-grid-wrapper">

            <Calendar

                localizer={localizer}

                events={events}

                date={currentDate}

                onNavigate={onNavigate}

                startAccessor="start"

                endAccessor="end"

                defaultView="month"

                views={["month"]}

                toolbar={false}

                /*
                 * Don't use popup.
                 *
                 * We want the calendar itself to show the
                 * contest names clearly.
                 */
                popup={false}

                /*
                 * Allows multiple contests to appear inside
                 * the same date instead of combining them.
                 */
                eventPropGetter={eventPropGetter}

                onSelectEvent={handleEventClick}

                /*
                 * Show more contests when a date has many.
                 * Clicking "+X more" will display the remaining
                 * contests for that date.
                 */
                components={{
                    event: ({ event }) => (
                        <div
                            className="calendar-contest-event"
                            title={event.title}
                        >
                            {event.title}
                        </div>
                    ),
                }}

                /*
                 * Give the calendar enough vertical space.
                 * CSS controls the actual scrolling.
                 */
                style={{
                    height: "100%",
                    width: "100%",
                }}
            />

        </div>
    );
}

export default CalendarGrid;