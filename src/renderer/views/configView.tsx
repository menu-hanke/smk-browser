/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import { Grid, TextField } from '@mui/material'
import { setApiKeyToRedux, setUsernameToRedux, setPasswordToRedux } from 'renderer/Store/Actions/data'
import { batch, useDispatch, useSelector } from 'react-redux'
import { RootState } from 'renderer/App'

const ConfigView: React.FC = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    batch(() => {
      dispatch(setApiKeyToRedux({ apiKey: localStorage.getItem('smk-browser.config.apiKey') }))
      dispatch(setUsernameToRedux({ username: localStorage.getItem('smk-browser.config.username') }))
      dispatch(setPasswordToRedux({ password: localStorage.getItem('smk-browser.config.password') }))
    })
  }, [])

  //  const [apiKey, setApiKey] = React.useState(localStorage.getItem('smk-browser.config.apiKey'))
  const username = useSelector((state: RootState) => state.username)
  const password = useSelector((state: RootState) => state.password)
  const apiKey = useSelector((state: RootState) => state.apiKey)

  const apiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('smk-browser.config.apiKey', event.target.value.trim())
    // setApiKey(event.target.value)
    dispatch(setApiKeyToRedux({ apiKey: event.target.value }))
  }

  const usernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('smk-browser.config.username', event.target.value.trim())
    dispatch(setUsernameToRedux({ username: event.target.value }))
  }

  const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('smk-browser.config.password', event.target.value.trim())
    dispatch(setPasswordToRedux({ password: event.target.value }))
  }

  return (
    <Grid container spacing={2} style={{ paddingLeft: '27px', paddingRight: '27px' }}>
      <Grid item xs={4}>
        <TextField id="outlined-multiline-static" label="Username" value={username} variant="outlined" onChange={usernameChange} defaultValue="" fullWidth />
      </Grid>
      <Grid item xs={4}>
        <TextField id="outlined-multiline-static" label="Password" value={password} variant="outlined" onChange={passwordChange} defaultValue="" fullWidth type="password" />
      </Grid>
      <Grid item xs={4}>
        <TextField id="outlined-multiline-static" label="API Key for MML WMTS" value={apiKey} variant="outlined" onChange={apiKeyChange} defaultValue="" fullWidth />
      </Grid>
    </Grid>
  )
}

export default ConfigView
