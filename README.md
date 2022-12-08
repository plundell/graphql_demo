# GraphQL Demo

This repo contains a quick demo of using a GraphQL API to power a simple React app. No additional libraries are used.

It features:
 * a text search input
 * a grid output of search results
 * automatic querying of the API as the user types
 * automatic populating of the grid as results come in
 * responsive sizing of the grid based on screen size 
 * clickable items in the grid which show additional data

You can view the demo in action via [GitHub pages](http://plundell.github.io/graphql_demo) or you can tinker with the code yourself on [StackBlitz](https://stackblitz.com/github/plundell/graphql_demo)


## GraphQL API
We're using a _public_ GraphQL API from [this](https://github.com/APIs-guru/graphql-apis) list, specifically this one which provides information about [countries](https://github.com/trevorblades/countries)

### Queries
The available queries are described [here](https://trevorblades.github.io/countries/queries/continent) but in short they consist of:
 * country()/countries()
 * continent()/countinents()
 * language()/languages()

Each takes a filter object argument and retuns a single/array of objects


