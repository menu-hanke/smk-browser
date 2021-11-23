//_____ Function for reading prefix from XML file _____
export function getNamespacePrefix(rootElement: any, nameSpace: any) {
    const key = Object.keys(rootElement['$']).find((key) => rootElement['$'][key] === nameSpace)
    const keyAsString = String(key)
    if (keyAsString.indexOf('xmlns:') === 0) {
        return keyAsString.slice(6)
    } else {
        return null
    }
}