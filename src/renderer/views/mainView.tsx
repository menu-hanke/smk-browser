/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar, Button, Grid, TextField, Toolbar, Typography } from '@material-ui/core'
// import ipcRenderer from 'electron';
import DownloadIcon from '@material-ui/icons/CloudDownload'
import CopyIcon from '@material-ui/icons/FileCopy'
import { useSnackbar } from 'notistack'
// @ts-ignore
import wkt from 'wkt'
import _ from 'lodash'
import xml2js from 'xml2js'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { produce } from 'immer'
import { ipcRenderer } from 'electron'

import LogComponent from '../components/LogComponent'
import ModalComponent from '../components/ModalComponent'
import DropdownSelect from '../components/DropdownSelect'

import { setFoundStandIds, setPropertyIds, setForestStandVersion, setFolderPath, setLogData, setFoundIds } from '../Store/Actions/data'
import { RootState } from 'renderer/App'

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
  const foundIds = [] as any[]
  dispatch(setLogData({ logData: [] }))

  const arrayOfIDs = propertyIDs
   .replace(/[\r\n\t]/g, '')
   .split(',')
   .filter((string: string) => string)

  await Promise.all(
   arrayOfIDs.map(async (ID: string) => {
    // _____ Clear old files from folder _____
    await ipcRenderer.invoke('removeOldFiles', {
     propertyID: ID
    })

    // _____ Download Data ______
    const fetchURL =
     'https://beta-paikkatieto.maanmittauslaitos.fi/kiinteisto-avoin/simple-features/v1/collections/PalstanSijaintitiedot/items?crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F3067&kiinteistotunnuksenEsitysmuoto='
    const response = await fetch(fetchURL + ID)
    const data = await response.json()
    // console.log('Data from first API call: ', data)
    const dataString = JSON.stringify(data)
    // eslint-disable-next-line promise/catch-or-return
    ipcRenderer.invoke('saveFile', {
     filename: `mml-${ID}.json`,
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

       if (dataAsText.includes('<Error><Message>errCode')) {
        const date = new Date()
        dispatch(
         setLogData({
          logData: {
           type: 'error',
           message: `${date.toLocaleTimeString(undefined, options as any)}:  No stands found for property ID: ${ID} and patch: ${index}`
          }
         })
        )
        ipcRenderer.invoke('saveFile', {
         filename: `mvk-${ID}_${index}_${forestStandVersion}.xml`,
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
       }

       // 1. Convert XML to JSON
       let jsonObject = await xml2js.parseStringPromise(dataAsText)

       //_____ Function for reading prefix from XML file _____
       const getNamespacePrefix = (rootElement: any, nameSpace: any) => {
        const key = Object.keys(rootElement['$']).find((key) => rootElement['$'][key] === nameSpace)
        const keyAsString = String(key)
        if (keyAsString.indexOf('xmlns:') === 0) {
         return keyAsString.slice(6)
        } else return null
       }

       // _____ Filtering functions _____
       const xmlNsStand = getNamespacePrefix(jsonObject['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/Stand')
       const xmlNsGeometricDataTypes = getNamespacePrefix(jsonObject['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/common/geometricDataTypes')
       const xmlNsGml = getNamespacePrefix(jsonObject['ForestPropertyData'], 'http://www.opengis.net/gml')

       const removeStandsIfPointInPolygon = (jsonObject: any, geometry: any) => {
        const filteredJsonObject = jsonObject['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].filter((stand: any) => {
         const pointAsString =
          stand[`${xmlNsStand}:StandBasicData`][0][`${xmlNsGeometricDataTypes}:PolygonGeometry`][0][`${xmlNsGml}:pointProperty`][0][`${xmlNsGml}:Point`][0][`${xmlNsGml}:coordinates`]
         const point = pointAsString[0].split(',').map((value: string) => Number(value))
         const result = booleanPointInPolygon(point, geometry)
         return result
        })
        return filteredJsonObject
       }

       // ______ This function will remove duplicates from downloaded forest stands ______
       const removeDuplicates = (jsonObject: any, arrayOfStandIds: string[]) => {
        if (arrayOfStandIds.length === 0) {
         return jsonObject['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`]
        } else {
         const filteredJsonObject = jsonObject['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].filter((stand: any) => !arrayOfStandIds.find((id) => id === stand['$'].id))
         return filteredJsonObject
        }
       }

       // 2. Filter out stand that are not inside the property
       jsonObject = produce(jsonObject, (draftState: any) => {
        draftState['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`] = removeStandsIfPointInPolygon(jsonObject, geometry)
       })

       if (removeDuplicatesState === true) {
        // 2.1 Filter out stands whose ID has already been saved
        jsonObject = produce(jsonObject, (draftState: any) => {
         draftState['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`] = removeDuplicates(jsonObject, foundStandIds)
        })
       }

       // 3. Save ID:s of the stands that are to be saved to Redux

       const arrayOfStandIds = jsonObject['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].map((stand: any) => stand['$'].id)
       dispatch(setFoundStandIds({ foundStandIds: arrayOfStandIds }))

       // 4. Convert Json back to XML
       const builder = new xml2js.Builder()
       const filteredXml = builder.buildObject(jsonObject)

       // 5. Update save process state in Redux
       //  dispatch(setFoundIds({ propertyId: ID, geojsonFile: `mml-${ID}.json` }))

       // 6 Save patches under foundIds.patches[] in Redux
       context.stands.push({ patchId: index, standXmlFile: `mvk-${ID}_${index}_${forestStandVersion}.xml` })
       console.log('context after push: ', context, 'ID: ', ID, 'context lenght: ', context.stands.length)

       // 7. write files to folder
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
        data: filteredXml
       })
      })
     )
    } catch (error) {
     enqueueSnackbar(`Error during download: ${error}`, {
      variant: 'error'
     })
    } finally {
     // Dispatch actions in here, after all downloads are completed to avoid re-renders
     dispatch(setFoundIds({ foundIds: foundIds }))
    }
   })
  )
 }

 const fetchDataAndAlert = async () => {
  if (propertyIDs === '') {
   enqueueSnackbar('Please add property IDs', { variant: 'error' })
   return
  }
  if (folderPath === '' || folderPath === undefined) {
   enqueueSnackbar('Please select folder path', { variant: 'error' })
   return
  }
  await getData()
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
      <TextField
       style={{ width: containerWidth }}
       id="outlined-multiline-static"
       label="Property IDs"
       multiline
       rows={4}
       value={propertyIDs}
       variant="outlined"
       onChange={IDchange}
       defaultValue="Default Value"
       fullWidth
      />
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
       defaultValue="Hello World"
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
      <DropdownSelect />
     </Grid>
    </Grid>
    <Grid container item xs={9} direction="column" alignItems="center" style={{ paddingRight: '20px' }}>
     <LogComponent logData={logData} />
    </Grid>
   </Grid>
   <ModalComponent />
  </div>
 )
}

export default MainView
