import * as React from 'react'
import {createStyles, makeStyles} from '@material-ui/styles'
import Projection from 'ol/proj/Projection'
import * as ol from 'ol'
import 'ol/ol.css'
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import TileLayer from 'ol/layer/Tile';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import {apiKey} from '../../../apiKey.json'

const projection = new Projection({
  code: 'EPSG:3067', 
  extent:  [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
})

const OpenLayersMap: React.FC = () => {
  const [map, setMap] = React.useState<any>()
  const mapRef = React.useRef<HTMLElement>()

  const mapExtent = {
    center: [397915, 7132330],
    resolution: 3550,
    rotation: 0,
    projection
}

console.log(map)



const initializeOL = React.useCallback(async() => {

  // Fetch map
  const url = 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml?api-key='
  
  const parser = new WMTSCapabilities();
  const response = await fetch(url + apiKey)
  console.log('response from fetch: ', response)
  const text= await response.text()
  console.log('text from response: ', text)
  const result = await parser.read(text)
  console.log('result from parser: ', result)

  const options = optionsFromCapabilities(result, {
    layer: 'maastokartta', // tai 'ortokuva'
    matrixSet: 'ETRS-TM35FIN',
  });



  console.log('Initializing Open Layers')
  const newMap = new ol.Map({
    target: mapRef.current, 
    layers: [
      new TileLayer({
        source: new WMTS(options as any), 
        opacity: 0.7
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
return (
  <div ref={mapRef as any} className={classes.mapContainer}/>
)
}

const useStyles = makeStyles(() => 
  createStyles({
    mapContainer: {
      height: '300px', 
      width: '600px', 
      background: 'black'
    }
  }))

export default OpenLayersMap  