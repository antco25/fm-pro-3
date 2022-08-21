import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.scss';
import { ReactComponent as LoadingIcon } from '../Loading/loading.svg';
import { useSelector } from 'react-redux';
import { selectModalLoading } from '../../redux/appData/appDataSlice';
import { rootURL } from '../App/App';

interface ModalProps {
  className?: string,
  children?: React.ReactNode,
  setLoading?: (x: boolean) => void
}

function Modal(props: ModalProps) {
  const { className, children } = props;
  const ref = useRef(null);
  const nav = useNavigate();
  const loading = useSelector(selectModalLoading);

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current !== e.target) return;
    if (loading) return;
    nav(rootURL);
  }

  return (
    <div className={`${className ? className + ' ' : ''}modal`} onClick={(e) => closeModal(e)} ref={ref}>
      <div className='modal-wrap'>
        <div className='modal-content'>
          {children}
          {
            loading ?
              <div className='modal-loading'>
                <LoadingIcon className='loading-icon' />
              </div> : null
          }
        </div>
      </div>
    </div>
  );
}

export default Modal;
