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
import { register } from 'ol/proj/proj4'
import { useSelector } from 'react-redux'
import { RootState } from 'renderer/App'
import { ipcRenderer } from 'electron'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import xml2js from 'xml2js'
import { createPolygonsFromXml } from 'renderer/controllers/createPolygonsFromXml'
import * as turf from '@turf/turf'
import { Style, Stroke, Fill, Text } from 'ol/style'
import { useSnackbar } from 'notistack'

const apiKey = () => localStorage.getItem('smk-browser.config.apiKey')

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
  const { enqueueSnackbar } = useSnackbar()
  const [map, setMap] = React.useState<any>(null)
  const [dataToRender, setDataToRender] = React.useState({} as DataToRender)
  const selectedPropertyId = useSelector((state: RootState) => state.map.selectedPropertyId)
  const foundIds = useSelector((state: RootState) => state.saveProcess.foundIDs)
  const folderPath = useSelector((state: RootState) => state.beforeFetch.folderPath)

  const useBackgroundMap = useSelector((state: RootState) => state.map.useBackgroundMap)

  const mapRef = React.useRef<HTMLElement>()
  const mapExtent = {
    center: [397915, 7132330],
    resolution: 3550,
    rotation: 0,
    projection: projection
  }

  // Find correct object from foundIds and pass it to ipcRenderer, to fetch the data from disc
  React.useEffect(() => {
    ;(async () => {
      const dataById = foundIds.find((object) => object.propertyId === selectedPropertyId)
      const response = await ipcRenderer.invoke('readFilesFromDisc', { dataById, folderPath })
      setDataToRender(response)
    })()
  }, [selectedPropertyId])

  const initializeOL = React.useCallback(async () => {
    const parser = new WMTSCapabilities()
    const url = 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml?api-key='
    const response = await fetch(url + apiKey())
    const text = await response.text()
    const result = await parser.read(text)

    if (response.status >= 400) {
      enqueueSnackbar('Invalid API-key', { variant: 'error' })
      return
    }

    let options = optionsFromCapabilities(result, {
      layer: useBackgroundMap, // tai 'ortokuva'
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
    if (!map) return
    const changeBackgroundMap = async () => {
      const parser = new WMTSCapabilities()
      const url = 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml?api-key='
      const response = await fetch(url + apiKey())
      const text = await response.text()
      const result = await parser.read(text)

      let options = optionsFromCapabilities(result, {
        layer: useBackgroundMap, // tai 'ortokuva'
        projection: projection
      })

      if (options && options.urls) {
        const urlToEdit = options.urls[0]
        options.urls[0] = `${urlToEdit}api-key=${apiKey()}`
      }

      const newBackground = new TileLayer({
        source: new WMTS(options as any),
        opacity: 1
      })

      map.getLayers().setAt(0, newBackground)
    }
    changeBackgroundMap()
  }, [useBackgroundMap])

  React.useEffect(() => {
    if (!map) return

    // Remove old layers

    console.log('map layers before remove', map.getLayers())
    // while (map.getLayers().length > 1) {
    //  // map.getLayers().removeAt(1)
    //  const l = map.getLayers()[1]
    //  map.removeLayer(l)
    //  l.dispose()
    // }

    console.log('map layers after remove', map.getLayers())

    const createPolygonsAndDisplay = async () => {
      const parcelVectorLayerStyle = new Style({
        stroke: new Stroke({
          color: 'red',
          //  lineDash: [4],
          width: 6
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.2)'
        })
      })

      const standVectorLayerStyle = (feature: any) => {
        const properties = feature.getProperties()

        return new Style({
          stroke: new Stroke({
            color: '#FEC627',
            //  lineDash: [4],
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          }),
          text: new Text({
            // Text label and styling in here <----
            text: String(properties.standNumber),
            fill: new Fill({ color: '#fff' })
          })
        })
      }

      // Add new layers
      const polygons = await Promise.all(
        (dataToRender.stands || []).map(async (stand: any) => {
          const xml = await xml2js.parseStringPromise(stand.standXmlFile)
          const polygon = createPolygonsFromXml(xml)
          return polygon
        })
      )

      const polygonArray = polygons.flat()

      // New Layers to display on map
      const parcelVectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(JSON.parse(dataToRender.geojsonFile))
      })
      const parcelVectorlayer = new VectorLayer({
        source: parcelVectorSource,
        style: parcelVectorLayerStyle
      })
      const standVectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(turf.featureCollection(polygonArray))
      })
      const standVectorlayer = new VectorLayer({
        source: standVectorSource,
        style: standVectorLayerStyle
      })

      map.getLayers().setAt(1, parcelVectorlayer)
      map.getLayers().setAt(2, standVectorlayer)
      console.log('all layers after extend: ', map.getLayers())
      console.log('parcels', JSON.parse(dataToRender.geojsonFile))
      const extent = parcelVectorlayer.getSource().getExtent()
      if (!extent) return
      console.log('extent: ', extent)
      map.getView().fit(extent)
    }
    createPolygonsAndDisplay()
  }, [map, dataToRender])

  // OnUnmount
  React.useEffect(() => {
    return () => {
      const oldLayers = map?.getLayers() || []
      oldLayers.forEach((l: any) => {
        l.getSource().clear()
        l.setSource(undefined)
        map?.removeLayer(l)
      })
      map?.setTarget(null)
    }
  }, [])

  const classes = useStyles()
  return <div ref={mapRef as any} className={classes.mapContainer}></div>
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
