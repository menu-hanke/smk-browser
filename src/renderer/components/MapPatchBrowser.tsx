import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Grid } from '@material-ui/core'
import IconButton from '@mui/material/IconButton'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import DropdownSelect from './DropdownSelect'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { setSelectedPropertyIdForMap } from 'renderer/Store/Actions/data'

// interface interfaceName {
//   value: string
// }

const MapPatchBrowser: React.FC = () => {
 const dispatch = useDispatch()
 const classes = useStyles()
 const foundIDs = useSelector((state: RootState) => state.saveProcess.foundIDs)
 const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)
 console.log('selected propertyId in mapPatchBrowser: ', selectedPropertyId)
 const currentIndex = foundIDs.findIndex((object) => object.propertyId === selectedPropertyId)

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

 const keyDownHandler = (event: any) => {
  switch (event.keyCode) {
   case 27:
    alert('esc key')
    return

   case 37:
    alert('left key')
    return

   case 38:
    upKeyPressed()
    return

   case 39:
    alert('right key')
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
