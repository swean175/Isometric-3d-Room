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
	] = useState("rgb(211, 182, 96)");
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
					<Select selectionMode={"single"} aria-label="theme" aria-labelledby="themeLabel" value={theme} onChange={setTheme}>
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
					<button aria-label="brown" aria-labelledby="brownBtnLabel" onClick={() => setColor("rgb(57, 29, 29)")}>
						Dark
					</button>
					<button aria-label="neutral" aria-labelledby="neutralBtnLabel" onClick={() => setColor("rgb(211, 182, 96)")}>
						Neutral
					</button>
					<button aria-label="bright" aria-labelledby="brightBtnLabel" onClick={() => setColor("none")}>
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
