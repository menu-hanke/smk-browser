import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { SelectChangeEvent } from '@mui/material/Select'
import { useSelector } from 'react-redux'
import { RootState } from 'renderer/App'

interface Props {
 afterSelectFunction: () => void
}

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

const DropdownSelect: React.FC<Props> = ({ afterSelectFunction }) => {
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
    afterSelectFunction()
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
