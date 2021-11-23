import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Grid, IconButton } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { setBackgroundMap } from 'renderer/Store/Actions/data'

const ChangeMap: React.FC = () => {
 const dispatch = useDispatch()
 const classes = useStyles()

 return (
  <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.container} spacing={2}>
   <Grid container item xs={6}>
    <IconButton
     onClick={() => {
      dispatch(setBackgroundMap({ useBackgroundMap: 'maastokartta' }))
     }}
    >
     Maastokartta
    </IconButton>
   </Grid>
   <Grid container item xs={6}>
    <IconButton
     onClick={() => {
      dispatch(setBackgroundMap({ useBackgroundMap: 'ortokuva' }))
     }}
    >
     Ortokuva
    </IconButton>
   </Grid>
  </Grid>
 )
}

const useStyles = makeStyles(() =>
 createStyles({
  container: {
   width: '200px',
   height: '50px',
   backgroundColor: 'white'
  }
 })
)

export default ChangeMap
