import * as React from 'react'
import { DiceRoller } from "dice-roller-parser";
import {default as MersenneTwister} from "mersenne-twister";

const twister = new MersenneTwister();
const diceRoller = new DiceRoller(() => twister.random());

const Roll20SyntaxUrl = 'https://wiki.roll20.net/Dice_Reference';
const AnimationOffset = 0.5;

const DiceSets = {
    d20: {
        defaultRoll: '1d20 + 1',
        dice: [
            ['1d20', '1d12', '1d10', '1d8', '1d6', '1d4'],
            [{label: 'd20 ADV', value: '2d20kh1'}, {label: 'd20 DIS', value: '2d20kl1'}]
        ]
    },
    
    pbta: {
        defaultRoll: '2d6 + 1',
        dice: [['2d6', '3d6']]
    },
    
    kids: {
        defaultRoll: '1d4!',
        swapDice: true,
        dice: [[
            {label: '1d4', value: '1d4!'},
            {label: '1d6', value: '1d6!'},
            {label: '1d8', value: '1d8!'},
            {label: '1d10', value: '1d10!'},
            {label: '1d12', value: '1d12!'},
            {label: '1d20', value: '1d20!'},
        ]]
    },
    
    resistance: {
        defaultRoll: '1d10',
        swapDice: true,
        dice: [
            [
                {label: '2d10', value: '2d10dh1'},
                {label: '3d10', value: '3d10dh1k1'},
                {label: '4d10', value: '4d10dh1k1'},
                {label: '5d10', value: '5d10dh1k1'},
            ],
            [
                {label: '1d2', value: '1d2'},
                {label: '1d4', value: '1d4'},
                {label: '1d6', value: '1d6'},
                {label: '1d8', value: '1d8'},
                {label: '1d12', value: '1d12'},
            ]
        ]
    }
};

function renderDiceSet(diceSet, onClickHandler) {
    const _onClick = (value) => {
        return () => onClickHandler(value)
    };
    
    console.log('dice:', diceSet);
    
    return <>{
        diceSet.dice.map((dieButtons, rowI) => (
            <div className="row" key={rowI}>{
                dieButtons.map((dieButton, i) => (
                    <button
                        key={i}
                        onClick={_onClick(dieButton.value || dieButton)}
                    >
                        {diceSet.swapDice ? '' : '+'}
                        {dieButton.label || dieButton}
                    </button>
                ))
            }</div>
        ))
    }</>;
}

function renderRoll(rollObject, diceString) {    
    const dice = rollObject.dice || [rollObject];
    if (!dice[0]) { return <></>; }
        
    const ops = rollObject.ops || [];
    const stylesForRoll = (roll) => {
        const styles = {};
        if (roll.critical === 'success') {
            styles.color = '#0F7B6C';
        } else if (roll.critical === 'failure') {
            styles.color = '#E03E3E';
        }
        return styles;
    }
    
    const renders = dice.reduce((all, next, index) => {
        if (next.value === undefined) { return all; }
        let nextValue = next.value;

        if (next.rolls) {
            nextValue = <>{
                next.rolls.reduce((a, r, i) => {
                    const rValue = <span style={stylesForRoll(r)}>
                        {r.valid ? <>{r.value}</> : <s>{r.value}</s>}
                    </span>;
                    return !a ? <>{rValue}</> : <>{a}, {rValue}</>;
                }, null)
            }</>;

            if (next.rolls.length > 1) {
                nextValue = <>({nextValue})</>;
            }
        }
                
        const op = index === 0 ? '' : ops[index - 1];
        return [...all, <> {op} </>, nextValue]
    }, []);
    
    return (
        <>
            <span style={{color: '#9B9A97'}}>
                {renders.map((r, i) => <span key={i}>{r}</span>)}
            </span> { renders.length > 0 ? ' = ' : '' }
            <b>{rollObject.value}</b>
        </>
    );
}


export default function DiceBox(_diceSet) {
    const diceSet = DiceSets[_diceSet] || DiceSets['d20'];
    const [diceString, setDiceString] = React.useState('');
    const [rollHistory, setRollHistory] = React.useState([{}]);

    return () => {
        const handleChangeDiceString = (newDiceString) => {
            setDiceString(newDiceString.target.value);
        };

        const handleRollButtonClick = () => {        
            const rollObject = diceRoller.roll(diceString);
            setRollHistory([rollObject, ...rollHistory]);
        };

        const handleDiceButtonClick = (value) => {
            if (diceSet.swapDice) {
                setDiceString(value);
            } else {
                setDiceString(diceString ? `${diceString} + ${value}` : value);
            }
        };

        return (
            <>
                <div className="row">
                    <input placeholder={diceSet.defaultRoll} type="text" value={diceString} onChange={handleChangeDiceString} />
                    <button onClick={handleRollButtonClick}>Roll</button>
                    { renderRoll(rollHistory[0], diceString) }
                </div>
                { renderDiceSet(diceSet, handleDiceButtonClick) }
                <div className="row">
                    <button onClick={() => window.open(Roll20SyntaxUrl,'_blank')}>❓</button>
                    <button onClick={() => setDiceString('')}>❌</button>
                </div>
            </>
        );
    };
}
