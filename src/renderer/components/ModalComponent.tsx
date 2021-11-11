import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Box, Grid, Modal } from '@material-ui/core'
import OpenLayersMap from '../components/OpenLayersMap'

interface ModalProps {
 modalIsOpen: boolean
 closeModal: () => void
}

const ModalComponent: React.FC<ModalProps> = ({ modalIsOpen, closeModal }) => {
 const classes = useStyles()
 return (
  <Modal open={modalIsOpen} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
   <Box className={classes.modalContainer}>
    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
     <Grid container item xs={10} justifyContent="center" alignItems="center">
      <OpenLayersMap />
     </Grid>
     <Grid container item xs={2} justifyContent="center">
      <button>this is a button</button>
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
   top: '55%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: '98%',
   height: '80%',
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
