import {useState, useEffect, useRef} from 'react'
import styled from "styled-components";
import { Buttons, Button, Input, Inputs, TimerContainer, Timer } from '../../views/TimersView';

const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
  };

function convertToSeconds(timeMinInput: number, timeSecInput: number) {
    return parseInt(timeMinInput || '0') * 60 + parseInt(timeSecInput || '0');
}

const TimeDisplay = styled.div`
  font-size: 2rem;
  color: ${(props) => (props.isActive ? 'black' : 'grey')}; 
`;

const Countdown = () => {

    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')
    const [status, setStatus] = useState(STATUS.STOPPED);
    const [secondsRemaining, setSecondsRemaining] = useState(0)
    const intervalRef = useRef(); 


    const secondsOnTimer = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60
  
    const startCountdown = () => {
        if (secondsRemaining === 0) {
            const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);
            setTimeMinInput('');
            setTimeSecInput('');
            if (totalSeconds > 0) {
              setSecondsRemaining(totalSeconds);
            } else {
              alert('Please enter a valid time.');
              return;
            }
          }
          setStatus(STATUS.STARTED); 
        };

    const stopCountdown = () => {
      setStatus(STATUS.STOPPED);
      clearInterval(intervalRef.current); 
    }

    const resetCountdown = () => {
      stopCountdown();
      setSecondsRemaining(0);
      setTimeMinInput('');
      setTimeSecInput('');
    }

    useEffect(() => {
        if (status === STATUS.STARTED) {
          intervalRef.current = setInterval(() => {
            setSecondsRemaining((prev) => {
              if (prev > 0) return prev - 1;
              stopCountdown();
              return 0;
            });
          }, 1000);
        }
    
        return () => clearInterval(intervalRef.current); 
      }, [status]);

    return (
        <div className="App">
            <Inputs>
            <Input>     
                <input 
                    style={{ width: '1rem', padding: '10px' }}
                    id="timeMinInput" 
                    value={timeMinInput}
                    onChange={e=>{
                        setTimeMinInput(e.target.value);
                    }}/>
                <div>min</div>
            </Input>
            <Input> 
                <input 
                    style={{ width: '1rem', padding: '10px' }}
                    id="timeInput" 
                    value={timeSecInput}
                    onChange={e=>{
                        setTimeSecInput(e.target.value);
                    }}/>
                    <div>sec</div>
            </Input>
            </Inputs>
            <Buttons>
                <Button 
                    onClick={startCountdown} 
                    //type="button" 
                    style={{backgroundColor: 'darkgreen'}}>
                    Start
                </Button>
                <Button 
                    onClick={stopCountdown} 
                    //type="button" 
                    style={{backgroundColor: 'darkred'}}>
                    Stop
                </Button>
                <Button 
                    onClick={resetCountdown} 
                    //type="button" 
                    style={{backgroundColor: 'grey'}}>
                    Reset
                </Button>
            </Buttons>
            <Timer>
            <TimeDisplay isActive={status === STATUS.STARTED}>
                {String(hoursOnTimer).padStart(2, '0')}:
                {String(minutesOnTimer).padStart(2, '0')}:
                {String(secondsOnTimer).padStart(2, '0')}
             </TimeDisplay>
            
            </Timer>
        </div>
      )
};


export default Countdown;
