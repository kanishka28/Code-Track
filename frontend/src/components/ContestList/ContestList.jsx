import React from "react";

import ContestCard from "../ContestCard/ContestCard";

import contests from "../../data/contests.json";


function ContestList(){


    return (

        <div className="contest-list">


            {
                contests.map(
                    contest => (

                        <ContestCard
                            key={contest.id}
                            contest={contest}
                        />

                    )
                )
            }


        </div>

    )

}


export default ContestList;