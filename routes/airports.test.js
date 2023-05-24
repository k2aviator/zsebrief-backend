const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Airports = require('../models/airports');

describe("/airports", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const airport0 = 
  {
    "AIRSPACE_CLASS": "E",
    "ELEV": 250,
    "HRS_CLOSE": 9999,
    "HRS_OPEN": 9999,
    "ICAO": "KCVO",
    "LAT": "44.4968758",
    "LONG": "-123.2894572",
    "NAME": "Corvallis Municipal Airport",
    "NOTES": "",
    "TOWERED": "FALSE",
    "UPDATED": "3/14/2023"
  }
  const airport1 = 
  {
    "AIRSPACE_CLASS": "D",
    "ELEV": 1497,
    "HRS_CLOSE": 2000,
    "HRS_OPEN": 600,
    "ICAO": "KPDT",
    "LAT": "45.6950953",
    "LONG": "-118.8433686",
    "NAME": "Eastern Oregon Regional Airport at Pendleton",
    "NOTES": "",
    "TOWERED": "TRUE",
    "UPDATED": "2/26/2023"
  }

  describe('GET /', () => {
    beforeAll(async () => {
      await Airports.insertMany([airport0, airport1]);
    });

    it('should return all stored items', async () => {
      const res = await request(server)
        .get("/airports")
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject([airport0, airport1]);
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