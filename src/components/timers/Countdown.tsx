import {useState, useEffect, useRef} from 'react'
import { Buttons, Button, Input, Inputs, TimerContainer, Timer, TimerTitle, TimeDisplay, SupportText } from '../../utils/styles';
import { convertToSeconds, DisplayForText, DisplayForTime } from '../../utils/helpers';
import { STATUS } from '../../utils/constants';
import type { StatusType } from '../../utils/constants';


const Countdown = () => {

    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')

    const [status, setStatus] = useState<StatusType>(STATUS.INITIAL);
    const [secondsRemaining, setSecondsRemaining] = useState(0)


    const secondsOnTimer = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60

    const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

  
    const startStopCountdown = () => {

      if (Number.isNaN(totalSeconds) || (timeMinInput === '' && timeSecInput === '') || totalSeconds <= 0) {
        alert('Please enter a valid time.');
        }
      else if (totalSeconds > 3600) {
        alert("Friendly caution: excercise over an hour can lead to overtraining. Please enter a time under an hour.")
      }
              
              else {
                if (status !== STATUS.STARTED) 
                  {
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
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  


    const intervalRef = useRef<number | null>();


    useEffect(() => {
        if (status === STATUS.STARTED) {

          //this decrements the seconds immideately without waiting for the first second
          setSecondsRemaining((prev) => {
            if (prev > 1) 
              return prev - 1;
              return prev; //this is added to fix a TypeScript error to ensure we never return undefined
          }
          );

          intervalRef.current = setInterval(() => {
            setSecondsRemaining((prev) => { 
              if (prev > 1) 
                return prev - 1;
              else {
                setStatus(STATUS.STOPPED);
                return 0;
              }
            });
          }, 1000);
        }
        return () => {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } ;
        
      }, [status]);



    return (
        <div className="App"> 

            <TimerContainer isActive={status === STATUS.STARTED}>
            <TimerTitle>Countdown</TimerTitle> 

            {/* INPUTS FOR INITIAL STATE*/} 
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

              {/* TIME DISPLAY*/} 
              {(status !== STATUS.INITIAL)  &&
              <TimeDisplay isActive={status === STATUS.STARTED}>
                <DisplayForTime hoursOnTimer={hoursOnTimer} minutesOnTimer={minutesOnTimer} secondsOnTimer= {secondsOnTimer} />
              </TimeDisplay>
              }
              
              </Timer>

              {/* DYMANIC TEXT LINE*/}

             {/* Show this text at initial state*/} 
             {status === STATUS.INITIAL &&
                <SupportText>
                Please input time for a countdown above
                </SupportText>}
              
              {/* Show this text when timer in progress */}
              {status !== STATUS.INITIAL && (status !== STATUS.FASTFORWARDED) && (secondsRemaining !== 0) &&
                <SupportText>
                In progress: countdown for
                <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
                </SupportText>}

              {/* Show this text when timer is finished or fastforwarded */}
              {(status === STATUS.FASTFORWARDED || (secondsRemaining === 0 && status !== STATUS.INITIAL)) &&
                <SupportText>
                Finished: countdown for
                <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
                </SupportText>}


            {/* DYMANIC BUTTONS*/}  

            <Buttons>
                
            {(status !== STATUS.FASTFORWARDED && (secondsRemaining !== 0 || status === STATUS.INITIAL)) &&
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Pause':'Start'}
                </Button>}

            {status !== STATUS.INITIAL && secondsRemaining !== totalSeconds &&
                <Button onClick={resetCountdown} style={{backgroundColor: 'navy'}}>
                Reset
                </Button>}

            {(status === STATUS.FASTFORWARDED || (secondsRemaining === 0 && status !== STATUS.INITIAL)) &&     
                <Button onClick={initialCountdown} style={{backgroundColor: 'steelblue'}}>
                New Input
                </Button>}

            {status !== STATUS.INITIAL && status !== STATUS.FASTFORWARDED && secondsRemaining !== 0 &&    
                <Button onClick={fastforwardCountdown} style={{backgroundColor: 'darkgreen'}}>
                Forward
                </Button>}   

            </Buttons>
            </TimerContainer>
        </div>
      )
};


export default Countdown;
              
