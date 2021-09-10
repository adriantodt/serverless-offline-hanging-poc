# serverless-offline-hanging-poc
_Proof of Concept of `serverless-offline` hanging._

### Environment

Bug was reproduced on following environment:

```
serverless-offline-hanging-poc$ serverless --version
Framework Core: 2.57.0 (local)
Plugin: 5.4.4
SDK: 4.3.0
Components: 3.17.0
```
```
serverless-offline-hanging-poc$ node --version
v14.17.6
```

The project manager used was `yarn`.

### Executing

```
serverless-offline-hanging-poc$ yarn start
yarn run v1.22.11
$ sls offline start
offline: Starting Offline: dev/us-east-1.
offline: Offline [http for lambda] listening on http://localhost:3002
offline: Function names exposed for local invocation by aws-sdk:
           * hello: poc-hello
```
```
serverless-offline-hanging-poc$ aws lambda invoke /dev/null --endpoint-url http://localhost:3002 --function-name poc-hello

Read timeout on endpoint URL: "http://localhost:3002/2015-03-31/functions/poc-hello/invocations"
```

The lambda should've returned `{"text":"Hello, World!"}`, but it never returns.

This was first reproduced trying to run `serverless-appsync-simulator`, but I managed to reproduce with just `serverless-offline` on my machine.

### Footnote

Install the project and run `yarn start` to run. The `dist` folder is provided on the repository, but you can also run `yarn build` to build it yourself.

We use a custom Webpack building solution and because of that we can't use `serverless-webpack`.
