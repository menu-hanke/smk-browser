/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import { Grid, TextField } from '@material-ui/core'

const ConfigView : React.FC = () => {
const [apiKey, setApiKey] = React.useState(localStorage.getItem('smk-browser.config.apiKey'))

 const apiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     localStorage.setItem('smk-browser.config.apiKey', event.target.value.trim());
     setApiKey(event.target.value)
 }

 return (
   <Grid container spacing={2}>
    <Grid item xs={12}>
        <TextField
            id="outlined-multiline-static"
            label="API Key for MML WMTS"
            value={apiKey}
            variant="outlined"
            onChange={apiKeyChange}
            defaultValue=""
            fullWidth
            />
    </Grid>
   </Grid>
 )
}

export default ConfigView
