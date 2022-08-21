import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export const appDataSlice = createSlice({
    name: 'appData',
    initialState: {
        appTheme: 'dark-theme',
        navBoardOpen: false,
        modalLoading: false,
        boardLoading: false,
    },
    reducers: {
        setAppTheme: (state, action: AppThemeAction) => {
            return { ...state, appTheme: action.payload }
        },
        setNavBoardOpen: (state, action: BooleanAction) => {
            return { ...state, navBoardOpen: action.payload }
        },
        setModalLoading: (state, action: BooleanAction) => {
            return { ...state, modalLoading: action.payload }
        },
        setBoardLoading: (state, action: BooleanAction) => {
            return { ...state, boardLoading: action.payload }
        }
    }
})

/**
 * Action Types
 */

interface AppThemeAction {
    type: string,
    payload: "dark-theme" | "light-theme"
}

interface BooleanAction {
    type: string,
    payload: boolean
}

/**
 * Select methods
 */

export const selectAppTheme = (state: RootState) => {
    return state.appData.appTheme;
};

export const selectNavBoardOpen = (state: RootState) => {
    return state.appData.navBoardOpen;
};

export const selectModalLoading = (state: RootState) => {
    return state.appData.modalLoading;
};

export const selectBoardLoading = (state: RootState) => {
    return state.appData.boardLoading;
};

export const { setAppTheme, setNavBoardOpen, setModalLoading, setBoardLoading } = appDataSlice.actions;

export default appDataSlice.reducer