import { createReducer } from '@reduxjs/toolkit'

const initialState = {
 saveProcess: {
  propertyIds: '',
  forestStandVersion: 'MV1.8',
  folderPath: '',
  savePath: '',
  filterByGeometry: true,
  filterDuplicates: true,
  logData: {},
  foundIDs: {},
  savedFilesById: {}
 },
 map: {
  displayMap: false,
  useBackgroundMap: 'maastokartta',
  dataToDisplay: ''
 }
}

const dataReducer = createReducer(initialState, {
 ADD_DATA_TO_STORE: (state, action) => {
  console.log('State before action: ', state)
  state.saveProcess.propertyIds = action.payload.propertyId
  console.log('State after action: ', state)
 }
})

export default dataReducer
