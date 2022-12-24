import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import { ReactComponent as DeleteIcon } from '../../assets/icon-cross.svg';
import './TaskMenu.scss';
import Dropdown from '../Dropdown/Dropdown';
import { useSelector } from 'react-redux';
import { cleanInput, ColumnType, selectCurrentBoard, selectCurrentTask, setColumns, setCurrentTask, TaskType, useDbDispatch } from '../../redux/dbData/dbDataSlice';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { setModalLoading } from '../../redux/appData/appDataSlice';
import { apiURL, rootURL } from '../App/App';

export function TaskNewMenu() {
  const nav = useNavigate();
  const dispatch = useDbDispatch();
  const { columns } = useSelector(selectCurrentBoard);
  const { state } = useLocation() as { state: ColumnType | null };

  const emptyTask = {
    _id: '', title: '', subtitle: '', description: '', columnId: (state === null) ? columns[0]._id : state._id,
    subtasks: [{ title: '', isCompleted: false }, { title: '', isCompleted: false }], completedSubtasks: 0
  }

  const onCreateTask = async (task: TaskType) => {
    dispatch(setModalLoading(true))
    try {
      const response: { data: { task: TaskType, columns: ColumnType[] } } = await axios.post(apiURL + rootURL + '/task/create', task);
      dispatch(setColumns(response.data.columns));
      dispatch(setCurrentTask(response.data.task));
      nav(`${rootURL}/detail/${response.data.task.subtitle}`)
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false));
    }

  }

  return <TaskMenu isEdit={false} task={emptyTask} status={columns} onSubmit={onCreateTask} />
}
export function TaskEditMenu() {
  const { task, columns } = useSelector(selectCurrentTask);
  const nav = useNavigate();
  const dispatch = useDbDispatch();

  const onEditTask = async (task: TaskType) => {
    dispatch(setModalLoading(true))
    try {
      const response: { data: { task: TaskType, columns: ColumnType[] } } = await axios.post(apiURL + rootURL + '/task/edit', task);
      dispatch(setCurrentTask(response.data.task))
      dispatch(setColumns(response.data.columns))
      nav(-1);
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false));
    }
  }

  return <TaskMenu isEdit={true} task={task} status={columns} onSubmit={onEditTask} />
}

interface TaskMenuProps {
  isEdit: boolean,
  task: TaskType,
  status: ColumnType[],
  onSubmit: (task: TaskType) => void
}

function TaskMenu(props: TaskMenuProps) {

  const { isEdit, task, status, onSubmit } = props;
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [currentStatus, setStatus] = useState(status.findIndex((s) => s._id === task.columnId) || 0);
  const [formError, setFormError] = useState({
    title: false,
    subtasks: task.subtasks.map(() => false)
  });
  function addSubtask() {
    const newSubtasks = [...subtasks, { title: '', isCompleted: false }];
    const error = {
      ...formError,
      subtasks: [...formError.subtasks, false]
    }
    setSubtasks(newSubtasks);
    setFormError(error);
  }

  function onChangeSubtask(value: string, index: number) {
    if (formError.subtasks[index]) {
      const error = {
        ...formError,
        subtasks: formError.subtasks.map((s, i) => (i === index) ? false : s)
      }
      setFormError(error);
    }

    const newSubtasks = subtasks.map((s, i) => {
      if (i !== index) return s;
      else return { title: value, isCompleted: s.isCompleted }
    });
    setSubtasks(newSubtasks);
  }

  function deleteSubtask(index: number) {
    const newSubtasks = subtasks.filter((v, i) => i !== index)
    const error = {
      ...formError,
      subtasks: formError.subtasks.filter((v, i) => i !== index)
    }
    setSubtasks(newSubtasks);
    setFormError(error);
  }

  function handleSubmit() {
    if (hasFormError())
      return;

    const taskData = {
      _id: task._id,
      subtitle: task.subtitle,
      title: cleanInput(taskTitle),
      description: cleanInput(taskDescription),
      columnId: status[currentStatus]._id,
      subtasks: subtasks.map((s) => {
        return {
          title: cleanInput(s.title),
          isCompleted: s.isCompleted
        }
      }),
      completedSubtasks: 0
    }

    onSubmit(taskData);
  }

  function hasFormError() {
    let hasError = false;
    let error = {
      title: false,
      subtasks: [] as boolean[]
    }

    if (!taskTitle.trim()) {
      error.title = true;
      hasError = true;
    }

    subtasks.forEach((s) => {
      if (!s.title.trim()) {
        error.subtasks.push(true);
        hasError = true;
      } else {
        error.subtasks.push(false);
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
    <Modal className='TaskMenu'>
      <h1 className="menuTitle">{isEdit ? 'Edit Task' : 'Add New Task'}</h1>
      <div className={`taskTitle form-section formInput${formError.title ? ' error' : ''}`}>
        <h2>Title</h2>
        <div className='input-wrapper'>
          <input type="text" placeholder='e.g. Take coffee break' maxLength={100} value={taskTitle} onChange={(e) => setTaskTitle(e.currentTarget.value)} />
        </div>
      </div>
      <div className={`taskDescription form-section formInput`}>
        <h2>Description</h2>
        <div className='input-wrapper'>
          <textarea rows={3} value={taskDescription} onChange={(e) => setTaskDescription(e.currentTarget.value)} maxLength={280}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little" />
        </div>
      </div>
      <div className='subtasks form-section'>
        <h2>Subtasks</h2>
        {
          subtasks.map((subtask, index) => {
            return (
              <div className={`subtask addable${formError.subtasks[index] ? ' error' : ''}`} key={index}>
                <input type="text" value={subtask.title} onChange={(e) => onChangeSubtask(e.currentTarget.value, index)}
                  placeholder={index % 2 === 0 ? 'e.g. Make coffee' : 'e.g. Drink coffee & smile'} maxLength={100} />
                <DeleteIcon onClick={() => deleteSubtask(index)} />
              </div>
            )
          })
        }
        <button className='button-modal button-modal-2' onClick={addSubtask}>+ Add New Subtask</button>
      </div>
      <div className='status form-section'>
        <h2>Status</h2>
        <Dropdown options={status.map((s) => s.name)} currentValue={currentStatus} onValueChange={(value) => setStatus(value)} />
      </div>
      <button className='button-modal button-modal-1' onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create Task"}</button>
    </Modal>
  );
}

export default TaskMenu;
