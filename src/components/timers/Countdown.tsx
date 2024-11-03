import {useState, useEffect, useRef} from 'react'
import { Buttons, Button, Input, Inputs, TimerContainer, Timer, TimerTitle, TimeDisplay, SupportText } from '../../utils/styles';
import { convertToSeconds, DisplayForText, DisplayForTime } from '../../utils/helpers';
import { STATUS } from '../../utils/constants';


const Countdown = () => {

    const [timeMinInput, setTimeMinInput] = useState('')
    const [timeSecInput, setTimeSecInput] = useState('')

    const [status, setStatus] = useState(STATUS.INITIAL);
    const [secondsRemaining, setSecondsRemaining] = useState(0)


    const secondsOnTimer = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60
    const minutesOnTimer = minutesRemaining % 60
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60

    const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

  
    const startStopCountdown = () => {

              if (isNaN(totalSeconds) || (timeMinInput === '' && timeSecInput === '') || totalSeconds <= 0) {
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
        clearInterval(intervalRef.current); 
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  


    const intervalRef = useRef(); 


    useEffect(() => {
        if (status === STATUS.STARTED) {
          const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

          setSecondsRemaining((prev) => {
            if (prev > 1) 
              return prev - 1;
          });

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
        return () => clearInterval(intervalRef.current);
        
      }, [status]);



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

              {(status !== STATUS.INITIAL)  &&
              <TimeDisplay isActive={status === STATUS.STARTED}>
                <DisplayForTime hoursOnTimer={hoursOnTimer} minutesOnTimer={minutesOnTimer} secondsOnTimer= {secondsOnTimer} />
              </TimeDisplay>
              }
              
              </Timer>
              
              {status !== STATUS.INITIAL && (status !== STATUS.FASTFORWARDED) && (secondsRemaining !== 0 && status !== STATUS.INITIAL) &&
              <SupportText>
                  <>In progress: countdown for </> 
                  <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
                </SupportText>
              }

              {(status === STATUS.FASTFORWARDED || (secondsRemaining === 0 && status !== STATUS.INITIAL)) &&
              <SupportText>
                <>Finished: countdown for </>
                <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInput}/>
              </SupportText>
              }
              
              {status == STATUS.INITIAL &&
            <SupportText>
            <>Please input time for a countdown above</>
          </SupportText>}

          

            <Buttons>
                
            {(status !== STATUS.FASTFORWARDED && (secondsRemaining !== 0 || status === STATUS.INITIAL)) &&
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Pause':'Start'}
                </Button>}

            {status !== STATUS.INITIAL && secondsRemaining !== totalSeconds &&
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


export default Countdown;
              
