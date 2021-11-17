export const ADD_DATA_TO_STORE = 'ADD_DATA_TO_STORE'
export const SAVE_FOUND_ID = 'SAVE_FOUND_ID'
export const SAVE_FOUND_STAND_IDS = 'SAVE_FOUND_STAND_IDS'

export const addDataToStore = (data: any) => ({
 type: ADD_DATA_TO_STORE,
 payload: data
})

export const saveFoundId = (data: any) => ({
 type: SAVE_FOUND_ID,
 payload: data
})

export const saveFoundStandIds = (data: any) => ({
 type: SAVE_FOUND_STAND_IDS,
 payload: data
})
