import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { setModalState, setSelectedPropertyIdForMap } from '../Store/Actions/data'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
 PaperProps: {
  style: {
   maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
   width: 250
  }
 }
}

const DropdownSelect: React.FC = () => {
 const dispatch = useDispatch()
 const foundIDs = useSelector((state: RootState) => state.saveProcess.foundIDs)
 const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)

 return (
  <Select
   value={selectedPropertyId}
   onChange={(event) => {
    // handleChange(event)
    dispatch(setModalState({ displayMap: true }))
    dispatch(setSelectedPropertyIdForMap({ selectedPropertyId: event.target.value }))
   }}
   MenuProps={MenuProps}
  >
   {foundIDs.map((object: any) => (
    <MenuItem key={object.propertyId} value={object.propertyId}>{`propertyID: ${object.propertyId}`}</MenuItem>
   ))}
  </Select>
 )
}

export default DropdownSelect
