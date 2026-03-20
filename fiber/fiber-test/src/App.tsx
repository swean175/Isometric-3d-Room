import './App.css'
import React, {  useState, useRef, useLayoutEffect, useEffect } from 'react'
import  Scene  from './components/Scene'
import {Select, SelectItem} from './components/Select';
import { Moon, Sun, Glasses } from 'lucide-react';

//label={<Glasses/>}

interface Size {
  width: number;
  height: number;
}


function App() {
  const sceneRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("#FF0000")
const [sceneSize, setSceneSize]  = useState<Size>({ width: 600, height: 600 });
const [theme, setTheme] : [string, React.Dispatch<React.SetStateAction<string>>] = useState(() => localStorage.getItem('theme') || 'system');

  useLayoutEffect(() => {
    if (sceneRef.current) {
      const { width, height } = sceneRef.current.getBoundingClientRect();
        const finalWidth = Math.round(width * 0.75);
    const finalHeight = Math.round(height * 0.85);
      setSceneSize({ width: finalWidth, height: finalHeight });
    }
  }, []);

    useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.colorScheme = 'dark';
      document.body.className = 'dark-body';
      localStorage.removeItem('theme');
      console.log("dark chosen " +theme + " " + root.style.colorScheme)      
    }
     else {
      root.style.colorScheme = theme
      document.body.className = 'light-body';
      localStorage.setItem('theme', theme);
        console.log("else chosen " +theme + " " + root.style.colorScheme) 
    }
  }, [theme]);

  return (
    <main >
         <section>
        <aside>
         <Select selectionMode={"single"} value={theme} onChange={setTheme}>
          <SelectItem textValue={"system"} id={"system"} >System 💾</SelectItem>
          <SelectItem textValue={"light"} id={"light"}>Light <Sun/></SelectItem>
          <SelectItem textValue={"dark"} id={"dark"}>Dark <Moon/></SelectItem>
          </Select>
</aside>
            <div className = "controls">
              <button className = "logo" onClick={() => setColor("#FF0000")}>Dark</button>
              <button className = "logo" onClick={() => setColor("#00FF00")}>Neutral</button>
              <button className = "logo" onClick={() => setColor("#0000FF")}>Bright</button>
            </div>
        
      </section>


   
<section id="scene" ref={sceneRef}>

        <Scene color={color} size={sceneSize}/>
</section>

    </main>

  )
}

export default App
