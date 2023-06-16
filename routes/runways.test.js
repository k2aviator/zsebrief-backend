const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Runways = require('../models/runways');
const User = require('../models/user');


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
    "DVA": "NA",
    "IAP": "",
    "ICAO": "KAST",
    "LENGTH_FT": 4467,
    "MAG_HEADING": 29,
    "ODP": "NA",
    "RUNWAY":  "14",
    "TRAFFIC_PATTERN": "LEFT",
    "TRUE_HEADING": 154,
    "UPDATED": "2/26/2023",
    "WIDTH_FT": 100
  }
  const runway2 = 
  {
    "CALM_WIND_RUNWAY": "TRUE",
    "CALM_WIND_THRESHOLD": "5",
    "DVA": "NA",
    "IAP": "",
    "ICAO": "KBFI",
    "LENGTH_FT": 4467,
    "MAG_HEADING": 319,
    "ODP": "NA",
    "RUNWAY": "32",
    "TRAFFIC_PATTERN": "LEFT",
    "TRUE_HEADING": 334,
    "UPDATED": "2/23/2023",
    "WIDTH_FT": 100
  }
  const runway3 = {
    "CALM_WIND_RUNWAY": "",
    "CALM_WIND_THRESHOLD": "",
    "DVA": "NA",
    "IAP": "",
    "ICAO": "KBFI",
    "LENGTH_FT": 4467,
    "MAG_HEADING": 29,
    "ODP": "NA",
    "RUNWAY":  "14",
    "TRAFFIC_PATTERN": "LEFT",
    "TRUE_HEADING": 154,
    "UPDATED": "2/26/2023",
    "WIDTH_FT": 100
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

  describe.each([runway0, runway1])("POST /runways/%#", (runway) => {
    it('should send 403 to normal user and not store item', async () => {
      const res = await request(server)
        .post(`/runways`)
        .set('Authorization', 'Bearer ' + token0)
        .send(runway);
      expect(res.statusCode).toEqual(403);
      expect(await Runways.countDocuments()).toEqual(0);
    });
    it('should send 200 to admin user and store item', async () => {
      const res = await request(server)
        .post(`/runways`)
        .set('Authorization', 'Bearer ' + adminToken)
        .send(runway);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(runway)
      const savedRunway = await Runways.findOne({ _id: res.body._id }).lean();
      expect(savedRunway).toMatchObject(runway);
    });
  });
  describe('GET /numbers/:ICAO', () => {
    beforeEach(async () => {
      // Store the runways in the database
      savedRunways = await Runways.create([runway0, runway1, runway2, runway3]);
    });
    it('should return runways for ICAO', async () => {;
      // console.log("saved runway 0 ICAO ", savedRunways[0].ICAO)
      const res = await request(server)
        .get(`/runways/numbers/${savedRunways[0].ICAO}`)
        .send();
      expect(res.statusCode).toEqual(200);
      const response = res.body
      // console.log("response is ", response, " length is ", response.length)
      expect(response.length).toEqual(2)
    });
    it('should return all runways', async () => {;
      // console.log("saved runway 0 ICAO ", savedRunways[0].ICAO)
      const res = await request(server)
        .get(`/runways`)
        .send();
      expect(res.statusCode).toEqual(200);
      const response = res.body
      // console.log("response is ", response, " length is ", response.length)
      expect(response.length).toEqual(4)
    });
  });
  describe.each([runway0, runway1])('PUT /:id', (runway) => {
    let originalRunway;
    let savedRunway
    beforeEach(async () => {
      const res = await request(server)
        .post(`/runways`)
        .set('Authorization', 'Bearer ' + adminToken)
        .send(runway);
        originalRunway = res.body;
    });
    beforeEach(async () => {
      // Store the runways in the database
      savedRunways = await Runways.create([runway0, runway1]);
      runwayOneId = savedRunways[0]._id.toString()
      runwayTwoId = savedRunways[0]._id.toString()
    });

    it('should send 403 to normal user and not update item', async () => {
      const res = await request(server)
        .put(`/runways/${runwayOneId}`)
        .set('Authorization', 'Bearer ' + token0)
        .send({ ...runway, TRAFFIC_PATTERN: "RIGHT" });
      expect(res.statusCode).toEqual(403);
    });
    it('should send 200 to admin user and update item', async () => {
      const res = await request(server)
        .put(`/runways/${runwayTwoId}`)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({...runway, TRAFFIC_PATTERN: "RIGHT"});
      expect(res.statusCode).toEqual(200);
      const newRunway = await Runways.findById(runwayTwoId).lean();
      delete newRunway._id;
      delete res.body.id
      expect(res.body).toMatchObject(newRunway);
    });
  });
  describe("DELETE / runways %#", () => {
    let runwayToDelete; 
    beforeEach(async () => {
      const res = await request(server)
        .post("/runways")
        .set('Authorization', 'Bearer ' + adminToken)
        .send(runway0);
      runwayToDelete = res.body;
    });
    it('should send 403 to normal user and not delete departure', async () => { 
      // console.log("runway to delete id is ", runwayToDelete._id)
      const res = await request(server)
        .delete("/runways/" + runwayToDelete._id)
        .set('Authorization', 'Bearer ' + token0)
        .send({});
      // console.log("the server returned something ", res.body)
      expect(res.statusCode).toEqual(403);
    });
    it('should send 200 to an admin and delete departure', async () => {
      const {_id} = runwayToDelete
      const res = await request(server)
        .delete("/runways/" + runwayToDelete._id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({});
      expect(res.statusCode).toEqual(200);
      const storedRunway = await Runways.findOne({_id});
      expect(storedRunway).toBeNull();
    });
  });
})
