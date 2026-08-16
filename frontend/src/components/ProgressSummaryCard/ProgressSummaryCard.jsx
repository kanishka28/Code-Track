import { useEffect, useState } from "react";
import { getProgressSummary } from "../../services/progressService";
import "./ProgressSummaryCard.css";

function ProgressSummaryCard() {

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const load = async () => {
            try {
                const data = await getProgressSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to load progress summary:", error);
            } finally {
                setLoading(false);
            }
        };

        load();

    }, []);

    if (loading) {
        return <div className="progress-summary-card loading">Loading progress...</div>;
    }

    if (!summary) {
        return null;
    }

    return (
        <div className="progress-summary-card">
            <h3>Your Progress</h3>

            <div className="progress-summary-total">
                <span className="progress-summary-number">{summary.totalSolved}</span>
                <span className="progress-summary-label">problems solved</span>
            </div>

            <div className="progress-summary-breakdown">
                <div className="progress-summary-row">
                    <span>NeetCode 150 / Blind 75</span>
                    <strong>{summary.solvedByType?.NEETCODE ?? 0}</strong>
                </div>
                <div className="progress-summary-row">
                    <span>Striver A2Z</span>
                    <strong>{summary.solvedByType?.STRIVER ?? 0}</strong>
                </div>
                <div className="progress-summary-row">
                    <span>CSES</span>
                    <strong>{summary.solvedByType?.CSES ?? 0}</strong>
                </div>
            </div>

            <div className="progress-summary-revision">
                {summary.totalMarkedForRevision} marked for revision
            </div>
        </div>
    );
}

export default ProgressSummaryCard;