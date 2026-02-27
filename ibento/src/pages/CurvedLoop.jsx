import { useRef, useEffect, useState, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  logos = [], // This now accepts an array
  speed = 0.5,
  curveAmount = 140,
  logoSize = 80
}) => {
  const [offset, setOffset] = useState(0);
  const requestRef = useRef();
  const uid = useId();
  const pathId = `curve-${uid}`;
  
  const pathD = `M-100,100 Q720,${100 + curveAmount} 1540,100`;

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => (prev + speed) % 100);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  return (
    <div className="curved-loop-jacket logo-mode">
      <svg className="curved-loop-svg" viewBox="0 0 1440 400">
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        
        {logos.map((logoUrl, i) => {
          // Calculate distance based on the number of logos provided
          const distance = (i * (100 / logos.length) + offset) % 100;

          return (
            <image
              key={i}
              href={logoUrl}
              width={logoSize}
              height={logoSize}
              style={{
                offsetPath: `path('${pathD}')`,
                offsetDistance: `${distance}%`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default CurvedLoop;