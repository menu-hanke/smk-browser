import { createReducer } from '@reduxjs/toolkit'
import { ReduxState } from 'renderer/types'

const initialState: ReduxState = {
 apiKey: '',

 beforeFetch: {
  propertyIds: '',
  forestStandVersion: 'MV1.8',
  folderPath: '',
  removeDuplicates: true
 },

 saveProcess: {
  logData: [],
  foundStandIds: [], // This is used for remove duplicates filtering process
  foundIDs: []
 },

 map: {
  displayMap: false,
  useBackgroundMap: 'maastokartta',
  selectedPropertyId: '',
  currentPolygonIndices: [],
  selectedStandIndex: 0,
  dataToDisplay: {
   standFeatures: {}, // Get XML from hard drive and convert it to geojson
   patchFeatures: {} // This is filled from json files fetched from the hard drive, once propertyID is selected in Map Screen
  }
 }
}

const dataReducer = createReducer(initialState, {
 SET_FOUND_IDS: (state, action) => {
  state.saveProcess.foundIDs = action.payload.foundIds
 },
 SET_FOUND_STAND_IDS: (state, action) => {
  state.saveProcess.foundStandIds = state.saveProcess.foundStandIds.concat(action.payload.foundStandIds)
 },
 SET_PROPERTY_IDS: (state, action) => {
  state.beforeFetch.propertyIds = action.payload.propertyIds
 },
 SET_FOREST_STAND_VERSION: (state, action) => {
  state.beforeFetch.forestStandVersion = action.payload.forestStandVersion
 },
 SET_FOLDER_PATH: (state, action) => {
  state.beforeFetch.folderPath = action.payload.folderPath
 },
 SET_LOG_DATA: (state, action) => {
  state.saveProcess.logData = [...state.saveProcess.logData, action.payload.logData]
 },
 SET_MODAL_STATE: (state, action) => {
  state.map.displayMap = action.payload.displayMap
 },
 //  SET_STAND_FOR_PROPERTYID: (state, action) => {
 //   state.saveProcess.foundIDs[action.payload.propertyID].stands.push({ patchId: action.payload.patchId, standXmlFile: action.payload.standXmlFile })
 //  },
 SET_SELECTED_PROPERTYID_FOR_MAP: (state, action) => {
  state.map.selectedPropertyId = action.payload.selectedPropertyId
 },
 SET_CURRENT_POLYGON_INDICES: (state, action) => {
  state.map.currentPolygonIndices = action.payload.currentPolygonIndices
 },
 SET_STAND_INDEX_FOR_MAP: (state, action) => {
  state.map.selectedStandIndex = action.payload.selectedStandIndex
 },
 SET_API_KEY_TO_REDUX: (state, action) => {
  state.apiKey = action.payload.apiKey
 },
 SET_BACKGROUND_MAP: (state, action) => {
  state.map.useBackgroundMap = action.payload.useBackgroundMap
 }
})

export default dataReducer

// const foundIds = [
// {
//   propertyId: '',
//   geojsonFile: 'nameOfTheFile.json',
//   stands: [
//    {
//     patchId: 1,
//     standXMLFile: 'nameOfTheFile.xml'
//    }
//   ]
//  }
// ]
