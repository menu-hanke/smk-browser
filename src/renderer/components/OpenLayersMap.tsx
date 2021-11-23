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
import { useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { ipcRenderer } from 'electron'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import 'ol/ol.css'
import xml2js from 'xml2js'
import { createPolygonsFromXml } from 'renderer/controllers/createPolygonsFromXml'
import * as turf from '@turf/turf'

const apiKey = () => localStorage.getItem('smk-browser.config.apiKey');

// import testData from '../testdata.json'

const projection = new Projection({
 code: 'EPSG:3067',
 extent: [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
})

proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
register(proj4)

interface DataToRender {
 propertyId: string
 geojsonFile: string
 stands: [{ patchId: number; standXmlFile: [number] }]
}

const OpenLayersMap: React.FC = () => {
 const [map, setMap] = React.useState<any>(null)
 const [dataToRender, setDataToRender] = React.useState({} as DataToRender)
 const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)
 const foundIds = useSelector((state: RootState) => state.saveProcess.foundIDs)
 const folderPath = useSelector((state: RootState) => state.beforeFetch.folderPath)

 const mapRef = React.useRef<HTMLElement>()
 const mapExtent = {
  center: [397915, 7132330],
  resolution: 3550,
  rotation: 0,
  projection: projection
 }

 console.log('data from ipcRenderer: ', dataToRender)
 console.log('map in OL map component: ', map)

 // Find correct object from foundIds and pass it to ipcRenderer, to fetch the data from disc
 React.useEffect(() => {
  ;(async () => {
   const dataById = foundIds.find((object) => object.propertyId === selectedPropertyId)
   const response = await ipcRenderer.invoke('readFilesFromDisc', { dataById, folderPath })
   console.log('dataToRender: ', dataToRender)
   setDataToRender(response)
  })()
 }, [selectedPropertyId])

 const initializeOL = React.useCallback(async () => {
  const parser = new WMTSCapabilities()
  const url = 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml?api-key='
  const response = await fetch(url + apiKey())
  const text = await response.text()
  const result = await parser.read(text)

  let options = optionsFromCapabilities(result, {
   layer: 'maastokartta', // tai 'ortokuva'
   projection: projection
  })

  if (options && options.urls) {
   const urlToEdit = options.urls[0]
   options.urls[0] = `${urlToEdit}api-key=${apiKey()}`
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
  const initializeMapAsync = async () => {
   const initializedMap = await initializeOL()
   setMap(initializedMap)
  }
  initializeMapAsync()
 }, [])

 React.useEffect(() => {
  if (!map) {
   console.log('map not initialized, will return')
   return
  }

  console.log('Map initialized! :', map)

  // Remove old layers
  const layers = [] as any[]
  map.getLayers().forEach((layer: any) => layers.push(layer))
  while (layers.length > 1) {
   layers.pop()
  }

  // Add new layers

  // 1. Convert Xml to Json

  // loop stands
  Promise.all(
   (dataToRender.stands || []).map((stand: any) => {
    return xml2js.parseStringPromise(stand.standXmlFile).then((xml) => {
     const polygon = createPolygonsFromXml(xml)
     return polygon
    })
   })
  ).then((polygons) => {
   // You might need to turn this into feature collection  --> turf.featurecollection
   polygons = polygons.reduce((memo, a) => memo.concat(a), [])
   console.log('polygons, :', polygons)
   

   const parcelVectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(JSON.parse(dataToRender.geojsonFile))
   })
   const parcelVectorlayer = new VectorLayer({
    source: parcelVectorSource
   })

   const standVectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(turf.featureCollection(polygons))
   })
   const standVectorlayer = new VectorLayer({
    source: standVectorSource
   })

   map.getLayers().extend([parcelVectorlayer, standVectorlayer])
   const extent = parcelVectorlayer.getSource().getExtent()
   console.log('extent of the new layer: ', extent, 'vectorLayer: ', parcelVectorlayer.getSource())
   if (!extent) return
   map.getView().fit(extent)
  })
 }, [map, dataToRender])

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
