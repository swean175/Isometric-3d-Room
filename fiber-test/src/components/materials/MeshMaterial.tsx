import * as THREE from 'three'

type MeshMaterialProps = {
    mat? : THREE.MeshStandardMaterial,
     isEmisive? : boolean,
    reference?: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial | THREE.MeshLambertMaterial | THREE.MeshPhongMaterial | undefined
    }


export default function DeskMaterial({mat, isEmisive, reference}: MeshMaterialProps) {
if (!mat) return null
if (!reference){
    return (
        <meshStandardMaterial
        attach="material" 
        {...mat} 
        // polygonOffset        
        // polygonOffsetFactor={-1} 
        //color={"#4a5e34"}
        transparent 
        opacity={1} 
        emissive={isEmisive?100:0}
      />
)}

    return (
                  <meshStandardMaterial
               ref={reference}
                attach="material" 
                {...mat} 
                // polygonOffset        
                // polygonOffsetFactor={-1} 
                transparent 
                opacity={1} 
                emissive={isEmisive?100:0}
              />
    )
}