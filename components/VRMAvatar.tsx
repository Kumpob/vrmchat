"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import {
  VRM,
  VRMLoaderPlugin,
  VRMExpressionPresetName,
} from "@pixiv/three-vrm";

import { loadMixamoAnimation } from "./loadMixamoAnimation";

type Props = {
  started: boolean;
  audioUrl: string;
  stopIdle: boolean;
};

const IDLE_FBX_FILES = ["looking.fbx", "waving.fbx"];
// How many seconds of inactivity before a random animation triggers
const INACTIVITY_THRESHOLD = 8;

export default function VRMAvatar({ started, audioUrl, stopIdle }: Props) {
  const vrmRef = useRef<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Actions
  const idleActionRef = useRef<THREE.AnimationAction | null>(null);
  const idleActionsRef = useRef<THREE.AnimationAction[]>([]);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const isPlayingIdleAnimRef = useRef(false);

  // Inactivity
  const inactivityTimerRef = useRef(0);

  // Blink
  const blinkTimerRef = useRef(0);
  const isBlinkingRef = useRef(false);
  const blinkDurationRef = useRef(2 + Math.random() * 2);

  // Audio
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const { camera } = useThree();

  const crossFadeTo = (
    from: THREE.AnimationAction | null,
    to: THREE.AnimationAction,
    duration = 0.3,
  ) => {
    to.reset().play();
    if (from && from !== to) {
      from.crossFadeTo(to, duration, true);
    }
    activeActionRef.current = to;
  };

  const returnToIdle = () => {
    if (!idleActionRef.current) return;
    crossFadeTo(activeActionRef.current, idleActionRef.current);
    isPlayingIdleAnimRef.current = false;
    // Reset inactivity so it doesn't immediately retrigger
    inactivityTimerRef.current = 0;
  };

  useEffect(() => {
    if (!stopIdle) return;
    // If a random animation is playing, cut back to idle immediately
    if (isPlayingIdleAnimRef.current) {
      returnToIdle();
    }
    // Freeze the inactivity timer so it won't trigger during speech
    inactivityTimerRef.current = 0;
  }, [stopIdle]);

  // LOAD VRM + ALL ANIMATIONS
  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();

    gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

    gltfLoader.load("/avatar.vrm", async (gltf) => {
      const vrm = gltf.userData.vrm as VRM;

      vrm.scene.rotation.y = Math.PI;
      vrmRef.current = vrm;

      // Camera
      const headNode = vrm.humanoid.getRawBoneNode("head");
      if (headNode) {
        const headPos = new THREE.Vector3();
        headNode.getWorldPosition(headPos);

        // Sit the camera ~0.5 units in front of the head
        camera.position.set(headPos.x, 0, headPos.z + 0.7);
        camera.lookAt(headPos.x, headPos.y, headPos.z);
      }

      const mixer = new THREE.AnimationMixer(vrm.scene);
      mixerRef.current = mixer;

      // Load idle (base loop)
      const idleFbx = await new Promise<any>((res) =>
        fbxLoader.load("/idle.fbx", res),
      );
      const idleClip = await loadMixamoAnimation(vrm, idleFbx);
      const idleAction = mixer.clipAction(idleClip);
      idleAction.play();
      idleActionRef.current = idleAction;
      activeActionRef.current = idleAction;

      // Load the 3 random idle animations
      const loadedActions: THREE.AnimationAction[] = [];

      for (const file of IDLE_FBX_FILES) {
        const fbx = await new Promise<any>((res) =>
          fbxLoader.load(`/${file}`, res),
        );
        const clip = await loadMixamoAnimation(vrm, fbx);
        const action = mixer.clipAction(clip);

        // Play once, freeze on last frame until we crossfade out
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;

        loadedActions.push(action);
      }

      idleActionsRef.current = loadedActions;

      // When any of the 3 finish, crossfade back to idle
      mixer.addEventListener("finished", (e) => {
        if (loadedActions.includes(e.action as THREE.AnimationAction)) {
          returnToIdle();
        }
      });
    });

    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, []);

  // Reset inactivity timer when audio starts (counts as "activity")
  useEffect(() => {
    inactivityTimerRef.current = 0;
  }, [started, audioUrl]);

  // START AUDIO
  useEffect(() => {
    if (!started) return;

    let audio: HTMLAudioElement | null = null;

    const setup = async () => {
      audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous";
      audio.loop = false;

      const context = new AudioContext();
      await context.resume();

      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);
      analyser.connect(context.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      audio.addEventListener("ended", () => {
        // Re-enable idle animations and reset the timer
        isPlayingIdleAnimRef.current = false;
        inactivityTimerRef.current = 0;
        returnToIdle();
      });

      await audio.play();
    };

    setup();

    return () => {
      audio?.pause();
    };
  }, [started, audioUrl]);

  // ANIMATION LOOP
  useFrame((_, delta) => {
    const vrm = vrmRef.current;
    if (!vrm) return;

    mixerRef.current?.update(delta);
    vrm.update(delta);

    // PUSH ARMS OUT
    const humanoid = vrm.humanoid;
    if (humanoid) {
      const leftUpperArm = humanoid.getRawBoneNode("leftUpperArm");
      const rightUpperArm = humanoid.getRawBoneNode("rightUpperArm");
      if (leftUpperArm) leftUpperArm.rotation.z -= 0.2;
      if (rightUpperArm) rightUpperArm.rotation.z += 0.2;
    }

    // INACTIVITY → random idle animation
    // Don't trigger while speaking
    if (
      !analyserRef.current &&
      !isPlayingIdleAnimRef.current &&
      idleActionsRef.current.length > 0
    ) {
      inactivityTimerRef.current += delta;

      if (inactivityTimerRef.current >= INACTIVITY_THRESHOLD) {
        const pool = idleActionsRef.current;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        crossFadeTo(activeActionRef.current, pick);
        isPlayingIdleAnimRef.current = true;
        inactivityTimerRef.current = 0;
      }
    }

    // BLINK CYCLE
    blinkTimerRef.current += delta;

    if (
      !isBlinkingRef.current &&
      blinkTimerRef.current > blinkDurationRef.current
    ) {
      isBlinkingRef.current = true;
      blinkTimerRef.current = 0;
      blinkDurationRef.current = 0.12 + Math.random() * 0.05;
    }

    if (isBlinkingRef.current) {
      const progress = blinkTimerRef.current / blinkDurationRef.current;
      vrm.expressionManager?.setValue(
        VRMExpressionPresetName.Blink,
        Math.sin(progress * Math.PI),
      );

      if (blinkTimerRef.current >= blinkDurationRef.current) {
        isBlinkingRef.current = false;
        blinkTimerRef.current = 0;
        blinkDurationRef.current = 3 + Math.random() * 3;
        vrm.expressionManager?.setValue(VRMExpressionPresetName.Blink, 0);
      }
    }

    // AUDIO ANALYSIS → mouth
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }

      const volume = sum / dataArrayRef.current.length / 255;
      vrm.expressionManager?.setValue(VRMExpressionPresetName.Aa, volume * 1.2);
    }
  });

  return vrmRef.current ? (
    <primitive object={vrmRef.current.scene} position={[0, -1, 0]} />
  ) : null;
}
