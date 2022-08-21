import React from 'react';
import './Error.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';

function ErrorPage() {
    return (
        <div className='ErrorPage'>
            <Logo className='logo-icon' />
            <div>Something went wrong.</div>
        </div>
    );
}

export default ErrorPage;
