import { createReducer } from '@reduxjs/toolkit'
import { ReduxState } from 'renderer/types'

const initialState: ReduxState = {
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
 SET_STAND_FOR_PROPERTYID: (state, action) => {
  state.saveProcess.foundIDs[action.payload.propertyID].stands.push({ standId: action.payload.standId, standXmlFile: action.payload.standXmlFile })
 }
})

export default dataReducer

// const foundIds = [
// {
//   propertyId: '',
//   geojsonFile: 'nameOfTheFile.json',
//   stands: [
//    {
//     standId: 1,
//     standXMLFile: 'nameOfTheFile.xml'
//    }
//   ]
//  }
// ]
