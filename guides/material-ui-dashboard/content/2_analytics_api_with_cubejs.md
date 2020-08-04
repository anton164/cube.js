---
order: 2
title: "Analytics API with Cube.js"
---

First, we need to have the CLI installed globally on our machine. For this, we can use both 

NPM:

`$ npm install -g cubejs-cli`

Yarn:

`$ yarn global add cubejs-cli`

With the CLI installed, the next step is the creation of the basic backend structure. [There are several options available](https://cube.dev/docs/getting-started#2-connect-to-your-database).

`$ cubejs create <project name> -d postres`

We’ll use a [PostgreSQL](https://www.postgresql.org/) database. 

So we would run the command:

`$ cubejs create react-material-dashboard -d postgres`

If you don’t have any data for the dashboard, you can download our sample e-commerce Postgres dataset.

```
$ curl http://cube.dev/downloads/ecom-dump.sql > ecom-dump.sql
$ createdb ecom
$ psql --dbname ecom -f ecom-dump.sql
```

Next step is to [configure settings in the .env file to connect to our database](https://cube.dev/docs/connecting-to-the-database#configuring-connection-for-cube-js-cli-created-apps) :

```
CUBEJS_DB_NAME=ecom
CUBEJS_DB_TYPE=postgres
CUBEJS_API_SECRET=secret
```

![run Cube.js Playground](/images/1.gif)

Now, let’s run Cube.js Playground. It will help us to build a simple data schema, test out the charts, and then generate a React dashboard boilerplate. Run the following command in the Cube.js project folder:

`$ node index.js`

Next, open [http://localhost:4000](http://localhost:4000/) in your browser to create a Cube.js data schema.

![create a Cube.js data schema](/images/2.gif)

Data schema is a JavaScript code, which defines measures and dimensions and how they map to SQL queries. Here is an example of the schema, which can be used to describe users’ data.

```
cube(`Users`, {
  sql: `SELECT * FROM users`,

  measures: {
    count: {
      sql: `id`,
      type: `count`}
  },

  dimensions: {
    city: {
      sql: `city`,
      type: `string`},

    signedUp: {
      sql: `created_at`,
      type: `time`},

    companyName: {
      sql: `company_name`,
      type: `string`}
  }
});
```

Cube.js can generate a simple data schema based on the database’s tables. Let’s select the `line_items`, `orders`, `products`, and `users` tables and click “Generate Schema.” It will generate 4 schema files, one per table.

![Cube.js can generate a simple data schema](/images/3.png)

Once the schema is generated, we can navigate to the “Build” tab and select some measures and dimensions to test out the schema. The "Build" tab is a place where you can build sample charts with different visualization libraries and inspect how that chart was created, starting from the generated SQL all the way up to the JavaScript code to render the chart. You can also inspect the JSON query, which is sent to Cube.js backend.

![Once the schema is generated, we can navigate to the Build](/images/4.png)