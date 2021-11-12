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

const dataReducer = createReducer(initialState, {})

export default dataReducer
