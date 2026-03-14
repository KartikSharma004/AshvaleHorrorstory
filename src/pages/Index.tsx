import { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HorrorScene from "@/components/horror/HorrorScene";
import TypingText from "@/components/horror/TypingText";
import FlashlightCursor from "@/components/horror/FlashlightCursor";
import FogParticles from "@/components/horror/FogParticles";
import ShadowFigure from "@/components/horror/ShadowFigure";
import AudioManager from "@/components/horror/AudioManager";

import phoneGlow from "@/assets/phone-glow.jpg";
import foggyRoad from "@/assets/foggy-road.jpg";
import abandonedTown from "@/assets/abandoned-town.jpg";
import schoolHallway from "@/assets/school-hallway.jpg";
import chalkboard from "@/assets/chalkboard.jpg";
import nightmare from "@/assets/nightmare.jpg";
import fireMemory from "@/assets/fire-memory.jpg";
import hospital from "@/assets/hospital.jpg";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [showJumpScare, setShowJumpScare] = useState(false);
  const [jumpScareTriggered, setJumpScareTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSceneEnter = useCallback((scene: number) => () => {
    setActiveScene(scene);
  }, []);

  // Jump scare before hospital scene
  useEffect(() => {
    if (activeScene === 9 && !jumpScareTriggered) {
      setJumpScareTriggered(true);
      setShowJumpScare(true);
      // Shake the whole page
      if (containerRef.current) {
        containerRef.current.classList.add("horror-shake");
        setTimeout(() => containerRef.current?.classList.remove("horror-shake"), 500);
      }
      setTimeout(() => setShowJumpScare(false), 600);
    }
  }, [activeScene, jumpScareTriggered]);

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Overlays */}
      <div className="horror-grain" />
      <div className="horror-vignette" />
      <FlashlightCursor />
      <FogParticles />
      <ShadowFigure />
      <AudioManager activeScene={activeScene} />

      {/* Jump scare flash */}
      {showJumpScare && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ background: "hsl(0 0% 3%)" }}>
          <h1 className="horror-title text-accent text-8xl md:text-9xl horror-glitch">
            WAKE UP
          </h1>
        </div>
      )}

      {/* Scene 1: Title */}
      <HorrorScene id="scene-title" dimLevel={0.15} onEnter={handleSceneEnter(0)}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-muted-foreground font-horror-body text-sm tracking-[0.3em] uppercase opacity-60">
            Scroll to begin
          </p>
          <h1 className="horror-title text-foreground text-5xl md:text-7xl lg:text-8xl horror-flicker">
            ASHVALE
          </h1>
          <p className="horror-body text-muted-foreground text-lg md:text-xl tracking-[0.2em]">
            The Town That Remembers
          </p>
          <div className="mt-12 opacity-40 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </HorrorScene>

      {/* Scene 2: Phone message */}
      <HorrorScene id="scene-phone" backgroundImage={phoneGlow} dimLevel={0.25} onEnter={handleSceneEnter(1)}>
        <div className="flex flex-col items-center gap-8">
          <p className="horror-body text-muted-foreground text-base md:text-lg">
            2:57 AM
          </p>
          <p className="horror-body text-foreground text-lg md:text-xl max-w-lg">
            Jake's phone suddenly vibrates beside his bed.
          </p>
          <p className="horror-body text-muted-foreground text-base md:text-lg">
            The screen lights up with a message from an unknown number.
          </p>
          <div className="horror-phone-msg mt-4">
            <TypingText
              text='Jake… come back to Ashvale.'
              speed={80}
              isVisible={activeScene >= 1}
              className="horror-body"
            />
          </div>
          <p className="horror-body text-muted-foreground text-base mt-6 max-w-md">
            Ashvale is a place he hasn't thought about in years.
          </p>
          <p className="horror-body text-muted-foreground text-sm italic opacity-70">
            Or maybe… a place he tried to forget.
          </p>
        </div>
      </HorrorScene>

      {/* Scene 3: Foggy road */}
      <HorrorScene id="scene-road" backgroundImage={foggyRoad} dimLevel={0.35} onEnter={handleSceneEnter(2)}>
        <div className="flex flex-col items-center gap-6">
          <p className="horror-body text-foreground text-lg md:text-xl max-w-lg">
            The next evening Jake is driving home on a lonely road.
          </p>
          <p className="horror-body text-muted-foreground text-base max-w-lg">
            The night is unusually quiet. Slowly, a thick fog begins covering the road.
          </p>
          <p className="horror-body text-muted-foreground text-base max-w-lg">
            His GPS stops working. The radio turns into static.
          </p>
          <div className="mt-8 border-2 border-muted px-8 py-4 bg-background/40 backdrop-blur-sm">
            <p className="horror-title text-foreground text-2xl md:text-4xl tracking-wider horror-flicker">
              WELCOME TO ASHVALE
            </p>
          </div>
        </div>
      </HorrorScene>

      {/* Scene 4: Abandoned town */}
      <HorrorScene id="scene-town" backgroundImage={abandonedTown} dimLevel={0.3} onEnter={handleSceneEnter(3)}>
        <div className="flex flex-col items-center gap-6">
          <p className="horror-body text-foreground text-lg md:text-xl">
            Ashvale looks abandoned.
          </p>
          <p className="horror-body text-muted-foreground text-base max-w-lg">
            Streetlights flicker. Buildings are empty. Dust and fog cover everything.
          </p>
          <p className="horror-body text-foreground text-base max-w-lg mt-4">
            As Jake walks through the streets, he notices something strange.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="horror-body text-muted-foreground text-sm">
              Every clock in town shows the same time.
            </p>
            <p className="horror-title text-foreground text-5xl md:text-6xl horror-flicker">
              3:03 AM
            </p>
            <p className="horror-body text-muted-foreground text-sm italic">
              None of them move. The town feels… frozen.
            </p>
          </div>
        </div>
      </HorrorScene>

      {/* Scene 5: Empty streets - children laughing */}
      <HorrorScene id="scene-streets" backgroundImage={abandonedTown} dimLevel={0.2} onEnter={handleSceneEnter(4)}>
        <div className="flex flex-col items-center gap-6">
          <p className="horror-body text-foreground text-lg md:text-xl max-w-lg">
            From somewhere in the distance Jake hears children laughing.
          </p>
          <p className="horror-body text-muted-foreground text-base max-w-lg italic">
            The sound echoes through the empty streets.
          </p>
          <p className="horror-body text-foreground text-base max-w-lg mt-4">
            He follows it until he reaches Ashvale Elementary School.
          </p>
          <p className="horror-body text-muted-foreground text-base max-w-lg">
            The doors slowly creak open.
          </p>
        </div>
      </HorrorScene>

      {/* Scene 6: School hallway */}
      <HorrorScene id="scene-school" backgroundImage={schoolHallway} dimLevel={0.3} onEnter={handleSceneEnter(5)}>
        <div className="flex flex-col items-center gap-6">
          <p className="horror-body text-foreground text-lg md:text-xl max-w-lg">
            Inside the hallway everything is covered in dust.
          </p>
        </div>
      </HorrorScene>

      {/* Scene 7: Chalkboard */}
      <HorrorScene id="scene-chalkboard" backgroundImage={chalkboard} dimLevel={0.35} onEnter={handleSceneEnter(6)}>
        <div className="flex flex-col items-center gap-8">
          <p className="horror-body text-muted-foreground text-base">
            On a classroom chalkboard, fresh writing appears:
          </p>
          <div className="mt-4">
            <TypingText
              text="WHY DID YOU LEAVE US?"
              speed={120}
              delay={800}
              isVisible={activeScene >= 6}
              className="horror-title horror-blood-text text-4xl md:text-6xl horror-glitch"
            />
          </div>
          <p className="horror-body text-muted-foreground text-base mt-6">
            Jake's heart begins racing.
          </p>
          <p className="horror-body text-foreground text-lg italic">
            Something feels very wrong.
          </p>
        </div>
      </HorrorScene>

      {/* Scene 8: Nightmare transformation */}
      <HorrorScene id="scene-nightmare" backgroundImage={nightmare} dimLevel={0.4} onEnter={handleSceneEnter(7)}>
        <div className="flex flex-col items-center gap-6">
          <p className="horror-body text-foreground text-lg md:text-xl max-w-lg">
            Suddenly a loud siren echoes through the town.
          </p>
          <p className="horror-body text-muted-foreground text-base">
            The lights go out.
          </p>
          <p className="horror-body text-foreground text-base max-w-lg mt-2">
            When they return, the entire school looks twisted and rusted.
          </p>
          <p className="horror-body text-muted-foreground text-sm max-w-lg">
            The walls are covered in dark stains. Chains hang from the ceiling.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="horror-title text-foreground text-3xl md:text-4xl">
              CLANG.
            </p>
            <p className="horror-title text-foreground text-4xl md:text-5xl">
              CLANG.
            </p>
          </div>
          <p className="horror-body text-muted-foreground text-base mt-4 italic">
            He begins running through the hallway. But the corridors seem endless.
          </p>
        </div>
      </HorrorScene>

      {/* Scene 9: Fire memory / breaking point */}
      <HorrorScene id="scene-fire" backgroundImage={fireMemory} dimLevel={0.4} onEnter={handleSceneEnter(8)}>
        <div className="flex flex-col items-center gap-6">
          <div className="horror-phone-msg mb-4">
            <TypingText
              text="You remember now."
              speed={100}
              isVisible={activeScene >= 8}
              className="horror-body"
            />
          </div>
          <p className="horror-body text-foreground text-lg md:text-xl">
            Suddenly memories begin flooding back.
          </p>
          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="horror-body text-accent text-lg">The fire.</p>
            <p className="horror-body text-accent text-lg">The smoke.</p>
            <p className="horror-body text-accent text-lg">The panic.</p>
          </div>
          <p className="horror-body text-foreground text-base max-w-lg mt-6">
            Jake remembers running. Leaving others behind.
          </p>
          <p className="horror-body text-muted-foreground text-base italic max-w-lg">
            The guilt he buried deep inside his mind.
          </p>
        </div>
      </HorrorScene>

      {/* Scene 10: Hospital reveal */}
      <HorrorScene id="scene-hospital" backgroundImage={hospital} dimLevel={0.5} onEnter={handleSceneEnter(9)}>
        <div className="flex flex-col items-center gap-6">
          <p className="horror-body text-foreground text-lg md:text-xl max-w-lg">
            Suddenly everything goes silent.
          </p>
          <p className="horror-body text-muted-foreground text-base max-w-lg">
            The town fades away. The fog disappears.
          </p>
          <p className="horror-body text-foreground text-base max-w-lg mt-4">
            Jake hears distant voices. Machines beeping. Someone shouting.
          </p>
          <p className="horror-body text-foreground text-lg max-w-lg mt-4">
            Slowly Jake opens his eyes. Bright hospital lights shine above him.
          </p>
          <div className="mt-8 border border-border p-6 bg-background/60 backdrop-blur-sm max-w-lg">
            <p className="horror-body text-foreground text-base leading-relaxed">
              Jake had been in a serious car accident. He had been unconscious for hours.
            </p>
            <p className="horror-body text-muted-foreground text-sm mt-4 leading-relaxed">
              Everything he experienced — Ashvale, the town, the school — was happening inside his mind.
            </p>
            <p className="horror-body text-muted-foreground text-sm mt-4 leading-relaxed italic">
              His brain was forcing him to confront the guilt and trauma he had buried for years.
            </p>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="horror-body text-muted-foreground text-sm tracking-[0.2em]">
              The town of Ashvale was never real.
            </p>
            <p className="horror-body text-foreground text-base italic max-w-md">
              It was a place created by Jake's mind while he was fighting to wake up.
            </p>
          </div>
        </div>
      </HorrorScene>

      {/* Ending */}
      <div className="horror-scene flex flex-col items-center justify-center min-h-[50vh]">
        <div className="horror-fog" />
        <div className="relative z-10 text-center px-6">
          <p className="horror-title text-muted-foreground text-2xl md:text-3xl tracking-[0.2em] opacity-60">
            ASHVALE
          </p>
          <p className="horror-body text-muted-foreground text-sm mt-4 tracking-wider opacity-40">
            The Town That Remembers
          </p>
          <p className="horror-body text-muted-foreground text-xs mt-8 opacity-30">
            An interactive horror experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
