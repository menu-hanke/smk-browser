import '@testing-library/jest-dom'
import { readFile } from 'fs/promises'
import xml2js from 'xml2js'
// @ts-ignore
import wkt from 'wkt'
import { createPolygonsFromXml } from '../renderer/controllers/createPolygonsFromXml'

describe('createPolygonFromXml', () => {
  it('should load multiple stands (both eterior-only and stands with single interiors)', async () => {
    const xmlString = await readFile('src/__tests__/data1-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(50)

    const result = createPolygonsFromXml(xml)

    expect(result).toBeTruthy();
    expect(result.length).toBe(50)

    expect(result[0].geometry.coordinates.length).toBe(1) // element 0 has only exterior
    expect(result[15].geometry.coordinates.length).toBe(2) // element 15 has exterior and one interior
    expect(result[21].geometry.coordinates.length).toBe(2) // element 21 has exterior and one interior
    expect(result[29].geometry.coordinates.length).toBe(2) // element 29 has exterior and one interior

    expect(result[30].geometry.coordinates.length).toBe(1) // element 30 has only exterior
  })

  it('should load single stand with multiple interiors', async () => {
    const xmlString = await readFile('src/__tests__/data2-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(1)

    const result = createPolygonsFromXml(xml)

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    expect(result[0].geometry.coordinates.length).toBe(4) // element 0 has exterior and 3 interiors
  })

  it('should load empty stand XML)', async () => {
    const xmlString = await readFile('src/__tests__/empty-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    const result = createPolygonsFromXml(xml)

    expect(result).toBeTruthy();
    expect(result.length).toBe(0);
  })
})