import { createReducer } from '@reduxjs/toolkit'

const initialState = {
 beforeFetch: {
  propertyIds: '',
  forestStandVersion: 'MV1.8',
  folderPath: '',
  removeDuplicates: true
 },

 saveProcess: {
  logData: [],
  foundStandIds: ['idOfFoundStand'], // This is used for remove duplicates filtering process
  foundIDs: [
   {
    propertyId: '',
    geojsonFile: 'nameOfTheFile.json',
    patches: [
     {
      patchId: 1,
      standXMLFile: 'nameOfTheFile.xml'
     }
    ]
   }
  ]
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
  state.saveProcess.propertyIds = action.payload.propertyId
 }
})

export default dataReducer
