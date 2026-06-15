"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

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
  onAudioEnd: () => void | undefined;
  vrmUrl: string;
  modelPosX: number;
  modelPosY: number;
  modelPosZ: number;
  modelRotY: number;
  leftArmZ: number;
  rightArmZ: number;
  leftThumbX: number;
  rightThumbX: number;
};

const IDLE_FBX_FILES = ["texting.fbx", "looking.fbx"];
// How many seconds of inactivity before a random animation triggers
const INACTIVITY_THRESHOLD = 10;

export default function VRMAvatar({
  started,
  audioUrl,
  stopIdle,
  onAudioEnd,
  vrmUrl,
  modelPosX,
  modelPosY,
  modelPosZ,
  modelRotY,
  leftArmZ,
  rightArmZ,
  leftThumbX,
  rightThumbX,
}: Props) {
  const vrmRef = useRef<VRM | null>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const phoneRef = useRef<THREE.Object3D | null>(null);

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
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const crossFadeTo = (
    from: THREE.AnimationAction | null,
    to: THREE.AnimationAction,
    duration = 0.3,
  ) => {
    to.reset().play();
    const isTexting = (to as any).name === "texting.fbx";
    // toggle phone
    if (phoneRef.current) {
      phoneRef.current.visible = isTexting;
    }

    if (from && from !== to) {
      from.crossFadeTo(to, duration, true);
    }
    activeActionRef.current = to;
  };

  const returnToIdle = () => {
    if (!idleActionRef.current) return;
    if (phoneRef.current) {
      phoneRef.current.visible = false;
    }
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

    // Stop old mixer actions before loading new model
    mixerRef.current?.stopAllAction();
    mixerRef.current = null;
    idleActionRef.current = null;
    activeActionRef.current = null;
    idleActionsRef.current = [];
    isPlayingIdleAnimRef.current = false;
    inactivityTimerRef.current = 0;
    analyserRef.current = null;
    dataArrayRef.current = null;

    gltfLoader.load(vrmUrl, async (gltf) => {
      const vrm = gltf.userData.vrm as VRM;

      vrm.scene.rotation.y = Math.PI + modelRotY;
      vrm.scene.position.set(modelPosX, modelPosY, modelPosZ);
      vrmRef.current = vrm;
      setVrm(vrm);

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

      // Load the random idle animations
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

        (action as any).name = file;

        loadedActions.push(action);
      }

      idleActionsRef.current = loadedActions;

      // When any of the idle animations finish, crossfade back to idle
      mixer.addEventListener("finished", (e) => {
        if (loadedActions.includes(e.action as THREE.AnimationAction)) {
          returnToIdle();
        }
      });

      // Re-attach phone to new VRM's right hand if already loaded
      if (phoneRef.current) {
        const rightHand = vrm.humanoid.getRawBoneNode("rightHand");
        if (rightHand) {
          rightHand.add(phoneRef.current);
        }
      }
    });

    const tryAttachPhone = (phone: THREE.Object3D) => {
      const vrm = vrmRef.current;
      if (!vrm) return false;

      const rightHand = vrm.humanoid.getRawBoneNode("rightHand");
      if (!rightHand) return false;

      rightHand.add(phone);
      return true;
    };

    const phoneLoader = new GLTFLoader();

    phoneLoader.load("/phone.glb", (gltf) => {
      const phone = gltf.scene;
      phone.scale.set(0.2, 0.2, 0.2);
      phone.visible = false;

      phoneRef.current = phone;
      phone.position.set(0.05, -0.01, -0.01);
      phone.rotation.set(0, -0.7, 0);

      const attached = tryAttachPhone(phone);
      if (!attached) {
        // retry next frame until VRM exists
        const interval = setInterval(() => {
          if (tryAttachPhone(phone)) clearInterval(interval);
        }, 100);
      }
    });

    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, [vrmUrl]);

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
        onAudioEnd();
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

    // Update model position/rotation from props
    vrm.scene.position.set(modelPosX, modelPosY, modelPosZ);
    vrm.scene.rotation.y = Math.PI + modelRotY;

    mixerRef.current?.update(delta);
    vrm.update(delta);

    // PUSH ARMS OUT
    const humanoid = vrm.humanoid;
    if (humanoid) {
      const leftUpperArm = humanoid.getRawBoneNode("leftUpperArm");
      const rightUpperArm = humanoid.getRawBoneNode("rightUpperArm");
      const metaL = vrm.humanoid.getRawBoneNode("leftThumbMetacarpal");
      const metaR = humanoid.getRawBoneNode("rightThumbMetacarpal");

      if (leftUpperArm) leftUpperArm.rotation.z += leftArmZ;
      if (rightUpperArm) rightUpperArm.rotation.z += rightArmZ;
      if (metaL) metaL.rotation.x += leftThumbX;
      if (metaR) metaR.rotation.x += rightThumbX;
    }

    // INACTIVITY → random idle animation
    // Don't trigger while speaking
    if (
      !stopIdle &&
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

  return vrm ? <primitive object={vrm.scene} /> : null;
}
