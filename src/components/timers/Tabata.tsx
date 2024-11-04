import { useEffect, useRef, useState } from 'react';
import { STATUS } from '../../utils/constants';
import type { StatusType } from '../../utils/constants';
import { DisplayForText, DisplayForTime, TimeOnTimer, convertToSeconds } from '../../utils/helpers';
import { Button, Buttons, Input, Inputs, SupportText, TimeDisplay, Timer, TimerContainer, TimerTitle } from '../../utils/styles';

const Tabata = () => {
    const [timeMinInputRest, setTimeMinInputRest] = useState('');
    const [timeSecInputRest, setTimeSecInputRest] = useState('');
    const [secondsRemainingRest, setSecondsRemainingRest] = useState(0);

    const [timeMinInputWork, setTimeMinInputWork] = useState('');
    const [timeSecInputWork, setTimeSecInputWork] = useState('');
    const [secondsRemainingWork, setSecondsRemainingWork] = useState(0);

    const [repInput, setRepInput] = useState('');

    const [status, setStatus] = useState<StatusType>(STATUS.INITIAL);
    const [secondsRemainingTotal, setSecondsRemainingTotal] = useState(0);
    const [repRemaining, setRepRemaining] = useState(0);
    const intervalRef = useRef<number | null>();

    const totalSecondsWork = convertToSeconds(timeMinInputWork, timeSecInputWork);
    const totalSecondsRest = convertToSeconds(timeMinInputRest, timeSecInputRest);
    const totalSeconds = totalSecondsRest + totalSecondsWork;

    const startStopCountdown = () => {
        if (
            Number.isNaN(totalSeconds) ||
            (timeMinInputRest === '' && timeSecInputRest === '') ||
            (timeMinInputWork === '' && timeSecInputWork === '') ||
            totalSeconds <= 0 ||
            Number.isNaN(repInput) ||
            repInput === ''
        ) {
            alert('Please enter a valid time.');
        } else if (totalSeconds > 3600) {
            alert('Friendly caution: excercise over an hour can lead to overtraining. Please enter a time under an hour.');
        } else {
            if (status !== STATUS.STARTED) {
                if (status === STATUS.INITIAL) {
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
    };

    const resetCountdown = () => {
        setStatus(STATUS.STOPPED);
        const totalSecondsWork = convertToSeconds(timeMinInputWork, timeSecInputWork);
        const totalSecondsRest = convertToSeconds(timeMinInputRest, timeSecInputRest);
        const totalSeconds = totalSecondsRest + totalSecondsWork;
        setSecondsRemainingTotal(totalSeconds);
        setSecondsRemainingRest(totalSecondsRest);
        setSecondsRemainingWork(totalSecondsWork);
        setRepRemaining(Number(repInput));
    };

    const fastforwardCountdown = () => {
        setStatus(STATUS.FASTFORWARDED);
        setSecondsRemainingTotal(0);
        setSecondsRemainingRest(0);
        setSecondsRemainingWork(0);
        setRepRemaining(0);
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const initialCountdown = () => {
        setStatus(STATUS.INITIAL);
    };

    //this effect takes care of reps when seconds for both work and rest are complete
    useEffect(() => {
        if (status === STATUS.STARTED && secondsRemainingRest === 0 && secondsRemainingWork === 0 && repRemaining > 0) {
            const totalSecondsWork = convertToSeconds(timeMinInputWork, timeSecInputWork);
            const totalSecondsRest = convertToSeconds(timeMinInputRest, timeSecInputRest);

            setRepRemaining(prevRep => prevRep - 1);

            if (repRemaining - 1 <= 0) {
                setStatus(STATUS.STOPPED);
            } else {
                setSecondsRemainingWork(totalSecondsWork);
                setSecondsRemainingRest(totalSecondsRest);
                setSecondsRemainingTotal(totalSecondsWork + totalSecondsRest);
            }
        }
    }, [secondsRemainingWork, secondsRemainingRest, status, repRemaining, timeMinInputWork, timeMinInputRest, timeSecInputRest, timeSecInputWork]);

    //this effect takes care of the seconds
    useEffect(() => {
        if (status === STATUS.STARTED) {
            //this decrements the seconds immideately without waiting for the first second – only implemented for the very first second when reps are still intact
            if (secondsRemainingWork === totalSecondsWork && repRemaining === Number(repInput)) {
                setSecondsRemainingWork(prevWork => {
                    if (prevWork > 1) return prevWork - 1;
                    return prevWork; //this is added to fix a TypeScript error to ensure we never return undefined
                });
            } else if (secondsRemainingWork > 0) {
                intervalRef.current = setInterval(() => {
                    setSecondsRemainingWork(prevWork => {
                        if (prevWork > 1) {
                            return prevWork - 1;
                        } else {
                            return 0;
                        }
                    });
                }, 1000);
            } else if (secondsRemainingWork === 0 && secondsRemainingRest > 0) {
                intervalRef.current = setInterval(() => {
                    setSecondsRemainingRest(prevRest => {
                        if (prevRest > 0) {
                            return prevRest - 1;
                        } else {
                            return 0;
                        }
                    });
                }, 1000);
            }
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [status, secondsRemainingWork, secondsRemainingRest, repInput, repRemaining, totalSecondsWork]);

    return (
        <div className="App">
            <TimerContainer isActive={status === STATUS.STARTED}>
                <TimerTitle>Tabata</TimerTitle>

                {/* INPUTS FOR INITIAL STATE*/}
                <Timer>
                    {status === STATUS.INITIAL && (
                        <Inputs>
                            <Input>
                                <input
                                    style={{ maxWidth: '2.5rem', border: '0px solid white', fontSize: '2rem', textAlign: 'right' }}
                                    id="timeMinInput"
                                    placeholder="10"
                                    value={timeMinInputWork}
                                    onChange={e => {
                                        setTimeMinInputWork(e.target.value);
                                    }}
                                    disabled={secondsRemainingWork > 0 && secondsRemainingRest > 0}
                                />
                            </Input>
                            <Input>
                                :
                                <input
                                    style={{ maxWidth: '2.5rem', border: '0px solid white', fontSize: '2rem', textAlign: 'left' }}
                                    id="timeInput"
                                    value={timeSecInputWork}
                                    placeholder="00"
                                    onChange={e => {
                                        setTimeSecInputWork(e.target.value);
                                    }}
                                    disabled={secondsRemainingWork > 0 && secondsRemainingRest > 0}
                                />
                            </Input>
                            <Input>
                                <input
                                    style={{ maxWidth: '2.5rem', border: '0px solid white', fontSize: '2rem', textAlign: 'right' }}
                                    id="timeMinInput"
                                    placeholder="10"
                                    value={timeMinInputRest}
                                    onChange={e => {
                                        setTimeMinInputRest(e.target.value);
                                    }}
                                    disabled={secondsRemainingWork > 0 && secondsRemainingRest > 0}
                                />
                            </Input>
                            <Input>
                                :
                                <input
                                    style={{ maxWidth: '2.7rem', border: '0px solid white', fontSize: '2rem', textAlign: 'left' }}
                                    id="timeInput"
                                    value={timeSecInputRest}
                                    placeholder="00"
                                    onChange={e => {
                                        setTimeSecInputRest(e.target.value);
                                    }}
                                    disabled={secondsRemainingWork > 0 && secondsRemainingRest > 0}
                                />
                            </Input>
                            x
                            <Input>
                                <input
                                    style={{ maxWidth: '2.7rem', border: '0px solid white', fontSize: '0.75rem', textAlign: 'left' }}
                                    id="timeInput"
                                    value={repInput}
                                    placeholder="Reps"
                                    onChange={e => {
                                        setRepInput(e.target.value);
                                    }}
                                    disabled={secondsRemainingWork > 0 && secondsRemainingRest > 0}
                                />
                            </Input>
                        </Inputs>
                    )}

                    {/* text display at the initial state to indicate the intervals for work and rest  */}
                    {status === STATUS.INITIAL && (
                        <div style={{ display: 'flex', gap: '68px', fontSize: '11px', justifyContent: 'left', color: 'grey', marginLeft: '37px' }}>
                            <div>Work</div>
                            <div>Rest</div>
                        </div>
                    )}

                    {/* DYMANIC TIME DISPLAY*/}

                    {/* display work seconds interval only when there are seconds for Remanining Work */}
                    {status !== STATUS.INITIAL && secondsRemainingWork > 0 && (
                        <TimeDisplay isActive={status === STATUS.STARTED}>
                            <div style={{ fontSize: '14px' }}>Work left</div>
                            <DisplayForTime {...TimeOnTimer({ secondsRemaining: secondsRemainingWork })} />
                            <div style={{ fontSize: '20px', color: 'lightgrey' }}>|</div>
                            <div style={{ fontSize: '14px' }}>On round</div> {repRemaining}
                        </TimeDisplay>
                    )}

                    {/* when we run out of Work seconds, display rest seconds */}
                    {status !== STATUS.INITIAL && ((secondsRemainingWork === 0 && secondsRemainingRest >= 0) || secondsRemainingTotal === 0) && (
                        <TimeDisplay isActive={status === STATUS.STARTED}>
                            <div style={{ fontSize: '14px' }}>Rest left</div>
                            <DisplayForTime {...TimeOnTimer({ secondsRemaining: secondsRemainingRest })} />
                            <div style={{ fontSize: '20px', color: 'lightgrey' }}>|</div>
                            <div style={{ fontSize: '14px' }}>On round</div> {repRemaining}
                        </TimeDisplay>
                    )}
                </Timer>

                {/* DYMANIC TEXT LINE*/}

                {/* Show this text at initial state*/}
                {status === STATUS.INITIAL && <SupportText>Please input time for a time for exercise and rest, plus repetitions above</SupportText>}

                {/* Show this text when timer in progress */}
                {status !== STATUS.INITIAL && status !== STATUS.FASTFORWARDED && (secondsRemainingRest !== 0 || secondsRemainingWork !== 0) && (
                    <SupportText>
                        In progress:
                        <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputWork} />
                        <div>work and </div>
                        <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputRest} />
                        <div>rest, for {repInput} rounds</div>
                    </SupportText>
                )}

                {/* Show this text when timer is finished or fastforwarded */}
                {(status === STATUS.FASTFORWARDED || (secondsRemainingRest === 0 && secondsRemainingWork === 0 && repRemaining === 0 && status !== STATUS.INITIAL)) && (
                    <SupportText>
                        Finished:
                        <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputWork} />
                        <div>work and </div>
                        <DisplayForText totalSeconds={totalSeconds} timeSecInput={timeSecInputRest} />
                        <div>rest, for {repInput} rounds</div>
                    </SupportText>
                )}

                {/* DYMANIC BUTTONS*/}

                <Buttons>
                    {status !== STATUS.FASTFORWARDED && (secondsRemainingRest !== 0 || secondsRemainingWork !== 0 || status === STATUS.INITIAL) && (
                        <Button onClick={startStopCountdown} isActive={status === STATUS.STARTED}>
                            {status === STATUS.STARTED ? 'Pause' : 'Start'}
                        </Button>
                    )}

                    {(status !== STATUS.INITIAL || (secondsRemainingRest > 0 && secondsRemainingWork > 0)) && (
                        <Button onClick={resetCountdown} style={{ backgroundColor: 'navy' }}>
                            Reset
                        </Button>
                    )}

                    {(status === STATUS.FASTFORWARDED || (secondsRemainingRest === 0 && status !== STATUS.INITIAL)) && (
                        <Button onClick={initialCountdown} style={{ backgroundColor: 'steelblue' }}>
                            New Input
                        </Button>
                    )}

                    {status !== STATUS.INITIAL && secondsRemainingRest > 0 && secondsRemainingWork >= 0 && status !== STATUS.FASTFORWARDED && (
                        <Button onClick={fastforwardCountdown} style={{ backgroundColor: 'darkgreen' }}>
                            Forward
                        </Button>
                    )}
                </Buttons>
            </TimerContainer>
        </div>
    );
};

export default Tabata;
