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

const Countdown = () => {

    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')

    const [status, setStatus] = useState(STATUS.INITIAL);
    const [secondsRemaining, setSecondsRemaining] = useState(0)
    const intervalRef = useRef(); 


    const secondsOnTimer = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60

    const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

  
    const startStopCountdown = () => {

              if (isNaN(totalSeconds) || (timeMinInput === '' && timeSecInput === '') || totalSeconds <= 0) {
                alert('Please enter a valid time.');
                }
              else {
                if (status !== STATUS.STARTED) {
                      if (secondsRemaining === 0) {
                        setSecondsRemaining(totalSeconds);
                      }
                  setStatus(STATUS.STARTED);
                } 
                else {
                  setStatus(STATUS.STOPPED); 
                }
             }
        }
        ;

    const resetCountdown = () => {
      setStatus(STATUS.STOPPED);
      const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);
      setSecondsRemaining(totalSeconds);
    }

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsRemaining(0);
        clearInterval(intervalRef.current); 
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  

    // const clearInput = () => {
    //     setTimeMinInput(''); // Clear inputs after starting
    //     setTimeSecInput('');
    //     setTimeHrInput('');
    // }

    useEffect(() => {
        if (status === STATUS.STARTED) {
          const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

          setSecondsRemaining((prev) => {
            if (prev > 0) return prev - 1;
            setStatus(STATUS.STOPPED); // Stop if time reaches 0
            return 0;
          });

          intervalRef.current = setInterval(() => {
            setSecondsRemaining((prev) => { 
              if (prev > 0) return prev - 1;
              startStopCountdown();
              return 0;
            });
          }, 1000);
        }
    
        return () => clearInterval(intervalRef.current); 
      }, [status]);

      //|| status === STATUS.STOPPED && secondsRemaining === 0


    return (
        <div className="App"> 
            <TimerContainer isActive={status === STATUS.STARTED} isInitial={status === STATUS.INITIAL}>
            <TimerTitle>Countdown</TimerTitle> 
              <Timer>
              {status === STATUS.INITIAL  && (
              <Inputs>
              <Input>     
                  <input 
                      style={{ maxWidth: '3rem', border: '0px solid white', fontSize: '2rem', textAlign: 'right' }}
                      id="timeMinInput" 
                      placeholder='10'
                      value={timeMinInput}
                      onChange={e=>{
                          setTimeMinInput(e.target.value);
                      }}
                      disabled={secondsRemaining > 0}/>
              </Input>
              <Input>:
                  <input 
                      style={{ maxWidth: '3rem', border: '0px solid white', fontSize: '2rem', textAlign: 'left' }}
                      id="timeInput" 
                      value={timeSecInput}
                      placeholder='00'
                      onChange={e=>{
                          setTimeSecInput(e.target.value);
                      }}
                      disabled={secondsRemaining > 0}/>
              </Input>
              </Inputs>
              )}

              {secondsRemaining !== 0 && status !== STATUS.FASTFORWARDED &&
              <TimeDisplay isActive={status === STATUS.STARTED}>
                {hoursOnTimer > 0 && ( <> {String(hoursOnTimer).padStart(2, '0')}:</>)}
                {minutesOnTimer < 10 ? minutesOnTimer : String(minutesOnTimer)}:
                  {String(secondsOnTimer).padStart(2, '0')}
              </TimeDisplay>
              }
              
              {status === STATUS.FASTFORWARDED && 
              <div style={{fontSize: '1rem',  textTransform: 'uppercase',   letterSpacing: '.2rem'}}>
              Time's Up! 
              </div>
              }

              

              </Timer>
              
              {status !== STATUS.INITIAL &&
            <div  style={{fontSize: '0.75rem', textAlign: 'center', color: 'darkgrey', padding: '0.5rem'}} >Countdown for: 
              {totalSeconds > 60 && ( <> {String(timeMinInput).padStart(2, '0')}:</>)}
              {String(timeSecInput).padStart(2, '0')||'00'}
              </div>}
              
              
              

            <Buttons>
                
            {status !== STATUS.FASTFORWARDED &&     
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Stop' : 'Start'}
                </Button>}

            {status !== STATUS.INITIAL && secondsRemaining !== totalSeconds &&
                <Button 
                    onClick={resetCountdown} 
                    style={{backgroundColor: 'navy'}}>
                    Reset
                </Button>}

            {status === STATUS.FASTFORWARDED &&     
            <Button 
            onClick={initialCountdown} 
            style={{backgroundColor: 'steelblue'}}>
            New Input
            </Button>
             }

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


export default Countdown;
