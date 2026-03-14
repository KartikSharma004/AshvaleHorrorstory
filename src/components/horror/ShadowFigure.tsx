import { useEffect, useState } from "react";

const ShadowFigure = () => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPos({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2,
        });
        setVisible(true);
        setTimeout(() => setVisible(false), 1500 + Math.random() * 2000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="horror-shadow-figure"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 0.4 : 0,
        zIndex: 9995,
        position: "fixed",
      }}
    />
  );
};

export default ShadowFigure;
