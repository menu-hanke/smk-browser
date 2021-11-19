import '@testing-library/jest-dom'
import { readFile } from 'fs/promises'
import xml2js from 'xml2js'
// @ts-ignore
import wkt from 'wkt'
import { filterStands } from '../renderer/controllers/standFilter'

const data1Geometry = wkt.parse("POLYGON((393960.156 6801453.126, 394798.608 6801657.878, 394930.512 6801670.111, 395028.723 6802116.858, 394258.945 6801929.148, 394261.711 6801810.541, 394091.166 6801665.961, 393960.156 6801453.126))")

describe('App', () => {
  it('filtering should maybe filter 50 stands to 29', async () => {
    const xmlString = await readFile('src/__tests__/data1-stands.test.xml')
    let xml = await xml2js.parseStringPromise(xmlString)

    expect(xml['ForestPropertyData']['st:Stands'][0]['st:Stand'].length).toBe(50);

    const result = filterStands(xml, data1Geometry, [], true);

    expect(result.arrayOfStandIds.length).toBe(29);
  });
});