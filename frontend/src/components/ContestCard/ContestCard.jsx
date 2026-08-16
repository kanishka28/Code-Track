import moment from "moment";
import "./ContestCard.css";

// Platform → accent color
const PLATFORM_COLORS = {
    codeforces:  "#1a8fff",
    leetcode:    "#f59e0b",
    atcoder:     "#10b981",
    codechef:    "#8b5cf6",
    hackerrank:  "#22c55e",
    hackerearth: "#3b82f6",
};

function getPlatformColor(platform = "") {
    const key = platform.toLowerCase().replace(/\s+/g, "");
    return PLATFORM_COLORS[key] || "#2563eb";
}

function formatDuration(seconds) {
    if (!seconds) return "";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

function ContestCard({ contest }) {

    const color    = getPlatformColor(contest.platform);
    const start    = moment(contest.startTime);
    const timeStr  = start.local().format("ddd, MMM D · HH:mm");
    const duration = formatDuration(contest.durationSeconds);

    return (

        <a
            href={contest.url}
            target="_blank"
            rel="noreferrer"
            className="contest-card"
            style={{ borderLeft: `3px solid ${color}` }}
        >

            <div className="platform" style={{ background: color }}>
                {contest.platform}
            </div>

            <h4>{contest.title}</h4>

            <p>{timeStr}</p>

            {duration && <span>⏱ {duration}</span>}

        </a>

    );

}

export default ContestCard;