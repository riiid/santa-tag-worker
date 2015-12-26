# santa-tag-worker

Fetch, Manipulate, Aggregate Google Sheets data with Rx.

## Setup

* create `credential.json` which conatins service account. (see [here](https://github.com/theoephraim/node-google-spreadsheet#service-account-recommended-method))
* create `config.json` with following props.

```
{
  "url": <DEAFULT_HTTP_REQUEST_URl>,
  "api_key": <API_KEY>,
  "token": <TOKEN>,
  "sheetKey": <GOOGLE_SHEET_KEY>,
  "sheetTitles": [<GOOGLE_SHEET_TITLE>...]
}
```

## Development

```
$ npm run lint
$ npm test
```

## Run

```
$ npm start
```

## Implement your own worker

* setup `service account` and `credential.json` for your own Google Sheet.
* update `sheetKey`, `sheetTitles` on `config.json` for your own Google Sheet.

```
import auth$ from './lib/auth';
import rows2obj$ from './lib/rows2obj';

auth$()
  .concatMap(rows2obj$)
  // your own works !!
  .subscribe();
```
