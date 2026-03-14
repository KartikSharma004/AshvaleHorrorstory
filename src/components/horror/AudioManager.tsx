import { useEffect, useRef, useCallback } from "react";

interface AudioManagerProps {
  activeScene: number;
}

const AudioManager = ({ activeScene }: AudioManagerProps) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const activeNodesRef = useRef<{ stop: () => void }[]>([]);
  const prevSceneRef = useRef(-1);

  const stopSceneAudio = useCallback(() => {
    activeNodesRef.current.forEach((n) => {
      try { n.stop(); } catch {}
    });
    activeNodesRef.current = [];
  }, []);

  const initAudio = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Dark ambient drone
      const createDrone = (freq: number, gain: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.value = gain;
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
      };
      createDrone(55, 0.03);
      createDrone(82.5, 0.02);
      createDrone(110, 0.01);

      // Wind noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 400;
      noise.connect(noiseFilter);
      noiseFilter.connect(ctx.destination);
      noise.start();
    } catch {}
  }, []);

  // Children laughing - synthesized eerie high-pitched tones (scene 4)
  const playChildrenLaughing = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const playLaughBurst = (delay: number) => {
      const timeout = setTimeout(() => {
        // Create multiple rapid oscillations to simulate laughter
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const t = ctx.currentTime + i * 0.12;
          osc.type = "sine";
          osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
          osc.frequency.linearRampToValueAtTime(600 + Math.random() * 200, t + 0.08);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.04, t + 0.02);
          g.gain.linearRampToValueAtTime(0, t + 0.1);
          osc.connect(g);
          // Add reverb-like effect with delay
          const delay2 = ctx.createDelay();
          delay2.delayTime.value = 0.3;
          const feedback = ctx.createGain();
          feedback.gain.value = 0.3;
          g.connect(ctx.destination);
          g.connect(delay2);
          delay2.connect(feedback);
          feedback.connect(delay2);
          feedback.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.12);
        }
      }, delay);
      return { stop: () => clearTimeout(timeout) };
    };

    // Repeat bursts at intervals
    const nodes: { stop: () => void }[] = [];
    nodes.push(playLaughBurst(0));
    nodes.push(playLaughBurst(1500));
    nodes.push(playLaughBurst(3500));
    nodes.push(playLaughBurst(6000));
    activeNodesRef.current.push(...nodes);
  }, []);

  // Loud siren effect (scene 7)
  const playSiren = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);

    // Siren sweep
    const duration = 6;
    for (let i = 0; i < duration * 2; i++) {
      const t = ctx.currentTime + i * 0.5;
      osc.frequency.setValueAtTime(i % 2 === 0 ? 440 : 660, t);
    }
    g.gain.setValueAtTime(0.12, ctx.currentTime + duration - 1);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);

    activeNodesRef.current.push({ stop: () => { try { osc.stop(); } catch {} } });
  }, []);

  // Clang clang metallic impact (scene 7)
  const playClang = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const playOneClang = (time: number) => {
      // Metallic resonance using multiple detuned oscillators
      [180, 420, 680, 1100].forEach((freq) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.08, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.8);
      });

      // Impact noise burst
      const bufLen = ctx.sampleRate * 0.1;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.15, time);
      ng.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 800;
      bp.Q.value = 2;
      src.connect(bp);
      bp.connect(ng);
      ng.connect(ctx.destination);
      src.start(time);
    };

    // Two clangs with pause
    const timeout1 = setTimeout(() => playOneClang(ctx.currentTime), 2000);
    const timeout2 = setTimeout(() => playOneClang(ctx.currentTime), 3200);
    activeNodesRef.current.push(
      { stop: () => clearTimeout(timeout1) },
      { stop: () => clearTimeout(timeout2) }
    );
  }, []);

  // Fire crackling and children crying (scene 8)
  const playFireAndCrying = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Fire crackling - filtered noise with random amplitude modulation
    const fireLen = ctx.sampleRate * 8;
    const fireBuf = ctx.createBuffer(1, fireLen, ctx.sampleRate);
    const fireData = fireBuf.getChannelData(0);
    for (let i = 0; i < fireLen; i++) {
      const crackle = Math.random() > 0.97 ? (Math.random() * 2 - 1) * 0.8 : 0;
      fireData[i] = (Math.random() * 2 - 1) * 0.04 + crackle * 0.15;
    }
    const fireSrc = ctx.createBufferSource();
    fireSrc.buffer = fireBuf;
    const fireFilter = ctx.createBiquadFilter();
    fireFilter.type = "bandpass";
    fireFilter.frequency.value = 2000;
    fireFilter.Q.value = 0.5;
    const fireGain = ctx.createGain();
    fireGain.gain.setValueAtTime(0, ctx.currentTime);
    fireGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1);
    fireGain.gain.setValueAtTime(0.25, ctx.currentTime + 6);
    fireGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
    fireSrc.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(ctx.destination);
    fireSrc.start();

    // Children crying - modulated high-pitched tones with vibrato
    const playCry = (delay: number) => {
      const timeout = setTimeout(() => {
        const osc = ctx.createOscillator();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        const g = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = 600 + Math.random() * 200;
        vibrato.type = "sine";
        vibrato.frequency.value = 5 + Math.random() * 3;
        vibratoGain.gain.value = 30;
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);

        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.05, ctx.currentTime + 1.2);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        vibrato.start();
        osc.stop(ctx.currentTime + 2);
        vibrato.stop(ctx.currentTime + 2);
      }, delay);
      return { stop: () => clearTimeout(timeout) };
    };

    activeNodesRef.current.push(
      { stop: () => { try { fireSrc.stop(); } catch {} } },
      playCry(500),
      playCry(2500),
      playCry(4500)
    );
  }, []);

  // Scene-specific sound effects
  useEffect(() => {
    if (activeScene === prevSceneRef.current) return;
    prevSceneRef.current = activeScene;
    stopSceneAudio();

    if (!audioCtxRef.current) return;

    switch (activeScene) {
      case 4: // Children laughing scene
        playChildrenLaughing();
        break;
      case 7: // Nightmare - siren + clang
        playSiren();
        playClang();
        break;
      case 8: // Fire memory - fire + crying
        playFireAndCrying();
        break;
    }
  }, [activeScene, stopSceneAudio, playChildrenLaughing, playSiren, playClang, playFireAndCrying]);

  // Heartbeat for intense scenes
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || activeScene < 6) {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      return;
    }

    const bpm = activeScene >= 8 ? 120 : 80;
    const interval = 60000 / bpm;

    const playBeat = () => {
      // Double-beat pattern (lub-dub)
      const playThump = (delay: number, freq: number, vol: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const t = ctx.currentTime + delay;
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      };
      playThump(0, 50, 0.1);
      playThump(0.15, 40, 0.07);
    };

    heartbeatRef.current = window.setInterval(playBeat, interval);
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [activeScene]);

  // Jump scare sound
  useEffect(() => {
    if (activeScene !== 9) return;
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    setTimeout(() => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 200;
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }, 500);
  }, [activeScene]);

  useEffect(() => {
    const onClick = () => initAudio();
    const onScroll = () => initAudio();
    window.addEventListener("click", onClick, { once: true });
    window.addEventListener("scroll", onScroll, { once: true });
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, [initAudio]);

  return null;
};

export default AudioManager;
