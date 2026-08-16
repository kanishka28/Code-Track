import "./DifficultyBadge.css";


function DifficultyBadge({ difficulty }) {


    return (

        <span
            className={`difficulty-badge ${difficulty.toLowerCase()}`}
        >

            {difficulty}

        </span>

    );

}


export default DifficultyBadge;