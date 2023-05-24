const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Runways = require('../models/runways');

describe("/runways", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const runway0 = 
  {
    "CALM_WIND_RUNWAY": "TRUE",
    "CALM_WIND_THRESHOLD": "5",
    "DVA": "NA",
    "IAP": "",
    "ICAO": "KAST",
    "LENGTH_FT": 4467,
    "MAG_HEADING": 319,
    "ODP": "NA",
    "RUNWAY": "32",
    "TRAFFIC_PATTERN": "LEFT",
    "TRUE_HEADING": 334,
    "UPDATED": "2/23/2023",
    "WIDTH_FT": 100
  }
  const runway1 = {
    "CALM_WIND_RUNWAY": "",
    "CALM_WIND_THRESHOLD": "",
    "DVA": "ANY HEADING W/IN 12 NM",
    "IAP": "",
    "ICAO": "KPDX",
    "LENGTH_FT": 6000,
    "MAG_HEADING": 29,
    "ODP": "NA",
    "RUNWAY":  "3",
    "TRAFFIC_PATTERN": "LEFT",
    "TRUE_HEADING": 45,
    "UPDATED": "2/26/2023",
    "WIDTH_FT": 150
  }

  describe('GET /', () => {
    beforeAll(async () => {
      await Runways.insertMany([runway0, runway1]);
    });

    it('should return all stored items', async () => {
      const res = await request(server)
        .get("/runways")
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject([runway0, runway1]);
    });
  });
  // describe('GET /:id', () => {
  //   let savedItems;

  //   beforeEach(async () => {
  //     savedItems = await Item.insertMany([item0, item1]);
  //   });

  //   it('should return item0', async () => {
  //     const res = await request(server)
  //       .get("/items/" + savedItems[0]._id)
  //       .send();
  //     expect(res.statusCode).toEqual(200);
  //     const expected = savedItems[0].toJSON();
  //     expected._id = expected._id.toString();
  //     expect(res.body).toMatchObject(expected);
  //   });

  //   it('should return item1', async () => {
  //     const res = await request(server)
  //       .get("/items/" + savedItems[1]._id)
  //       .send();
  //     expect(res.statusCode).toEqual(200);
  //     const expected = savedItems[1].toJSON();
  //     expected._id = expected._id.toString();
  //     expect(res.body).toMatchObject(expected);
  //   });

  //   it('should return 404 if no match', async () => {
  //     await Item.deleteOne({ _id: savedItems[1]._id })
  //     const res = await request(server)
  //       .get("/items/" + savedItems[1]._id)
  //       .send();
  //     expect(res.statusCode).toEqual(404);
  //   });
  // });

  // describe('POST /', () => {
  //   it('should create item0', async () => {
  //     const res = await request(server)
  //       .post("/items")
  //       .send(item0);
  //     expect(res.statusCode).toEqual(200);
  //     const storedItem = await Item.findOne().lean()
  //     expect(storedItem).toMatchObject(item0);
  //   });

  //   it('should create item1', async () => {
  //     const res = await request(server)
  //       .post("/items")
  //       .send(item1);
  //     expect(res.statusCode).toEqual(200);
  //     const storedItem = await Item.findOne().lean()
  //     expect(storedItem).toMatchObject(item1);
  //   });
  // });

});