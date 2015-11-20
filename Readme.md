# PostgreSQL Example

See schema.sql for the tables referred to in this example

The object exposed in model.js could be directly passed into the model parameter of the config object when initiating.

For example:

```js

var oauth = oauthserver({
  model: require('./model'),
  grants: ['password'],
  debug: true
});

```

## Start

In this example, the postgres connection info is read from the `DATABASE_URL` environment variable which you can set 
when you run, for example:

```
$ DATABASE_URL=postgres://postgres:1234@localhost/postgres node index.js
```

or use npm command in combination with start script defined in package.json

```
$ npm start
```

## Sample request

POST /oauth/token HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=password&client_id=abc1&client_secret=token&username=paulv&password=password