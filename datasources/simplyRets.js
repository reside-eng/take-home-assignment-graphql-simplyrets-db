const { RESTDataSource } = require('apollo-datasource-rest');

class SimplyRets extends RESTDataSource {
    constructor(baseUri) {
        super();
        this.baseURL = baseUri;
    }

    willSendRequest(request) {
        request.headers.set('Authorization', `Basic ${Buffer.from('simplyrets:simplyrets').toString('base64')}`);
    }

    async GetListings(user, city) {
        if (!user) {
            // user did not athenticate.
            return [];
        }

        let uri = `${this.baseURL}/properties`;
        let params = {};
        if (city) {
            params = {q: city};
        }

        try {
            // Assuming username and password are api keys, I would pull these from config properties.
            const response = await this.get(uri, params);
            return Array.isArray(response)
                ? response
                : [];
        }
        catch (error) {
            console.log(error);
        }
        return [];
    }
}

module.exports = SimplyRets;
