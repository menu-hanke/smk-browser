import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Box, Grid, Modal } from '@material-ui/core'
import OpenLayersMap from '../components/OpenLayersMap'
import MapPatchBrowser from './MapPatchBrowser'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { setDisplayMap } from 'renderer/Store/Actions/data'
import ChangeMapButtons from './ChangeMapButtons'

const ModalComponent: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const displayMap = useSelector((state: RootState) => state.map.displayMap)

  return (
    <Modal open={displayMap} onClose={() => dispatch(setDisplayMap({ displayMap: false }))} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box className={classes.modalContainer}>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid container item xs={10} justifyContent="center" alignItems="center">
            <OpenLayersMap />
          </Grid>
          <Grid container item xs={2} justifyContent="center">
            <Grid container item direction="row">
              <Grid container item xs={3} justifyContent="flex-start" alignItems="center" style={{ paddingLeft: '15px' }}>
                <ChangeMapButtons />
              </Grid>
              <Grid container item xs={6} justifyContent="center" alignItems="center">
                <MapPatchBrowser />
              </Grid>
              <Grid container item xs={3}></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    modalContainer: {
      position: 'absolute',
      top: '53%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '98%',
      height: '75%',
      backgroundColor: 'white',
      borderRadius: '5px',
      boxShadow: '24',
      p: '4',
      border: 'solid black 1px',
      paddingTop: '10px'
    }
  })
)

export default ModalComponent
