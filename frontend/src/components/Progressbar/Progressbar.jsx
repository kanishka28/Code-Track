import "./Progressbar.css";

function Progressbar({ solved, total }) {

    const percentage =
        total === 0
            ? 0
            : Math.round((solved / total) * 100);

    return (

        <div className="progress-container">

            <div className="progress-header">

                <div>

                    <h3 className="progress-title">
                        Overall Progress
                    </h3>

                    <p className="progress-message">
                        {percentage === 100
                            ? "🎉 Sheet Completed!"
                            : "Keep solving consistently 🚀"}
                    </p>

                </div>

                <div className="progress-right">

                    <span className="progress-count">
                        {solved} / {total}
                    </span>

                    <span className="progress-percent">
                        {percentage}%
                    </span>

                </div>

            </div>

            <div className="progress-track">

                <div
                    className="progress-fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

        </div>

    );

}

export default Progressbar;