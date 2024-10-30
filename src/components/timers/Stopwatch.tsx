import {useState, useEffect, useRef} from 'react'
import { Buttons, Button, Input, Inputs, TimerContainer, Timer, TimerTitle, TimeDisplay } from '../../views/TimersView';

const STATUS = {
    INITIAL: 'Initial',
    STARTED: 'Started',
    STOPPED: 'Stopped',
    FASTFORWARDED: 'Fastforwarded'
  };

function convertToSeconds(timeMinInput: number, timeSecInput: number) {
    return (Number(timeMinInput || '0') * 60) + Number(timeSecInput || '0');
}

const Stopwatch = () => {

    const [status, setStatus] = useState(STATUS.INITIAL);
    const [secondsPassed, setSecondsPassed] = useState(0)
    const intervalRef = useRef(); 


    const secondsOnTimer = secondsPassed % 60
    const minutesRemaining = (secondsPassed - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60

  
    const startStopCountdown = () => {

                if (status !== STATUS.STARTED) {
                  setStatus(STATUS.STARTED);
                } else {
                  setStatus(STATUS.STOPPED);             
             }
        }
        ;

    const resetCountdown = () => {
      setStatus(STATUS.STOPPED);
      setSecondsPassed(0);
    }

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsPassed(0);
        clearInterval(intervalRef.current); 
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  


    useEffect(() => {
        if (status === STATUS.STARTED) {

          setSecondsPassed((prev) => {
            return prev + 1;
          });

          intervalRef.current = setInterval(() => {
            setSecondsPassed((prev) => { 
              return prev + 1;
            });
          }, 1000);
        }
    
        return () => clearInterval(intervalRef.current); 
      }, [status]);

      //|| status === STATUS.STOPPED && secondsRemaining === 0


    return (
        <div className="App"> 

            <TimerContainer isActive={status === STATUS.STARTED} isInitial={status === STATUS.INITIAL}>
            <TimerTitle>Stopwatch</TimerTitle> 
              <Timer>

              
              <TimeDisplay isActive={status === STATUS.STARTED}>
                {hoursOnTimer > 0 && ( <> {String(hoursOnTimer).padStart(2, '0')}:</>)}
                {minutesOnTimer < 10 ? minutesOnTimer : String(minutesOnTimer)}:
                  {String(secondsOnTimer).padStart(2, '0')}
              </TimeDisplay>
              
              
              {/* {status === STATUS.FASTFORWARDED && 
              <div style={{fontSize: '1rem',  textTransform: 'uppercase',   letterSpacing: '.2rem'}}>
              Time's Up! 
              </div>
              } */}

              </Timer>
            <Buttons>
                
            {status !== STATUS.FASTFORWARDED &&     
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Stop' : 'Start'}
                </Button>}

            {status !== STATUS.INITIAL &&
                <Button 
                    onClick={resetCountdown} 
                    style={{backgroundColor: 'navy'}}>
                    Reset
                </Button>}

            {status !== STATUS.INITIAL && status !== STATUS.FASTFORWARDED &&
            <Button 
                    onClick={fastforwardCountdown} 
                    //type="button" 
                    style={{backgroundColor: 'darkgreen'}}>
                    Forward
                </Button>}   

            
              
            </Buttons>
            </TimerContainer>
        </div>
      )
};


export default Stopwatch;

