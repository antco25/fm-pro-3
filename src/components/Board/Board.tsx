import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { selectNavBoardOpen } from '../../redux/appData/appDataSlice';
import { BoardType, ColumnType, selectCurrentBoard, setCurrentTask, TaskType, useDbDispatch } from '../../redux/dbData/dbDataSlice';
import { rootURL } from '../App/App';
import './Board.scss';
import './BoardColumn.scss';

function Board() {
  const { columns, currentBoard } = useSelector(selectCurrentBoard);
  const navBoardOpen = useSelector(selectNavBoardOpen);
  const nav = useNavigate();
  const transitionRef = useRef(null);

  const emptyBoardElement = (
    <div className='board-wrap center'>
      <div className='board-empty'>
        <p>This board is empty. Create a new column to get started.</p>
        <button className='addColumn button-1' onClick={() => nav(rootURL + '/edit/board/' + currentBoard.subname)}>
          <span>+ Add New Column</span>
        </button>
      </div>
    </div>
  )

  const boardElement = (
    <div className='board-wrap grid'>
      {columns.map((column, index) => {
        const dotIndex = index % 3;
        let dotClass = 'dot dot-one';
        if (dotIndex === 1) {
          dotClass = 'dot dot-two';
        } else if (dotIndex === 2) {
          dotClass = 'dot dot-three';
        }

        return <BoardColumn key={index} nav={nav} column={column} dotClass={dotClass} />
      })}
      <BoardColumnEmpty nav={nav} currentBoard={currentBoard} />
    </div>
  )

  const isEmptyBoard = (columns.length === 0);

  return (
    <CSSTransition nodeRef={transitionRef} in={navBoardOpen} timeout={300} classNames='slide'>
      <div className='Board' ref={transitionRef}>
        {isEmptyBoard ? emptyBoardElement : boardElement}
      </div>
    </CSSTransition>
  );
}

interface BoardColumnEmptyProps {
  nav: NavigateFunction,
  currentBoard: BoardType
}

function BoardColumnEmpty(props: BoardColumnEmptyProps) {
  const { nav, currentBoard } = props;

  return (
    <div className='BoardColumn'>
      <div className='addColumn' onClick={() => nav(rootURL + '/edit/board/' + currentBoard.subname)}>+ New Column</div>
    </div>
  )
}

interface BoardColumnProps {
  nav: NavigateFunction,
  column: ColumnType,
  dotClass: string
}

function BoardColumn(props: BoardColumnProps) {
  const dispatch = useDbDispatch();
  const { nav, column, dotClass } = props;

  const handleTaskClick = (task: TaskType) => {
    dispatch(setCurrentTask(task));
    nav(`${rootURL}/detail/${task.subtitle}`)
  }

  return (
    <div className='BoardColumn'>
      <h1 className='col-title'><span className={dotClass}></span>{`${column.name} (${column.tasks.length})`}</h1>
      {
        column.tasks.length === 0 ?
          <div className='addTask' onClick={() => nav(rootURL + '/new/task', { state: column })}>+ New Task</div> :
          column.tasks.map((task, index) => {
            return (
              <div className='task' key={index} onClick={() => handleTaskClick(task)}>
                <h1 className='task-title'>{task.title}</h1>
                <h2 className='task-subtitle'>{`${task.completedSubtasks} of ${task.subtasks.length} subtasks`}</h2>
              </div>
            )
          })
      }
    </div>
  );
}

export default Board;
