const LocalDb = require('./localdb');

let localDb;
let mongod;

beforeAll(async () => {
    let uri;
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = new MongoMemoryServer({
        instance: {
            port: 27018,
            ip: '127.0.0.1',
            dbName: 'properties'
        }
    });
    await mongod.start();
    uri = mongod.getUri();

    localDb = new LocalDb(uri, 'properties');
    await localDb.init();

    const userCollection = await localDb.db.collection('users');
    await userCollection.insertMany([{
        "email": "user1@sideinc.com",
        "token": "676cfd34-e706-4cce-87ca-97f947c43bd4",
    }, {
        "email": "user2@sideinc.com",
        "token": "2f403433-ba0b-4ce9-be02-d1cf4ad6f453",
    }]);
});

afterAll(async () => {
    await localDb.db.collection('listingFavorites').remove({});
    await localDb.stop();
    await mongod.stop(true);
});

test('get user returns user', async () => {
    const user = await localDb.getUser('2f403433-ba0b-4ce9-be02-d1cf4ad6f453');
    expect(user).toBeDefined();
    expect(user.email).toBe('user2@sideinc.com');
});

test('getFavorites returns null for unknown property', async () => {
    const favorite = await localDb.getFavorites(2000);
    expect(favorite).toBeNull();
});

test('incrementFavorites adds value when none exists', async () => {
    await localDb.incrementFavorites(111);
    var favorite = await localDb.getFavorites(111);
    expect(favorite).toBeDefined();
    expect(favorite.count).toBe(1);
});

test('incrementFavorites increments count when record exists', async () => {
    await localDb.incrementFavorites(555);
    await localDb.incrementFavorites(555);
    var favorite = await localDb.getFavorites(555);
    expect(favorite).toBeDefined();
    expect(favorite.count).toBe(2);
});