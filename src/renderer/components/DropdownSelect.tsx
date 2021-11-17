import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { SelectChangeEvent } from '@mui/material/Select'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'

import { setModalState } from '../Store/Actions/data'

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
 const [value, setValue] = React.useState('')
 const handleChange = (event: SelectChangeEvent) => {
  setValue(event.target.value as string)
 }

 const foundIDs = useSelector((state: RootState) => state.saveProcess.foundIDs)
 console.log('found stand IDs: ', foundIDs)

 return (
  <Select
   value={value}
   label="Age"
   onChange={(event) => {
    handleChange(event)
    dispatch(setModalState({ displayMap: true }))
   }}
   MenuProps={MenuProps}
  >
   {foundIDs.map((object) => (
    <MenuItem value={object.propertyId}>{`propertyID: ${object.propertyId}`}</MenuItem>
   ))}
  </Select>
 )
}

export default DropdownSelect
