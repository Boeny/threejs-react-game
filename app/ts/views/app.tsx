import * as React from 'react';
import * as events from '~/utils/events';
import * as React3 from 'react3';
import { Store as html } from './html/store';
import { Entities, Player } from '~/components';
import { Html } from './html';
import { savedData } from '~/saves';


export function App() {
    const { position, zoom, rotation, translation } = savedData;
    return (
        <React.Fragment>
            <Html />
            <React3
                mainCamera={'camera'}
                width={window.innerWidth}
                height={window.innerHeight}
                canvasRef={(el: HTMLCanvasElement | null) => html.setCanvas(el)}
                {...events}
            >
                <scene>
                    <Player
                        position={position}
                        zoom={zoom}
                        rotation={rotation}
                        translation={translation}
                    />
                    <Entities />
                </scene>
            </React3>
        </React.Fragment>
    );
}
