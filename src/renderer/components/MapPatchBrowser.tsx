import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Grid } from '@material-ui/core'
import IconButton from '@mui/material/IconButton'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

// interface interfaceName {
//   value: string
// }

const MapPatchBrowser: React.FC = () => {
 const classes = useStyles()

 return (
  <Grid container className={classes.container} alignItems="center" justifyContent="space-around">
   <Grid container item xs={2} justifyContent="center" alignItems="center">
    <IconButton size="large">
     <KeyboardArrowLeft fontSize="large" />
    </IconButton>
   </Grid>
   <Grid container item xs={8} justifyContent="center"></Grid>
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
