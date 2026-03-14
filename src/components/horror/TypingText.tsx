import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  isVisible?: boolean;
}

const TypingText = ({ text, speed = 50, delay = 0, className = "", onComplete, isVisible = true }: TypingTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDisplayed("");
      setStarted(false);
      return;
    }
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [isVisible, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, onComplete]);

  if (!isVisible || !started) return null;

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && <span className="horror-typing-cursor" />}
    </span>
  );
};

export default TypingText;
