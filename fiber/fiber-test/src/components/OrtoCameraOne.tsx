import { useGLTF, OrthographicCamera} from '@react-three/drei'
import * as THREE from 'three'
import type{ GLTF } from 'three-stdlib'





type RoomGLTF = GLTF & {
  nodes: {
    camera: THREE.Mesh
  }

  camera: THREE.OrthographicCamera
  // actions: {
  //   camAction: THREE.AnimationAction
  //   screenAction: THREE.AnimationAction
  // }
  isDefault: boolean
  width: number
  height: number

}

export default function OrtoCameraOne({ ...props }:RoomGLTF) {

   
  

    // const zoomLevel = useRef(20)
    

  return (
 
      <OrthographicCamera
      name="camera" 
        makeDefault={props.isDefault}
        position={[9.985, 11.939, 9.892]}
        rotation={[-0.527, 0.786, 0.39]}
        // Blender's "Orthographic Scale" corresponds to the frustum size 
        far={100}
        near={0.001}

      />
  
  )
}

useGLTF.preload('/room.gltf')