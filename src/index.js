import React from 'react'
import ReactDOM from 'react-dom'

const { useState, useEffect } = React
const rootElement = document.getElementById('root')
const presets = [
  ["#bd4faf","#5794db"],
  ["#0080ff","#388363","#fcf8d6"],
  ["#246655","#462466","#b66d52"],
  ["#41b497","#7f47c5","#c29c46"],
  ["#71c66c","#ff8000","#db5779"],
  ["#c1ac6b","#bd4faf","#57db73","#5794db","#6657db","#db5779","#def2a0"],
  ["#ff0000","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"]
]
const currentSet = ["#71c66c","#ff8000","#db5779"]
function PresetsSection({parentFunction}) {
  const [items, setItems] = React.useState(presets)
  return (
    <section>
      <span className="label">Presets</span>
      <div className="presets">
        {items.map(item => (
          <Preset 
            key={item}
            colorSeries={item.toString()}
            changePreset={() => parentFunction(item)}
            />
        ))}
      </div>
    </section>
  )
}
function Preset({colorSeries, changePreset}) {
  return (
    <div className="preset" 
      style={{ backgroundImage: `linear-gradient(90deg, ${colorSeries})` }}
      onClick={() => changePreset()}
    ></div>
  )
}
function ColorList({colorSet, removeFunction, changeFunction}) {
  return (
    <ol className="color-list">
      {colorSet.map((color, index) => (
        <ColorItem 
          key={index}
          colorValue={color} 
          removeColor={() => removeFunction(index)} 
          changeColor={() => changeFunction(event, index)} />
      ))}
    </ol>
  )
}
function ColorItem({colorValue, removeColor, changeColor}) {
  return (
    <li className="color">
      <input type="color" 
        className="color__input" 
        value={colorValue} 
        onChange={(event) => changeColor(event)} />
      <button type="button" 
        className="color__remove" 
        onClick={() => removeColor()}>✖</button>
    </li>
  )
}
function CopyToClipboardButton() {
  const copy = () => {
    const code = document.getElementById('output')
    code.select()
    code.setSelectionRange(0, 99999)
    document.execCommand("copy")
    code.setSelectionRange(0, 0)
  }
  return (
    <button 
      type="button"
      className="button button--copy"
      onClick={copy}>Copy to Clipboard</button>
  )
}
function getCssKeyframes(direction) {
  switch(direction) {
    case 'left':
      return `@keyframes animateBg {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
}`
    case 'right':
      return `@keyframes animateBg {
  0% { background-position: 100% 0%; }
  100% { background-position: 0% 0%; }
}`
    case 'up':
      return `@keyframes animateBg {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}`
    case 'down':
      return `@keyframes animateBg {
  0% { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
}`
  }
}
function getCode({bg, bgwidth, bgheight, degrees, direction, duration}) {
  const keyframes = getCssKeyframes(direction)
  return (`.animated-gradient {
  animation: animateBg ${duration}s linear infinite;
  background-image: linear-gradient(${degrees}deg,${bg});
  background-size: ${bgwidth}vw ${bgheight}vh;
}
${keyframes}
`)
}
function Output({bg, bgwidth, bgheight, degrees, direction, duration}) {
  let code = getCode({bg, bgwidth, bgheight, degrees, direction, duration})
  return (
    <div>
      <textarea
        value={code} 
        readOnly={true}
        className="output" 
        id="output"/>
    </div>
  )
}
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)  
  function handleChange(e) {
    setValue(e.target.value)
  }
  return {
    value,
    onChange: handleChange
  }
}
function Generator({title}) {
  const [colorSet, setColorSet] = React.useState(currentSet)
  const addColor = () => {
    let newColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setColorSet(colorSet => [...colorSet, newColor])
  }
  const removeColor = (index) => {
    const temp = [...colorSet]
    temp.splice(index, 1)
    setColorSet(temp)
  }
  const changeColor = (event, index) => {
    const temp = [...colorSet]
    temp[index] = event.target.value
    setColorSet(temp)
  }
  const duration = useFormInput(14)
  const bg = `${colorSet.toString()},${colorSet[0]},${colorSet[1]}`
  const direction = useFormInput('left')
  const bgwidth = (direction.value === 'left' || direction.value === 'right') ? (100 * (colorSet.length + 1)) : 100
  const bgheight = (direction.value === 'left' || direction.value === 'right') ? 100 : (100 * (colorSet.length + 1))
  const degrees = (direction.value === 'left' || direction.value === 'right') ? '90' : '0'

  return (
    <div 
      className="generator"
      style={{ backgroundImage: `linear-gradient(${degrees}deg, ${bg})`, 
             backgroundSize: `${bgwidth}vw ${bgheight}vh`,
             animationDuration: `${duration.value}s`,
             animationName: `animateBg-${direction.value}`}}>
      <article 
        className="container">
        <h1 
          className="title">Pure CSS Animated Gradient Generator</h1>
        <PresetsSection 
          parentFunction={(item)=>{setColorSet(item)}}/>
        <button 
          type="button"
          className="button button--add"
          onClick={addColor}>Add Color</button>
        <ColorList 
          colorSet={colorSet} 
          removeFunction={(index)=> removeColor(index)}
          changeFunction={(event, index)=> changeColor(event, index)}/>
          
        <div>
          <label htmlFor="duration">
            <span><strong>Duration</strong> (seconds)</span>
            <input id="duration" 
              className="input--textlike duration" 
              type="number" 
              min="1" 
              max="1000" 
              {...duration}/>
          </label>
        </div>
        <div>
          <label htmlFor="direction">
            <strong>Direction</strong>
            <select id="direction"
              className="input--textlike direction"
              {...direction}>
              <option value="left">&#129044; Left</option>
              <option value="right">&#129046; Right</option>
              <option value="up">&#129045; Up</option>
              <option value="down">&#129047; Down</option>
            </select>
          </label>
        </div>
        <CopyToClipboardButton />
        <Output 
          bg={bg} 
          bgwidth={bgwidth} 
          bgheight={bgheight} 
          direction={direction.value}
          degrees={degrees} 
          duration={duration.value}/>
      </article>
    </div>
  )
}
const app = <Generator />
ReactDOM.render(app, rootElement)