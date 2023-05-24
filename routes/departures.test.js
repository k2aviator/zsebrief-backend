const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Departures = require('../models/departures');

describe("/departures", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const departure0 = 
  {
    "CLIMB":"CLB VIA SID",
    "EXPECT_CRUISE":"3 MINS AFT DEP",
    "ICAO":"KBFI",
    "LAST_UPDATED":"2/23/2022",
    "NAME":"KENT",
    "NEED_FOR_INTERIM_ALT":"NO",
    "NUM":8,
    "PROCEDURE":"DEPARTURE",
    "RWY_SPECIFIC":"",
    "TOP_ALT":"2000 (DON'T STATE)",
    "TOP_ALT_LISTED":"YES",
    "TYPE": "R/V"
   }

  const departure1 = {
    "CLIMB":"CLB VIA SID, EXCEPT MAINTAIN",
    "EXPECT_CRUISE":"5 MINS AFT DEP",
    "ICAO":"KUAO",
    "LAST_UPDATED":"2/26/2023",
    "NAME":"GLARA",
    "NEED_FOR_INTERIM_ALT":"NO",
    "NUM":2,
    "PROCEDURE":"DEPARTURE",
    "RWY_SPECIFIC":"",
    "TOP_ALT":"4000",
    "TOP_ALT_LISTED":"NO",
    "TYPE":"RNAV"
    }

  describe('GET /', () => {
    beforeAll(async () => {
      await Departures.insertMany([departure0, departure1]);
    });

    it('should return all stored items', async () => {
      const res = await request(server)
        .get("/departures")
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject([departure0, departure1]);
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