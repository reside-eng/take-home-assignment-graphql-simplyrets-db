# Side Take-Home Test

The following is an example of GraphQL using Apollo Server Express.


## DataSources

This project uses two data sources. The first is SimplyRETS, which is an REST endpoint. The second is a local source from MongoDB.

### SimpyRETS

SimplyRETS is a datasource that exposes the REST API at https://api.simplyrets.com. To interact with it, the class **SimplyRets** is created in the datasources directory. It extends **RESTDataSource** from **apollo-datasource-rest**, which provides http functionality, as well as being part of the apollo server family.

It provides functionality to query the listings data source at SimplyRETS.

This class is not unit tested.

### LocalDb

LocalDb is a datasouce that is a wrapper for mongodb. It connects to a database and provides functionality around getting users, and managing listing favorites.

This class is unit tested.

## GraphQL

The types directory houses the graphQL files including the schema in **index.js**, and the resolvers in **resolvers.js**.

There is only one query and one mutation.

### properties Query

The properties query fetches listings (by city if specified) by calling the SimplyRETS endpoint, then connecting each listing to corresponding favorites count stored in the mongo database. If no favorites can be found in the database, then 0 is returned for favoritesCount.

### incrementFavorites Mutation

The incrementFavorites mutation requires a listing id, and increments, or creates a favorites record for that listing. It then returns the current count for that listing.

## index.js

The main entry point for node express. Here we create all objects needed for the execution of the server, and register the proper elements.

## Challanges

* Running on Windows provided some challanges to this test. They were resolved, but took some time.
* database.js was using an older version of the api provided by mongodb-memory-server. This needed to be updated to get the database server to start. Since this was not the focus of the efforts, I took some shortcuts, and removed some unnecessary logging.
* Learning how Apollo Server interacts with GraphQL. It was relatively simple, but their documentation is a bit lacking is some areas, and so it sometimes lead to some churn.
* I did not have time to add nearly as many tests as I wanted. I was able to cover the happy-path tests on localDb, but had to stop short of covering some fail-cases that I wanted.

