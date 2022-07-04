import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Grid, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setBackgroundMap } from 'renderer/Store/Actions/data'

const ChangeMapButtons: React.FC = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.container}>
      <Grid container item xs={6} justifyContent="center" alignItems="center">
        <Button
          style={{ padding: '2' }}
          variant="outlined"
          onClick={() => {
            dispatch(setBackgroundMap({ useBackgroundMap: 'maastokartta' }))
          }}
        >
          Maastokartta
        </Button>
      </Grid>
      <Grid container item xs={6} justifyContent="center" alignItems="center">
        <Button
          style={{ padding: '2' }}
          variant="outlined"
          onClick={() => {
            dispatch(setBackgroundMap({ useBackgroundMap: 'ortokuva' }))
          }}
        >
          Ortokuva
        </Button>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '250px',
      height: '50px',
      backgroundColor: 'white'
    }
  })
)

export default ChangeMapButtons
