import * as React from 'react'

import { Grid } from '@material-ui/core'
import IconButton from '@mui/material/IconButton'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import DropdownSelect from './DropdownSelect'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { setDisplayMap, setSelectedPropertyIdForMap } from 'renderer/Store/Actions/data'

const MapPatchBrowser: React.FC = () => {
 const dispatch = useDispatch()

 const foundIDs = useSelector((state: RootState) => state.saveProcess.foundIDs)
 const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)
 const currentIndex = foundIDs.findIndex((object) => object.propertyId === selectedPropertyId)

 const leftKeyPressed = () => {
  const foundObject = foundIDs[currentIndex - 1]
  if (foundObject) {
   dispatch(setSelectedPropertyIdForMap({ selectedPropertyId: foundObject.propertyId }))
  }
 }

 const rightKeyPressed = () => {
  const foundObject = foundIDs[currentIndex + 1]
  if (foundObject) {
   dispatch(setSelectedPropertyIdForMap({ selectedPropertyId: foundObject.propertyId }))
  }
 }

 const escKeyPressed = () => {
  dispatch(setDisplayMap({ displayMap: false }))
 }

 const keyDownHandler = (event: any) => {
  switch (event.keyCode) {
   case 27:
    escKeyPressed()
    return

   case 37:
    leftKeyPressed()
    return

   case 39:
    rightKeyPressed()
    return

   default:
    return
  }
 }

 React.useEffect(() => {
  window.addEventListener('keydown', keyDownHandler)
  return () => {
   window.removeEventListener('keydown', keyDownHandler)
  }
 })

 return (
  <Grid container alignItems="center" justifyContent="space-around">
   <Grid container item xs={3} justifyContent="center" alignItems="center">
    <IconButton
     size="large"
     onClick={() => {
      leftKeyPressed()
     }}
    >
     <KeyboardArrowLeft fontSize="large" />
    </IconButton>
   </Grid>
   <Grid container item xs={6} justifyContent="center">
    <DropdownSelect />
   </Grid>
   <Grid container item xs={3} justifyContent="center">
    <IconButton
     size="large"
     onClick={() => {
      rightKeyPressed()
     }}
    >
     <KeyboardArrowRight fontSize="large" />
    </IconButton>
   </Grid>
  </Grid>
 )
}

export default MapPatchBrowser
