/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar, Button, Grid, TextField, Toolbar, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/CloudDownload'
import CopyIcon from '@mui/icons-material/FileCopy'
import { useSnackbar } from 'notistack'
// @ts-ignore
import wkt from 'wkt'
import _ from 'lodash'
import xml2js from 'xml2js'
import { ipcRenderer } from 'electron'
import LogComponent from '../components/LogComponent'
import ModalComponent from '../components/ModalComponent'
import DropdownSelect from '../components/DropdownSelect'
import { setFoundStandIds, setPropertyIds, setForestStandVersion, setFolderPath, setLogData, setFoundIds, resetLogData } from '../Store/Actions/data'
import { RootState } from 'renderer/App'
import { FoundID } from 'renderer/types'
import { filterStands } from '../controllers/standFilter'
import ConfigView from './configView'
import base64 from 'base-64'

const MainView: React.FC = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [containerWidth, setContainerWidth] = React.useState(window.innerWidth * 0.2)
  const propertyIDs = useSelector((state: RootState) => state.beforeFetch.propertyIds)
  const forestStandVersion = useSelector((state: RootState) => state.beforeFetch.forestStandVersion)
  const folderPath = useSelector((state: RootState) => state.beforeFetch.folderPath)
  const logData = useSelector((state: RootState) => state.saveProcess.logData)
  const foundStandIds = useSelector((state: RootState) => state.saveProcess.foundStandIds)
  const removeDuplicatesState = useSelector((state: RootState) => state.beforeFetch.removeDuplicates)
  const apiKey = useSelector((state: RootState) => state.apiKey)
  const USERNAME = useSelector((state: RootState) => state.username)
  const PASSWORD = useSelector((state: RootState) => state.password)

  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  const emptyXML =
    '<ForestPropertyData xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:gml="http://www.opengis.net/gml" xmlns:gdt="http://standardit.tapio.fi/schemas/forestData/common/geometricDataTypes" xmlns:co="http://standardit.tapio.fi/schemas/forestData/common" xmlns:sf="http://standardit.tapio.fi/schemas/forestData/specialFeature" xmlns:op="http://standardit.tapio.fi/schemas/forestData/operation" xmlns:dts="http://standardit.tapio.fi/schemas/forestData/deadTreeStrata" xmlns:tss="http://standardit.tapio.fi/schemas/forestData/treeStandSummary" xmlns:tst="http://standardit.tapio.fi/schemas/forestData/treeStratum" xmlns:ts="http://standardit.tapio.fi/schemas/forestData/treeStand" xmlns:st="http://standardit.tapio.fi/schemas/forestData/Stand" xmlns="http://standardit.tapio.fi/schemas/forestData" xsi:schemaLocation="http://standardit.tapio.fi/schemas/forestData ForestData.xsd"><st:Stands/></ForestPropertyData>'
  const versions = [
    {
      value: 'MV1.6',
      label: 'MV1.6'
    },
    {
      value: 'MV1.7',
      label: 'MV1.7'
    },
    {
      value: 'MV1.8',
      label: 'MV1.8'
    },
    {
      value: 'latest',
      label: 'latest'
    }
  ]

  // _____ Functionality ______

  const copyToClipboard = async () => {
    let stringToWrite = ''
    logData.forEach((object) => {
      stringToWrite += `${object.message}, \n`
    })
    await ipcRenderer.invoke('copyToClipboard', { logData: stringToWrite })
    enqueueSnackbar('Logs copied to clipboard', { variant: 'success' })
  }

  const handleResize = () => {
    setContainerWidth(window.innerWidth * 0.2)
  }
  window.addEventListener('resize', handleResize)

  const standVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setForestStandVersion({ forestStandVersion: event.target.value }))
  }

  const IDchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPropertyIds({ propertyIds: event.target.value }))
  }

  const openFileBrowser = async () => {
    const response = await ipcRenderer.invoke('openFileSystem')
    dispatch(setFolderPath({ folderPath: response }))
  }

  const getData = async () => {
    let foundIds = [] as FoundID[]
    dispatch(setLogData({ logData: [] }))

    const arrayOfIDs = propertyIDs
      .trim()
      .split(/[\s,]+/)
      .filter((string: string) => string)

    await Promise.all(
      arrayOfIDs.map(async (ID: string) => {
        // _____ Clear old files from folder _____
        await ipcRenderer.invoke('removeOldFiles', {
          propertyID: ID,
          selectedPath: folderPath
        })

        // _____ Download Data ______
        const credentials = base64.encode(USERNAME + ':' + PASSWORD)
        const fetchUrl =
          'https://sopimus-paikkatieto.maanmittauslaitos.fi/kiinteisto-avoin/simple-features/v3/collections/PalstanSijaintitiedot/items?f=json&crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F3067&kiinteistotunnuksenEsitysmuoto='

        const response = await fetch(fetchUrl + ID, {
          headers: new Headers({
            Authorization: `Basic ${credentials}`
          })
        })

        if (response.status === 403) {
          throw new Error('Invalid credentials. Cannot download data')
        }

        const data = await response.json()

        if (data.features.length === 0) {
          dispatch(
            setLogData({
              logData: {
                type: 'error',
                message: `${new Date().toLocaleTimeString(undefined, options as any)}:  No parcel data found for property ID: ${ID}`
              }
            })
          )
          return
        }

        const dataString = JSON.stringify(data)
        // eslint-disable-next-line promise/catch-or-return
        await ipcRenderer.invoke('saveFile', {
          filename: `mml-${ID}.json`,
          selectedPath: folderPath,
          data: dataString
        })

        const context = { propertyId: ID, geojsonFile: `mml-${ID}.json`, stands: [] as any[] }
        foundIds.push(context)

        try {
          await Promise.all(
            data.features.map(async (geometry: any, index: number) => {
              //  const propertyID = data.features[index].properties.kiinteistotunnuksenEsitysmuoto
              const WKTPolygon = wkt.stringify(geometry) as string
              const fetchURL = 'https://mtsrajapinnat.metsaan.fi/ATServices/ATXmlExportService/FRStandData/v1/ByPolygon'
              const response = await fetch(fetchURL, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                body: `wktPolygon=${encodeURIComponent(WKTPolygon)}&stdVersion=${forestStandVersion}`
              })
              const dataAsText = await response.text()

              if (dataAsText.includes('<Error>')) {
                const date = new Date()
                dispatch(
                  setLogData({
                    logData: {
                      type: 'error',
                      message: `${date.toLocaleTimeString(undefined, options as any)}:  No stands found for property ID: ${ID} and patch: ${index}, error: ${dataAsText.split('=')[2].split(/,|\./)[0]}`
                    }
                  })
                )
                await ipcRenderer.invoke('saveFile', {
                  filename: `mvk-${ID}_${index}_${forestStandVersion}.xml`,
                  selectedPath: folderPath,
                  data: emptyXML
                })
                return
              } else if (dataAsText.includes('Palvelu ei ole käytettävissä')) {
                const date = new Date()
                dispatch(
                  setLogData({
                    logData: {
                      type: 'error',
                      message: `${date.toLocaleTimeString(undefined, options as any)}:  Error during download, service not available for ID: ${ID} and patch: ${index}`
                    }
                  })
                )
                return
              } else if (dataAsText.includes('Kyselyalue on liian suuri')) {
                const date = new Date()
                dispatch(
                  setLogData({
                    logData: {
                      type: 'error',
                      message: `${date.toLocaleTimeString(undefined, options as any)}:  Kyselyalue liian suurifor  ID: ${ID} and patch: ${index}`
                    }
                  })
                )
              }

              // 1. Convert XML to JSON
              let jsonObject = await xml2js.parseStringPromise(dataAsText)

              const filterResult = filterStands(jsonObject, geometry, foundStandIds, removeDuplicatesState)
              jsonObject = filterResult.xml
              const arrayOfStandIds = filterResult.arrayOfStandIds

              dispatch(setFoundStandIds({ foundStandIds: arrayOfStandIds }))

              // 4. Convert Json back to XML
              const builder = new xml2js.Builder()
              const filteredXml = builder.buildObject(jsonObject)

              // 5 Save patches under foundIds.patches[] in Redux
              context.stands.push({ patchId: index, standXmlFile: `mvk-${ID}_${index}_${forestStandVersion}.xml` })

              // 6. Write files to folder
              const date = new Date()
              dispatch(
                setLogData({
                  logData: {
                    type: 'success',
                    message: `${date.toLocaleTimeString(undefined, options as any)}:  Download completed for property ID: ${ID} and patch: ${index}`
                  }
                })
              )
              ipcRenderer.invoke('saveFile', {
                filename: `mvk-${ID}_${index}_${forestStandVersion}.xml`,
                selectedPath: folderPath,
                data: filteredXml
              })
            })
          )
        } catch (error) {
          dispatch(
            setLogData({
              logData: {
                type: 'error',
                message: `${new Date().toLocaleTimeString(undefined, options as any)}:  Download FAILED for property ID: ${ID}`
              }
            })
          )
        }
      })
    )
    // 7. Update saveProcess state to Redux
    dispatch(setFoundIds({ foundIds: foundIds }))
  }

  const fetchDataAndAlert = async () => {
    if (USERNAME === '' || USERNAME === null || PASSWORD === '' || PASSWORD === null) {
      enqueueSnackbar('Cannot download data without username and password', { variant: 'warning' })
      return
    }
    if (propertyIDs === '') {
      enqueueSnackbar('Please add property IDs', { variant: 'error' })
      return
    }
    if (folderPath === '' || folderPath === undefined) {
      enqueueSnackbar('Please select folder path', { variant: 'error' })
      return
    }
    if (apiKey === '' || apiKey === null) {
      enqueueSnackbar('Cannot display map without API key', { variant: 'warning' })
      return
    }

    dispatch(resetLogData({ logData: [] }))
    try {
      await getData()
    } catch (error: any) {
      if (error.message.includes('Invalid credentials')) {
        enqueueSnackbar('Invalid username or password. Cannot download data', { variant: 'error' })
        return
      }
    }

    const date = new Date()
    dispatch(
      setLogData({
        logData: {
          type: 'success',
          message: `${date.toLocaleDateString(undefined, options as any)} All downloads complete!`
        }
      })
    )
    enqueueSnackbar('All downlods completed', { variant: 'success' })
  }

  return (
    <div>
      <AppBar position="static" style={{ marginBottom: '20px' }}>
        <Toolbar>
          <Typography variant="h6">SMK browser</Typography>
        </Toolbar>
      </AppBar>
      <Grid container justifyContent="center" alignItems="center" style={{ height: window.innerHeight * 0.7 }}>
        <Grid container item xs={3} direction="column" alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={12}>
            <TextField style={{ width: containerWidth }} id="outlined-multiline-static" label="Property IDs" multiline rows={4} value={propertyIDs} variant="outlined" onChange={IDchange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: containerWidth }}
              id="outlined-select-currency-native"
              select
              label="Version"
              value={forestStandVersion}
              onChange={standVersionChange}
              SelectProps={{
                native: true
              }}
              variant="outlined"
              fullWidth
            >
              {versions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: containerWidth }}
              onClick={() => openFileBrowser()}
              id="filled-read-only-input"
              label="Folder path"
              value={folderPath}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button style={{ width: containerWidth, height: '50px' }} variant="outlined" onClick={() => fetchDataAndAlert()} endIcon={<DownloadIcon color="primary" />}>
              <Typography>Download all data</Typography>
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button style={{ width: containerWidth, height: '50px' }} variant="outlined" onClick={() => copyToClipboard()} endIcon={<CopyIcon color="primary" />}>
              <Typography>Copy logs to clipboard</Typography>
            </Button>
          </Grid>

          <Grid item xs={12}>
            <div style={{ width: containerWidth, height: '50px' }}>
              <DropdownSelect />
            </div>
          </Grid>
        </Grid>
        <Grid container item xs={9} direction="column" alignItems="center" style={{ paddingRight: '27px' }}>
          <LogComponent logData={logData} />
        </Grid>
      </Grid>
      <ConfigView />
      <ModalComponent />
    </div>
  )
}

export default MainView
