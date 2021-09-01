const Resolvers = {
    Query: {
        async properties(parent, args, context, info) {
            const listings = await context.dataSources.simplyRets.GetListings(context.user, args.city);

            const listingWithFavorites = await Promise.all(listings.map(async listing => {
                const favorites = await context.dataSources.localDb.getFavorites(listing.listingId);
                return {...listing, favoriteCount: favorites ? favorites.count : 0};
            }));

            return listingWithFavorites;
        }
    },
    Mutation: {
        incrementFavorite: async (_, { listingId }, { dataSources }) => {
            const favorite = await dataSources.localDb.incrementFavorites(listingId);
            return favorite.count;
        }
    }
}

module.exports = Resolvers;