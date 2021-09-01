const { DataSource } = require('apollo-datasource');

class LocalDb extends DataSource {
    constructor(uri, dbName) {
        super();
        this.uri = uri;
        this.dbName = dbName;
    }

    async init() {
        try {
            this.client = require('mongodb').MongoClient;
            this.connection = await this.client.connect(this.uri);
            this.db = this.connection.db(this.dbName);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async stop() {
        await this.connection.close();
    }

    async getUser(token) {
        try {
            const userCollection = this.db.collection('users');
            const query = { token: token };
            return await userCollection.findOne(query);
        } catch (error) {
            console.log(error);
        }
    }

    async getFavorites(listingId) {
        try {
            const favorites = this.db.collection('listingFavorites');
            const query = { listingId: listingId};
            return await favorites.findOne(query);
        } catch (error) {
            console.log(error);
        }
    }

    async incrementFavorites(listingId) {
        try {
            const favorites = this.db.collection('listingFavorites');
            const query = { listingId: listingId};
            const operation = { $inc: { count: 1 } };
            await favorites.updateOne(query, operation, {upsert: true });
            return await favorites.findOne(query);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = LocalDb;