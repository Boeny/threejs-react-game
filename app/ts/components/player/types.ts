

export interface Position {
    x: number;
    y: number;
}

export interface Moving {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface IStore {
    moving: Moving;
    position: Position;
    setPosition: (x: number, y: number) => void;
    moveLeft: (v: boolean) => void;
    moveRight: (v: boolean) => void;
    moveUp: (v: boolean) => void;
    moveDown: (v: boolean) => void;
    readonly isMoving: boolean;
}
