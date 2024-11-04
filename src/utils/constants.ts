export const STATUS = {
    INITIAL: 'Initial',
    STARTED: 'Started',
    STOPPED: 'Stopped',
    FASTFORWARDED: 'Fastforwarded'
  } as const;


  export type StatusType = typeof STATUS[keyof typeof STATUS];