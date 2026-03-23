import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "../App.css";

//import { Html} from '@react-three/drei'

import FallbackComponent from "./FallbackComponent";
//import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'
import Room from "./Room";

export default function Scene({ color, size }: { color: string; size: { width: number; height: number } }) {
	//console.log(" Size " + props.size);

	return (
		<div
			aria-label="3D Scene"
			style={size.width>578 ? {
				width: size.width + "px",
				height: size.height + "px",
			} : {
				margin: "auto;"
			}}
		>
			<Canvas shadows={true}>
				{/*  
        <Html center distanceFactor={1}>
        <h1 style={{ color: "black" }}>Price!</h1>
      </Html> */}

				<ambientLight intensity={0.1} />

				<Suspense fallback={<FallbackComponent />}>
					<Room width={size.width} height={size.height} color={color} />
				</Suspense>
			</Canvas>
		</div>
	);
}
