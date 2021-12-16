export const ADD_DATA_TO_STORE = 'ADD_DATA_TO_STORE'
export const SET_FOUND_IDS = 'SET_FOUND_IDS'
export const SET_FOUND_STAND_IDS = 'SET_FOUND_STAND_IDS'
export const SET_PROPERTY_IDS = 'SET_PROPERTY_IDS'
export const SET_FOREST_STAND_VERSION = 'SET_FOREST_STAND_VERSION'
export const SET_FOLDER_PATH = 'SET_FOLDER_PATH'
export const RESET_LOG_DATA = 'RESET_LOG_DATA'
export const SET_LOG_DATA = 'SET_LOG_DATA'
export const SET_DISPLAY_MAP = 'SET_DISPLAY_MAP'
export const SET_STAND_FOR_PROPERTYID = 'SET_STAND_FOR_PROPERTYID'
export const SET_SELECTED_PROPERTYID_FOR_MAP = 'SET_SELECTED_PROPERTYID_FOR_MAP'
export const SET_API_KEY_TO_REDUX = 'SET_API_KEY_TO_REDUX'
export const SET_STAND_INDEX_FOR_MAP = 'SET_STAND_INDEX_FOR_MAP'
export const SET_CURRENT_POLYGON_INDICES = 'SET_CURRENT_POLYGON_INDICES'
export const SET_BACKGROUND_MAP = 'SET_BACKGROUND_MAP'

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

export const resetLogData = (data: any) => ({
  type: RESET_LOG_DATA,
  payload: data
})

export const setDisplayMap = (data: any) => ({
  type: SET_DISPLAY_MAP,
  payload: data
})

export const setSelectedPropertyIdForMap = (data: any) => ({
  type: SET_SELECTED_PROPERTYID_FOR_MAP,
  payload: data
})

export const setCurrentPolygonIndices = (data: any) => ({
  type: SET_CURRENT_POLYGON_INDICES,
  payload: data
})

export const setStandIndexForMap = (data: any) => ({
  type: SET_STAND_INDEX_FOR_MAP,
  payload: data
})

export const setApiKeyToRedux = (data: any) => ({
  type: SET_API_KEY_TO_REDUX,
  payload: data
})

export const setBackgroundMap = (data: any) => ({
  type: SET_BACKGROUND_MAP,
  payload: data
})
