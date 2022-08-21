import React, { useState } from 'react';
import './Dropdown.scss';
import { ReactComponent as Arrow } from '../../assets/icon-chevron-down.svg';
import useOutsideClick from '../useOutsideClick';

interface DropdownProps {
    options: string[];
    currentValue?: number;
    onValueChange?: (value : number) => void
}

function Dropdown(props: DropdownProps) {
    const { options, onValueChange } = props;

    const [value, setValue] = useState(props.currentValue ? props.currentValue : 0);
    const { ref, isComponentActive, setIsComponentActive } = useOutsideClick(false, onOutsideClick);
    
    function onOutsideClick() {
        setIsComponentActive(false);
    }

    function handleOptionClick(value: number) {
        setValue(value);
        onValueChange?.(value);
        setIsComponentActive(false);
    }

    return (
        <div ref={ref} className={`Dropdown`}>
            <button className={`select${ isComponentActive ? ' active' : ''}`} onClick={() => setIsComponentActive(!isComponentActive)}><span>{options[value]}</span><Arrow /></button>
            <div className={`select-options${ isComponentActive ? ' active' : ''}`}>
                <ul>
                    {options.map((option, index) => {
                        return <li key={index} onClick={() => handleOptionClick(index)}>{option}</li>
                    })}
                </ul>
                <div className='spacer'></div>
            </div>
        </div>
    );
}

export default Dropdown;
