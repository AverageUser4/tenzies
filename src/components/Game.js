import React from 'react';

export default function Game(props) {
  const [buttons, setButtons] = React.useState(getRandomButtonsArray());
  const [tenzies, setTenzies] = React.useState(false);

  const [time, setTime] = React.useState(0);
  const [rolls, setRolls] = React.useState(0);

  const [bestTime, setBestTime] = React.useState(() => parseInt(localStorage.getItem('bestTime')) || '');
  const [bestRolls, setBestRolls] = React.useState(() => parseInt(localStorage.getItem('bestRolls')) || '');

  const buttonElements = buttons.map((button) => {
    return (
      <button 
        key={button.index}
        className={`tenzies__die
          ${button.isLocked && 'tenzies__die--locked'}`}
        onClick={() => toggleLock(button.index)}
      >
        {button.value}
      </button>
    );
  });

  function randomValue() {
    return Math.ceil(Math.random() * 6);
  }

  function getRandomButtonsArray() {
    const a = Array.from(Array(props.numbersCount), (_, i) => i);
    return a.map((_, i) => {
      return {
        value: randomValue(),
        isLocked: false,
        index: i
      };
    })
  }

  function toggleLock(index) {
    setButtons((prevButtons) => 
      prevButtons.map((button) =>
        button.index === index ? 
          { ...button, isLocked: !button.isLocked } : button
      )
    );
  }

  function roll() {
    setRolls((prevRolls) => prevRolls + 1);

    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.isLocked ? button : { ...button, value: randomValue() }
      )
    );
  }

  function reset() {
    setButtons(getRandomButtonsArray());
    setTenzies(false);
  }

  React.useEffect(() => {
    const allLocked = buttons.every(button => button.isLocked);
    const value = buttons[0].value;
    const allSame = buttons.every(button => button.value === value);

    if(!allLocked || !allSame)
      return;

    window.alert('Congratulations!!! YOU WIN!!! YOU\'VE DONE IT! LET\'S GOOOOO!!!!!');
    setTenzies(true);
  }, [buttons]);

  React.useEffect(() => {
    if(!tenzies) {
      setRolls(0)
      setTime(0);
      var intervalId = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    } else {
      if(!bestTime || rolls < bestRolls) {
        localStorage.setItem('bestRolls', rolls);
        setBestRolls(rolls)
      }
      if(!bestTime || time < bestTime) {
        localStorage.setItem('bestTime', time);
        setBestTime(time);
      }

      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);

  }, [tenzies]);


  return (
    <div>

      <div className="tenzies__numbers-container">
  
        {buttonElements}
    
      </div>
    
      <button 
        className="tenzies__roll-button"
        onClick={tenzies ? reset : roll}
      >{tenzies ? 'Reset' : 'Roll'}</button>

      <div className="tracker">

        <span className="tracker__stat">Time: {time}</span>
        <span className="tracker__stat">Rolls: {rolls}</span>

        <span className="tracker__stat">Best Time: {bestTime || 'N/A'}</span>
        <span className="tracker__stat">Least Rolls: {bestRolls || 'N/A'}</span>

      </div>

    </div>
  );
}