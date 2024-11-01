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

    // const clearInput = () => {
    //     setTimeMinInput(''); // Clear inputs after starting
    //     setTimeSecInput('');
    //     setTimeHrInput('');
    // }

    const intervalRef = useRef(); 


    useEffect(() => {
      //console.log('beginEffect', status); 
        if (status === STATUS.STARTED) {
          const totalSeconds = convertToSeconds(timeMinInput, timeSecInput);

          //console.log('loop');
          //console.log('totalSeconds', totalSeconds);
          //console.log('secondsRemaining', secondsRemaining);

          setSecondsRemaining((prev) => {
            if (prev > 1) 
              return prev - 1;
          });

          intervalRef.current = setInterval(() => {
            setSecondsRemaining((prev) => { 
              if (prev > 1) 
                return prev - 1;
              else {
                //console.log('else statement, prev:', prev);
                //console.log('else statement, totalSeconds:', totalSeconds);
                //console.log('else statement, secondsRemaining', secondsRemaining);
                setStatus(STATUS.STOPPED);
                return 0;
              }
            });
          }, 1000);
        }
        //console.log('return'); 
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
              <>Countdown for </>
              {totalSeconds > 60 && ( <> {String(Number(totalSeconds - (timeSecInput%60))/60)}min </>)}
              {String(timeSecInput % 60)||'00'}sec
              </div>}
              
              


            <Buttons>
                
            {(status !== STATUS.FASTFORWARDED && (secondsRemaining !== 0 || status === STATUS.INITIAL)) &&
                <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                {status === STATUS.STARTED ? 'Pause':'Start'}
                </Button>}

            {status !== STATUS.INITIAL && secondsRemaining !== totalSeconds &&
                <Button 
                    onClick={resetCountdown} 
                    style={{backgroundColor: 'navy'}}>
                    Restart
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
              

//{status === STATUS.STARTED ? <img  src={'pause-xxl.png'} style={{width:'20px'}} alt="play button"/> : <img  src={'ic_play_circle_filled_white_48px-512.png'} style={{width:'30px', justifyContent:'center', alignContent:'center'}} alt="play button"/>}
