import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { getNamespacePrefix } from './getNamespacePrefix'

export function filterStands(xml : any, parcelGeometry : any, foundStandIds : any[], removeDuplicates : boolean) {

    // _____ Filtering functions _____
    const xmlNsStand = getNamespacePrefix(xml['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/Stand')
    const xmlNsGeometricDataTypes = getNamespacePrefix(xml['ForestPropertyData'], 'http://standardit.tapio.fi/schemas/forestData/common/geometricDataTypes')
    const xmlNsGml = getNamespacePrefix(xml['ForestPropertyData'], 'http://www.opengis.net/gml')

    const removeStandsIfPointInPolygon = (xml: any, geometry: any) => {
        const filteredJsonObject = xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].filter((stand: any) => {
            const pointAsString =
                stand[`${xmlNsStand}:StandBasicData`][0][`${xmlNsGeometricDataTypes}:PolygonGeometry`][0][`${xmlNsGml}:pointProperty`][0][`${xmlNsGml}:Point`][0][`${xmlNsGml}:coordinates`]
            const point = pointAsString[0].split(',').map((value: string) => Number(value))
            const result = booleanPointInPolygon(point, geometry)
            return result
        })
        return filteredJsonObject
    }

    // ______ This function will remove duplicates from downloaded forest stands ______
    const removeDuplicateStands = (xml: any, arrayOfStandIds: string[]) => {
        return xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].filter((stand: any) => !arrayOfStandIds.find((id) => id === stand['$'].id))
    }

    // 2. Filter out stand that are not inside the property
    xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`] = removeStandsIfPointInPolygon(xml, parcelGeometry)

    if (removeDuplicates === true) {
        // 2.1 Filter out stands whose ID has already been saved
        xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`] = removeDuplicateStands(xml, foundStandIds)
    }

    // 3. Save ID:s of the stands that are to be saved to Redux
    const arrayOfStandIds = xml['ForestPropertyData'][`${xmlNsStand}:Stands`][0][`${xmlNsStand}:Stand`].map((stand: any) => stand['$'].id)

    return {
        xml,
        arrayOfStandIds
    };
}