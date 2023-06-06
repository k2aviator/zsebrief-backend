const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Airports = require('../models/airports');
const Departures = require('../models/departures');

describe('Admin tests', () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);

    const airportClassB = "B" 
    const airportClassC = "C"
    const airportClassD = "D"
    
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
    describe.each([airportClassB, airportClassC, airportClassD])("GET /deps-by-class", (aptClass) => {
          
          it('should send 200 to normal user and not return items', async () => {
            const res = await request(server)
            .get(`/admin/deps-by-class/${aptClass}`)
            .set('Authorization', 'Bearer ' + token0)
            .send();
             expect(res.statusCode).toEqual(200);
        });
        it('should send 200 to admin user and return all items', async () => {
            const res = await request(server)
            .get(`/admin/deps-by-class/${aptClass}`)
            .set('Authorization', 'Bearer ' + adminToken)
            .send();
            expect(res.statusCode).toEqual(200);
        });
    });
});