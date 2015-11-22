# OAuth2

Read [OAuth 2.0 Tutorial](http://tutorials.jenkov.com/oauth2/index.html)

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

## Access Token Request Samples
 
### 2 step with password grant type

POST /oauth/token HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=password&client_id=abc1&client_secret=EkfBWYQ34tgQ&username=paulv&password=test

#### Response

{"token_type":"bearer","access_token":"981a88f0a3ad54cb6ac5dc9e525174cf8c6f0e55","expires_in":3600}

### 3 step with authorization_code grant type

First authentication code must be received. Then:

POST /oauth/token HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=abc1&client_secret=EkfBWYQ34tgQ&code=762b8f16be488c859df44b3b6337bbe0421d04e4

#### Response
 
 {"token_type":"bearer","access_token":"7c96128efd3e262921101e1120b7f8481a881721","expires_in":3600}