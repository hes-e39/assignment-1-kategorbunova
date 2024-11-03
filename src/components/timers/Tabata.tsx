import {useState, useEffect, useRef} from 'react'
import { Buttons, Button, Input, Inputs, TimerContainer, Timer, TimerTitle, TimeDisplay, SupportText } from '../../utils/styles';
import { convertToSeconds, DisplayForText } from '../../utils/helpers';
import { STATUS } from '../../utils/constants';




const Tabata = () => {

    const DisplayForTime = ({ hoursOnTimer, minutesOnTimer, secondsOnTimer }) => {
        const hours = hoursOnTimer > 0 ? `${String(hoursOnTimer).padStart(2, '0')}:` : '';
        const minutes = minutesOnTimer < 10 ? `0${minutesOnTimer}:` : `${minutesOnTimer}:`;
        const seconds = `${String(secondsOnTimer).padStart(2, '0')}`;
      
        return (
          <div>{hours}{minutes}{seconds}</div>
        );
      };

      const TimeOnTimer = (secondsRemaining) => {
        const secondsOnTimer = secondsRemaining % 60
        const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60
        const minutesOnTimer = minutesRemaining % 60
        const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60
    
        return(
            {hoursOnTimer, minutesOnTimer, secondsOnTimer}
        )
    }

    const [timeMinInputRest, setTimeMinInputRest] = useState('')
    const [timeSecInputRest, setTimeSecInputRest] = useState('')
    const [secondsRemainingRest, setSecondsRemainingRest] = useState(0)

    const [timeMinInputWork, setTimeMinInputWork] = useState('')
    const [timeSecInputWork, setTimeSecInputWork] = useState('')
    const [secondsRemainingWork, setSecondsRemainingWork] = useState(0)

    const [repInput, setRepInput] = useState('')

    const [status, setStatus] = useState(STATUS.INITIAL);
    const [secondsRemainingTotal, setSecondsRemainingTotal] = useState(0)
    const [repRemaining, setRepRemaining] = useState(0)
    const intervalRef = useRef();

    const totalSecondsWork = convertToSeconds(timeMinInputWork, timeSecInputWork);
    const totalSecondsRest = convertToSeconds(timeMinInputRest,timeSecInputRest);
    const totalSeconds = totalSecondsRest+totalSecondsWork;
  
    const startStopCountdown = () => {

              if (isNaN(totalSeconds) || (timeMinInputRest === '' && timeSecInputRest === '') || totalSeconds <= 0 || isNaN(repInput) || (repInput === '')) {
                alert('Please enter a valid time.');
                }
              else {
                if (status !== STATUS.STARTED) {
                    if (status===STATUS.INITIAL) {
                        setSecondsRemainingTotal(totalSeconds);
                        setSecondsRemainingRest(totalSecondsRest);
                        setSecondsRemainingWork(totalSecondsWork);
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
      const totalSecondsWork = convertToSeconds(timeMinInputWork, timeSecInputWork);
      const totalSecondsRest = convertToSeconds(timeMinInputRest,timeSecInputRest);
      const totalSeconds = totalSecondsRest+totalSecondsWork;
      setSecondsRemainingTotal(totalSeconds);
      setSecondsRemainingRest(totalSecondsRest);
      setSecondsRemainingWork(totalSecondsWork);
      setRepRemaining(Number(repInput));
    }

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsRemainingTotal(0);
        setSecondsRemainingRest(0);
        setSecondsRemainingWork(0);
        setRepRemaining(0);
        clearInterval(intervalRef.current); 
      }

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
      }  

      useEffect(() => {
        if (status === STATUS.STARTED &&
          secondsRemainingRest === 0 &&
          secondsRemainingWork === 0 &&
          repRemaining > 0)
          {
            const totalSecondsWork = convertToSeconds(timeMinInputWork, timeSecInputWork);
            const totalSecondsRest = convertToSeconds(timeMinInputRest, timeSecInputRest);
        
            setRepRemaining((prevRep) => prevRep - 1);
        
            if (repRemaining - 1 <= 0) {
              setStatus(STATUS.STOPPED);
            } else {
              setSecondsRemainingWork(totalSecondsWork);
              setSecondsRemainingRest(totalSecondsRest);
              setSecondsRemainingTotal(totalSecondsWork + totalSecondsRest);
            }
          }
      }, [secondsRemainingWork, secondsRemainingRest, status, repRemaining]);

      useEffect(() => {
        if (status === STATUS.STARTED) {

          clearInterval(intervalRef.current);
      
          if (secondsRemainingWork > 0) {

            // setSecondsRemainingWork((prevWork) => {
            //     if (prevWork - 1 > 0) 
            //       return prevWork - 1;
            //   });

            intervalRef.current = setInterval(() => {
              setSecondsRemainingWork((prevWork) => {
                if (prevWork > 0) {
                  return prevWork - 1;
                } else {
                  return 0;
                }
              });
            }, 1000);
          } 
          
          else if (secondsRemainingWork === 0 && 
            secondsRemainingRest > 0) {
            
            // setSecondsRemainingRest((prevRest) => {
            //     if (prevRest > 1) 
            //       return prevRest - 1;
            //   });

            intervalRef.current = setInterval(() => {
              setSecondsRemainingRest((prevRest) => {
                if (prevRest > 0) {
                  return prevRest - 1;
                } else {
                  return 0;
                }
              });
            }, 1000);
          }
        }
      
        return () => clearInterval(intervalRef.current);
      }, [status, secondsRemainingWork, secondsRemainingRest]);
      
   

    return (
        <div className="App"> 

            <TimerContainer isActive={status === STATUS.STARTED} isInitial={status === STATUS.INITIAL}>
            <TimerTitle>Tabata</TimerTitle> 
              <Timer>
              {status === STATUS.INITIAL  && (
              <Inputs>
              <Input>     
                  <input 
                      style={{ maxWidth: '3rem', border: '0px solid white', fontSize: '2rem', textAlign: 'right' }}
                      id="timeMinInput" 
                      placeholder='10'
                      value={timeMinInputWork}
                      onChange={e=>{
                          setTimeMinInputWork(e.target.value);
                      }}
                      disabled={secondsRemainingTotal > 0}/>
              </Input>
              <Input>:
                  <input 
                      style={{ maxWidth: '2.7rem', border: '0px solid white', fontSize: '2rem', textAlign: 'left' }}
                      id="timeInput" 
                      value={timeSecInputWork}
                      placeholder='00'
                      onChange={e=>{
                          setTimeSecInputWork(e.target.value);
                      }}
                      disabled={secondsRemainingTotal > 0}/>
              </Input>
              <Input>     
                  <input 
                      style={{ maxWidth: '2.7rem', border: '0px solid white', fontSize: '2rem', textAlign: 'right' }}
                      id="timeMinInput" 
                      placeholder='10'
                      value={timeMinInputRest}
                      onChange={e=>{
                          setTimeMinInputRest(e.target.value);
                      }}
                      disabled={secondsRemainingTotal > 0}/>
              </Input>
              <Input>:
                  <input 
                      style={{ maxWidth: '2.7rem', border: '0px solid white', fontSize: '2rem', textAlign: 'left' }}
                      id="timeInput" 
                      value={timeSecInputRest}
                      placeholder='00'
                      onChange={e=>{
                          setTimeSecInputRest(e.target.value);
                      }}
                      disabled={secondsRemainingTotal > 0}/>
              </Input>x
              <Input>
                  <input 
                      style={{ maxWidth: '2.7rem', border: '0px solid white', fontSize: '0.75rem', textAlign: 'left' }}
                      id="timeInput" 
                      value={repInput}
                      placeholder='Reps'
                      onChange={e=>{
                          setRepInput(e.target.value);
                      }}
                      disabled={secondsRemainingTotal > 0}/>
              </Input>
              </Inputs>
              )}

              {status !== STATUS.INITIAL && secondsRemainingWork > 0 &&
              <TimeDisplay isActive={status === STATUS.STARTED}>
                <DisplayForTime {...TimeOnTimer(secondsRemainingWork)} />
                <div>x {repRemaining}</div>
              </TimeDisplay>
              }

            {status !== STATUS.INITIAL && ((secondsRemainingWork === 0 && secondsRemainingTotal > 0) || (secondsRemainingTotal===0)) &&
              <TimeDisplay isActive={status === STATUS.STARTED}>
                <DisplayForTime {...TimeOnTimer(secondsRemainingRest)} />
                x {repRemaining}
              </TimeDisplay>
              }


              

              </Timer>
              

            {status !== STATUS.INITIAL && (status !== STATUS.FASTFORWARDED) && (secondsRemainingRest !== 0 && secondsRemainingWork !== 0 && status !== STATUS.INITIAL) &&
            <SupportText>
            <>In progress: </> 
            <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputWork}/>
            <div>work and </div>
            <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputRest}/>
            <div>rest, for {repInput} rounds</div>
            </SupportText>}

            

              {status === STATUS.INITIAL &&
                <SupportText>
                <>Please input time for a time for 1) exercise, 2) rest and 3) repetitions above</>
            </SupportText>}
              
            {(status === STATUS.FASTFORWARDED || (secondsRemainingRest === 0 && secondsRemainingWork === 0 && repRemaining === 0 && status !== STATUS.INITIAL)) &&
              <SupportText>
                <>Finished: </>
                <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputWork}/>
            <div>work and </div>
            <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputRest}/>
            <div>rest, for {repInput} rounds</div>
              </SupportText>
              }
              
              
              

            <Buttons>
                
            {status !== STATUS.FASTFORWARDED &&     
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Stop' : 'Start'}
                </Button>}

            {status !== STATUS.INITIAL && secondsRemainingTotal !== totalSeconds &&
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


export default Tabata;

