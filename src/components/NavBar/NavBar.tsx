import React, { useRef } from 'react';
import './NavBar.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as LogoMobile } from '../../assets/icon-logo.svg';
import { ReactComponent as Arrow } from '../../assets/icon-chevron-down.svg';
import { ReactComponent as AddIcon } from '../../assets/icon-add-task-mobile.svg';
import { CSSTransition } from 'react-transition-group';
import { useDispatch, useSelector } from 'react-redux';
import { selectNavBoardOpen, setNavBoardOpen } from '../../redux/appData/appDataSlice';
import { MediaQueryProps, rootURL } from '../App/App';
import { OptionsBoardMenu } from '../OptionsMenu/OptionsMenu';
import { useNavigate } from 'react-router-dom';
import { selectCurrentBoard } from '../../redux/dbData/dbDataSlice';

function NavBar(props: MediaQueryProps) {

  const { isTablet } = props;
  const nav = useNavigate();
  const dispatch = useDispatch();
  const navBoardOpen = useSelector(selectNavBoardOpen);
  const { currentBoard, boards, columns } = useSelector(selectCurrentBoard);
  const transitionRef = useRef(null);

  return (
    <div className="NavBar">
      {
        isTablet ?
          <CSSTransition nodeRef={transitionRef} in={navBoardOpen} timeout={300} classNames='slide'>
            <div className={`logo${navBoardOpen ? ' slide-enter-done' : ' slide-exit-done'}`}
              onClick={() => dispatch(setNavBoardOpen(!navBoardOpen))} ref={transitionRef}>
              <Logo />
            </div>
          </CSSTransition> :
          <div className='logo mobile'>
            <LogoMobile />
          </div>
      }
      {isTablet ? <div className="boardName">{currentBoard.name}</div> :
        <button className='openBoards' onClick={() => dispatch(setNavBoardOpen(true))}>
          <span>{currentBoard.name}</span>
          <Arrow className={`arrow${navBoardOpen ? ' up' : ''}`} />
        </button>}
      <button className='addTask button-1' disabled={columns.length === 0}  onClick={() => nav(rootURL + '/new/task')}>
        {isTablet ? <span>+ Add New Task</span> : <AddIcon />}
      </button>
      <OptionsBoardMenu currentBoard={currentBoard} isDefaultBoard={currentBoard._id === boards[0]._id} />
    </div>
  );
}

export default NavBar;