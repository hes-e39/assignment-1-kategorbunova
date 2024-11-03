import {useState, useEffect, useRef} from 'react'
import { Buttons, Button, Input, Inputs, TimerContainer, Timer, TimerTitle, TimeDisplay, SupportText } from '../../utils/styles';
import { convertToSeconds, DisplayForText, DisplayForTime } from '../../utils/helpers';
import { STATUS } from '../../utils/constants';



const XY = () => {

    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')
    const [repInput, setRepInput] = useState('')

    const [status, setStatus] = useState(STATUS.INITIAL);
    const [secondsRemaining, setSecondsRemaining] = useState(0)
    const [repRemaining, setRepRemaining] = useState(0)
    const intervalRef = useRef(); 


    const secondsOnTimer = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60

    const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);
  
    const startStopCountdown = () => {

              if (isNaN(totalSeconds) || (timeMinInput === '' && timeSecInput === '') || totalSeconds <= 0 || isNaN(repInput) || (repInput === '')) {
                alert('Please enter a valid time.');
                }
              else {
                if (status !== STATUS.STARTED) {
                    if (status===STATUS.INITIAL) {
                        setSecondsRemaining(totalSeconds);
                        setRepRemaining(Number(repInput));
                    }
                  setStatus(STATUS.STARTED);
                } else {
                  setStatus(STATUS.STOPPED); 
                }
             }
        }
        ;

    const resetCountdown = () => {
      setStatus(STATUS.STOPPED);
      const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);
      setSecondsRemaining(totalSeconds);
      setRepRemaining(Number(repInput));
    }

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsRemaining(0);
        setRepRemaining(0);
        clearInterval(intervalRef.current); 
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  


      useEffect(() => {
        if (
          (status === STATUS.STARTED &&
          secondsRemaining === 0 &&
          repRemaining > 0)
        ) {
            const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);
            setSecondsRemaining(totalSeconds);
            setRepRemaining(Number(repInput));
            const reps = repRemaining - 1;
    
                    if (reps === 0) {
                        setSecondsRemaining(0);
                    setStatus(STATUS.STOPPED);
                    
                    } 
                    else {
                    setSecondsRemaining(totalSeconds);
                    }
          setRepRemaining(reps);
        }
      }, [secondsRemaining, status, repRemaining]);


      
      useEffect(() => {
        if (status === STATUS.STARTED) {
        
            setSecondsRemaining((prev) => {
                if (prev >= 0) 
                  return prev - 1;
              });

          intervalRef.current = setInterval(() => {
            setSecondsRemaining((prevSec) => {
              if (prevSec >= 0 ) {
                return prevSec - 1; 
              }
              return 0; 
            });
          }, 1000);
        }
   
        return () => clearInterval(intervalRef.current);  
        
      }, [status]);

      

    return (
        <div className="App"> 

            <TimerContainer isActive={status === STATUS.STARTED} isInitial={status === STATUS.INITIAL}>
            <TimerTitle>XY</TimerTitle> 
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
              <Input>x
                  <input 
                      style={{ maxWidth: '3rem', border: '0px solid white', fontSize: '0.75rem', textAlign: 'left' }}
                      id="timeInput" 
                      value={repInput}
                      placeholder='Reps'
                      onChange={e=>{
                          setRepInput(e.target.value);
                      }}
                      disabled={secondsRemaining > 0}/>
              </Input>
              </Inputs>
              )}

              {status !== STATUS.INITIAL &&
              <TimeDisplay isActive={status === STATUS.STARTED}>
                <DisplayForTime hoursOnTimer={hoursOnTimer} minutesOnTimer={minutesOnTimer} secondsOnTimer= {secondsOnTimer} />
                x {repRemaining}
              </TimeDisplay>
              }
              

              </Timer>
              

            {status !== STATUS.INITIAL && (status !== STATUS.FASTFORWARDED) && (secondsRemaining !== 0 && status !== STATUS.INITIAL) &&
            <SupportText>
            <>In progress: </> 
            <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
            , for {repInput} rounds
            </SupportText>}

                {status === STATUS.INITIAL &&
                <SupportText>
                <>Please input time for a time and repetitions above</>
            </SupportText>}

            {(status === STATUS.FASTFORWARDED || (secondsRemaining === 0 && status !== STATUS.INITIAL)) &&
              <SupportText>
                <>Finished: </>
                <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
                , for {repInput} rounds
              </SupportText>
              }
              
              
              

            <Buttons>
                
            {(status !== STATUS.FASTFORWARDED && (secondsRemaining !== 0 || status === STATUS.INITIAL)) &&    
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Stop' : 'Start'}
                </Button>}

            {(status !== STATUS.INITIAL || (secondsRemaining !== totalSeconds && repRemaining !== 0)) &&
                <Button 
                    onClick={resetCountdown} 
                    style={{backgroundColor: 'navy'}}>
                    Reset
                </Button>}

            {(status === STATUS.FASTFORWARDED || (secondsRemaining === 0 && status !== STATUS.INITIAL)) &&     
            <Button 
            onClick={initialCountdown} 
            style={{backgroundColor: 'steelblue'}}>
            New Input
            </Button>
             }

            {status !== STATUS.INITIAL && status !== STATUS.FASTFORWARDED && secondsRemaining !== 0 && 
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


export default XY;
