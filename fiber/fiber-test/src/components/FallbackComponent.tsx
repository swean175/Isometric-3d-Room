import { Html } from "@react-three/drei";

export default function FallbackComponent() {
	return (
		<Html center distanceFactor={1}>
			<div className="fallback">
				<p>Loading...</p>
			</div>
		</Html>
	);
}
