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


    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')

    const [status, setStatus] = useState(STATUS.INITIAL);
    const [secondsPassed, setSecondsPassed] = useState(0)
    const intervalRef = useRef(); 

    const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);


    const secondsOnTimer = secondsPassed % 60
    const minutesRemaining = (secondsPassed - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60


        const startStopCountdown = () => {

          if (isNaN(totalSeconds) || (timeMinInput === '' && timeSecInput === '') || totalSeconds <= 0) {
            alert('Please enter a valid time.');
            }
          else {
            if (status !== STATUS.STARTED) 
              {
                  if (status === STATUS.INITIAL) { //resetting the input to 0 when user clicks "new input" again
                    setSecondsPassed(0);
                  }
              setStatus(STATUS.STARTED);
            } 
            else {
              setStatus(STATUS.STOPPED); 
            }
         }
    }

    const resetCountdown = () => {
      setStatus(STATUS.STOPPED);
      const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);
      setSecondsPassed(0);
    }

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsPassed(totalSeconds);
        clearInterval(intervalRef.current); 
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  


    useEffect(() => {
        if (status === STATUS.STARTED) {
          const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

          setSecondsPassed((prev) => {
            if (prev < totalSeconds)
            return prev + 1;
          });


          intervalRef.current = setInterval(() => {
            setSecondsPassed((prev) => { 
              if (prev < (totalSeconds-1)) 
                return prev + 1;
              else {
                setStatus(STATUS.STOPPED);
                return totalSeconds;
              }
            });
          }, 1000);

        }
    
        return () => clearInterval(intervalRef.current); 
      }, [status]);


    return (
        <div className="App"> 

            <TimerContainer isActive={status === STATUS.STARTED} isInitial={status === STATUS.INITIAL}>
            <TimerTitle>Stopwatch</TimerTitle> 
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
                      />
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
                      />
              </Input>
              </Inputs>
              )}

            {(status !== STATUS.INITIAL)  && 
              <TimeDisplay isActive={status === STATUS.STARTED}>
                {hoursOnTimer > 0 && ( <> {String(hoursOnTimer).padStart(2, '0')}:</>)}
                {minutesOnTimer < 10 ? minutesOnTimer : String(minutesOnTimer)}:
                  {String(secondsOnTimer).padStart(2, '0')}
              </TimeDisplay>
              }           
              
              
              {/* {status === STATUS.FASTFORWARDED && 
              <div style={{fontSize: '1rem',  textTransform: 'uppercase',   letterSpacing: '.2rem'}}>
              Time's Up! 
              </div>
              } */}

              </Timer>
                            
              {status !== STATUS.INITIAL &&
            <div  style={{fontSize: '0.75rem', textAlign: 'center', color: 'white', padding: '0.5rem'}} >
              <>Stopwatch for </>
              {totalSeconds > 60 && ( <> {String(Number(totalSeconds - (timeSecInput%60))/60)}min </>)}
              {String(timeSecInput % 60)||'00'}sec
              </div>}



              <Buttons>
                
                {(status !== STATUS.FASTFORWARDED && (secondsPassed !== totalSeconds || status === STATUS.INITIAL)) &&
                    <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                    {status === STATUS.STARTED ? 'Pause':'Start'}
                    </Button>}
    
                {status !== STATUS.INITIAL && secondsPassed === totalSeconds &&
                    <Button 
                        onClick={resetCountdown} 
                        style={{backgroundColor: 'navy'}}>
                        Restart
                    </Button>}
    
                {(status === STATUS.FASTFORWARDED || (secondsPassed === totalSeconds && status !== STATUS.INITIAL)) &&     
                <Button 
                onClick={initialCountdown} 
                style={{backgroundColor: 'steelblue'}}>
                New Input
                </Button>
                 }
    
                {status !== STATUS.INITIAL && status !== STATUS.FASTFORWARDED && secondsPassed !== totalSeconds &&    
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

