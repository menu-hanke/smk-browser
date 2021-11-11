import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Box, Grid } from '@material-ui/core'

// interface interfaceName {
//   value: string
// }

const MapPatchBrowser: React.FC = () => {
 const classes = useStyles()
 return (
  <Grid>
   <Box className={classes.container}>this is a box</Box>
  </Grid>
 )
}

const useStyles = makeStyles(() =>
 createStyles({
  container: {
   backgroundColor: 'white'
  }
 })
)

export default MapPatchBrowser
