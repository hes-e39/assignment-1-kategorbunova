// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

function convertToSeconds(timeMinInput: number|string, timeSecInput: number|string) {
    return (Number(timeMinInput || '0') * 60) + Number(timeSecInput || '0');
}

type DisplayForTextProps = {
    totalSeconds: number | string;
    timeSecInput: number | string;
  };

function DisplayForText({ totalSeconds, timeSecInput }: DisplayForTextProps) {
    const minutes = Number(totalSeconds) > 60 ? `${String(Number(Number(totalSeconds) - (Number(timeSecInput)%60))/60)} min `:'';
    const seconds = `${String(Number(timeSecInput) % 60)||'00'} sec`;

    return ` ${minutes}${seconds}`;
  }

  type DisplayForTimeProps = {
    hoursOnTimer: number;
    minutesOnTimer: number;
    secondsOnTimer: number;
  };
  
  function DisplayForTime({ hoursOnTimer, minutesOnTimer, secondsOnTimer }: DisplayForTimeProps): string {
    const hours = hoursOnTimer > 0 ? `${String(hoursOnTimer).padStart(2, '0')}:` : '';
    const minutes = minutesOnTimer < 10 ? `0${minutesOnTimer}:` : '`${minutesOnTimer}:`';
    const seconds = `${String(secondsOnTimer).padStart(2, '0')}`;
  
    return `${hours}${minutes}${seconds}`;
  }


  type TimeOnTimerProps = {
    secondsRemaining: number;
  };


type TimeOnTimerReturn = {
  hoursOnTimer: number;
  minutesOnTimer: number;
  secondsOnTimer: number;
};

  function TimeOnTimer({secondsRemaining}: TimeOnTimerProps):TimeOnTimerReturn{
    const secondsOnTimer = secondsRemaining % 60;
    const minutesRemaining = (secondsRemaining - secondsOnTimer) / 60;
    const minutesOnTimer = minutesRemaining % 60;
    const hoursOnTimer = (minutesRemaining - minutesOnTimer) / 60;

    return {
      hoursOnTimer,
      minutesOnTimer,
      secondsOnTimer
    };
}

export {convertToSeconds, DisplayForText, DisplayForTime, TimeOnTimer};

