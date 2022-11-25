import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { selectAppTheme, selectBoardLoading } from '../../redux/appData/appDataSlice';
import { fetchApp, selectBoards, useDbDispatch } from '../../redux/dbData/dbDataSlice';
import Board from '../Board/Board';
import { BoardEditMenu, BoardNewMenu } from '../BoardMenu/BoardMenu';
import { DeleteBoardMenu, DeleteTaskMenu } from '../DeleteMenu/DeleteMenu';
import ErrorPage from '../Error/Error';
import Loading from '../Loading/Loading';
import NavBar from '../NavBar/NavBar';
import NavBoard from '../NavBoard/NavBoard';
import TaskDetailMenu from '../TaskDetailMenu/TaskDetailMenu';
import { TaskEditMenu, TaskNewMenu } from '../TaskMenu/TaskMenu';
import './App.scss';
import { ReactComponent as LoadingIcon } from '../Loading/loading.svg';

export const rootURL = '/fm-pro-3';
export const apiURL = 'https://ac-portfolio-db.onrender.com'

function App() {

  const dispatch = useDbDispatch();
  const appTheme = useSelector(selectAppTheme);
  const boards = useSelector(selectBoards);
  const boardLoading = useSelector(selectBoardLoading);
  const nav = useNavigate();
  const isTablet = useMediaQuery({ minWidth: 768 }, undefined)
  const [isMinLoading, setMinLoading] = useState(true);
  const [isError, setError] = useState(false);
  const transitionRef = useRef<any>(null);

  useEffect(() => {
    if (boards.boardsStatus === 'loading') {
      dispatch(fetchApp());
      nav(rootURL);
    }

    if (boards.boardsStatus === 'error') {
      setError(true);
    }
  }, [boards.boardsStatus, isMinLoading, dispatch, nav])

  const loadingElement = (
    < div className='board-load' >
      <LoadingIcon className='loading-icon' />
    </div >
  )

  const appContent = (
    <React.Fragment>
      <NavBar isTablet={isTablet} />
      <NavBoard isTablet={isTablet} />
      <Board />
      <Routes>
        <Route path={`${rootURL}/new/task`} element={<TaskNewMenu />} />
        <Route path={`${rootURL}/new/board`} element={<BoardNewMenu />} />
        <Route path={`${rootURL}/edit/task/:id`} element={<TaskEditMenu />} />
        <Route path={`${rootURL}/edit/board/:id`} element={<BoardEditMenu />} />
        <Route path={`${rootURL}/delete/task/:id`} element={<DeleteTaskMenu />} />
        <Route path={`${rootURL}/delete/board/:id`} element={<DeleteBoardMenu />} />
        <Route path={`${rootURL}/detail/:id`} element={<TaskDetailMenu />} />
        <Route path='*' element={null} />
      </Routes>
    </React.Fragment>
  );

  const loading = (boards.boardsStatus !== 'ready' || isMinLoading);

  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'loading' : 'ready'}
        nodeRef={transitionRef}
        addEndListener={(done: () => void) => transitionRef.current?.addEventListener("transitionend", done, false)}
        classNames='fade'>
        <div className={`App ${appTheme}`} >
          <div className='app-wrapper' ref={transitionRef}>
            {isError ? <ErrorPage /> : loading ? <Loading onMinTimeElapsed={() => { setMinLoading(false) }} /> : appContent}
            {boardLoading ? loadingElement : null}
          </div>
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
}

export interface MediaQueryProps {
  isTablet: boolean
}

export default App;

