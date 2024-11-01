import styled from "styled-components";
import {useState, useEffect, useRef} from 'react'


import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

const Timers = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-between;
  gap: 2rem;
`;

const TimerTitle = styled.div`
  font-size: 1em;
  font-family: sans-serif;
  color: white;
  text-align: center;
  padding-top: 2rem;
  text-transform: uppercase;
letter-spacing: .2rem;
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-between;
  background-color: ${(props) => (props.isActive ? 'green' : 'maroon' || props.isInitial ? 'grey' : 'black')}; 
  border-radius: 10px;

`;

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  width: 200px;
  height: 5rem;
  padding: 60px;
  margin: 30px;
  margin-bottom: 15px;
  font-size: 2rem;
  align-content: space-between;
  background-color: white;
  border-radius: 10px;

`;

const TimeDisplay = styled.div`
  border: 2px solid white;
  color: ${(props) => (props.isActive ? 'black' : 'grey')}; 
`;



const Button = styled.button`
color: white;
margin: 0.25em;
border-radius: 10px;
border: 2px solid;
width: 70px;
height: 50px;
background-color: ${(props) => (props.isActive ? 'maroon' : 'green' )}; 
`
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
  padding-bottom: 1rem;
`

const Input = styled.div`
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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
          <TimerContainer> {timer.C} </TimerContainer>
        </div>
      ))}
    </Timers>
  
  );
};

export default TimersView;
export {Button, Buttons, Input, Inputs, TimeDisplay, TimerContainer, Timer, TimerTitle};