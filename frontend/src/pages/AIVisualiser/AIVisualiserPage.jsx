import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

import { askCodeTrackBuddy } from "../../services/aiService";

import "./AIVisualiserPage.css";

function AIVisualiserPage() {

    const options = [
        "Step-by-Step Explanation",
        "Dry Run",
        "Hints",
        "Time Complexity",
        "Generate Test Cases",
        "Ask Question"
    ];

    const actionMap = {
        "Step-by-Step Explanation": "EXPLAIN",
        "Dry Run": "DRY_RUN",
        "Hints": "HINT",
        "Time Complexity": "COMPLEXITY",
        "Generate Test Cases": "TEST_CASES"
    };

    const [problem, setProblem] = useState("");

    const [selectedOptions, setSelectedOptions] =
        useState([]);

    const [messages, setMessages] =
        useState([]);

    const [chatInput, setChatInput] =
        useState("");

    const [showChat, setShowChat] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    /*
     * =====================================================
     * TOGGLE ANALYSIS OPTION
     * =====================================================
     */

    const toggleOption = (option) => {

        /*
         * Ask Question simply opens the chat.
         * It is not part of Analyze Problem.
         */
        if (option === "Ask Question") {

            setShowChat(true);

            return;
        }


        if (selectedOptions.includes(option)) {

            setSelectedOptions(
                selectedOptions.filter(
                    item => item !== option
                )
            );

        } else {

            setSelectedOptions([
                ...selectedOptions,
                option
            ]);
        }
    };


    /*
     * =====================================================
     * ANALYZE PROBLEM
     * =====================================================
     */

    const handleAnalyze = async () => {

        if (!problem.trim()) {

            alert(
                "Please paste the problem statement first."
            );

            return;
        }


        if (selectedOptions.length === 0) {

            alert(
                "Please select at least one analysis option."
            );

            return;
        }


        setLoading(true);


        /*
         * Keep the selected options before
         * eventually resetting the checkboxes.
         */
        const analysisOptions =
            selectedOptions.filter(
                option => option !== "Ask Question"
            );


        /*
         * Clear previous chat before
         * starting a new analysis.
         */
        setMessages([]);


        try {

            /*
             * If only Ask Question was selected,
             * simply open the chat.
             */
            if (analysisOptions.length === 0) {

                setShowChat(true);

                /*
                 * Reset the checkbox.
                 */
                setSelectedOptions([]);

                return;
            }


            /*
             * =================================================
             * SEND ALL SELECTED ANALYSIS REQUESTS
             * =================================================
             *
             * Every selected option is sent separately.
             */

            const results = await Promise.all(

                analysisOptions.map(
                    async (option) => {

                        const action =
                            actionMap[option];


                        const response =
                            await askCodeTrackBuddy({

                                problem: problem,

                                action: action,

                                difficulty: "",

                                platform: "",

                                problemUrl: "",

                                code: "",

                                question: ""
                            });


                        return {

                            option: option,

                            answer:
                                response?.response ||
                                response?.message ||
                                "No response received."

                        };

                    }
                )

            );


            /*
             * =================================================
             * BUILD CHAT MESSAGES
             * =================================================
             *
             * For every selected option:
             *
             * You:
             * [Selected option]
             *
             * CodeTrack Buddy:
             * [AI answer]
             */

            const newMessages = [];


            results.forEach(
                (result) => {

                    /*
                     * USER QUESTION
                     */

                    newMessages.push({

                        type: "user",

                        text: result.option

                    });


                    /*
                     * AI ANSWER
                     */

                    newMessages.push({

                        type: "ai",

                        text: result.answer

                    });

                }
            );


            /*
             * Display all selected analyses.
             */
            setMessages(newMessages);


            /*
             * Open the chat input so the user
             * can continue asking questions.
             */
            setShowChat(true);


            /*
             * =================================================
             * RESET CHECKBOXES
             * =================================================
             *
             * This happens AFTER all selected analyses
             * have successfully returned.
             */
            setSelectedOptions([]);


        } catch (error) {

            console.error(
                "AI analysis failed:",
                error
            );


            setMessages([

                {
                    type: "ai",

                    text:
                        "Sorry, CodeTrack Buddy could not generate the analysis."
                }

            ]);


            setShowChat(true);


        } finally {

            setLoading(false);

        }
    };


    /*
     * =====================================================
     * CONTINUE CHAT
     * =====================================================
     */

    const handleSendMessage = async () => {

        if (!chatInput.trim()) {

            return;
        }


        if (!problem.trim()) {

            alert(
                "Please paste the problem statement first."
            );

            return;
        }


        const question =
            chatInput.trim();


        /*
         * Show user's message immediately.
         */

        setMessages(prev => [

            ...prev,

            {
                type: "user",

                text: question
            }

        ]);


        setChatInput("");


        try {

            const response =
                await askCodeTrackBuddy({

                    problem: problem,

                    action: "ASK",

                    difficulty: "",

                    platform: "",

                    problemUrl: "",

                    code: "",

                    question: question
                });


            /*
             * Add AI response to existing conversation.
             */

            setMessages(prev => [

                ...prev,

                {
                    type: "ai",

                    text:
                        response?.response ||
                        response?.message ||
                        "No response received."
                }

            ]);

        } catch (error) {

            console.error(
                "Chat request failed:",
                error
            );


            setMessages(prev => [

                ...prev,

                {
                    type: "ai",

                    text:
                        "Sorry, I couldn't answer that question."
                }

            ]);
        }
    };


    /*
     * =====================================================
     * ENTER KEY
     * =====================================================
     */

    const handleChatKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSendMessage();
        }
    };


    return (

        <div className="home-container">

            <Sidebar />

            <div className="home-content">

                <Navbar />

                <main className="ai-page">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="ai-header">

                        <h1>
                            AI Assistant
                        </h1>

                        <p>
                            Paste a coding problem and let AI help
                            you understand it.
                        </p>

                    </div>


                    <div className="ai-layout">


                        {/* =================================================
                            LEFT PANEL
                        ================================================= */}

                        <div className="ai-sidebar">

                            <label>
                                Problem Statement
                            </label>


                            <textarea
                                className="problem-input"
                                value={problem}
                                onChange={(e) =>
                                    setProblem(e.target.value)
                                }
                                placeholder="Paste the coding problem statement here..."
                            />


                            <h3>
                                Choose Analysis
                            </h3>


                            <div className="option-list">

                                {options.map(option => (

                                    <div
                                        key={option}
                                        className="option-item"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedOptions.includes(
                                                    option
                                                )
                                            }
                                            onChange={() =>
                                                toggleOption(option)
                                            }
                                        />


                                        <span>
                                            {option}
                                        </span>

                                    </div>

                                ))}

                            </div>


                            <button
    className={`analyze-btn ${
        problem.trim() &&
        selectedOptions.some(option => option !== "Ask Question") &&
        !loading
            ? "analyze-btn-enabled"
            : ""
    }`}
    onClick={handleAnalyze}
    disabled={loading}
>
    {loading ? "Analyzing..." : "Analyze Problem"}
</button>

                        </div>


                        {/* =================================================
                            RIGHT CHAT PANEL
                        ================================================= */}

                        <div className="ai-output">


                            <div className="output-header">

                                AI Assistant

                            </div>


                            {/* =================================================
                                CHAT MESSAGES
                            ================================================= */}

                            <div className="output-body">

                                {messages.length === 0 ? (

                                    <div className="placeholder">

                                        <div className="placeholder-icon">
                                            🚀
                                        </div>


                                        <h2>
                                            Ready to Analyze
                                        </h2>


                                        <p>
                                            Paste a problem statement,
                                            select one or more analysis
                                            options and click
                                            <strong>
                                                {" "}Analyze Problem
                                            </strong>.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="chat-messages">

                                        {messages.map(
                                            (message, index) => (

                                                <div
                                                    key={index}
                                                    className={
                                                        message.type === "user"
                                                            ? "chat-message user-message"
                                                            : "chat-message ai-message"
                                                    }
                                                >

                                                    <div className="message-label">

                                                        {message.type === "user"
                                                            ? "You"
                                                            : "CodeTrack Buddy"
                                                        }

                                                    </div>


                                                    <div className="message-content">

                                                        {message.text}

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                CHAT INPUT
                                Appears after analysis or Ask Question.
                            ================================================= */}

                            {showChat && (

                                <div className="chat-input-area">

                                    <textarea
                                        value={chatInput}
                                        onChange={(e) =>
                                            setChatInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleChatKeyDown
                                        }
                                        placeholder="Ask anything about this problem..."
                                        className="chat-input"
                                        rows={3}
                                    />


                                    <button
                                        className="chat-send-btn"
                                        onClick={
                                            handleSendMessage
                                        }
                                        disabled={
                                            !chatInput.trim()
                                        }
                                    >

                                        Send

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}

export default AIVisualiserPage;