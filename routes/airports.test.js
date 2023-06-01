const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Airports = require('../models/airports');
const User = require('../models/user');


describe("/airports", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const newDate = new Date();

  const airport0 = 
  {
    AIRSPACE_CLASS: "E",
    ELEV: 250,
    HRS_CLOSE: 9999,
    HRS_OPEN: 9999,
    ICAO: "KCVO",
    LAT: "44.4968758",
    LONG: "-123.2894572",
    NAME: "Corvallis Municipal Airport",
    NOTES: "",
    TOWERED: "FALSE",
    UPDATED_BY: "user1@gmail.com"
  }
  const airport1 = 
  {
    AIRSPACE_CLASS: "D",
    ELEV: 1497,
    HRS_CLOSE: 2000,
    HRS_OPEN: 600,
    ICAO: "KPDT",
    LAT: "45.6950953",
    LONG: "-118.8433686",
    NAME: "Eastern Oregon Regional Airport at Pendleton",
    NOTES: "",
    TOWERED: "TRUE",
    UPDATED_BY: "user1@gmail.com"
  }
  describe('After login', () => {
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
    describe.each([airport0, airport1])("POST /airports/%#", (airport) => {
      it('should send 403 to normal user and not store item', async () => {
        const res = await request(server)
          .post("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + token0)
          .send(airport);
        expect(res.statusCode).toEqual(403);
        expect(await Airports.countDocuments()).toEqual(0);
      });
      it('should send 200 to admin user and store item', async () => {
        const res = await request(server)
          .post("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + adminToken)
          .send(airport);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(airport)
        const savedAirport = await Airports.findOne({ _id: res.body._id }).lean();
        expect(savedAirport).toMatchObject(airport);
      });
    describe.each([airport0, airport1])("PUT / airport %#", (airport) => {
      let originalAirportItem;
      beforeEach(async () => {
        const res = await request(server)
          .post("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + adminToken)
          .send(airport);
          originalAirportItem = res.body;
      });
      it('should send 403 to normal user and not update item', async () => {
        const res = await request(server)
          .put("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + token0)
          .send({ ...airport, ELEV: 999 });
        expect(res.statusCode).toEqual(403);
        const newAirportItem = await Airports.findById(originalAirportItem._id).lean();
        newAirportItem._id = newAirportItem._id.toString();
        expect(newAirportItem).toMatchObject(originalAirportItem);
      });
      it('should send 200 to admin user and update item', async () => {
        const updatedAirport = { ...airport, ELEV: 999 };
        //console.log('Updated Airport:', updatedAirport);
        const res = await request(server)
          .put("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + adminToken)
          .send(updatedAirport);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(updatedAirport);
        const savedAirport = await Airports.findOne({ _id: res.body._id }).lean();
        expect(savedAirport).toMatchObject(updatedAirport);
      });
    });


    describe.each([airport0, airport1])("GET /:ICAO airport %#", (airport) => {
      let originalAirport;
      beforeEach(async () => {
        const res = await request(server)
          .post("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + adminToken)
          .send(airport);
          originalAirport = res.body;
          //console.log("original airport", originalAirport)
      });
      it('should send 200 to normal user and return item', async () => {
        const res = await request(server)
          .get("/airports/" + airport.ICAO)
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(originalAirport);
      });
      it('should send 200 to admin user and return item', async () => {
        const res = await request(server)
          .get("/airports/"  + airport.ICAO)
          .set('Authorization', 'Bearer ' + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(originalAirport);
      });
    });
    describe("GET /", () => {
      let airports;
      beforeEach(async () => {
      airports = (await Airports.insertMany([airport0, airport1])).map(i => i.toJSON())
      airports.forEach(i => i._id = i._id.toString());
      });
      it('should send 200 to normal user and return all items', async () => {
        const res = await request(server)
          .get("/airports/")
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(airports);
      });
      it('should send 200 to admin user and return all items', async () => {
        const res = await request(server)
          .get("/airports/")
          .set('Authorization', 'Bearer ' + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(airports);
      });
    });
  });
});

})