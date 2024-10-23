import styled from "styled-components";
import {useState, useEffect, useRef} from 'react'


import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

const Timers = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
  gap: 2rem;
`;

const TimerTitle = styled.div`
  font-size: 2em;
  font-family: Georgia, serif;
  color: #23303d;
  text-align: center;
  padding: 1rem;
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-content: space-between;
  background-color: lightgrey;
    border-radius: 10px;
`;

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-content: space-between;
  padding: 50px;
  margin: 10px;
  font-size: 3rem;
  width: 15rem;
  height: 5rem;
  background-color: #efefef;
  border-radius: 10px;
  color: #935430;
  font-family: "Gill Sans", sans-serif;
  font-variant: small-caps;
`;

const Button = styled.button`
color: white;
font-size: 1em;
margin: 0.25em;
padding: 1em 1em;
border-radius: 100px;
border: 2px solid white;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
  padding-top: 1rem;
`

const Input = styled.div`
  font-size: 1em;
  font-family: "Gill Sans", sans-serif;
  color: #23303d;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
  gap: 2rem;
`;

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
          <TimerContainer>
          <TimerTitle>{timer.title}</TimerTitle>
          <div>{timer.C}</div>
          </TimerContainer>
        </div>
      ))}
    </Timers>
  
  );
};

export default TimersView;
export {Button, Buttons, Input, Inputs, TimerContainer, Timer};