import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Body } from '../body';
import { SHOW_CAMERA_POSITION } from './constants';


export function Camera(props: PositionProps) {
    return (
        <group>
            <CameraPosition {...props} />
            <CameraComponent {...props} />
        </group>
    );
}

const CameraComponent = observer((props: PositionProps) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { zoom, position } = Store.state;
    const pos2 = props.position ? props.position.clone().add(position) : position;
    return (
        <perspectiveCamera
            name={'camera'}
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}
            position={new Vector3(pos2.x, pos2.y, zoom)}
        />
    );
});


function CameraPosition(props: PositionProps) {
    if (SHOW_CAMERA_POSITION === false) {
        return null;
    }
    return (
        <Body
            getInstance={body => Store.connected = body}
            name={'camera'}
            afterUpdate={v => Store.setPosition(v)}
            color={'yellow'}
            position={props.position}
        />
    );
}
