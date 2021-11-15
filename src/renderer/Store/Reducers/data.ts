import { createReducer } from '@reduxjs/toolkit'

const initialState = {
 saveProcess: {
  propertyIds: '',
  forestStandVersion: 'MV1.8',
  folderPath: '',
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
  state.saveProcess.propertyIds = action.payload.propertyId
 }
})

export default dataReducer
