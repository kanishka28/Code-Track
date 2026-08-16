// import React, { useState, useEffect, useRef } from "react";
// import { FaRobot, FaTimes, FaUser } from "react-icons/fa";

// import BuddyActions from "./BuddyActions";
// import { askCodeTrackBuddy } from "../../services/aiService";

// import "./BuddyButton.css";

// function BuddyButton({ problem }) {

//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [question, setQuestion] = useState("");

//     const chatEndRef = useRef(null);


//     /* =========================================================
//        GET CURRENT PROBLEM DETAILS
//        ========================================================= */

//     const getProblemData = () => {

//         /*
//          * Problem name
//          */
//         const problemName =
//             problem?.problem ||
//             problem?.title ||
//             "";


//         /*
//          * IMPORTANT:
//          * Try all common field names where the actual
//          * problem statement might exist.
//          */
//         const problemStatement =
//             problem?.description ||
//             problem?.statement ||
//             problem?.problemStatement ||
//             problem?.content ||
//             problem?.question ||
//             "";


//         /*
//          * Difficulty
//          */
//         const difficulty =
//             problem?.difficulty ||
//             "";


//         /*
//          * Platform
//          */
//         const platform =
//             problem?.platform ||
//             problem?.source ||
//             problem?.platformName ||
//             "";


//         /*
//          * Problem URL
//          */
// const problemUrl =
//     problem?.link ||
//     problem?.url ||
//     problem?.problemUrl ||
//     problem?.solveUrl ||
//     "";

// console.log("========== URL DEBUG ==========");
// console.log("Full problem:", problem);
// console.log("link:", problem?.link);
// console.log("url:", problem?.url);
// console.log("problemUrl:", problem?.problemUrl);
// console.log("solveUrl:", problem?.solveUrl);
// console.log("FINAL URL:", problemUrl);
// console.log("===============================");

//         /*
//          * Student code
//          */
//         const code =
//             problem?.code ||
//             "";


//         /*
//          * IMPORTANT:
//          *
//          * If the actual problem statement exists,
//          * send it.
//          *
//          * Otherwise fall back to the problem name.
//          */
//         const problemText =
//             problemStatement.trim()
//                 ? problemStatement
//                 : problemName;


//         return {

//             problem: problemText,

//             problemName: problemName,

//             problemStatement: problemStatement,

//             difficulty: difficulty,

//             platform: platform,

//             problemUrl: problemUrl,

//             code: code

//         };
//     };


//     /* =========================================================
//        AUTO SCROLL
//        ========================================================= */

//     useEffect(() => {

//         if (messages.length > 0 || loading) {

//             chatEndRef.current?.scrollIntoView({
//                 behavior: "smooth"
//             });

//         }

//     }, [messages, loading]);


//     /* =========================================================
//        LOCK PAGE SCROLL
//        ========================================================= */

//     useEffect(() => {

//         if (isOpen) {

//             document.body.style.overflow = "hidden";

//         } else {

//             document.body.style.overflow = "";

//         }

//         return () => {
//             document.body.style.overflow = "";
//         };

//     }, [isOpen]);


//     /* =========================================================
//        OPEN
//        ========================================================= */

//     const openBuddy = () => {

//         setIsOpen(true);
//         setMessages([]);
//         setError(null);
//         setQuestion("");

//     };


//     /* =========================================================
//        CLOSE
//        ========================================================= */

//     const closeBuddy = () => {

//         setIsOpen(false);
//         setMessages([]);
//         setError(null);
//         setQuestion("");

//     };


//     /* =========================================================
//        ACTION LABELS
//        ========================================================= */

//     const actionLabels = {

//         EXPLAIN: "Explain this problem",

//         HINT: "Give me a hint",

//         DRY_RUN: "Show me a dry run",

//         COMPLEXITY: "Explain time & space complexity",

//         TEST_CASES: "Generate test cases",

//         EXPLAIN_CODE: "Explain my code",

//         SIMILAR: "Give me similar problems",

//         ASK: "Ask Buddy"

//     };


//     /* =========================================================
//        SEND ACTION
//        ========================================================= */

//     const handleAction = async (action) => {

//         if (loading) {
//             return;
//         }

//         setError(null);

//         const problemData = getProblemData();


//         /* =====================================================
//            MAKE SURE A PROBLEM EXISTS
//            ===================================================== */

//         if (!problemData.problemName.trim()) {

//             setError(
//                 "CodeTrack Buddy could not find the selected problem."
//             );

//             console.error(
//                 "Buddy error: Problem data is missing.",
//                 problem
//             );

//             return;
//         }


//         /* =====================================================
//            DEBUG PROBLEM DATA
//            ===================================================== */

//         console.log(
//             "========== BUDDY PROBLEM DATA =========="
//         );

//         console.log(
//             "Full problem object:",
//             problem
//         );

//         console.log(
//             "Problem name:",
//             problemData.problemName
//         );

//         console.log(
//             "Problem statement:",
//             problemData.problemStatement
//         );

//         console.log(
//             "Difficulty:",
//             problemData.difficulty
//         );

//         console.log(
//             "Platform:",
//             problemData.platform
//         );

//         console.log(
//             "Problem URL:",
//             problemData.problemUrl
//         );

//         console.log(
//             "========================================"
//         );


//         /* =====================================================
//            ADD USER ACTION
//            ===================================================== */

//         setMessages(previous => [

//             ...previous,

//             {
//                 role: "user",
//                 content:
//                     actionLabels[action] || action
//             }

//         ]);

//         setLoading(true);


//         try {

//             const requestBody = {

//                 action: action,

//                 /*
//                  * ACTUAL PROBLEM STATEMENT
//                  */
//                 problem: problemData.problem,

//                 difficulty: problemData.difficulty,

//                 platform: problemData.platform,

//                 problemUrl: problemData.problemUrl,

//                 code: problemData.code

//             };


//             console.log(
//                 "========== SENDING BUDDY REQUEST =========="
//             );

//             console.log(
//                 requestBody
//             );

//             console.log(
//                 "==========================================="
//             );


//             const response =
//                 await askCodeTrackBuddy(requestBody);


//             console.log(
//                 "Buddy response:",
//                 response
//             );


//             const aiText =
//                 response?.output ||
//                 response?.response ||
//                 response?.message ||
//                 response?.content;


//             if (!aiText) {

//                 throw new Error(
//                     "AI returned an empty response."
//                 );

//             }


//             /* =================================================
//                ADD AI RESPONSE
//                ================================================= */

//             setMessages(previous => [

//                 ...previous,

//                 {
//                     role: "assistant",
//                     content: aiText
//                 }

//             ]);

//         }

//         catch (err) {

//             console.error(
//                 "Buddy error:",
//                 err
//             );

//             setError(
//                 "Unable to get a response from CodeTrack Buddy."
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };


//     /* =========================================================
//        ASK CUSTOM QUESTION
//        ========================================================= */

//     const handleAskQuestion = async () => {

//         const trimmedQuestion =
//             question.trim();


//         if (!trimmedQuestion || loading) {
//             return;
//         }


//         const problemData = getProblemData();


//         /* =====================================================
//            MAKE SURE A PROBLEM EXISTS
//            ===================================================== */

//         if (!problemData.problemName.trim()) {

//             setError(
//                 "CodeTrack Buddy could not find the selected problem."
//             );

//             console.error(
//                 "Buddy error: Problem data is missing.",
//                 problem
//             );

//             return;
//         }


//         setQuestion("");
//         setError(null);


//         /* =====================================================
//            ADD USER QUESTION
//            ===================================================== */

//         setMessages(previous => [

//             ...previous,

//             {
//                 role: "user",
//                 content: trimmedQuestion
//             }

//         ]);

//         setLoading(true);


//         try {

//             const requestBody = {

//                 action: "ASK",

//                 problem: problemData.problem,

//                 difficulty: problemData.difficulty,

//                 platform: problemData.platform,

//                 problemUrl: problemData.problemUrl,

//                 code: problemData.code,

//                 question: trimmedQuestion

//             };


//             console.log(
//                 "Sending Buddy question:",
//                 requestBody
//             );


//             const response =
//                 await askCodeTrackBuddy(requestBody);


//             console.log(
//                 "Buddy response:",
//                 response
//             );


//             const aiText =
//                 response?.output ||
//                 response?.response ||
//                 response?.message ||
//                 response?.content;


//             if (!aiText) {

//                 throw new Error(
//                     "AI returned an empty response."
//                 );

//             }


//             setMessages(previous => [

//                 ...previous,

//                 {
//                     role: "assistant",
//                     content: aiText
//                 }

//             ]);

//         }

//         catch (err) {

//             console.error(
//                 "Buddy question error:",
//                 err
//             );

//             setError(
//                 "Unable to get a response from CodeTrack Buddy."
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };


//     /* =========================================================
//        ENTER KEY
//        ========================================================= */

//     const handleQuestionKeyDown = (event) => {

//         if (
//             event.key === "Enter" &&
//             !event.shiftKey
//         ) {

//             event.preventDefault();

//             handleAskQuestion();

//         }

//     };


//     /* =========================================================
//        RENDER
//        ========================================================= */

//     return (

//         <>

//             {/* =================================================
//                 FLOATING ROBOT BUTTON
//             ================================================= */}

//             <button
//                 className="buddy-button"
//                 onClick={openBuddy}
//                 title="Ask CodeTrack Buddy"
//                 aria-label="Ask CodeTrack Buddy"
//             >

//                 <FaRobot className="buddy-button-icon" />

//             </button>


//             {/* =================================================
//                 MODAL
//                 ================================================= */}

//             {isOpen && (

//                 <div className="buddy-overlay">

//                     <div className="buddy-modal">


//                         {/* =================================================
//                             HEADER
//                             ================================================= */}

//                         <div className="buddy-header">

//                             <div>

//                                 <div className="buddy-title">

//                                     <FaRobot />

//                                     <span>
//                                         CodeTrack Buddy
//                                     </span>

//                                 </div>


//                                 <div className="buddy-problem-name">

//                                     {problem?.problem ||
//                                         problem?.title ||
//                                         "Coding Problem"}

//                                 </div>


//                                 <div className="buddy-problem-meta">

//                                     {problem?.difficulty && (

//                                         <span>
//                                             {problem.difficulty}
//                                         </span>

//                                     )}


//                                     {(problem?.platform ||
//                                         problem?.source) && (

//                                         <span>
//                                             {problem?.platform ||
//                                                 problem?.source}
//                                         </span>

//                                     )}

//                                 </div>

//                             </div>


//                             <button
//                                 className="buddy-close"
//                                 onClick={closeBuddy}
//                                 aria-label="Close CodeTrack Buddy"
//                             >

//                                 <FaTimes />

//                             </button>

//                         </div>


//                         {/* =================================================
//                             CHAT AREA
//                             ================================================= */}

//                         <div className="buddy-chat">


//                             {/* =================================================
//                                 WELCOME MESSAGE
//                                 ================================================= */}

//                             {messages.length === 0 && (

//                                 <div className="buddy-welcome">

//                                     <div className="buddy-welcome-icon">

//                                         <FaRobot />

//                                     </div>


//                                     <div>

//                                         <h3>
//                                             Hi! I'm CodeTrack Buddy 👋
//                                         </h3>


//                                         <p>

//                                             I can help you understand{" "}

//                                             <strong>
//                                                 {problem?.problem ||
//                                                     problem?.title ||
//                                                     "this problem"}
//                                             </strong>

//                                             .

//                                         </p>


//                                         <p>
//                                             Choose an option below
//                                             to get started.
//                                         </p>

//                                     </div>

//                                 </div>

//                             )}


//                             {/* =================================================
//                                 CHAT MESSAGES
//                                 ================================================= */}

//                             {messages.map(
//                                 (message, index) => (

//                                     <div
//                                         key={index}
//                                         className={
//                                             message.role === "user"
//                                                 ? "buddy-message buddy-user-message"
//                                                 : "buddy-message buddy-ai-message"
//                                         }
//                                     >

//                                         <div className="buddy-message-icon">

//                                             {message.role === "user"

//                                                 ? <FaUser />

//                                                 : <FaRobot />

//                                             }

//                                         </div>


//                                         <div className="buddy-message-content">

//                                             <div className="buddy-message-name">

//                                                 {message.role === "user"

//                                                     ? "You"

//                                                     : "CodeTrack Buddy"

//                                                 }

//                                             </div>


//                                             <div className="buddy-message-text">

//                                                 {message.content}

//                                             </div>

//                                         </div>

//                                     </div>

//                                 )
//                             )}


//                             {/* =================================================
//                                 THINKING
//                                 ================================================= */}

//                             {loading && (

//                                 <div className="buddy-message buddy-ai-message">

//                                     <div className="buddy-message-icon">

//                                         <FaRobot />

//                                     </div>


//                                     <div className="buddy-message-content">

//                                         <div className="buddy-message-name">

//                                             CodeTrack Buddy

//                                         </div>


//                                         <div className="buddy-thinking">

//                                             <span></span>
//                                             <span></span>
//                                             <span></span>

//                                             <span className="buddy-thinking-text">

//                                                 Thinking...

//                                             </span>

//                                         </div>

//                                     </div>

//                                 </div>

//                             )}


//                             {/* =================================================
//                                 ERROR
//                                 ================================================= */}

//                             {error && (

//                                 <div className="buddy-error">

//                                     {error}

//                                 </div>

//                             )}


//                             {/* =================================================
//                                 8 ACTIONS
//                                 ================================================= */}

//                             {!loading && (

//                                 <div className="buddy-actions-area">

//                                     <div className="buddy-actions-title">

//                                         What would you like help with?

//                                     </div>


//                                     <BuddyActions
//                                         onAction={handleAction}
//                                     />

//                                 </div>

//                             )}


//                             <div ref={chatEndRef} />

//                         </div>


//                         {/* =================================================
//                             ASK INPUT
//                             ================================================= */}

//                         <div className="buddy-input-area">

//                             <textarea

//                                 value={question}

//                                 onChange={(event) =>
//                                     setQuestion(
//                                         event.target.value
//                                     )
//                                 }

//                                 onKeyDown={
//                                     handleQuestionKeyDown
//                                 }

//                                 placeholder="Ask CodeTrack Buddy anything about this problem..."

//                                 rows={1}

//                             />


//                             <button

//                                 onClick={
//                                     handleAskQuestion
//                                 }

//                                 disabled={
//                                     !question.trim() ||
//                                     loading
//                                 }

//                             >

//                                 Ask

//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </>

//     );

// }

// export default BuddyButton;

import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaUser } from "react-icons/fa";

import BuddyActions from "./BuddyActions";
import { askCodeTrackBuddy } from "../../services/aiService";

import "./BuddyButton.css";

function BuddyButton({ problem }) {

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /*
     * Used only when ASK or EXPLAIN_CODE is selected.
     */
    const [inputMode, setInputMode] = useState(null);

    const [question, setQuestion] = useState("");
    const [codeInput, setCodeInput] = useState("");

    const chatEndRef = useRef(null);


    /* =========================================================
       GET CURRENT PROBLEM DETAILS
    ========================================================= */

    const getProblemData = () => {

        const problemName =
            problem?.problem ||
            problem?.title ||
            "";

        const difficulty =
            problem?.difficulty ||
            null;

        const platform =
            problem?.platform ||
            null;

        const problemUrl =
            problem?.link ||
            problem?.url ||
            problem?.problemUrl ||
            problem?.solveUrl ||
            "";

        const code =
            problem?.code ||
            null;

        return {
            problem: problemName,
            difficulty: difficulty,
            platform: platform,
            problemUrl: problemUrl,
            code: code
        };
    };


    /* =========================================================
       AUTO SCROLL
    ========================================================= */

    useEffect(() => {

        if (messages.length > 0 || loading) {

            chatEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });

        }

    }, [messages, loading]);


    /* =========================================================
       LOCK PAGE SCROLL
    ========================================================= */

    useEffect(() => {

        if (isOpen) {

            document.body.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "";

        }

        return () => {
            document.body.style.overflow = "";
        };

    }, [isOpen]);


    /* =========================================================
       OPEN BUDDY
    ========================================================= */

    const openBuddy = () => {

        setIsOpen(true);
        setMessages([]);
        setError(null);

        setInputMode(null);

        setQuestion("");
        setCodeInput("");

    };


    /* =========================================================
       CLOSE BUDDY
    ========================================================= */

    const closeBuddy = () => {

        setIsOpen(false);
        setMessages([]);
        setError(null);

        setInputMode(null);

        setQuestion("");
        setCodeInput("");

    };


    /* =========================================================
       ACTION LABELS
    ========================================================= */

    const actionLabels = {

        EXPLAIN: "Explain this problem",

        HINT: "Give me a hint",

        DRY_RUN: "Show me a dry run",

        COMPLEXITY: "Explain time & space complexity",

        TEST_CASES: "Generate test cases",

        EXPLAIN_CODE: "Explain my code",

        SIMILAR: "Give me similar problems",

        ASK: "Ask Buddy"

    };


    /* =========================================================
       SEND NORMAL ACTION
    ========================================================= */

    const handleAction = async (action) => {

        if (loading) {
            return;
        }


        /*
         * =====================================================
         * ASK BUDDY
         *
         * Do NOT send request immediately.
         * Open the question input instead.
         * =====================================================
         */

        if (action === "ASK") {

            setError(null);

            setInputMode("ASK");

            setQuestion("");

            setCodeInput("");

            return;
        }


        /*
         * =====================================================
         * EXPLAIN MY CODE
         *
         * Do NOT send request immediately.
         * Open code input instead.
         * =====================================================
         */

        if (action === "EXPLAIN_CODE") {

            setError(null);

            setInputMode("EXPLAIN_CODE");

            setQuestion("");

            setCodeInput("");

            return;
        }


        /*
         * =====================================================
         * NORMAL ACTIONS
         * =====================================================
         */

        setError(null);

        const problemData =
            getProblemData();


        console.log(
            "========== BUDDY PROBLEM DATA =========="
        );

        console.log(
            "Full problem object:",
            problem
        );

        console.log(
            "Problem name:",
            problemData.problem
        );

        console.log(
            "Difficulty:",
            problemData.difficulty
        );

        console.log(
            "Platform:",
            problemData.platform
        );

        console.log(
            "Problem URL:",
            problemData.problemUrl
        );

        console.log(
            "========================================"
        );


        /*
         * =====================================================
         * MAKE SURE PROBLEM EXISTS
         * =====================================================
         */

        if (!problemData.problem.trim()) {

            setError(
                "CodeTrack Buddy could not find the selected problem."
            );

            console.error(
                "Buddy error: Problem data is missing.",
                problem
            );

            return;
        }


        /*
         * =====================================================
         * ADD USER ACTION TO CHAT
         * =====================================================
         */

        setMessages(previous => [

            ...previous,

            {
                role: "user",
                content:
                    actionLabels[action] || action
            }

        ]);

        setLoading(true);


        try {

            const requestBody = {

                action: action,

                problem:
                    problemData.problem,

                difficulty:
                    problemData.difficulty,

                platform:
                    problemData.platform,

                problemUrl:
                    problemData.problemUrl,

                code:
                    problemData.code

            };


            console.log(
                "========== SENDING BUDDY REQUEST =========="
            );

            console.log(
                requestBody
            );

            console.log(
                "==========================================="
            );


            const response =
                await askCodeTrackBuddy(
                    requestBody
                );


            console.log(
                "Buddy response:",
                response
            );


            const aiText =
                response?.output ||
                response?.response ||
                response?.message ||
                response?.content;


            if (!aiText) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            /*
             * =================================================
             * ADD AI RESPONSE
             * =================================================
             */

            setMessages(previous => [

                ...previous,

                {
                    role: "assistant",
                    content: aiText
                }

            ]);

        }

        catch (err) {

            console.error(
                "Buddy error:",
                err
            );

            setError(
                "Unable to get a response from CodeTrack Buddy."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================================
       SEND CUSTOM QUESTION
    ========================================================= */

    const handleAskQuestion = async () => {

        const trimmedQuestion =
            question.trim();


        if (!trimmedQuestion || loading) {
            return;
        }


        const problemData =
            getProblemData();


        if (!problemData.problem.trim()) {

            setError(
                "CodeTrack Buddy could not find the selected problem."
            );

            return;
        }


        setError(null);


        /*
         * Add question to chat.
         */

        setMessages(previous => [

            ...previous,

            {
                role: "user",
                content: trimmedQuestion
            }

        ]);


        /*
         * Clear input.
         */

        setQuestion("");

        setInputMode(null);

        setLoading(true);


        try {

            const requestBody = {

                action: "ASK",

                problem:
                    problemData.problem,

                difficulty:
                    problemData.difficulty,

                platform:
                    problemData.platform,

                problemUrl:
                    problemData.problemUrl,

                code:
                    problemData.code,

                question:
                    trimmedQuestion

            };


            console.log(
                "========== SENDING BUDDY QUESTION =========="
            );

            console.log(
                requestBody
            );

            console.log(
                "============================================"
            );


            const response =
                await askCodeTrackBuddy(
                    requestBody
                );


            console.log(
                "Buddy response:",
                response
            );


            const aiText =
                response?.output ||
                response?.response ||
                response?.message ||
                response?.content;


            if (!aiText) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            setMessages(previous => [

                ...previous,

                {
                    role: "assistant",
                    content: aiText
                }

            ]);

        }

        catch (err) {

            console.error(
                "Buddy question error:",
                err
            );

            setError(
                "Unable to get a response from CodeTrack Buddy."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================================
       SEND CODE FOR EXPLANATION
    ========================================================= */

    const handleExplainCode = async () => {

        const trimmedCode =
            codeInput.trim();


        if (!trimmedCode || loading) {
            return;
        }


        const problemData =
            getProblemData();


        if (!problemData.problem.trim()) {

            setError(
                "CodeTrack Buddy could not find the selected problem."
            );

            return;
        }


        setError(null);


        /*
         * =====================================================
         * ADD USER MESSAGE
         * =====================================================
         *
         * We don't display the entire code as the message.
         * This keeps the chat UI clean.
         */

        setMessages(previous => [

            ...previous,

            {
                role: "user",
                content: "Explain my code"
            }

        ]);


        /*
         * Clear input and close input mode.
         */

        setCodeInput("");

        setInputMode(null);

        setLoading(true);


        try {

            const requestBody = {

                action: "EXPLAIN_CODE",

                problem:
                    problemData.problem,

                difficulty:
                    problemData.difficulty,

                platform:
                    problemData.platform,

                problemUrl:
                    problemData.problemUrl,

                code:
                    trimmedCode

            };


            console.log(
                "========== SENDING CODE TO BUDDY =========="
            );

            console.log(
                requestBody
            );

            console.log(
                "==========================================="
            );


            const response =
                await askCodeTrackBuddy(
                    requestBody
                );


            console.log(
                "Buddy response:",
                response
            );


            const aiText =
                response?.output ||
                response?.response ||
                response?.message ||
                response?.content;


            if (!aiText) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            setMessages(previous => [

                ...previous,

                {
                    role: "assistant",
                    content: aiText
                }

            ]);

        }

        catch (err) {

            console.error(
                "Buddy code explanation error:",
                err
            );

            setError(
                "Unable to get a response from CodeTrack Buddy."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================================
       QUESTION ENTER KEY
       ========================================================= */

    const handleQuestionKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleAskQuestion();

        }

    };


    /* =========================================================
       CODE INPUT KEYBOARD
       ========================================================= */

    const handleCodeKeyDown = (event) => {

        /*
         * Ctrl + Enter / Cmd + Enter
         * sends the code.
         *
         * Normal Enter creates a new line.
         */

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {

            event.preventDefault();

            handleExplainCode();

        }

    };


    /* =========================================================
       CANCEL INPUT MODE
    ========================================================= */

    const cancelInput = () => {

        setInputMode(null);

        setQuestion("");

        setCodeInput("");

        setError(null);

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <>

            {/* =================================================
                FLOATING ROBOT BUTTON
            ================================================= */}

            <button
                className="buddy-button"
                onClick={openBuddy}
                title="Ask CodeTrack Buddy"
                aria-label="Ask CodeTrack Buddy"
            >

                <FaRobot className="buddy-button-icon" />

            </button>


            {/* =================================================
                MODAL
            ================================================= */}

            {isOpen && (

                <div className="buddy-overlay">

                    <div className="buddy-modal">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="buddy-header">

                            <div>

                                <div className="buddy-title">

                                    <FaRobot />

                                    <span>
                                        CodeTrack Buddy
                                    </span>

                                </div>


                                <div className="buddy-problem-name">

                                    {problem?.problem ||
                                        problem?.title ||
                                        "Coding Problem"}

                                </div>


                                <div className="buddy-problem-meta">

                                    {problem?.difficulty && (

                                        <span>
                                            {problem.difficulty}
                                        </span>

                                    )}

                                    {problem?.platform && (

                                        <span>
                                            {problem.platform}
                                        </span>

                                    )}

                                </div>

                            </div>


                            <button
                                className="buddy-close"
                                onClick={closeBuddy}
                                aria-label="Close CodeTrack Buddy"
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* =================================================
                            CHAT AREA
                        ================================================= */}

                        <div className="buddy-chat">


                            {/* =================================================
                                WELCOME MESSAGE
                            ================================================= */}

                            {messages.length === 0 && !inputMode && (

                                <div className="buddy-welcome">

                                    <div className="buddy-welcome-icon">

                                        <FaRobot />

                                    </div>


                                    <div>

                                        <h3>
                                            Hi! I'm CodeTrack Buddy 👋
                                        </h3>


                                        <p>

                                            I can help you understand{" "}

                                            <strong>

                                                {problem?.problem ||
                                                    problem?.title ||
                                                    "this problem"}

                                            </strong>

                                            .

                                        </p>


                                        <p>
                                            Choose an option below
                                            to get started.
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                CHAT MESSAGES
                            ================================================= */}

                            {messages.map(
                                (message, index) => (

                                    <div
                                        key={index}
                                        className={
                                            message.role === "user"
                                                ? "buddy-message buddy-user-message"
                                                : "buddy-message buddy-ai-message"
                                        }
                                    >

                                        <div className="buddy-message-icon">

                                            {message.role === "user"

                                                ? <FaUser />

                                                : <FaRobot />

                                            }

                                        </div>


                                        <div className="buddy-message-content">

                                            <div className="buddy-message-name">

                                                {message.role === "user"

                                                    ? "You"

                                                    : "CodeTrack Buddy"

                                                }

                                            </div>


                                            <div className="buddy-message-text">

                                                {message.content}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}


                            {/* =================================================
                                ASK BUDDY INPUT
                            ================================================= */}

                            {inputMode === "ASK" && !loading && (

                                <div className="buddy-inline-input">

                                    <div className="buddy-actions-title">

                                        Ask CodeTrack Buddy anything about
                                        this problem

                                    </div>


                                    <textarea

                                        value={question}

                                        onChange={(event) =>
                                            setQuestion(
                                                event.target.value
                                            )
                                        }

                                        onKeyDown={
                                            handleQuestionKeyDown
                                        }

                                        placeholder="Ask anything about this problem..."

                                        rows={3}

                                        autoFocus

                                    />


                                    <div className="buddy-inline-input-buttons">

                                        <button
                                            type="button"
                                            onClick={cancelInput}
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="button"
                                            onClick={handleAskQuestion}
                                            disabled={!question.trim()}
                                        >
                                            Ask Buddy
                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                EXPLAIN CODE INPUT
                            ================================================= */}

                            {inputMode === "EXPLAIN_CODE" && !loading && (

                                <div className="buddy-inline-input">

                                    <div className="buddy-actions-title">

                                        Paste your code below

                                    </div>


                                    <textarea

                                        value={codeInput}

                                        onChange={(event) =>
                                            setCodeInput(
                                                event.target.value
                                            )
                                        }

                                        onKeyDown={
                                            handleCodeKeyDown
                                        }

                                        placeholder="Paste your code here..."

                                        rows={10}

                                        autoFocus

                                    />


                                    <div className="buddy-code-hint">

                                        Press Ctrl + Enter to explain your
                                        code

                                    </div>


                                    <div className="buddy-inline-input-buttons">

                                        <button
                                            type="button"
                                            onClick={cancelInput}
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="button"
                                            onClick={handleExplainCode}
                                            disabled={!codeInput.trim()}
                                        >
                                            Explain Code
                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                LOADING
                            ================================================= */}

                            {loading && (

                                <div className="buddy-message buddy-ai-message">

                                    <div className="buddy-message-icon">

                                        <FaRobot />

                                    </div>


                                    <div className="buddy-message-content">

                                        <div className="buddy-message-name">
                                            CodeTrack Buddy
                                        </div>


                                        <div className="buddy-message-text">

                                            Thinking...

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (

                                <div className="buddy-error">

                                    {error}

                                </div>

                            )}


                            {/* =================================================
                                8 ACTIONS
                            ================================================= */}

                            {!loading && !inputMode && (

                                <div className="buddy-actions-area">

                                    <div className="buddy-actions-title">

                                        What would you like help with?

                                    </div>


                                    <BuddyActions
                                        onAction={handleAction}
                                    />

                                </div>

                            )}


                            {/* =================================================
                                SCROLL ANCHOR
                            ================================================= */}

                            <div ref={chatEndRef} />

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}

export default BuddyButton;