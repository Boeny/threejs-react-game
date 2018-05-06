import * as React from 'react';
import * as React3 from 'react3';
import * as events from '~/utils/events';
import { Vector2 } from 'three';
import { setCanvas } from './html/actions';
import { Camera, Player, Events, Movable, Colliders, Enemies } from '~/components';


export function App() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        <React.Fragment>
            <React3
                mainCamera={'camera'}
                width={width}
                height={height}
                canvasRef={setCanvas}
                {...events}
            >
                <scene>
                    <Camera />
                    <Events position={new Vector2(-20, 10)} />
                    <Player />
                    <Enemies />
                    <Movable position={new Vector2(-40, -20)} />
                    <Colliders position={new Vector2(40, -20)} />
                </scene>
            </React3>
        </React.Fragment>
    );
}
