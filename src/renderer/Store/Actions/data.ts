export const ADD_DATA_TO_STORE = 'ADD_DATA_TO_STORE'
export const SET_FOUND_IDS = 'SET_FOUND_IDS'
export const SET_FOUND_STAND_IDS = 'SET_FOUND_STAND_IDS'
export const SET_PROPERTY_IDS = 'SET_PROPERTY_IDS'
export const SET_FOREST_STAND_VERSION = 'SET_FOREST_STAND_VERSION'
export const SET_FOLDER_PATH = 'SET_FOLDER_PATH'
export const SET_LOG_DATA = 'SET_LOG_DATA'
export const SET_MODAL_STATE = 'SET_MODAL_STATE'
export const SET_PATCH_FOR_PROPERTYID = 'SET_PATCH_FOR_PROPERTYID'

export const setFoundIds = (data: any) => ({
 type: SET_FOUND_IDS,
 payload: data
})

export const setFoundStandIds = (data: any) => ({
 type: SET_FOUND_STAND_IDS,
 payload: data
})

export const setPropertyIds = (data: any) => ({
 type: SET_PROPERTY_IDS,
 payload: data
})

export const setForestStandVersion = (data: any) => ({
 type: SET_FOREST_STAND_VERSION,
 payload: data
})

export const setFolderPath = (data: any) => ({
 type: SET_FOLDER_PATH,
 payload: data
})

export const setLogData = (data: any) => ({
 type: SET_LOG_DATA,
 payload: data
})

export const setModalState = (data: any) => ({
 type: SET_MODAL_STATE,
 payload: data
})

export const setPatchForPropertyid = (data: any) => ({
 type: SET_PATCH_FOR_PROPERTYID,
 payload: data
})
