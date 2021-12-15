import * as React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { setDisplayMap, setSelectedPropertyIdForMap } from '../Store/Actions/data'

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
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Select ID to display</InputLabel>
      <Select
        fullWidth
        label="select ID to display"
        value={selectedPropertyId}
        onChange={(event) => {
          dispatch(setDisplayMap({ displayMap: true }))
          dispatch(setSelectedPropertyIdForMap({ selectedPropertyId: event.target.value }))
        }}
        MenuProps={MenuProps}
      >
        {foundIDs.map((object: any) => (
          <MenuItem key={object.propertyId} value={object.propertyId}>{`propertyID: ${object.propertyId}`}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default DropdownSelect
