import React, { useRef } from 'react';
import './NavBoard.scss';
import { ReactComponent as BoardIcon } from '../../assets/icon-board.svg';
import { ReactComponent as HideIcon } from '../../assets/icon-hide-sidebar.svg';
import { ReactComponent as ShowIcon } from '../../assets/icon-show-sidebar.svg';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useDispatch, useSelector } from 'react-redux';
import { selectNavBoardOpen, setBoardLoading, setNavBoardOpen } from '../../redux/appData/appDataSlice';
import { apiURL, MediaQueryProps, rootURL } from '../App/App';
import { useNavigate } from 'react-router-dom';
import { BoardType, ColumnType, selectCurrentBoard, setCurrentBoard } from '../../redux/dbData/dbDataSlice';
import axios from 'axios';

function NavBoard(props: MediaQueryProps) {
  const { isTablet } = props;
  const nav = useNavigate();
  const dispatch = useDispatch();
  const navBoardOpen = useSelector(selectNavBoardOpen);
  const { currentBoard, boards } = useSelector(selectCurrentBoard);
  const transitionRef = useRef<any>(null);

  /**
   * Mobile 
   */

  const mobileRef = useRef(null);

  const closeMobileMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mobileRef.current !== e.target) return;
    dispatch(setNavBoardOpen(false));
  }

  const switchBoards = async (board: BoardType) => {
    dispatch(setBoardLoading(true))
    try {
      const columns: { data: ColumnType[] } = await axios.get(apiURL + '/fm-pro-3/column/all/' + board._id);
      dispatch(setCurrentBoard({ currentBoard: board, columns: columns.data }));
    } catch (err) {

    } finally {
      dispatch(setBoardLoading(false))
    }
  }

  if (!isTablet) {
    return (
      <div className={`NavBoard mobile${navBoardOpen ? ' open' : ' hidden'}`} ref={mobileRef} onClick={(e) => closeMobileMenu(e)}>
        <div className='navboard-wrapper'>
          <h1>{`ALL BOARDS (${boards.length})`}</h1>
          <ul>
            {boards.map((board, index) => {
              return <li className={board._id === currentBoard._id ? 'active' : undefined}
                key={index} onClick={() => switchBoards(board)}><BoardIcon />{board.name}</li>
            })}
            <li className='create' onClick={() => nav(rootURL +'/new/board')}><BoardIcon /><span>+ Create New Board</span></li>
          </ul>
          <ThemeToggle />
        </div>
        <div className='spacer' />
      </div>
    )
  }

  /**
   * Desktop & Tablet 
   */

  return (
    <SwitchTransition>
      <CSSTransition
        key={navBoardOpen ? 'boardOpen' : 'boardClosed'}
        nodeRef={transitionRef}
        addEndListener={(done: () => void) => transitionRef.current?.addEventListener("transitionend", done, false)}
        classNames='slide'>
        <div className='NavBoard' ref={transitionRef}>
          {navBoardOpen ?
            <div className='navboard-wrapper'>
              <h1>{`ALL BOARDS (${boards.length})`}</h1>
              <ul>
                {boards.map((board, index) => {
                  return <li className={board._id === currentBoard._id ? 'active' : undefined}
                    key={index} onClick={() => switchBoards(board)}><BoardIcon />{board.name}</li>
                })}
                <li className='create' onClick={() => nav(rootURL +'/new/board')}><BoardIcon /><span>+ Create New Board</span></li>
              </ul>
              <ThemeToggle />
              <div className='hide' onClick={() => dispatch(setNavBoardOpen(false))}><HideIcon /><span>Hide Sidebar</span></div>
            </div> :
            <div className='OpenNavBoard' onClick={() => { dispatch(setNavBoardOpen(true)) }} >
              <ShowIcon />
            </div>
          }
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
}

export default NavBoard;
