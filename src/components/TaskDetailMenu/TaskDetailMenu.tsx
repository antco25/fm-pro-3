import React, { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Modal from '../Modal/Modal';
import { ReactComponent as CheckIcon } from '../../assets/icon-check.svg';
import './TaskDetailMenu.scss';
import { OptionsTaskMenu } from '../OptionsMenu/OptionsMenu';
import { ColumnType, selectCurrentTask, setColumns, setCurrentTask, TaskType, useDbDispatch } from '../../redux/dbData/dbDataSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { setModalLoading } from '../../redux/appData/appDataSlice';
import { apiURL } from '../App/App';

function TaskDetailMenu() {
  const { task, columns } = useSelector(selectCurrentTask);
  const [subtaskData, setSubtaskData] = useState({ subtasks: task.subtasks, completed: task.completedSubtasks });
  const currentStatus = columns.findIndex((s) => s._id === task.columnId)
  const dispatch = useDbDispatch();

  function onSubtaskClick(index: number) {
    let completed = subtaskData.completed;
    const updatedSubtasks = subtaskData.subtasks.map((subtask, i) => {
      if (i !== index) return subtask;

      if (subtask.isCompleted) {
        completed--;
        return { ...subtask, isCompleted: false }
      } else {
        completed++;
        return { ...subtask, isCompleted: true }
      }
    });
    saveSubtask({ ...task, subtasks: updatedSubtasks })
    setSubtaskData({ subtasks: updatedSubtasks, completed: completed });
  }

  function onStatusChange(index: number) {
    saveSubtask({ ...task, columnId: columns[index]._id })
  }

  async function saveSubtask(task: TaskType) {
    dispatch(setModalLoading(true))
    try {
      const response: { data: { task: TaskType, columns: ColumnType[] } } = await axios.post(apiURL + '/fm-pro-3/task/edit', task);
      dispatch(setCurrentTask(response.data.task))
      dispatch(setColumns(response.data.columns))
    } catch (err) {

    } finally {
      dispatch(setModalLoading(false))
    }
  }

  return (
    <Modal className='TaskDetailMenu'>
      <div className="menuTitle form-section">
        <h1>{task.title}</h1>
        <OptionsTaskMenu task={task} />
      </div>
      <p className='description form-section'>{task.description}</p>
      <div className='subtasks form-section'>
        <h2>{`Subtasks (${subtaskData.completed} of ${subtaskData.subtasks.length})`}</h2>
        <ul>
          {subtaskData.subtasks.map((subtask, index) => {
            return (
              <li key={index} className={subtask.isCompleted ? 'active' : undefined} onClick={() => onSubtaskClick(index)}>
                <div className='checkIcon'><CheckIcon /></div>
                <span>{subtask.title}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='currentStatus form-section'>
        <h2>Current Status</h2>
        <Dropdown options={columns.map((s) => s.name)} currentValue={currentStatus} onValueChange={onStatusChange} />
      </div>
    </Modal>
  );
}

export default TaskDetailMenu;
