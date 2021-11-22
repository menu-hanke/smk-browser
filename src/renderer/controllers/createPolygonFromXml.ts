import * as turf from '@turf/turf'

export const createPolygonFromXml = (xml: any) => {
 const getNamespacePrefix = (rootElement: any, nameSpace: any) => {
  const key = Object.keys(rootElement['$']).find((key) => rootElement['$'][key] === nameSpace)
  const keyAsString = String(key)
  if (keyAsString.indexOf('xmlns:') === 0) {
   return keyAsString.slice(6)
  } else return null
 }

 const xmlNsStand = getNamespacePrefix(xml['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/Stand')
 const xmlNsGeometricDataTypes = getNamespacePrefix(xml['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/common/geometricDataTypes')
 const xmlNsGml = getNamespacePrefix(xml['ForestPropertyData'], 'http://www.opengis.net/gml')

 const polygonArray = []

 // Get exterior from the json File
 const exterior =
  xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`][0][`${xmlNsStand}:StandBasicData`][0][`${xmlNsGeometricDataTypes}:PolygonGeometry`][0][`${xmlNsGml}:polygonProperty`][0][
   `${xmlNsGml}:Polygon`
  ][0][`${xmlNsGml}:exterior`][0][`${xmlNsGml}:LinearRing`][0][`${xmlNsGml}:coordinates`][0]

 //trim = removes whitespaces at start and end, split + regex = if more whitespaces, they are considered as one
 const exteriorArray = exterior
  .trim()
  .split(/\s+/)
  .map((string: string) => string.split(',').map(Number))
 console.log('Exterior array: ', exteriorArray)

 polygonArray.push(exteriorArray)

 // Get interior from the json file
 const interior =
  xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`][0][`${xmlNsStand}:StandBasicData`][0][`${xmlNsGeometricDataTypes}:PolygonGeometry`][0][`${xmlNsGml}:polygonProperty`][0][
   `${xmlNsGml}:Polygon`
  ][0][`${xmlNsGml}:interior`]

 if (interior) {
  interior.forEach((interior: any) => {
   polygonArray.push(
    interior
     .trim()
     .split(/\s+/)
     .map((string: string) => string.split(',').map(Number))
   )
  })
 }

 console.log('polygon arrays: ', polygonArray)

 const createdPolygon = turf.polygon(polygonArray, { name: 'polygon' })
 console.log('created polygon: ', createdPolygon)
 return createdPolygon
}
