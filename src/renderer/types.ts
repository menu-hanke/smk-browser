export interface ReduxState {
 apiKey: string | null
 beforeFetch: BeforeFetch
 saveProcess: SaveProcess
 map: Map
}

interface BeforeFetch {
 propertyIds: string
 forestStandVersion: string
 folderPath: string
 removeDuplicates: boolean
}

interface SaveProcess {
 logData: Log[]
 foundStandIds: string[]
 foundIDs: FoundID[]
}

export interface FoundID {
 propertyId: string
 geojsonFile: string
 stands: Stand[]
}

interface Stand {
 patchId: number
 standXmlFile: string
}

interface Log {
 type: string
 message: string
}

interface Map {
 displayMap: boolean
 useBackgroundMap: string
 selectedPropertyId: string
 currentPolygonIndices: number[]
 selectedStandIndex: number
 dataToDisplay: DataToDisplay
}

interface DataToDisplay {
 standFeatures: Object
 patchFeatures: Object
}
