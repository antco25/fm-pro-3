import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setModalLoading } from '../../redux/appData/appDataSlice';
import { BoardType, ColumnType, selectCurrentBoard, selectCurrentTask, setBoards, setColumns, setCurrentBoard, useDbDispatch } from '../../redux/dbData/dbDataSlice';
import { apiURL, rootURL } from '../App/App';
import Modal from '../Modal/Modal';
import './DeleteMenu.scss';

interface DeleteMenuProps {
  menuTitle: string,
  description: string,
  deleteButton: JSX.Element,
  cancelButton: JSX.Element
}

export function DeleteBoardMenu() {

  const { currentBoard, boards } = useSelector(selectCurrentBoard);
  const nav = useNavigate();
  const dispatch = useDbDispatch();

  const onBoardDelete = async () => {
    dispatch(setModalLoading(true))
    try {
      const boardIndex = boards.findIndex((board) => board._id === currentBoard._id);
      const nextBoard = (boardIndex < boards.length - 1) ? boards[boardIndex + 1] : boards[boardIndex - 1];

      const updatedBoards: { data: BoardType[] } = await axios.delete(apiURL + '/fm-pro-3/board/delete', { data: currentBoard });
      const columns: { data: ColumnType[] } = await axios.get(apiURL + '/fm-pro-3/column/all/' + nextBoard._id);
      dispatch(setBoards(updatedBoards.data));
      dispatch(setCurrentBoard({ currentBoard: nextBoard, columns: columns.data }));
      nav(rootURL);
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false))
    }
  }

  const menuTitle = 'Delete this board';
  const description = "Are you sure you want to delete the '" + currentBoard.name + "' board? This action will remove all columns and tasks and cannot be reversed.";
  const deleteButton = <button className='button-modal button-modal-3' onClick={() => onBoardDelete()}>Delete</button>;
  const cancelButton = <button className='button-modal button-modal-2' onClick={() => nav(-1)}>Cancel</button>;

  return <DeleteMenu menuTitle={menuTitle} description={description} deleteButton={deleteButton} cancelButton={cancelButton} />
}

export function DeleteTaskMenu() {
  const nav = useNavigate();
  const dispatch = useDbDispatch();
  const { task } = useSelector(selectCurrentTask)

  const onTaskDelete = async () => {
    dispatch(setModalLoading(true))
    try {
      const updatedColumns: { data: ColumnType[] } = await axios.delete(apiURL + '/fm-pro-3/task/delete', { data: task });
      dispatch(setColumns(updatedColumns.data))
      nav(rootURL);
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false))
    }
  }

  const menuTitle = 'Delete this task';
  const description = "Are you sure you want to delete the '" + task.title + "' task and its subtasks? This action cannot be reversed.";
  const deleteButton = <button className='button-modal button-modal-3' onClick={() => onTaskDelete()}>Delete</button>;
  const cancelButton = <button className='button-modal button-modal-2' onClick={() => nav(-1)}>Cancel</button>;

  return <DeleteMenu menuTitle={menuTitle} description={description} deleteButton={deleteButton} cancelButton={cancelButton} />
}

function DeleteMenu(props: DeleteMenuProps) {
  const { menuTitle, description, deleteButton, cancelButton } = props;

  return (
    <Modal className='DeleteMenu'>
      <h1 className="menuTitle">{menuTitle}</h1>
      <div className='description'>{description}</div>
      <div className='controls'>
        {deleteButton}
        {cancelButton}
      </div>
    </Modal>
  );
}

export default DeleteMenu;
