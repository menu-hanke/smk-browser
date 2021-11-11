import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { SelectChangeEvent } from '@mui/material/Select'

interface Props {
 arrayOfItems: any[]
 afterSelectFunction: () => void
 isLogData: boolean
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

const DropdownSelect: React.FC<Props> = ({ arrayOfItems, afterSelectFunction, isLogData }) => {
 const [value, setValue] = React.useState('')
 const handleChange = (event: SelectChangeEvent) => {
  setValue(event.target.value as string)
 }

 if (isLogData) {
  const filteredArray = arrayOfItems.filter((object) => object.type !== 'error')
  const editedArray = filteredArray.map((object) => object.message.slice(-40))
  // const shortenedArray = editedArray.filter(
  //  (object) => !object.message.includes('all downloads complete')
  // )
  console.log('editedArray:', editedArray)

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
    {editedArray.map((string) => (
     <MenuItem value={string}>{string}</MenuItem>
    ))}
   </Select>
  )
 } else {
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
    {arrayOfItems.map((string) => (
     <MenuItem value={string}>{string}</MenuItem>
    ))}
   </Select>
  )
 }
}

export default DropdownSelect

//  renderValue={(selected) => {
//   if (selected.length === 0) {
//    return <em>Placeholder</em>
//   }
//   return selected.concat(', ')
//  }}
