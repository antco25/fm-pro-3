import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { ReactComponent as DeleteIcon } from '../../assets/icon-cross.svg';
import './BoardMenu.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BoardType, cleanInput, ColumnType, selectBoards, selectCurrentBoard, setBoards, setCurrentBoard, useDbDispatch } from '../../redux/dbData/dbDataSlice';
import { useSelector } from 'react-redux';
import { setModalLoading } from '../../redux/appData/appDataSlice';
import { apiURL, rootURL } from '../App/App';

export function BoardNewMenu() {

  const nav = useNavigate();
  const dispatch = useDbDispatch();
  const { boards } = useSelector(selectBoards);

  const onCreateBoard = async (boardName: string, boardColumns: BoardColumnType[]) => {
    dispatch(setModalLoading(true))
    try {
      const board = {
        name: boardName,
        columns: boardColumns
      }
      const newBoard: { data: { board: BoardType, columns: ColumnType[] } } = await axios.post(apiURL + rootURL + '/board/create', board);
      dispatch(setBoards([...boards, newBoard.data.board]))
      dispatch(setCurrentBoard({ currentBoard: newBoard.data.board, columns: newBoard.data.columns }))
      nav(rootURL);
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false))
    }

  }

  return <BoardMenu isEdit={false} boardName={''} boardColumns={[{ name: '', _id: 'new' }, { name: '', _id: 'new' }]} onSubmit={onCreateBoard} />
}

export function BoardEditMenu() {

  const nav = useNavigate();
  const dispatch = useDbDispatch();
  const { currentBoard, columns } = useSelector(selectCurrentBoard);

  const onEditBoard = async (boardName: string, boardColumns: BoardColumnType[], deletedColumns: BoardColumnType[]) => {
    dispatch(setModalLoading(true))
    try {
      const newColumns = [] as BoardColumnType[];
      const existingColumns = [] as BoardColumnType[];;

      boardColumns.forEach((column) => {
        if (column._id === 'new') {
          newColumns.push(column);
        } else {
          existingColumns.push(column);
        }
      })

      const editBoard = {
        _id: currentBoard._id,
        name: boardName,
        newColumns: newColumns,
        deletedColumns: deletedColumns,
        existingColumns: existingColumns
      }

      const updatedBoard: { data: { board: BoardType, boards: BoardType[], columns: ColumnType[] } } = await axios.post(apiURL + rootURL + '/board/edit', editBoard);
      dispatch(setBoards(updatedBoard.data.boards))
      dispatch(setCurrentBoard({ currentBoard: updatedBoard.data.board, columns: updatedBoard.data.columns }))
      nav(rootURL);
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false))
    }
  }

  return <BoardMenu isEdit={true} boardName={currentBoard.name} boardColumns={columns} onSubmit={onEditBoard} />
}

interface BoardColumnType {
  name: string,
  _id: string
}
interface BoardMenuProps {
  isEdit: boolean,
  boardName: string,
  boardColumns: BoardColumnType[],
  onSubmit: (boardName: string, boardColumns: BoardColumnType[], deletedColumns: BoardColumnType[]) => void
}

function BoardMenu(props: BoardMenuProps) {
  const { isEdit, onSubmit } = props;
  const [boardTitle, setBoardTitle] = useState(props.boardName);
  const [boardColumns, setBoardColumns] = useState(props.boardColumns);
  const [deletedColumns, setDeletedColumns] = useState([] as BoardColumnType[]);
  const [formError, setFormError] = useState({
    title: false,
    columns: boardColumns.map(() => false)
  })

  function addBoardColumn() {
    const error = {
      ...formError,
      columns: [...formError.columns, false]
    }

    setBoardColumns([...boardColumns, { name: '', _id: 'new' }]);
    setFormError(error);
  }

  function onChangeBoardColumn(value: string, index: number) {
    const boardColumn = {
      name: value,
      _id: boardColumns[index]._id
    }

    const errorColumns = [] as boolean[];

    const updatedBoardColumns = [];
    for (let i = 0; i < boardColumns.length; i++) {
      if (i === index) {
        updatedBoardColumns.push(boardColumn);
        errorColumns[i] = false;
      }
      else {
        updatedBoardColumns.push(boardColumns[i]);
        errorColumns[i] = formError.columns[i];
      }
    }

    setBoardColumns([...updatedBoardColumns]);
    setFormError({ ...formError, columns: errorColumns })
  }

  function deleteBoardColumn(index: number) {
    if (boardColumns[index]._id !== 'new') {
      setDeletedColumns([...deletedColumns, boardColumns[index]])
    }
    const newBoardColumns = boardColumns.filter((v, i) => i !== index)
    const error = {
      ...formError,
      columns: formError.columns.filter((v, i) => i !== index)
    }
    setBoardColumns(newBoardColumns);
    setFormError(error)
  }

  function handleSubmit() {
    if (hasFormError())
      return;

    const title = cleanInput(boardTitle);
    const columns = boardColumns.map((c) => { return { _id: c._id, name: cleanInput(c.name) } })
    onSubmit(title, columns, deletedColumns)
  }

  function hasFormError() {
    let hasError = false;
    let error = {
      title: false,
      columns: [] as boolean[]
    }

    if (!boardTitle.trim()) {
      error.title = true;
      hasError = true;
    }

    boardColumns.forEach((s) => {
      if (!s.name.trim()) {
        error.columns.push(true);
        hasError = true;
      } else {
        error.columns.push(false);
      }
    })

    if (hasError) {
      setFormError(error);
      return true;
    } else {
      return false;
    }
  }

  return (
    <Modal className='BoardMenu'>
      <h1 className="menuTitle">{isEdit ? 'Edit Board' : 'Add New Board'}</h1>
      <div className={`boardTitle form-section formInput${formError.title ? ' error' : ''}`}>
        <h2>Title</h2>
        <div className='input-wrapper'>
          <input type="text" placeholder='e.g. Web Design' maxLength={20} value={boardTitle} onChange={(e) => setBoardTitle(e.currentTarget.value)} />
        </div>
      </div>
      <div className='boardColumns form-section'>
        <h2>Board Columns</h2>
        {
          boardColumns.map((boardColumn, index) => {
            return (
              <div className={`boardColumn addable${formError.columns[index] ? ' error' : ''}`} key={index}>
                <input type="text" value={boardColumn.name} onChange={(e) => onChangeBoardColumn(e.currentTarget.value, index)}
                  placeholder={index % 2 === 0 ? 'e.g. Todo' : 'e.g. Doing'} maxLength={20} />
                <DeleteIcon onClick={() => deleteBoardColumn(index)} />
              </div>
            )
          })
        }
        <button className='button-modal button-modal-2' onClick={addBoardColumn}>+ Add New Column</button>
      </div>
      <button className='button-modal button-modal-1' onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Create New Board'}</button>
    </Modal>
  );
}

export default BoardMenu;
