const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const askCodeTrackBuddy = async ({
    problem = "",
    action = "",
    difficulty = "",
    platform = "",
    problemUrl = "",
    code = "",
    question = "",
}) => {

    const requestBody = {
        action,
        problem,
        difficulty,
        platform,
        problemUrl,
        code,
        question,
    };


    console.log(
        "========== SENDING AI REQUEST =========="
    );

    console.log(requestBody);

    console.log(
        "========================================="
    );


    try {

        const response = await fetch(
            `${API_BASE}/api/ai/assist`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(requestBody),
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "AI backend error:",
                response.status,
                errorText
            );

            throw new Error(
                errorText ||
                "Failed to get response from CodeTrack Buddy."
            );
        }


        const data =
            await response.json();


        console.log(
            "========== AI RESPONSE =========="
        );

        console.log(data);

        console.log(
            "================================="
        );


        return data;


    } catch (error) {

        console.error(
            "CodeTrack Buddy request failed:",
            error
        );

        throw error;
    }
};