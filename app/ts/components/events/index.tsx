import * as React from 'react';
import * as constants from '../camera/constants';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as camera } from '../camera/store';
import { Store } from './store';
import { Box } from '../box';
import { Container } from '../container';
import { Mode } from './mode';


export function Events(props: PositionProps) {
    const position = props.position || new Vector2();
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={'blue'}
            width={20}
            position={position}
        >
            <Content position={(new Vector2(1, 1)).add(position)} />
        </Box>
    );
}


interface Props {
    position: Vector2;
}

const Content = ((props: Props) => {
    const { position } = props;
    return (
        <group>
            <Mode
                position={(new Vector2(1, 5)).add(position)}
                field={'mouseDragMode'}
                state={Store.state}
            />
            <Mode
                position={(new Vector2(3, 5)).add(position)}
                field={'stepMode'}
                state={Store.state}
            />
            <CameraProps position={position} />
            <Container
                borderColor={'grey'}
                data={Object.keys(constants).map(name => {
                    const c = (constants as { [key: string]: any })[name];
                    return {
                        name: `${name} = ${typeof c === 'object' ? '[Object]' : c}`,
                        color: 'grey'
                    };
                })}
                position={position}
            />
        </group>
    );
});


const CameraProps = ((props: Props) => {
    debugger;
    return (
        <Container
            borderColor={'#6bd6f1'}
            data={[{
                name: `zoom = ${camera.state.zoom}`,
                color: '#6bd6f1'
            }]}
            position={props.position}
        />
    );
});
