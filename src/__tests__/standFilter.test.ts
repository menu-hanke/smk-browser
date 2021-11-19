import '@testing-library/jest-dom'
import { readFile } from 'fs/promises'
import xml2js from 'xml2js'
// @ts-ignore
import wkt from 'wkt'
import { filterStands } from '../renderer/controllers/standFilter'

const data1Geometry = wkt.parse("POLYGON((393960.156 6801453.126, 394798.608 6801657.878, 394930.512 6801670.111, 395028.723 6802116.858, 394258.945 6801929.148, 394261.711 6801810.541, 394091.166 6801665.961, 393960.156 6801453.126))")

const bboxToPolygon = ([x1,y1,x2,y2] : number[]) => wkt.parse(`POLYGON((${x1} ${y1}, ${x2} ${y1}, ${x2} ${y2}, ${x1} ${y2}, ${x1} ${y1}))`);
const finlandGeometry = bboxToPolygon([-3669433.90, 4601644.86, 648181.26, 9364104.12])

const southernFinlandGeometry = bboxToPolygon([-3669433.90, 4601644.86, 648181.26, 6982874.49])
const northernFinlandGeometry = bboxToPolygon([-3669433.90, 6982874.49, 648181.26, 9364104.12])

describe('standFilter', () => {
  it('filtering should maybe filter 50 stands to 29', async () => {
    const xmlString = await readFile('src/__tests__/data1-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(50);

    const result = filterStands(xml, data1Geometry, [], true);

    expect(result.arrayOfStandIds.length).toBe(29);
  });

  it('all 50 stands should be in Finland', async () => {
    const xmlString = await readFile('src/__tests__/data1-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(50);

    const result = filterStands(xml, finlandGeometry, [], true);

    expect(result.arrayOfStandIds.length).toBe(50);
  });

  it('all 50 stands should be in Southern Finland', async () => {
    const xmlString = await readFile('src/__tests__/data1-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(50);

    const result = filterStands(xml, southernFinlandGeometry, [], true);

    expect(result.arrayOfStandIds.length).toBe(50);
  });

  it('no stands should be in Northern Finland', async () => {
    const xmlString = await readFile('src/__tests__/data1-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(50);

    const result = filterStands(xml, northernFinlandGeometry, [], true);

    expect(result.arrayOfStandIds.length).toBe(0);
  });
});