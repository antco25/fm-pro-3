import React, { useEffect } from 'react';
import './Loading.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as LoadingIcon } from './loading.svg';

interface LoadingProps {
    onMinTimeElapsed: () => void,
    minTime?: number
}

function Loading(props: LoadingProps) {
    useEffect(() => {
        const minTime = props.minTime || 300;
        setTimeout(() => {
            props.onMinTimeElapsed();
        }, minTime)
    }, [props])

    return (
        <div className='loading'>
            <Logo className='logo-icon' />
            <LoadingIcon className='loading-icon' />
            <span>This might take some time...</span>
        </div>
    );
}

export default Loading;
