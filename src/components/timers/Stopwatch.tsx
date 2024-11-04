import {useState, useEffect, useRef} from 'react'
import { Buttons, Button,  Inputs, TimerContainer, Timer, TimerTitle, TimeDisplay, SupportText, Input } from '../../utils/styles';
import { convertToSeconds, DisplayForText, DisplayForTime } from '../../utils/helpers';
import { STATUS } from '../../utils/constants';
import type { StatusType } from '../../utils/constants';

const Stopwatch = () => {


    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')

    const [status, setStatus] = useState<StatusType>(STATUS.INITIAL);
    const [secondsPassed, setSecondsPassed] = useState(0)
    const intervalRef = useRef<number | null>();

    const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);


    const secondsOnTimer = secondsPassed % 60
    const minutesRemaining = (secondsPassed - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60


    const startStopCountdown = () => {

          if (Number.isNaN(totalSeconds) || (timeMinInput === '' && timeSecInput === '') || totalSeconds <= 0) {
            alert('Please enter a valid time.');
            }
          else if (totalSeconds > 3600) {
            alert("Friendly caution: excercise over an hour can lead to overtraining. Please enter a time under an hour.")
          }
          else {
            if (status === STATUS.INITIAL) { //resetting the input to 0 when user clicks "new input" again
              setSecondsPassed(0);}
            if (status !== STATUS.STARTED) {
              setStatus(STATUS.STARTED);
            } 
            else {
              setStatus(STATUS.STOPPED); 
            }
         }
    }

    const resetCountdown = () => {
      setStatus(STATUS.STOPPED);
      setSecondsPassed(0);
    }

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsPassed(totalSeconds);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
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
            return prev; //this is added to fix a TypeScript error to ensure we never return undefined (in case of else)
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
    
        return () =>
          {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          } 
      }, [status, timeMinInput, timeSecInput]);


    return (
        <div className="App"> 

            <TimerContainer isActive={status === STATUS.STARTED}>

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
                <DisplayForTime hoursOnTimer={hoursOnTimer} minutesOnTimer={minutesOnTimer} secondsOnTimer= {secondsOnTimer} />
              </TimeDisplay>
              }           
              </Timer>

              {status !== STATUS.INITIAL && (status !== STATUS.FASTFORWARDED) && (secondsPassed !== totalSeconds) &&
                <SupportText>
                  In progress: stopwatch for
                  <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
                </SupportText>
              }

              {(status === STATUS.FASTFORWARDED || (secondsPassed === totalSeconds && status !== STATUS.INITIAL)) &&
              <SupportText>
                Finished: stopwatch for
                <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
              </SupportText>
              }

              {status === STATUS.INITIAL &&
              <SupportText>
                Please input time for a stopwatch above
              </SupportText>}


              <Buttons>
                {(status !== STATUS.FASTFORWARDED && (secondsPassed !== totalSeconds || status === STATUS.INITIAL)) &&
                    <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                    {status === STATUS.STARTED ? 'Pause':'Start'}
                    </Button>}
    
                {status !== STATUS.INITIAL  &&
                    <Button 
                        onClick={resetCountdown} 
                        style={{backgroundColor: 'navy'}}>
                        Reset
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

