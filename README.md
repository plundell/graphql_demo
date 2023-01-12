# GraphQL Demo

This repo contains a simple [React](https://reactjs.org/docs/create-a-new-react-app.html) web app which demonstrates how to use the [graphql-request](https://github.com/prisma-labs/graphql-request) client library to consume a [GraphQL](https://graphql.org/) API.

It features:
 * a text search which fetches results as user types
 * a grid output of search results
 * responsive sizing of the grid based on screen size 
 * grid items are "selectable" and this state remains until app is reset

You can view the demo in action via _GitHub pages_ [here](https://plundell.github.io/graphql_demo/build/) or you can tinker with the code yourself on [StackBlitz](https://stackblitz.com/github/plundell/graphql_demo)

## API
For this demo we're using [this](https://github.com/trevorblades/countries) public API which provides information about countries. 

### Schema
Most APIs expose an interactive query enviornment & schema outline using a builtin component called [Graph**i**QL](https://github.com/graphql/graphiql); this one's available [here](https://countries.trevorblades.com/). 

More details about the schema can be found [here](https://trevorblades.github.io/countries/queries/continent), but in short the available queries/methods are:
 * country()/countries()
 * continent()/countinents()
 * language()/languages()

Each method takes a filter object argument:
```graphql
query ($code: ID!) {
  continent(code: $code) {
    code
    name
    countries {
      code
      name
      native
      phone
      capital
      currency
      emoji
      emojiU
    }
  }
}
```
and retuns a single/array of objects. If the `$code` variable above eg. was _"SA"_ then the response would be:
```json
{
  "continent": {
    "code": "SA",
    "name": "South America",
    "countries": [
      {
        "code": "BR",
        "name": "Brazil",
        "native": "Brasil",
        "phone": "55",
        "capital": "Brasilia",
        "currency": "BRL",
        "emoji": "🇧🇷",
        "emojiU": "U+1F1E7 U+1F1F7"
      }
    ]
  }
}
```

### Typed responses
One major benifit of GraphQL are the customizable queries and predictable responses. To take full advantage of this in combination with TypeScript we're defining queries in standalone files, then using the NPM module [GraphQL CodeGen](https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node) to generate _types_ which we can use in our code. The like above contains a video how-to guide, but in short the steps are:
 1. `npm install ...`
 2. Create config _codegen.ts_ which will
  * Download the schema from uri defined in .env
  * Search for all `'./src/**/*.graphql'` files
  * Output a single `./countries.graphql-types.ts` file


## Development
Use Reacts builtin dev server to develop the app by running: `npm start`