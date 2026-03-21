import {
	Box,
	CameraControls,
	Html,
	OrthographicCamera,
	useAnimations,
	useGLTF,
	useHelper,
	useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath"; // npm install maath
import type React from "react";
import {
	useCallback,
	useMemo,
	useEffect,
	useEffectEvent,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "react-aria-components";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
//import { DirectionalLightHelper, PointLightHelper } from 'three'
import Dimensions from "./Dimensions";
import MeshMaterial from "./materials/MeshMaterial";

type ActionName =
	| "desk.001Action"
	| "desk.001CloseAction"
	| "desk.002Action"
	| "desk.002CloseAction"
	| "desk.003Action"
	| "desk.003CloseAction";

interface GLTFAction extends THREE.AnimationClip {
	name: ActionName;
}

type RoomGLTF = GLTF & {
	nodes: {
		room: THREE.Mesh;
		curtain: THREE.Mesh;
		bed: THREE.Mesh;
		desk: THREE.Mesh;
		screen: THREE.Mesh;
		desk001: THREE.Mesh;
		desk002: THREE.Mesh;
		desk003: THREE.Mesh;
		// Bone: THREE.Object3D
		// deskArmature: THREE.Object3D
	};
	materials: {
		room: THREE.MeshStandardMaterial;
		curtain: THREE.MeshStandardMaterial;
		bed: THREE.MeshStandardMaterial;
		desk: THREE.MeshStandardMaterial;
		desk001: THREE.MeshStandardMaterial;
		desk002: THREE.MeshStandardMaterial;
		desk003: THREE.MeshStandardMaterial;
		screen: THREE.MeshStandardMaterial;
		model: THREE.MeshStandardMaterial;
	};

	animations: GLTFAction[];

	//camera: THREE.OrthographicCamera
	actions: {
		deskAction: THREE.AnimationAction;
		secondDeskAction: THREE.AnimationAction;
	};
};

type eventObject = React.UIEvent & {
	eventObject: THREE.Object3D;
	position: THREE.Vector3;
};

interface RoomProps {
	position?: [number, number, number];
	state?: number;
	intensity?: number;
	decay?: number;
	clock?: THREE.Clock;
	camPosition?: THREE.Vector3;
	camRotation?: THREE.Euler;
	width?: any;
	height?: any;
    color?: unknown | string | THREE.ColorRepresentation;
}

export default function Room({ height, width, color }: RoomProps) {
	const [hovered, setHovered] = useState<string | null>(null);
	const group = useRef<THREE.Group>(null!);
	const { nodes, materials, animations } = useGLTF(
		"/room.gltf",
	) as unknown as RoomGLTF;
	const { actions } = useAnimations(animations, group);
	const deskCloseActions = [
		actions["desk.001CloseAction"],
		actions["desk.002CloseAction"],
		actions["desk.003CloseAction"],
	];
	const deskOpenActions = [
		actions["desk.001Action"],
		actions["desk.002Action"],
		actions["desk.003Action"],
	];
	const controlsRef = useRef(null!);
	const isZooming = useRef(false);
	const isSelected = useRef(false);
	const isPressed = useRef(false);
	const cameraRef = useRef<THREE.OrthographicCamera>(null!);
	const roomRef = useRef<THREE.Mesh>(null!);
	const curtainRef = useRef<THREE.Mesh>(null!);
	const bedRef = useRef<THREE.Mesh>(null!);
	const deskRef = useRef<THREE.Mesh>(null!);
	const screenRef = useRef<THREE.Mesh>(null!);
	const roomMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const curtainMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const bedMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const deskMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const desk001MaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const desk002MaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const desk003MaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const screenMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
	const [backBtnVisible, setBackBtnVisible] = useState(false);
	const [positions, setPositions] = useState<{
		bed: THREE.Vector3;
		desk: THREE.Vector3;
		screen: THREE.Vector3;
	}>({
		bed: new THREE.Vector3(-0.36, 0.48, 0.8),
		desk: new THREE.Vector3(0.31, 0.04, -1.17),
		screen: new THREE.Vector3(-1.47, 1.73, 0),
	});
	const [visibilities, setVisibilities] = useState<{
		bed: number;
		desk: number;
		screen: number;
		room: number;
		curtain: number;
	}>({ bed: 1.0, desk: 1.0, screen: 1.0, room: 1.0, curtain: 1.0 });

	
	const [customColors, setCustomColors] = useState<{
		bed: THREE.Color|string|unknown;
		desk: THREE.Color|string|unknown;
		screen: THREE.Color|string|unknown;
	}>({
		bed: color,
		desk: color,
		screen: color,
	});
	const [raycast, setRaycast] = useState<boolean>(true);
	const [isBedHovered, setIsBedHovered] = useState(false);
	const [isDeskHovered, setIsDeskHovered] = useState(false);
	const [isScreenHovered, setIsScreenHovered] = useState(false);
	const [deskOpen, setDeskOpen] = useState(false);
	const bedMaskTexture = useTexture('bedMask.webp')
	const colorObj = useMemo(() => new THREE.Color(color as THREE.ColorRepresentation | string), []);

		console.dir(nodes);
	const lightRef = useRef(null!);
	const directionalLightRef = useRef(null!);
	const directionalLightRefTwo = useRef(null!);

	//  useHelper(lightRef, PointLightHelper, 0.1, 'red')
	//   useHelper(directionalLightRef, DirectionalLightHelper, 0.1, 'blue')
	//   useHelper(directionalLightRefTwo, DirectionalLightHelper, 0.1, 'blue')

	bedMaskTexture.colorSpace = THREE.NoColorSpace

	//const whatIsHovered = hovered
	

useLayoutEffect(() => {
  const mat = materials.bed;
  if (!mat) return;

  // Zapobiegamy ponownej kompilacji
  if (mat.userData.shaderInjected) return;
  mat.userData.shaderInjected = true;

  // Podpinamy nasz istniejący obiekt koloru pod userData
  mat.userData.customColor = { value: colorObj };
  mat.userData.maskMap = { value: bedMaskTexture };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.targetColor = mat.userData.customColor;
    shader.uniforms.maskMap = mat.userData.maskMap;

 // ... wewnątrz onBeforeCompile ...

shader.fragmentShader = `
  uniform vec3 targetColor;
  uniform sampler2D maskMap;
  ${shader.fragmentShader}
`.replace(
  `#include <map_fragment>`,
  `
  #include <map_fragment>
  
  // Używamy vMapUv (standard w nowych wersjach R3F/Three.js dla tekstur)
  // Jeśli model ma teksturę 'map', vMapUv jest na pewno zdefiniowane
  #ifdef USE_MAP
    float mVal = texture2D(maskMap, vMapUv).r; 
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * targetColor, mVal);
  #endif
  `
);

  };
  mat.needsUpdate = true;
}, [materials.bed, bedMaskTexture]); // Ważne: colorObj NIE jest w tablicy zależności

// 2. Aktualizacja koloru jest teraz banalnie prosta i bezpieczna
useEffect(() => {
  colorObj.set(color as THREE.ColorRepresentation | string);
}, [color, colorObj]);



	const cameraPositionReset = useCallback((): void => {
		setVisibilities({
			bed: 1.0,
			desk: 1.0,
			screen: 1.0,
			room: 1.0,
			curtain: 1.0,
		});
		cameraRef.current.position.set(9.985, 11.939, 9.892);
		cameraRef.current.rotation.set(-0.527, 0.786, 0.39);
		//controlsRef.current.enabled = false
		controlsRef.current.zoomTo(70, true);
		controlsRef.current.enabled = true;
		console.log("reset");

		isSelected.current = false;
	}, []);

	const onHovered = useEffectEvent(() => {
		switch (hovered) {
			case "bed":
				setIsBedHovered(true);

				break;
			case "desk":
				setIsDeskHovered(true);

				break;
			case "screen":
				setIsScreenHovered(true);

				break;

			default:
				setIsBedHovered(false);
				setIsDeskHovered(false);
				setIsScreenHovered(false);

				break;
		}
	});

	useEffect(() => {
		document.body.style.cursor = hovered ? "pointer" : "move";
		onHovered();
	}, [hovered]);


	const chengeColors = useEffectEvent( () => {


		//materials.bed.userData.customColor.value.set(color as THREE.ColorRepresentation | string)
		// materials.bed.color.set(color as THREE.ColorRepresentation | string);
		// materials.desk.color.set(color as THREE.ColorRepresentation | string);
		// materials.screen.color.set(color as THREE.ColorRepresentation | string);

		setCustomColors({
			bed: color,
			desk: color,
			screen: color,
		});

			// bedMaterialRef.current.color = materials.bed.color;
			
			// deskMaterialRef.current.color = materials.desk.color;
			// desk001MaterialRef.current.color = materials.desk001.color;
			// desk002MaterialRef.current.color = materials.desk002.color;
			// desk003MaterialRef.current.color = materials.desk003.color;
			// screenMaterialRef.current.color = materials.screen.color;
	})

	useEffect(() => {
		chengeColors();
	}, [color]);


	const changeCustomColors = useEffectEvent(() => {
		materials.bed.color.set(customColors.bed);
		materials.desk.color.set(customColors.desk);
		materials.screen.color.set(customColors.screen);
	})


	useEffect(() => {
		changeCustomColors();
	}, [customColors])
	// const groupRef = useRef<THREE.Group>(null!)

	//const lightRef = useRef<THREE.PointLight>(null!)



	const onSelect = useEffectEvent(() => {
		if (!backBtnVisible && isSelected.current) {
			setHovered(null);
			controlsRef.current.enabled = false;
			controlsRef.current.setLookAt(1.5, 2, 2, 1, -2, 0, true);
			setBackBtnVisible(true);
			controlsRef.current.zoomTo(150, true);
			controlsRef.current.enabled = true;
		} else if (backBtnVisible && !raycast) {
			isZooming.current = false;
			isSelected.current = false;
			controlsRef.current.enabled = false;
			setRaycast(true);
			setBackBtnVisible(false);
			//setRaycast(true)
			setHovered(null);
			cameraPositionReset();
		}
	});

	useEffect(() => {
		onSelect();
	}, [positions]);

	const zoomIn = useCallback(
		(coor: THREE.Vector3, side: boolean, wall: boolean): void => {
			if (!controlsRef.current) return;
			controlsRef.current.enabled = false;

			controlsRef.current.zoomTo(90, true);
			controlsRef.current.setLookAt(
				side ? 5 : coor.x + 9,
				side ? 3 : wall ? coor.y + 2.5 : coor.y + 0.15,
				side ? 0 : wall ? 2 : 0,
				coor.x,
				coor.y,
				coor.z,
				true,
			);

			//setRaycast(true)
			controlsRef.current.enabled = true;
		},
		[],
	);

	const handleZoomIn = useCallback(
		(e: eventObject) => {
			e.stopPropagation();
			console.log("handleZoomIn");
			if (isZooming.current) return;

			console.log("handleZoom should run");
			const name = e.eventObject.name;

			if (isPressed.current) return;

			setHovered((prevHovered) => {
				if (prevHovered === name) return prevHovered;

				const position = e.eventObject.position.clone();
				const isLeftSide = name === "bed";
				const wall = name === "desk";
				const newVis = {
					room: 0.25,
					bed: 0.25,
					desk: 0.25,
					screen: 0.25,
					curtain: 0.25,
					[name]: 1.0,
				};

				setVisibilities(newVis);

				zoomIn(position, isLeftSide, wall);

				return name;
			});
		},
		[zoomIn],
	);

	const handleSelect = useCallback(
		async (item: eventObject): Promise<void> => {
			console.log("handleSelect item: " + item.eventObject.name);
			console.log(
				"isSeleceted: " +
					isSelected.current +
					" isZooming: " +
					isZooming.current,
			);
			console.log("raycast: " + raycast);

			if (!isSelected.current && raycast) {
				const it: string = item.eventObject.name;

				isSelected.current = true;

				let yPos = 1.7;
				await setRaycast(false);
				console.log("Object selected");
				if (it === "desk") {
					yPos = 1.35;
				}

				const newPos = { ...positions, [it]: new THREE.Vector3(0, yPos, 0) };

				const newVis = {
					bed: 0.0,
					desk: 0.0,
					screen: 0.0,
					room: 0.0,
					curtain: 0.0,
					[it]: 1.0,
				};
				await setVisibilities(newVis);

				console.log("handleSelect object key " + it);
				console.log("visibilities " + visibilities);
				console.dir(visibilities);
				//setTimeout(() => {
				setPositions(newPos);
				//},150)
			}
		},
		[positions, visibilities, raycast],
	);

	const handleDeselectItem = useCallback((): void => {
		console.log("handleDeselectItem");

		setPositions({
			bed: new THREE.Vector3(-0.36, 0.48, 0.8),
			desk: new THREE.Vector3(0.33, 0.04, -1.17),
			screen: new THREE.Vector3(-1.47, 1.73, 0),
		});
	}, []);

	const onEnter = useCallback(
		(e: eventObject) => {
			console.log("onEnter");
			e.stopPropagation();

			if (
				!backBtnVisible &&
				!isZooming.current &&
				controlsRef.current.enabled
			) {
				controlsRef.current.maxSpeed = 5;
				controlsRef.current.enabled = false;

				handleZoomIn(e);
			}
		},
		[backBtnVisible, handleZoomIn],
	);

	const onLeave = useCallback(
		(e: eventObject) => {
			console.log("onLeave");
			e.stopPropagation();
			if (!backBtnVisible && !isSelected.current) {
				controlsRef.current.enabled = false;
				setHovered(null);
				cameraPositionReset();
			}
		},
		[backBtnVisible, cameraPositionReset],
	);

	function handlePressed(): void {
		isPressed.current = true;
	}

	function hanleUnPressed(): void {
		isPressed.current = false;
	}

	function handleActions(): void {
		const isOpening = !deskOpen; // Sprawdzamy co chcemy zrobić
		const currentActions = isOpening ? deskOpenActions : deskCloseActions;
		const oppositeActions = isOpening ? deskCloseActions : deskOpenActions;

		currentActions.forEach((action, i) => {
			if (action) {
				const prevAction = oppositeActions[i];

				action.reset();
				action.setLoop(THREE.LoopOnce, 1);
				action.clampWhenFinished = true;

				if (prevAction) {
					// Płynne przełączenie (np. 0.2 sekundy) zapobiega "szarpaniu"
					action.crossFadeFrom(prevAction, 0.2, true);
				}

				action.play();
			}
		});

		setDeskOpen(isOpening);
	}

	useFrame((state, delta): void => {
		// const time = state.clock.getElapsedTime()

		easing.damp3(bedRef.current.position, positions.bed, 0.15, delta);

		bedMaterialRef.current.opacity = THREE.MathUtils.lerp(
			bedMaterialRef.current.opacity,
			visibilities.bed,
			0.3,
		);

	});

	useFrame((state, delta): void => {
		easing.damp3(deskRef.current.position, positions.desk, 0.15, delta);

		deskMaterialRef.current.opacity = THREE.MathUtils.lerp(
			deskMaterialRef.current.opacity,
			visibilities.desk,
			0.3,
		); 

			desk001MaterialRef.current.opacity = THREE.MathUtils.lerp(
			desk001MaterialRef.current.opacity,
			visibilities.desk,
			0.3,
		);

			desk002MaterialRef.current.opacity = THREE.MathUtils.lerp(
			desk002MaterialRef.current.opacity,
			visibilities.desk,
			0.3,
		);

			desk003MaterialRef.current.opacity = THREE.MathUtils.lerp(
			desk003MaterialRef.current.opacity,
			visibilities.desk,
			0.3,
		);

	});



	useFrame((state, delta): void => {
		easing.damp3(screenRef.current.position, positions.screen, 0.15, delta);

		screenMaterialRef.current.opacity = THREE.MathUtils.lerp(
			screenMaterialRef.current.opacity,
			visibilities.screen,
			0.3,
		);

	});

	useFrame((state): void => {
		roomMaterialRef.current.opacity = THREE.MathUtils.lerp(
			roomMaterialRef.current.opacity,
			visibilities.screen,
			0.3,
		);
	});

	useFrame((state): void => {
		curtainMaterialRef.current.opacity = THREE.MathUtils.lerp(
			curtainMaterialRef.current.opacity,
			visibilities.screen,
			0.3,
		);
	});

	return (
		<group
			ref={group}
			scale={20}
			position={[0, -35, 0]}
			dispose={null}
			onPointerDown={handlePressed}
			onPointerUp={hanleUnPressed}
		>
			<directionalLight
				ref={directionalLightRef}
				color="#FFEFD1"
				position={[1, 2, -1.5]}
				scale={6}
				castShadow
				intensity={3.5}
			/>
			<directionalLight
				ref={directionalLightRefTwo}
				color="#FFEFD1"
				position={[0, 2, 4.5]}
				scale={20}
				castShadow
				intensity={2.8}
			/>
			<CameraControls
				ref={controlsRef}
				makeDefault
				onRest={() => {
					isZooming.current = false;
					controlsRef.current.enabled = true;
					console.log("Kamera zaparkowała");
					console.log("raycast " + raycast);
				}}
				// Wywoływane przy ruchu kamery
				onStart={() => {
					isZooming.current = true;
				}}
				// szybkosc
				polarRotateSpeed={0.1}
				//smoth
				draggingSmoothTime={0.25}
				// Ograniczenie góra-dół
				minPolarAngle={backBtnVisible ? 0.3 : 0.5}
				maxPolarAngle={backBtnVisible ? 0.7 : 1}
				// Ograniczenie lewo-prawo
				minAzimuthAngle={backBtnVisible ? -0.3 : 0.2}
				maxAzimuthAngle={backBtnVisible ? 2.3 : Math.PI / 2}
			></CameraControls>

			<group name="Scene">
				<pointLight
					ref={lightRef}
					name="pointone"
					castShadow
					intensity={1.508}
					decay={1.8}
					color="#edeceb"
					position={[0, 2.825, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
				/>

				<OrthographicCamera
					ref={cameraRef}
					name="camera"
					zoom={70}
					onUpdate={(self) => {
						const aspect = width / height;
						const frustumSize: number = 400; // Stała określająca ile jednostek świata widać
						self.left = (-frustumSize * aspect) / 2;
						self.right = (frustumSize * aspect) / 2;
						self.top = frustumSize / 2;
						self.bottom = -frustumSize / 2;
						self.updateProjectionMatrix();
					}}
					makeDefault={true}
					far={1000}
					near={0.001}
					position={[9.985, 11.939, 9.892]}
					rotation={[-Math.PI / 2, -1.571, 0]}
				>
					{backBtnVisible && (
						<Html center distanceFactor={0.005}>
							<button className="backBtn" onClick={handleDeselectItem}>
								↩ Back
							</button>
						</Html>
					)}
					{backBtnVisible && positions.desk.x === 0 && (
						<Html center distanceFactor={0.005}>
							<Button className="openBtn" onClick={handleActions}>
								{deskOpen ? "Close" : "Open"}
							</Button>
						</Html>
					)}
				</OrthographicCamera>

				<mesh
					name="room"
					raycast={undefined}
					ref={roomRef}
					geometry={nodes.room.geometry}
					material={materials.room}
					scale={1}
					visible={backBtnVisible && visibilities.room === 0 ? false : true}
				>
					<MeshMaterial reference={roomMaterialRef} mat={materials.room} />
				</mesh>

				<mesh
					name="curtain"
					raycast={undefined}
					ref={curtainRef}
					geometry={nodes.curtain.geometry}
					material={materials.curtain}
					scale={1}
					visible={backBtnVisible && visibilities.room === 0 ? false : true}
					position={[0, 2.41, -1.41]}
				>
					<MeshMaterial
						reference={curtainMaterialRef}
						mat={materials.curtain}
					/>
				</mesh>

				<mesh
					name="bed"
					ref={bedRef}
					onPointerEnter={raycast ? onEnter : () => {}}
					onPointerLeave={raycast ? onLeave : () => {}}
					onPointerMissed={onLeave}
					onClick={handleSelect}
					geometry={nodes.bed.geometry}
					material={materials.bed}
					scale={1}
					visible={backBtnVisible && visibilities.bed === 0 ? false : true}
				>
					<MeshMaterial
						reference={bedMaterialRef}
						mat={materials.bed}
						isEmisive={isBedHovered}
					/>
				</mesh>

				<Dimensions
					position={[positions.bed.x, 1.95, positions.bed.z + 0.45]}
					scale={[0, 0.025, 0]}
					vis={backBtnVisible && positions.bed.x === 0}
					long={2}
					axis={"x"}
					trans={0}
					dimen={"200cm"}
					textSize={0.008}
				/>
				<Dimensions
					position={[positions.bed.x + 1, 1.95, positions.bed.z + 0.01]}
					scale={[0, 0.025, 0]}
					vis={backBtnVisible && positions.bed.x === 0}
					long={0.85}
					axis={"z"}
					trans={0}
					dimen={"85cm"}
					textSize={0.008}
				/>
				<Dimensions
					position={[
						positions.bed.x + 1,
						positions.bed.y - 0.135,
						positions.bed.z + 0.44,
					]}
					scale={[0, 0, 0.025]}
					vis={backBtnVisible && positions.bed.x === 0}
					long={0.73}
					axis={"y"}
					trans={0}
					dimen={"70cm"}
					textSize={0.008}
				/>

				<mesh
					name="desk"
					ref={deskRef}
					onPointerEnter={raycast ? onEnter : () => {}}
					onPointerLeave={raycast ? onLeave : () => {}}
					onPointerMissed={onLeave}
					onClick={handleSelect}
					geometry={nodes.desk.geometry}
					material={materials.desk}
					scale={1}
					visible={backBtnVisible && visibilities.desk === 0 ? false : true}
				>
					<MeshMaterial
						reference={deskMaterialRef}
						mat={materials.desk}
						isEmisive={isDeskHovered}
					/>

					<mesh
						name="desk001"
						raycast={() => null}
						position={[0, 0.42, 0.02]}
						geometry={nodes.desk001.geometry}
						material={materials.desk}
						scale={1}
						visible={backBtnVisible && visibilities.desk === 0 ? false : true}
					>
						<MeshMaterial
							reference={desk001MaterialRef}
							mat={materials.desk}
							isEmisive={isDeskHovered}
						/>
					</mesh>

					<mesh
						name="desk002"
						raycast={() => null}
						position={[0, 0.24, 0.02]}
						geometry={nodes.desk002.geometry}
						material={materials.desk}
						scale={1}
						visible={backBtnVisible && visibilities.desk === 0 ? false : true}
					>
						<MeshMaterial
							reference={desk002MaterialRef}
							mat={materials.desk}
							isEmisive={isDeskHovered}
						/>
					</mesh>

					<mesh
						name="desk003"
						raycast={() => null}
						position={[0, 0.05, 0.02]}
						geometry={nodes.desk002.geometry}
						material={materials.desk}
						scale={1}
						visible={backBtnVisible && visibilities.desk === 0 ? false : true}
					>
						<MeshMaterial
							reference={desk003MaterialRef}
							mat={materials.desk}
							isEmisive={isDeskHovered}
						/>
					</mesh>
				</mesh>

				<Dimensions
					position={[positions.desk.x + 0.01, 1.95, positions.desk.z + 0.33]}
					scale={[0, 0.025, 0]}
					vis={backBtnVisible && positions.desk.x === 0}
					long={0.57}
					axis={"x"}
					trans={0}
					dimen={"56cm"}
					textSize={0.006}
				/>
				<Dimensions
					position={[positions.desk.x + 0.3, 1.95, positions.desk.z + 0.03]}
					scale={[0, 0.025, 0]}
					vis={backBtnVisible && positions.desk.x === 0}
					long={0.58}
					axis={"z"}
					trans={0}
					dimen={"56cm"}
					textSize={0.006}
				/>
				<Dimensions
					position={[positions.desk.x + 0.3, 1.65, positions.desk.z + 0.32]}
					scale={[0, 0, 0.025]}
					vis={backBtnVisible && positions.desk.x === 0}
					long={0.6}
					axis={"y"}
					trans={0}
					dimen={"59cm"}
					textSize={0.006}
				/>

				<mesh
					name="screen"
					ref={screenRef}
					onPointerEnter={raycast ? onEnter : () => {}}
					onPointerLeave={raycast ? onLeave : () => {}}
					onPointerMissed={onLeave}
					onClick={handleSelect}
					geometry={nodes.screen.geometry}
					material={materials.screen}
					position={[-9.254, 5.316, -6]}
					scale={1}
					visible={backBtnVisible && visibilities.screen === 0 ? false : true}
				>
					<MeshMaterial
						reference={screenMaterialRef}
						mat={materials.screen}
						isEmisive={isScreenHovered}
					/>
				</mesh>

				<Dimensions
					position={[
						positions.screen.x + 0.01,
						2.08,
						positions.screen.z + 0.56,
					]}
					scale={[0, 0.025, 0]}
					vis={backBtnVisible && positions.screen.x === 0}
					long={0.025}
					axis={"x"}
					trans={0}
					dimen={"2.4cm"}
					textSize={0.005}
				/>
				<Dimensions
					position={[
						positions.screen.x + 0.03,
						2.08,
						positions.screen.z + 0.013,
					]}
					scale={[0, 0.025, 0]}
					vis={backBtnVisible && positions.screen.x === 0}
					long={1.08}
					axis={"z"}
					trans={0}
					dimen={"107cm"}
					textSize={0.005}
				/>
				<Dimensions
					position={[
						positions.screen.x + 0.03,
						1.71,
						positions.screen.z + 0.55,
					]}
					scale={[0, 0, 0.025]}
					vis={backBtnVisible && positions.screen.x === 0}
					long={0.75}
					axis={"y"}
					trans={0}
					dimen={"69cm"}
					textSize={0.005}
				/>
			</group>
		</group>
	);
}

useGLTF.preload("/room.gltf");
