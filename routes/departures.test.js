const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Departures = require('../models/departures');
const User = require('../models/user');


describe("/departures", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const departure0 = 
  {
    "CLIMB":"CLB VIA SID",
    "EXPECT_CRUISE":"3 MINS AFT DEP",
    "ICAO":"KBFI",
    "NAME":"KENT",
    "NEED_FOR_INTERIM_ALT":"NO",
    "NUM":8,
    "PROCEDURE":"DEPARTURE",
    "RWY_SPECIFIC":"",
    "TOP_ALT":"2000 (DON'T STATE)",
    "TOP_ALT_LISTED":"YES",
    "TOP_ALT_STATE":"NO",
    "TYPE": "R/V"
   }

  const departure1 = {
    "CLIMB":"CLB VIA SID, EXCEPT MAINTAIN",
    "EXPECT_CRUISE":"5 MINS AFT DEP",
    "ICAO":"KUAO",
    "NAME":"GLARA",
    "NEED_FOR_INTERIM_ALT":"NO",
    "NUM":2,
    "PROCEDURE":"DEPARTURE",
    "RWY_SPECIFIC":"",
    "TOP_ALT":"4000",
    "TOP_ALT_LISTED":"NO",
    "TOP_ALT_STATE":"YES",
    "TYPE":"RNAV"
    }

  const user0 = {
    email: 'user0@gmail.com',
    password: '123password'
  };
  const user1 = {
    email: 'user1@gmail.com',
    password: '456password'
  }
  let token0;
  let adminToken;

  beforeEach(async () => {
    await request(server).post("/login/signup").send(user0);
    const res0 = await request(server).post("/login").send(user0);
    token0 = res0.body.token;
    await request(server).post("/login/signup").send(user1);
    await User.updateOne({ email: user1.email }, { $push: { roles: 'admin'} });
    const res1 = await request(server).post("/login").send(user1);
    adminToken = res1.body.token;
  });

  describe.each([departure0, departure1])("POST /departures/%#", (departure) => {
    it('should send 403 to normal user and not store item', async () => {
      const res = await request(server)
        .post("/departures")
        .set('Authorization', 'Bearer ' + token0)
        .send(departure);
      expect(res.statusCode).toEqual(403);
      expect(await Departures.countDocuments()).toEqual(0);
    });
    it('should send 200 to admin user and store item', async () => {
      const res = await request(server)
        .post("/departures")
        .set('Authorization', 'Bearer ' + adminToken)
        .send(departure);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(departure)
      const savedDeparture = await Departures.findOne({ _id: res.body._id }).lean();
      expect(savedDeparture).toMatchObject(departure);
    });
    // DISABLED - RECEIVE 400 ERRORS IN PRODUCTION WITH CURRENT DATA; NEED TO REFACTOR DATA IN DATABASE
    // it.each(Object.keys(departure1))('should return 400 if %s is not provided', async (key) =>{
    //   const departureMissingKeys = {
    //   ...departure1,
    //   [key]: undefined
    //   } 
    //   const res = await request(server)
    //   .post("/departures")
    //   .set('Authorization', 'Bearer ' + adminToken)
    //   .send(departureMissingKeys);
    //   expect(res.statusCode).toEqual(400);
    //   const savedDeparture = await Departures.find().lean();
    //   expect(savedDeparture.length).toEqual(0);        
    // })  
  });
  describe.each([departure0, departure1])('GET /:id', (departure) => {
    let originalDeparture;
    beforeEach(async () => {
      const res = await request(server)
        .post("/departures")
        .set('Authorization', 'Bearer ' + adminToken)
        .send(departure);
      originalDeparture = res.body;
      //console.log("TEST: departure sent" , originalDeparture)
    });

    it('should return departure by id', async () => {
      const res = await request(server)
        .get("/departures/" + originalDeparture._id)
        .send();
        expect(res.statusCode).toEqual(200);
        //console.log("TEST: departure returned ", res.body)
        expect(res.body).toMatchObject(originalDeparture);
      });
  });
  describe('GET /departures', () => {
    beforeEach(async () => {
      // Store the runways in the database
      savedDepartures = await Departures.create([departure0, departure1]);
    });
    it('should return all departures', async () => {;
      const res = await request(server)
        .get(`/departures`)
        .send();
      expect(res.statusCode).toEqual(200);
      const response = res.body
      expect(response.length).toEqual(2)
    });
  });
  describe.each([departure0, departure1])("PUT / airport %#", (departure) => {
    let originalDeparture;
    let savedDepartures;
    beforeEach(async () => {
      const res = await request(server)
        .post(`/departures`)
        .set('Authorization', 'Bearer ' + adminToken)
        .send(departure);
        originalDeparture = res.body;
    });
    beforeEach(async () => {
      // Store the departures in the database
      savedDepartures = await Departures.create([departure0, departure1]);
      departureOneId = savedDepartures[0]._id
      departureTwoId = savedDepartures[0]._id
    });
    it('should send 403 to normal user and not update item', async () => {
      const res = await request(server)
        .put(`/departures/${departureOneId}`)
        .set('Authorization', 'Bearer ' + token0)
        .send({ ...departure, TOP_ALT: 99999 });
      expect(res.statusCode).toEqual(403);
    });
    it('should send 200 to admin user and update item', async () => {
      const res = await request(server)
        .put(`/departures/${departureTwoId}`)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({...departure, TOP_ALT: "99999"});
      expect(res.statusCode).toEqual(200);
      const newDeparture = await Departures.findById(departureTwoId).lean();
      delete newDeparture._id;
      delete res.body.id
      expect(res.body).toMatchObject(newDeparture);
    });
  });
  describe("DELETE / departure %#", () => {
    let depToDelete; 
    beforeEach(async () => {
      const res = await request(server)
        .post("/departures")
        .set('Authorization', 'Bearer ' + adminToken)
        .send(departure0);
      depToDelete = res.body;
    });
    beforeEach(async () => {
      const res = await request(server)
      .get("/departures/" + depToDelete._id)
      .send();
      expect(res.statusCode).toEqual(200);
  
      expect(res.body).toMatchObject(departure0);
    });
    it('should send 403 to normal user and not delete departure', async () => { 
      const res = await request(server)
        .delete("/departures/" + depToDelete._id)
        .set('Authorization', 'Bearer ' + token0)
        .send({});
      expect(res.statusCode).toEqual(403);
    });
    it('should send 200 to an admin and delete departure', async () => {
      const {_id} = depToDelete
      const res = await request(server)
        .delete("/departures/" + depToDelete._id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({});
      expect(res.statusCode).toEqual(200);
      const storedDeparture = await Departures.findOne({_id});
      expect(storedDeparture).toBeNull();
    });
  });
});