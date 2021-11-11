import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Grid } from '@material-ui/core'
import IconButton from '@mui/material/IconButton'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import DropdownSelect from './DropdownSelect'

// interface interfaceName {
//   value: string
// }

const MapPatchBrowser: React.FC = () => {
 const classes = useStyles()

 const arrayOfItems = [
  'PropertyID:  213-424-1-120 patch: 1',
  'PropertyID:  213-424-1-120 patch: 2',
  'PropertyID:  213-424-1-120 patch: 3',
  'PropertyID:  213-424-1-120 patch: 4',
  'PropertyID:  213-424-1-120 patch: 5',
  'PropertyID:  213-424-1-120 patch: 6'
 ]

 return (
  <Grid container className={classes.container} alignItems="center" justifyContent="space-around">
   <Grid container item xs={2} justifyContent="center" alignItems="center">
    <IconButton size="large">
     <KeyboardArrowLeft fontSize="large" />
    </IconButton>
   </Grid>
   <Grid container item xs={8} justifyContent="center">
    <DropdownSelect
     arrayOfItems={arrayOfItems}
     afterSelectFunction={() => console.log('function called')}
     isLogData={false}
    />
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
