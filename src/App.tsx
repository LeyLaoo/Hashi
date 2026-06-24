import { Board } from "./components/Board";
import "./App.css";

function App() {
    return (
        <>
            <h1>Hashi</h1>
            <div className="board-container">
                <Board />
            </div>
        </>
    );
}

export default App;
