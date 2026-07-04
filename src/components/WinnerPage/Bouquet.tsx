import "./Bouquet.css";

const FLOWER_PATH = `${import.meta.env.BASE_URL}flowers/`;
const IMAGE_SIZE = 90;
const flowers = [
    "alstroemeria",
    "anemone",
    "carnation",
    "chrysanthemum",
    "daisy",
    "freesia",
    "hydrangea",
    "iris",
    "lily",
    "orchid",
    "peony",
    "ranunculus",
    "rose",
    "sunflower",
    "sweetPea",
    "tulip",
];

type FlowerPosition = {
    x: number;
    y: number;
    rotation: number;
    flowerType: string;
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.5°
function generateBouquet(count: number, centerX: number, centerY: number, bouquetHeight: number): FlowerPosition[] {
    const positions: FlowerPosition[] = [];

    const spacing = 40; // distance between flowers
    const widthScale = 1.0; // bouquet gets wider
    const heightScale = 0.75; // bouquet gets flatter

    for (let i = 0; i < count; i++) {
        // Spiral coordinates
        const radius = spacing * Math.sqrt(i);
        const theta = i * GOLDEN_ANGLE;
        let x = Math.cos(theta) * radius * widthScale;
        let y = -Math.sin(theta) * radius * heightScale - bouquetHeight / 2;

        // Small random jitter
        x += (Math.random() - 0.5) * 8;
        y += (Math.random() - 0.5) * 8;
        const rotation = (Math.atan2(y, x) * 180) / Math.PI + 90;

        positions.push({
            x: centerX + x,
            y: centerY + y,
            rotation: rotation,
            flowerType: flowers[Math.floor(Math.random() * flowers.length)],
        });
    }

    return positions;
}

export type BouquetProps = {
    numbFlowers: number,
    containerWidth: number,
    containerHeight: number,
    ref: React.RefObject<HTMLDivElement | null>
}

export function Bouquet( {numbFlowers,containerWidth, containerHeight, ref}: BouquetProps ) {

    const bouquetCenterX = containerWidth/2
    const bouquetCenterY = containerHeight/1.5

    const flowerPositions: FlowerPosition[] = generateBouquet(numbFlowers, bouquetCenterX, bouquetCenterY, containerHeight/1.5);
    flowerPositions.reverse()
    return (
        <div className="bouquet" ref={ref}>
            {/* SVG for stems and flowers */}
            <svg className="stems" >
                {flowerPositions.map((flower, index) => (
                    <line
                        key={`stem-${index}`}
                        x1={bouquetCenterX}
                        y1={bouquetCenterY}
                        x2={flower.x} // Center of flower image
                        y2={flower.y}
                        className="stem"
                    />
                ))}

                {/* Flowers */}
                {flowerPositions.map((flower, index) => (
                    <image
                        key={`flower-${index}`}
                        href={FLOWER_PATH + flower.flowerType + ".webp"}
                        x={flower.x - IMAGE_SIZE / 2}
                        y={flower.y - IMAGE_SIZE / 2}
                        width={IMAGE_SIZE}
                        height={IMAGE_SIZE}
                        className="flower"
                        style={{
                            width: `${IMAGE_SIZE}px`,
                            height: `${IMAGE_SIZE}px`,
                            transformOrigin: `${flower.x}px ${flower.y}px`,
                            transform: `rotate(${flower.rotation}deg)`,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
export default Bouquet;
