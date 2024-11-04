import { TimerContainer, Timers } from '../utils/styles';

import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';

const TimersView = () => {
    const timers = [
        { title: 'Stopwatch', C: <Stopwatch /> },
        { title: 'Countdown', C: <Countdown /> },
        { title: 'XY', C: <XY /> },
        { title: 'Tabata', C: <Tabata /> },
    ];

    return (
        <Timers>
            {timers.map(timer => (
                <div key={`timer-${timer.title}`}>
                    <TimerContainer> {timer.C} </TimerContainer>
                </div>
            ))}
        </Timers>
    );
};

export default TimersView;
