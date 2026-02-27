import { useRef, useEffect, useState, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  logos = [], 
  speed = 0.5,
  curveAmount = 140,
  logoSize = 80
}) => {
  const [offset, setOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef();
  const uid = useId();
  const pathId = `curve-${uid}`;
  
  // Adjusted path to start further left (-200) and end further right (1640)
  // to ensure logos are always visible at the screen edges.
  const pathD = `M -200,100 Q 720,${100 + curveAmount} 1640,100`;

  useEffect(() => {
    const animate = () => {
      if (!isHovered) {
        setOffset((prev) => (prev + speed) % 100);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed, isHovered]);

  return (
    <div 
      className="curved-loop-jacket logo-mode"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 450" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        
        {logos.map((logoUrl, i) => {
          const distance = (i * (100 / logos.length) + offset) % 100;

          return (
            <image
            preserveAspectRatio="xMidYMid meet"
              key={i}
              href={logoUrl}
              width={logoSize}
              height={logoSize}
              style={{
                offsetPath: `path('${pathD}')`,
                offsetDistance: `${distance}%`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
                translate: `-${logoSize / 2}px -${logoSize / 2}px`,
                cursor: 'pointer'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default CurvedLoop;