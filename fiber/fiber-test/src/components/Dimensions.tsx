import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Box, Html } from "@react-three/drei";
import * as THREE from 'three'



interface CubeProps {
  position: [number, number, number]
  // rotation: [number, number, number]
  scale: [number, number, number]
  vis: boolean
  long: number
  axis: "x" | "y" | "z"
  trans: number
  dimen : string
  textSize : number
  
}

export default function Dimensions({ position, scale, vis, long, axis, trans, dimen, textSize }: CubeProps) {
  const boxRef = useRef<THREE.Mesh>(null);
  const boxMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    if (boxRef.current  ) {
      if (boxRef.current.scale[axis] <= long)
      boxRef.current.scale[axis] += 0.025;
    if (!vis)
      boxRef.current.scale[axis] = 0;
     if (boxMaterialRef.current.opacity <  1)
       boxMaterialRef.current.opacity += 0.01;
     }
  });

  if (vis) return (
    <Box ref={boxRef} position={position} scale={scale} visible={vis}  >
      <meshBasicMaterial ref={boxMaterialRef} color="#dfdfdf" transparent opacity={trans}/>
      <Html raycast={undefined} center distanceFactor={textSize}><h2 className="dimen">{dimen}</h2></Html>
    </Box>
  );
  else
    return (
      <>
      </>
    );
}
