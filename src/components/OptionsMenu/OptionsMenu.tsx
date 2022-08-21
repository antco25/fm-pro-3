import React from 'react';
import './OptionsMenu.scss';
import { ReactComponent as OptionsIcon } from '../../assets/icon-vertical-ellipsis.svg';
import useOutsideClick from '../useOutsideClick';
import { useNavigate } from 'react-router-dom';
import { BoardType, TaskType } from '../../redux/dbData/dbDataSlice';
import { rootURL } from '../App/App';

interface OptionsMenuProps {
    position: string,
    editElement: JSX.Element,
    deleteElement: JSX.Element,
    isDefaultBoard: boolean
}

export function OptionsBoardMenu(props: { currentBoard: BoardType, isDefaultBoard: boolean }) {
    const { currentBoard, isDefaultBoard } = props;
    const nav = useNavigate();

    const editLink = rootURL +'/edit/board/' + currentBoard.subname;
    const editElement = <span onClick={() => nav(editLink)}>Edit {currentBoard.name}</span>;

    const deleteLink = rootURL + '/delete/board/' + currentBoard.subname;
    const deleteElement = <span onClick={() => nav(deleteLink)}>Delete {currentBoard.name}</span>

    const position = 'top-position';

    return <OptionsMenu editElement={editElement} deleteElement={deleteElement} position={position} isDefaultBoard={isDefaultBoard} />
}

export function OptionsTaskMenu(props: { task: TaskType }) {
    const { task } = props;
    const nav = useNavigate();

    const editLink = rootURL + '/edit/task/' + task.subtitle;
    const editElement = <span onClick={() => nav(editLink)}>Edit</span>;

    const deleteLink = rootURL + '/delete/task/' + task.subtitle;
    const deleteElement = <span onClick={() => nav(deleteLink)}>Delete</span>

    const position = 'modal-position';

    return <OptionsMenu editElement={editElement} deleteElement={deleteElement} position={position} isDefaultBoard={false} />
}

function OptionsMenu(props: OptionsMenuProps) {

    const { position, editElement, deleteElement, isDefaultBoard } = props;
    const { ref, isComponentActive, setIsComponentActive } = useOutsideClick(false, onOutsideClick);

    function onOutsideClick() {
        setIsComponentActive(false);
    }

    return (
        <div className={`OptionsMenu`} ref={ref}>
            <OptionsIcon onClick={() => setIsComponentActive(!isComponentActive)} />
            <div className={`options ${position}${isComponentActive ? ' open' : ' hidden'}`}>
                <ul>
                    <li className='edit' onClick={() => setIsComponentActive(false)}>
                        {editElement}
                    </li>
                    {
                        isDefaultBoard ? null :
                            <li className='delete' onClick={() => setIsComponentActive(false)}>
                                {deleteElement}
                            </li>
                    }
                </ul>
            </div>
        </div>
    );
}

export default OptionsMenu;