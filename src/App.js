import React from 'react';

import Top from './components/Top.js';
import Game from './components/Game.js';

export default function App() {
  return (
    <div className="tenzies">

      <Top/>
      <Game
        numbersCount={10}
      />

    </div>
  );
}