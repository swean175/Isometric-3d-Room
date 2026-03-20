import "./App.css";
import {  Moon, Sun } from "lucide-react";
import type React from "react";
import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import Scene from "./components/Scene";
import { Select, SelectItem } from "./components/Select";
import { useSystemTheme } from "./components/custom-hooks/useSystemTheme";
import useTheme from "./components/custom-hooks/useTheme";



interface Size {
	width: number;
	height: number;
}

function App() {
	const sceneRef = useRef<HTMLCanvasElement>(null);
	const [color, setColor]: [
		string,
		React.Dispatch<React.SetStateAction<string>>,
	] = useState("none");
	const [sceneSize, setSceneSize] = useState<Size>({ width: 600, height: 600 });
	const systemTheme = useSystemTheme()? "dark" : "light";
	
	        const [theme, setTheme]: [
            string,
            React.Dispatch<React.SetStateAction<string>>,
        ] = useState(() => localStorage.getItem("theme") || systemTheme);


	useEffect(() => {
		localStorage.setItem("theme", theme);
		
			if (theme === "system") {
				useTheme({ theme: systemTheme });
			} else {
				useTheme({ theme });
			}
		
		
	}, [theme]);
	

	useLayoutEffect(() => {
		if (sceneRef.current) {
			const { width, height } = sceneRef.current.getBoundingClientRect();
			const finalWidth = Math.round(width * 0.75);
			const finalHeight = Math.round(height * 0.85);
			setSceneSize({ width: finalWidth, height: finalHeight });
		}
	}, []);


	return (
		<main>
			<section>
				<aside>
					<Select selectionMode={"single"} value={theme} onChange={setTheme}>
						<SelectItem textValue={"system"} id={"system"}>
							System 💾
						</SelectItem>
						<SelectItem textValue={"light"} id={"light"}>
							Light <Sun />
						</SelectItem>
						<SelectItem textValue={"dark"} id={"dark"}>
							Dark <Moon />
						</SelectItem>
					</Select>
				</aside>
				<div className="controls">
					<button  onClick={() => setColor("rgba(57, 29, 29, 0.4)")}>
						Dark
					</button>
					<button  onClick={() => setColor("none")}>
						Neutral
					</button>
					<button  onClick={() => setColor("rgba(237, 245, 16, 0.9)")}>
						Bright
					</button>
				</div>
			</section>

			<section id="scene" ref={sceneRef}>
				<Scene color={color} size={sceneSize} />
			</section>
		</main>
	);
}

export default App;
