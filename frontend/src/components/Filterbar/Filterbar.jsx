import "./Filterbar.css";

function Filterbar({
    difficulty,
    setDifficulty,
    topic,
    setTopic
}) {
    return (
        <div className="filter-bar">

            <select
                value={difficulty}
                onChange={(e)=>setDifficulty(e.target.value)}
            >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>

            <select
                value={topic}
                onChange={(e)=>setTopic(e.target.value)}
            >
                <option value="All">All Topics</option>
                <option value="Arrays">Arrays</option>
                <option value="Graphs">Graphs</option>
                <option value="DP">DP</option>
                <option value="Trees">Trees</option>
            </select>

        </div>
    );
}

export default Filterbar;