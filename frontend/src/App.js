import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/Home/Home";
import CalendarPage from "./pages/Calendar/CalendarPage";
import SheetsPage from "./pages/CodingSheets/CodingSheetsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SheetDetailsPage from "./pages/SheetDetailsPage/SheetDetailsPage";
import ProblemDetailsPage from "./pages/ProblemDetailsPage/ProblemDetailsPage";
import AIVisualiserPage from "./pages/AIVisualiser/AIVisualiserPage";
import CSESPage from "./pages/csesSheet/csesSheet";

function App() {
    return (
        <AuthProvider>
            <ProgressProvider>
                <BrowserRouter>

                    <Routes>

                    {/* Public */}
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    {/* Protected */}
                    <Route
                        path="/"
                        element={<ProtectedRoute><Home /></ProtectedRoute>}
                    />

                    <Route
                        path="/calendar"
                        element={<ProtectedRoute><CalendarPage /></ProtectedRoute>}
                    />

                    <Route
                        path="/sheets"
                        element={<ProtectedRoute><SheetsPage /></ProtectedRoute>}
                    />

                    <Route
                        path="/ai-visualizer"
                        element={<ProtectedRoute><AIVisualiserPage /></ProtectedRoute>}
                    />

                    <Route
                        path="/profile"
                        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                    />

                    <Route
                        path="/sheet/:id"
                        element={<ProtectedRoute><SheetDetailsPage /></ProtectedRoute>}
                    />

                    <Route
                        path="/problem/:id"
                        element={<ProtectedRoute><ProblemDetailsPage /></ProtectedRoute>}
                    />

                    <Route
                        path="/cses"
                        element={<ProtectedRoute><CSESPage /></ProtectedRoute>}
                    />

                </Routes>

                </BrowserRouter>
            </ProgressProvider>
        </AuthProvider>
    );
}

export default App;