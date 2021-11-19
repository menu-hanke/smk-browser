/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable object-shorthand */
/* esline-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import Projection from 'ol/proj/Projection'
import * as ol from 'ol'
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import proj4 from 'proj4'
// import {ScaleLine, defaults as defaultControls} from 'ol/control';
// import {fromLonLat} from 'ol/proj';
import { register } from 'ol/proj/proj4'
import { apiKey } from '../../../apiKey.json'
import { useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { ipcRenderer } from 'electron'

const projection = new Projection({
 code: 'EPSG:3067',
 extent: [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
})

proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
register(proj4)

const OpenLayersMap: React.FC = () => {
 const [map, setMap] = React.useState<any>()
 const [dataToRender, setDataToRender] = React.useState('')
 const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)
 const foundIds = useSelector((state: RootState) => state.saveProcess.foundIDs)

 const mapRef = React.useRef<HTMLElement>()
 const mapExtent = {
  center: [397915, 7132330],
  resolution: 3550,
  rotation: 0,
  projection: projection
 }

 console.log('data from ipcRenderer: ', dataToRender)

 console.log(map)

 // Find correct object from foundIds and pass it to ipcRenderer, to fetch the data from disc
 React.useEffect(() => {
  ;(async () => {
   const dataById = foundIds.find((object) => object.propertyId === selectedPropertyId)
   console.log('Will send object to ipcRenderer: ', dataById)
   const response = await ipcRenderer.invoke('readFilesFromDisc', dataById)
   setDataToRender(response)
  })()
 }, [selectedPropertyId])

 const initializeOL = React.useCallback(async () => {
  const parser = new WMTSCapabilities()
  const url = 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml?api-key='
  const response = await fetch(url + apiKey)
  const text = await response.text()
  const result = await parser.read(text)

  let options = optionsFromCapabilities(result, {
   layer: 'maastokartta', // tai 'ortokuva'
   projection: projection
  })

  if (options && options.urls) {
   const urlToEdit = options.urls[0]
   options.urls[0] = `${urlToEdit}api-key=${apiKey}`
  }

  const newMap = new ol.Map({
   target: mapRef.current,
   layers: [
    new TileLayer({
     source: new WMTS(options as any),
     opacity: 1
    })
   ],
   view: new ol.View({
    center: mapExtent.center,
    resolution: mapExtent.resolution,
    rotation: mapExtent.rotation,
    projection
   })
  })
  return newMap
 }, [mapRef])

 // OnInit
 React.useEffect(() => {
  setMap(initializeOL())
 }, [initializeOL])

 // OnUnmount
 // React.useEffect(() => {
 //   return () => {
 //     // clear everything when component unmounts
 //   }
 // }, [])

 const classes = useStyles()
 return <div ref={mapRef as any} className={classes.mapContainer} />
}

const useStyles = makeStyles(() =>
 createStyles({
  mapContainer: {
   height: '450px',
   width: '980px',
   background: 'black'
  }
 })
)

export default OpenLayersMap
