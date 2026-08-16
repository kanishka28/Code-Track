import apiClient from "../api/apiClient";

// ============================================================
// GET ALL SHEETS
// ============================================================

export const getAllSheets = async () => {

    const response = await apiClient.get("/sheets");

    return response.data;
};


// ============================================================
// GET ONE SHEET METADATA
// ============================================================

export const getSheetById = async (sheetId) => {

    const sheets = await getAllSheets();

    const id = String(sheetId).trim();

    return sheets.find(
        sheet => String(sheet.id).trim() === id
    );
};


// ============================================================
// GET PROBLEMS FOR A SHEET
// ============================================================

export const getSheetProblems = async (sheetId) => {

    const id = String(sheetId).trim();


    // --------------------------------------------------------
    // STRIVER A2Z
    // --------------------------------------------------------

    if (id === "striver-a2z") {

        const response = await apiClient.get(
            "/sheets/striver-a2z/problems"
        );

        return response.data;
    }


    // --------------------------------------------------------
    // CSES
    // --------------------------------------------------------

    if (id === "cses") {

        const response = await apiClient.get(
            "/cses/problems"
        );

        return response.data;
    }


    // --------------------------------------------------------
    // EXISTING NEETCODE / BLIND 75
    // --------------------------------------------------------

    const response = await apiClient.get(
        `/sheets/${id}/problems`
    );

    return response.data;
};


// ============================================================
// GET CSES PROBLEMS DIRECTLY
// ============================================================
// This is useful if CSES has its own page.
// It does NOT affect the existing sheet logic.
// ============================================================

export const getCsesProblems = async () => {

    const response = await apiClient.get(
        "/cses/problems"
    );

    return response.data;
};


// ============================================================
// BACKWARD COMPATIBILITY
// ============================================================

export const getSheets = getAllSheets;