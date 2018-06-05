

export { Signal } from '~/components/body/types';

export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    timer: number;
    state: { tick: boolean };
    position: Position;
    setPosition: (v: Position) => void;
    timerAfterTickStart: () => boolean;
    updateTimer: () => void;
    setTick: (tick: boolean) => void;
}