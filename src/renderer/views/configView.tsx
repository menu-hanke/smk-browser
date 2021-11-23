/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { setApiKeyToRedux } from 'renderer/Store/Actions/data'
import { useDispatch } from 'react-redux'

const ConfigView: React.FC = () => {
 React.useEffect(() => {
  dispatch(setApiKeyToRedux({ apiKey: localStorage.getItem('smk-browser.config.apiKey') }))
 }, [])

 const dispatch = useDispatch()
 const [apiKey, setApiKey] = React.useState(localStorage.getItem('smk-browser.config.apiKey'))

 const apiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  localStorage.setItem('smk-browser.config.apiKey', event.target.value.trim())
  setApiKey(event.target.value)
  dispatch(setApiKeyToRedux({ apiKey: event.target.value }))
 }

 return (
  <Grid container spacing={2}>
   <Grid item xs={12}>
    <TextField id="outlined-multiline-static" label="API Key for MML WMTS" value={apiKey} variant="outlined" onChange={apiKeyChange} defaultValue="" fullWidth />
   </Grid>
  </Grid>
 )
}

export default ConfigView
