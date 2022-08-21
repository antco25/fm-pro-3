import React, { useState } from 'react';
import './ThemeToggle.scss';
import lightIcon from '../../assets/icon-light-theme.svg';
import darkIcon from '../../assets/icon-dark-theme.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppTheme, setAppTheme } from '../../redux/appData/appDataSlice';


function ThemeToggle() {
  const dispatch = useDispatch();
  const appTheme = useSelector(selectAppTheme);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(setAppTheme('dark-theme'));
    } else {
      dispatch(setAppTheme('light-theme'));
    }
  }
  return (
    <div className="ThemeToggle">
      <img src={lightIcon} alt='Light Theme Icon' />
      <label className="switch">
        <input type="checkbox" checked={appTheme === 'dark-theme'} onChange={(e) => handleChange(e)} />
        <span className="slider"></span>
      </label>
      <img src={darkIcon} alt='Dark Theme Icon' />
    </div>
  );
}

export default ThemeToggle;
