import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorrorSceneProps {
  backgroundImage?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  parallaxSpeed?: number;
  dimLevel?: number;
  onEnter?: () => void;
  onLeave?: () => void;
}

const HorrorScene = ({
  backgroundImage,
  children,
  className = "",
  id,
  parallaxSpeed = 0.3,
  dimLevel = 0.4,
  onEnter,
  onLeave,
}: HorrorSceneProps) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!scene || !content) return;

    // Parallax on background
    if (bg) {
      gsap.fromTo(bg, { y: "-20%" }, {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top bottom",
          end: "bottom top",
          scrub: parallaxSpeed,
        },
      });
    }

    // Fade in content
    gsap.fromTo(content, { opacity: 0, y: 60 }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: scene,
        start: "top 70%",
        end: "top 30%",
        toggleActions: "play none none reverse",
        onEnter,
        onLeave,
        onEnterBack: onEnter,
        onLeaveBack: onLeave,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === scene) t.kill();
      });
    };
  }, [parallaxSpeed, onEnter, onLeave]);

  return (
    <div ref={sceneRef} id={id} className={`horror-scene ${className}`}>
      {backgroundImage && (
        <div
          ref={bgRef}
          className="horror-scene-bg"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: `brightness(${dimLevel}) contrast(1.1) saturate(0.3)`,
          }}
        />
      )}
      <div className="horror-fog" />
      <div ref={contentRef} className="relative z-10 px-6 max-w-3xl mx-auto text-center">
        {children}
      </div>
    </div>
  );
};

export default HorrorScene;
