import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore as IBodyStore } from '~/components/body/types';
import { getNumArray } from '~/utils';
import { Body } from './body';
import { MAX_SPEED } from '~/constants';


export function Enemies() {
    return (
        <group>
            {getNumArray(1).map(i => (
                <Enemy key={i} />
            ))}
        </group>
    );
}


interface Position {
    x: number;
    y: number;
}

interface IStore {
    speedVector: Vector2;
    timer: number;
    state: {
        tick: boolean;
        mover: IBodyStore | null;
        position: Position;
    };
    setMover: (el: IBodyStore) => void;
    setPosition: (v: Position) => void;
    checkTickByTimer: (mover: IBodyStore) => void;
}

function getStore(speedVector: Vector2): IStore {
    return {
        speedVector,
        timer: 0,
        state: observable({
            tick: false,
            mover: null,
            position: { x: 0, y: 0 }
        }),
        setMover(el: IBodyStore) {
            runInAction(() => {
                this.state.mover = el;
            });
            this.setPosition(el.position);
        },
        setPosition(v: Position) {
            runInAction(() => {
                this.state.position = { x: v.x, y: v.y };
            });
        },
        checkTickByTimer(mover: IBodyStore) {
            this.timer += 1;
            if (this.timer < 21) {
                return;
            }
            if (this.timer === 30) {
                runInAction(() => {
                    this.state.tick = false;
                    this.timer = 0;
                });
                return;
            }
            if (this.timer === 21) {
                mover.velocity = this.speedVector;
                runInAction(() => {
                    this.state.tick = true;
                });
                return;
            }
            if (this.timer === 22) {
                mover.velocity = V2;
                return;
            }
        }
    };
}

const V2 = new Vector2();


function Enemy() {
    const s1 = getStore(new Vector2(MAX_SPEED, 0));
    const s2 = getStore(new Vector2(0, -MAX_SPEED));
    return (
        <group>
            <Body
                getInstance={el => s1.setMover(el)}
                name={'mover'}
                color={'red'}
                hasCollider={true}
                isMovable={true}
                onEveryTick={el => s1.checkTickByTimer(el)}
                afterUpdate={v => s1.setPosition(v)}
                position={new Vector2(15, 15)}
            />
            <Generator offset={new Vector2(MAX_SPEED, 0)} connected={s1} />

            <Body
                getInstance={el => s2.setMover(el)}
                name={'mover'}
                color={'red'}
                hasCollider={true}
                isMovable={true}
                onEveryTick={el => s2.checkTickByTimer(el)}
                afterUpdate={v => s2.setPosition(v)}
                position={new Vector2(20, 20)}
            />
            <Generator offset={new Vector2(0, -MAX_SPEED)} connected={s2} />
        </group>
    );
}


interface GeneratorProps {
    offset: Vector2;
    connected: IStore;
}

const Generator = observer((props: GeneratorProps) => {
    const { mover, tick, position } = props.connected.state;
    if (mover === null) {
        return null;
    }
    return (
        <Body
            name={'generator'}
            color={tick ? '#ffffff' : '#49b4d0'}
            position={(new Vector2(position.x, position.y)).add(props.offset)}
        />
    );
});
