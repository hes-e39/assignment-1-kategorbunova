import styled from "styled-components";

const Timers = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-between;
  gap: 5rem;
    flex-basis: 100%;
    margin: 3rem 10rem;

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
  flex-basis: 100%;
  flex-grow: 1;
`;

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  width: 300px;
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

const SupportText = styled.div`
  font-size: 0.75rem; 
  color: lightgrey; 
  padding: 0.5rem;
  display: flex;
  gap: 1.5px;
  justify-content: center;

`


  export {Button, Buttons, Input, Inputs, TimeDisplay, TimerContainer, Timer, TimerTitle, SupportText, Timers};
