import { createReducer } from '@reduxjs/toolkit'

const initialState = {
 beforeFetch: {
  propertyIds: [''],
  forestStandVersion: 'MV1.8',
  folderPath: '',
  removeDuplicates: true
 },

 saveProcess: {
  logData: [],
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
 ADD_DATA_TO_STORE: (state, action) => {
  state.beforeFetch.propertyIds.push(action.payload.propertyId)
 },
 SAVE_FOUND_ID: (state, action) => {
  if (state.saveProcess.foundIDs.find((object) => object.propertyId === action.payload.propertyId)) {
   return
  }
  state.saveProcess.foundIDs.push({
   propertyId: action.payload.propertyId,
   geojsonFile: action.payload.geojsonFile
  })
 },
 SAVE_FOUND_STAND_IDS: (state, action) => {
  state.saveProcess.foundStandIds = state.saveProcess.foundStandIds.concat(action.payload.foundStandIds)
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
