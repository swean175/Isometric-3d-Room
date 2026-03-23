import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "../App.css";
import FallbackComponent from "./FallbackComponent";
import Room from "./Room";

export default function Scene({
	color,
	size,
}: {
	color: string;
	size: { width: number; height: number };
}) {
	return (
		<div
			aria-label="3D Scene"
			style={
				size.width > 578
					? {
							width: size.width + "px",
							height: size.height + "px",
						}
					: {
							margin: "auto;",
						}
			}
		>
			<Canvas shadows={true}>
				<ambientLight intensity={0.1} />

				<Suspense fallback={<FallbackComponent />}>
					<Room width={size.width} height={size.height} color={color} />
				</Suspense>
			</Canvas>
		</div>
	);
}
