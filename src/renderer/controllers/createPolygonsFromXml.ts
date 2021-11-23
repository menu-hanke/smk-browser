import * as turf from '@turf/turf'
import { getNamespacePrefix } from './getNamespacePrefix'

export const createPolygonsFromXml = (xml: any) => {
 const xmlNsStand = getNamespacePrefix(xml['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/Stand')
 const xmlNsGeometricDataTypes = getNamespacePrefix(xml['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/common/geometricDataTypes')
 const xmlNsGml = getNamespacePrefix(xml['ForestPropertyData'], 'http://www.opengis.net/gml')

 function extractPolygon(stand: any) {
  const polygonArray = []
  // Get exterior from the json File
  const exterior =
   stand[`${xmlNsStand}:StandBasicData`][0][`${xmlNsGeometricDataTypes}:PolygonGeometry`][0][`${xmlNsGml}:polygonProperty`][0][`${xmlNsGml}:Polygon`][0][`${xmlNsGml}:exterior`][0][
    `${xmlNsGml}:LinearRing`
   ][0][`${xmlNsGml}:coordinates`][0]

  //trim = removes whitespaces at start and end, split + regex = if more whitespaces, they are considered as one
  const exteriorArray = exterior
   .trim()
   .split(/\s+/)
   .map((string: string) => string.split(',').map(Number))

  polygonArray.push(exteriorArray)

  // Get interior from the json file
  const interiors = stand[`${xmlNsStand}:StandBasicData`][0][`${xmlNsGeometricDataTypes}:PolygonGeometry`][0][`${xmlNsGml}:polygonProperty`][0][`${xmlNsGml}:Polygon`][0][`${xmlNsGml}:interior`]

  if (interiors) {
   interiors.forEach((interior: any) => {
    interior[`${xmlNsGml}:LinearRing`][0][`${xmlNsGml}:coordinates`].forEach((interior: any) => {
     polygonArray.push(
      interior
       .trim()
       .split(/\s+/)
       .map((string: string) => string.split(',').map(Number))
     )
    })
   })
  }

  return turf.polygon(polygonArray, { name: 'polygon' })
 }

 if (
  !xml['ForestPropertyData'] ||
  !xml['ForestPropertyData'][`${xmlNsStand}:Stands`] ||
  !xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0] ||
  !xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`]
 ) {
  return []
 }

 return xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].map((stand: any) => extractPolygon(stand))
}
