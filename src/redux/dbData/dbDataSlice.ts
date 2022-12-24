import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { apiURL, rootURL } from '../../components/App/App';
import store, { RootState } from '../store'

/**
 * Thunks
 */

export const fetchApp = createAsyncThunk(
    'dbData/fetchApp',
    async () => {
        //Get board list
        const boards: { data: BoardType[] } = await axios.get(apiURL + rootURL + '/board/all');

        if (boards.data.length === 0) {
            //Create default board
            const board = {
                _id: '',
                name: 'Default',
                subname: 'default',
                columns: []
            } as BoardType

            const defaultBoard: { data: { board: BoardType, columns: ColumnType[] } } = await axios.post(apiURL + rootURL + '/board/create', board);
            return { boards: [defaultBoard.data.board], currentBoard: defaultBoard.data.board, columns: defaultBoard.data.columns };
        }

        //Get current board columns and tasks
        const currentBoard = boards.data[0]
        const columns: { data: ColumnType[] } = await axios.get(apiURL + rootURL + '/column/all/' + currentBoard._id);

        return { boards: boards.data, currentBoard: currentBoard, columns: columns.data };
    }
)

/**
 * Slice
 */

interface dbDataType {
    boards: BoardType[],
    boardsStatus: "loading" | "ready" | "error",
    currentBoard: BoardType | null,
    columns: ColumnType[],
    currentTask: TaskType | null,
}

export const dbDataSlice = createSlice({
    name: 'dbData',
    initialState: {
        boards: [],
        boardsStatus: 'loading',
        currentBoard: null,
        columns: [],
        currentTask: null
    } as dbDataType,
    reducers: {
        setCurrentBoard: (state, action: CurrentBoardAction) => {
            return { ...state, currentBoard: action.payload.currentBoard, columns: action.payload.columns }
        },
        setColumns: (state, action: ColumnAction) => {
            return { ...state, columns: action.payload }
        },
        setCurrentTask: (state, action: TaskAction) => {
            return { ...state, currentTask: action.payload }
        },
        setBoards: (state, action: BoardsAction) => {
            return { ...state, boards: action.payload }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchApp.fulfilled, (state, action) => {
            const { boards, currentBoard, columns } = action.payload;
            return {
                ...state, boards: boards, boardsStatus: 'ready', currentBoard: currentBoard, columns: columns
            }
        })
            .addCase(fetchApp.pending, (state) => {
                return { ...state, boardsStatus: 'loading' }
            })
            .addCase(fetchApp.rejected, (state) => {
                return { ...state, boardsStatus: 'error' }
            })
    }
})

/**
 * Select methods
 */

export const selectBoards = (state: RootState) => {
    return { boards: state.dbData.boards, boardsStatus: state.dbData.boardsStatus };
};

export const selectCurrentBoard = (state: RootState) => {
    if (state.dbData.currentBoard === null) throw new TypeError("No current board")

    return { currentBoard: state.dbData.currentBoard, columns: state.dbData.columns, boards: state.dbData.boards };
};

export const selectCurrentTask = (state: RootState) => {
    if (state.dbData.currentTask === null) throw new TypeError("No current board")

    return { task: state.dbData.currentTask, columns: state.dbData.columns };
};

/**
 * Types
 */

export interface BoardType {
    _id: string,
    name: string,
    subname: string
}

export interface ColumnType {
    _id: string,
    name: string,
    boardId: string,
    tasks: TaskType[]
}

export interface TaskType {
    _id: string,
    title: string,
    subtitle: string,
    description: string,
    columnId: string,
    subtasks: { title: string, isCompleted: boolean }[],
    completedSubtasks: number
}

interface CurrentBoardAction {
    type: string,
    payload: { currentBoard: BoardType, columns: ColumnType[] }
}

interface ColumnAction {
    type: string,
    payload: ColumnType[]
}

interface TaskAction {
    type: string,
    payload: TaskType
}

interface BoardsAction {
    type: string,
    payload: BoardType[]
}

/**
 * Methods
 */

export function cleanInput(s: string): string {
    if (s === '') return s;
    let text = s.replace(/\s+/g, ' ').trim();
    return text[0].toUpperCase() + text.slice(1);
}

/**
* Exports
*/

export const { setCurrentBoard, setColumns, setCurrentTask, setBoards } = dbDataSlice.actions;

export type DbDispatch = typeof store.dispatch;
export const useDbDispatch: () => DbDispatch = useDispatch;

export default dbDataSlice.reducer