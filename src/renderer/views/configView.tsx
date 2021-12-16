/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { setApiKeyToRedux } from 'renderer/Store/Actions/data'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'

const ConfigView: React.FC = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setApiKeyToRedux({ apiKey: localStorage.getItem('smk-browser.config.apiKey') }))
  }, [])

  //  const [apiKey, setApiKey] = React.useState(localStorage.getItem('smk-browser.config.apiKey'))
  const apiKey = useSelector((state: RootState) => state.apiKey)

  const apiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('smk-browser.config.apiKey', event.target.value.trim())
    // setApiKey(event.target.value)
    dispatch(setApiKeyToRedux({ apiKey: event.target.value }))
  }

  return (
    <Grid container spacing={2} style={{ paddingLeft: '27px', paddingRight: '27px' }}>
      <Grid item xs={12}>
        <TextField id="outlined-multiline-static" label="API Key for MML WMTS" value={apiKey} variant="outlined" onChange={apiKeyChange} defaultValue="" fullWidth />
      </Grid>
    </Grid>
  )
}

export default ConfigView
