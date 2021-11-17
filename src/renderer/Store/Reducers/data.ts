import { createReducer } from '@reduxjs/toolkit'

interface Log {
 type: string
 message: string
}

const initialState = {
 beforeFetch: {
  propertyIds: '',
  forestStandVersion: 'MV1.8',
  folderPath: '',
  removeDuplicates: true
 },

 saveProcess: {
  logData: [] as Log[],
  foundStandIds: [] as string[], // This is used for remove duplicates filtering process
  foundIDs: [] as any[]
 },

 map: {
  displayMap: false,
  useBackgroundMap: 'maastokartta',
  dataToDisplay: {
   standFeatures: {}, // Get XML from hard drive and convert it to geojson
   parcelFeatures: {} // This is filled from json files fetched from the hard drive, once propertyID is selected in Map Screen
  }
 }
}

const dataReducer = createReducer(initialState, {
 SET_FOUND_ID: (state, action) => {
  if (state.saveProcess.foundIDs.find((object) => object.propertyId === action.payload.propertyId)) {
   return
  }
  state.saveProcess.foundIDs.push({
   propertyId: action.payload.propertyId,
   geojsonFile: action.payload.geojsonFile
  })
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
 }
})

export default dataReducer

// {
//   propertyId: '',
//   geojsonFile: 'nameOfTheFile.json',
//   patches: [
//    {
//     patchwId: 1,
//     standXMLFile: 'nameOfTheFile.xml'
//    }
//   ]
//  }
