
import { Link } from "react-router-dom";
import "./WinnerPopUp.css";

type WinnerPopUpProps = {
    onConfirm: () => void;
};

export function WinnerPopUp({ onConfirm }: WinnerPopUpProps) {
    return (
        <div className="winner-popup">
            <div className="winner-content">
                <h2>Yaaay, du hast es geschafft!</h2>
                <Link to ="/winner">Deine Belohnung</Link>
                <button className="winner-ok" onClick={onConfirm}>
                    Wooo
                </button>
            </div>
        </div>
    );
}
export default WinnerPopUp;
