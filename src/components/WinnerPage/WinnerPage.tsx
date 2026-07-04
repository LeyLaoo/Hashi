import { useLayoutEffect, useRef, useState } from "react";
import Bouquet from "./Bouquet";
import { messages } from "./Texts";
import "./WinnerPage.css";
import { Link } from "react-router-dom";

export function WinnerPage() {
    const bouquetRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    useLayoutEffect(() => {
        const bouquet = bouquetRef.current;
        if (!bouquet) return;

        const computeSize = () => {
            const bouquetRect = bouquet.getBoundingClientRect();
            if (bouquetRect.width > 0) {
                setContainerWidth(bouquetRect.width);
            }
            if (bouquetRect.height > 0) {
                setContainerHeight(bouquetRect.height);
            }
        };

        // Compute on initial mount
        computeSize();

        // Setup ResizeObserver to track text-overlay element size changes
        const resizeObserver = new ResizeObserver(computeSize);
        resizeObserver.observe(bouquet);

        // Also listen to window resize events
        window.addEventListener("resize", computeSize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", computeSize);
        };
    }, []);

    const today = new Date();
    const start = new Date("2026-07-03");
    const diff = today.valueOf() - start.valueOf();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));
    const message =
        messages[today.toISOString().split("T")[0]] ??
        "Ui, äääh...also entweder ich habe irgendwas verkackt, oder ich hab heute vergessen oder ich bin noch nicht dazu gekommen. Sorrryyy <3";

    return (
        <div className="winner-page">
            <div>
                <Bouquet numbFlowers={diffDays} containerWidth={containerWidth} containerHeight={containerHeight} ref={bouquetRef} />
                <div className="text-overlay">
                    <p>{message}</p>
                    <Link to="/">Zurück</Link>
                </div>
            </div>
        </div>
    );
}
export default WinnerPage;
