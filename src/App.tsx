import { Board } from "./components/Game/Board";
import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import WinnerPage from "./components/WinnerPage/WinnerPage";

const width = 15;
const height = 15;
let maxCellSize = 60;

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <h1>Hashi</h1>
                            <div className="board-container">
                                <Board maxCellSize={maxCellSize} width={width} height={height} />
                            </div>
                        </>
                    }
                />
                <Route path="/winner" element={<WinnerPage />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
