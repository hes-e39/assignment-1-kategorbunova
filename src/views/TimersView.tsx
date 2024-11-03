
import {  TimerContainer, Timers } from '/Users/kategorbunova/Library/Mobile Documents/com~apple~CloudDocs/Personal/Personal - HES School/JS React/assignment-1-kategorbunova/src/utils/styles.tsx'

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

const TimersView = () => {

  const timers = [
    { title: "Stopwatch", C: <Stopwatch /> },
    { title: "Countdown", C: <Countdown /> },
    { title: "XY", C: <XY /> },
    { title: "Tabata", C: <Tabata /> },
  ];

  return (
    <Timers>
      {timers.map((timer) => (
        <div key={`timer-${timer.title}`}>
          <TimerContainer> {timer.C} </TimerContainer>
        </div>
      ))}
    </Timers>
  
  );
};

export default TimersView;
