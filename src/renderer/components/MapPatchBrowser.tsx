import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Grid } from '@material-ui/core'
import IconButton from '@mui/material/IconButton'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import DropdownSelect from './DropdownSelect'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { setSelectedPropertyIdForMap, setStandIndexForMap } from 'renderer/Store/Actions/data'

const MapPatchBrowser: React.FC = () => {
 const dispatch = useDispatch()
 const classes = useStyles()
 const foundIDs = useSelector((state: RootState) => state.saveProcess.foundIDs)
 const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)
 const currentIndex = foundIDs.findIndex((object) => object.propertyId === selectedPropertyId)

 // Stands
 const currentPolygonIndices = useSelector((state: RootState) => state.map.currentPolygonIndices)
 const standIndexForMap = useSelector((state: RootState) => state.map.selectedStandIndex)

 const upKeyPressed = () => {
  const foundObject = foundIDs[currentIndex - 1]
  if (foundObject) {
   dispatch(setSelectedPropertyIdForMap({ selectedPropertyId: foundObject.propertyId }))
  }
 }

 const downKeyPressed = () => {
  const foundObject = foundIDs[currentIndex + 1]
  if (foundObject) {
   dispatch(setSelectedPropertyIdForMap({ selectedPropertyId: foundObject.propertyId }))
  }
 }

 const leftKeyPressed = () => {
  const selectedStandIndex = standIndexForMap - 1
  if (selectedStandIndex !== -1 || selectedStandIndex < currentPolygonIndices.length) {
   dispatch(setStandIndexForMap({ selectedStandIndex: selectedStandIndex }))
  }
 }

 const rightKeyPressed = () => {
  const selectedStandIndex = standIndexForMap + 1
  if (selectedStandIndex !== -1 || selectedStandIndex < currentPolygonIndices.length) {
   dispatch(setStandIndexForMap({ selectedStandIndex: selectedStandIndex }))
  }
 }

 const keyDownHandler = (event: any) => {
  switch (event.keyCode) {
   case 27:
    alert('esc key')
    return

   case 37:
    // left key
    leftKeyPressed()
    return

   case 38:
    upKeyPressed()
    return

   case 39:
    // Right key
    rightKeyPressed()
    return

   case 40:
    // Down Key
    downKeyPressed()
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
  <Grid container className={classes.container} alignItems="center" justifyContent="space-around">
   <Grid container item xs={2} justifyContent="center" alignItems="center">
    <IconButton size="large">
     <KeyboardArrowLeft fontSize="large" />
    </IconButton>
   </Grid>
   <Grid container item xs={8} justifyContent="center">
    <DropdownSelect />
   </Grid>
   <Grid container item xs={2} justifyContent="center">
    <IconButton size="large">
     <KeyboardArrowRight fontSize="large" />
    </IconButton>
   </Grid>
  </Grid>
 )
}

const useStyles = makeStyles(() =>
 createStyles({
  container: {
   width: '35%'
  }
 })
)

export default MapPatchBrowser
