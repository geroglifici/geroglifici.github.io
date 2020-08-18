import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';

import data from "./transliteration/index.json"; 

import Grid from '@material-ui/core/Grid';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

function translittera(paroleLatine, vecchioTesto, testoEgiziano, soloUltima){
  if (paroleLatine === []){
    return ""
  }
  // if(soloultima) per evitare di repitere ricerche ma non funziona bene
  if (false){
    if(data[paroleLatine[paroleLatine.length]] === undefined){
      if (paroleLatine[paroleLatine.length] !== undefined){
        return testoEgiziano + paroleLatine[paroleLatine.length]
      }
      return testoEgiziano
    }
    return testoEgiziano + String.fromCodePoint(data[paroleLatine[paroleLatine.length]]);
  }
  else {
    return paroleLatine.map(val => {
      let carattere = data[val];
      if (carattere === undefined){
        if (val !== undefined){
          return val
        }
        return ""
      }
      carattere = carattere.geroglifico;
      if (carattere.length < 7) {
        return carattere
      }
      return String.fromCodePoint(carattere);

    }
      ).join("");
  }
}

function App() {
  const [testoLatino, settestoLatino] = useState("");
  const [testoEgiziano, settestoEgiziano] = useState("");
  const [layoutName, setlayoutName] = useState("default");
  const [detectCaps, setdetectCaps] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 16) {
        setlayoutName(layoutName === "default" ? "shift" : "default");
      }
      else if (event.keyCode === 20) {
        setlayoutName(layoutName === "default" ? "shift" : "default");
        setdetectCaps(!detectCaps);
      }
      else if (!detectCaps) {
        setlayoutName("default");
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [layoutName, detectCaps]);
  
  var onChange = (input) => {
    console.log("Input changed", input);
  }

  var onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      setlayoutName(layoutName === "default" ? "shift" : "default")
    };
    console.log("Button pressed", button);
  }

  var handleChange = (event) => {
    let soloUltimaParola = true;
    let parole = event.target.value;
    parole = parole.replace("x", "\u1E2B")
    parole = parole.replace("X", "\u1E96")
    parole = parole.replace("q", "\u1E33")
    parole = parole.replace("a", "\u1D9C")
    parole = parole.replace("A", "\uA723")
    parole = parole.replace("S", "\u015D") 
    parole = parole.replace("D", "\u1E0F")
    // Occhio che funziona solo con la tastiera italiana così
    parole = parole.replace("è", "\u1E25")
    parole = parole.replace("+", "\u1E6F")
    parole = parole.replace("ì", "ı͗")
    let paroleLatine = parole.split(" ");
    let vecchioTesto = testoLatino.split(" ");
    if (paroleLatine.length === vecchioTesto.length){
      soloUltimaParola = false;
    }
    settestoLatino(parole);
    settestoEgiziano(translittera(paroleLatine, vecchioTesto, testoEgiziano, soloUltimaParola));
  }

  return (
    <div className="App">
      <header className="App-header">
      <div style={{color:"white"}}>
        {String.fromCodePoint(data.M.geroglifico)}
      </div>
      <Grid 
      container 
      spacing={3}
      direction="row"
      >
        <Grid item xs={6}>
          <textarea 
            id="testoLatino"
            name="latino"
            spellCheck="false"
            autoFocus
            onChange={handleChange}
            value={testoLatino}/>
        </Grid>
        <Grid item xs={6}>
          <textarea 
            id="testoEgiziano"
            name="egiziano"
            readOnly
            value={testoEgiziano}/>
        </Grid>
      </Grid>
      <Keyboard
        onChange={onChange}
        onKeyPress={onKeyPress}
        layoutName={layoutName}
        layout={{
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - ı͗ {bksp}",
            "{tab} \u1E33 w e r t y u i o p \u1E25 \u1E6F \\",
            "{lock} \u1D9C s d f g h j k l ; ' {enter}",
            "{shift} z \u1E2B c v b n m , . / {shift}",
            "{space}"
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} \uA723 \u015D \u1E0F F G H J K L : " {enter}',
            "{shift} Z \u1E96 C V B N M < > ? {shift}",
            "{space}"
          ]
        }}
      />
      </header>
    </div>
  );
}

export default App;
