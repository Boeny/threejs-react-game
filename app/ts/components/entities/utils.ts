import { createArray } from '~/utils';


const MERGES_PER_FRAME = 20;
export const INITIAL_VALUE = 512;
const DELIMITER = '|';
const DEFAULT_COOS = ['0|0', '5|1', '-5|-1', '1|5', '-1|-5', '1|-5', '-1|5', '5|-1', '-5|1'];
const MAX_PRESSURE_PER_FRAME = 10;
const COUNTER_RATE = 20;
const MAX_COLOR = 255;

type Data = Coobject<number>; // coo -> color

interface Coo {
    x: number;
    y: number;
}

export function getDefaultData(): Data {
    return DEFAULT_COOS.reduce(
        (result, coo) => {
            const pos = getPosition(coo);
            result[getKey({ x: pos.x, y: pos.y })] = INITIAL_VALUE;
            return result;
        },
        {} as Data
    );
}

function getKey(position: Coo): string {
    return `${position.x}${DELIMITER}${position.y}`;
}

export function getNonEmptyCoordinates(data: Data): string[] {
    return Object.keys(data);
}

export function getPosition(coo: string): Coo {
    const position = coo.split(DELIMITER).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    if (position.length !== 2) {
        console.warn(
            `Entities.getPosition: input string = 2 coordinates splitted by "${DELIMITER}"`
        );
        return { x: 0, y: 0 };
    }
    return {
        x: position[0],
        y: position[1]
    };
}

export function getColor(color: number): string {
    const c = Math.round(color * MAX_COLOR / INITIAL_VALUE);
    return `rgb(${c}, ${c}, ${c})`;
}


let counter = 0;

function changeColorByCounter(color: number): number {
    if (counter < COUNTER_RATE) {
        counter += 1;
        return INITIAL_VALUE;
    }
    if (counter === COUNTER_RATE) {
        counter = 0;
    }
    return color;
}

export function getNewData(data: Data): Data {
    return createArray(MERGES_PER_FRAME).reduce(updateDataAtPosition, data);
}


let stack: string[] = [];

function updateDataAtPosition(data: Data): Data {
    if (stack.length === 0) {
        DEFAULT_COOS.forEach(coo => data[coo] = changeColorByCounter(data[coo] || 0));
        stack = getNonEmptyCoordinates(data);
    }
    const chance = Math.random() * INITIAL_VALUE;
    let index = 0;
    for (let i = 0; i < stack.length; i += 1) {
        if ((data[stack[i]] || 0) > chance) {
            index = i;
            break;
        }
    }
    const cooToExplode = stack[index];
    stack.splice(index, 1);
    const colorToDecrease = data[cooToExplode];
    if (!colorToDecrease) {
        return {};
    }
    const position = getPosition(cooToExplode);
    const coos = [
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y }
    ]
        .map(getKey)
        .map(coo => ({
            coo,
            color: data[coo] || 0
        }))
        .sort((a, b) => b.color - a.color);

    const result = decreaseColors(coos.map(o => o.color), colorToDecrease);
    if (result.data.length !== 4) {
        console.warn('result colors length must be 4!');
        return data;
    }
    coos.forEach((o, i) => setColor(data, o.coo, result.data[i]));
    setColor(data, cooToExplode, result.color);
    return data;
}


type Children = { data: number[], color: number };
function decreaseColors(sortedColors: number[], colorToDecrease: number): Children {
    const filtered = sortedColors.filter(c => colorToDecrease - c > 0);
    if (filtered.length === 0) {
        return { data: sortedColors, color: colorToDecrease };
    }
    const diff = (colorToDecrease - filtered[0]) / (filtered.length + 1);
    if (colorToDecrease - filtered[0] > MAX_PRESSURE_PER_FRAME) {
        return {
            data: [
                ...sortedColors.filter(c => colorToDecrease - c <= 0),
                ...filtered.map(c => c + MAX_PRESSURE_PER_FRAME)
            ],
            color: colorToDecrease - MAX_PRESSURE_PER_FRAME
        };
    }
    const children = decreaseColors(filtered.map(c => c + diff), filtered[0] + diff);
    return {
        data: [
            ...sortedColors.filter(c => colorToDecrease - c <= 0),
            ...children.data
        ],
        color: children.data[children.data.length - 1]
    };
}

function setColor(data: Data, coo: string, color: number) {
    if (color < 1) {
        delete data[coo];
    } else {
        data[coo] = color;
    }
}
