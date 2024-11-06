import React, { useState } from 'react';
import Survey from './component/Survey';
import './Survey.css';

const App = () => {
  const [startSurvey, setStartSurvey] = useState(false);

  return (
    <div className="appContainer">
      {!startSurvey ? (
        <div className="welcomeContainer">
          <h1 className="welcomeHeader">Welcome to the Customer Survey</h1>
          <button onClick={() => setStartSurvey(true)} className="startButton">Start</button>
        </div>
      ) : (
        <Survey />
      )}
    </div>
  );
};

export default App;
