import "./ConnectionPopUp.css";
type ConnectionPopUpProps = {
    onConfirm: () => void;
};

export function ConnectionPopUp({ onConfirm }: ConnectionPopUpProps) {
    return (
        <div>
            <div className="connection-popup">
                <div className="connection-content">
                    <h2>Alle Inseln müssen untereinander verbunden sein!</h2>
                    <button className="winner-ok" onClick={onConfirm}>
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ConnectionPopUp;
