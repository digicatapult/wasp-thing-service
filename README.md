# wasp-thing-service

Thing Service for WASP Project

## Getting started

`wasp-thing-service` can be run in a similar way to most nodejs application. First install required dependencies using `npm`:

```sh
npm install
```

`wasp-thing-service` depends on a `postgresql` database dependency which can be brought locally up using docker:

```sh
docker-compose up -d
```

Finally the database must be initialised with:

```sh
npx knex migrate:latest
```

And finally you can run the application in development mode with:

```sh
npm run dev
```

Or run tests with:

```sh
npm test
```

You can also generate seed data script via:

```sh
NODE_ENV=test npx knex seed:run
```

## Environment Variables

`wasp-thing-service` is configured primarily using environment variables as follows:

|  variable   | required |        default         | description                                                                          |
| :---------: | :------: | :--------------------: | :----------------------------------------------------------------------------------- |
|  LOG_LEVEL  |    N     |         `info`         | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
|    PORT     |    N     |         `3001`         | Port on which the service will listen                                                |
|   DB_HOST   |    Y     |           -            | PostgreSQL database hostname                                                         |
|   DB_PORT   |    N     |         `5432`         | PostgreSQL database port                                                             |
|   DB_NAME   |    N     |         `wasp`         | PostgreSQL database name                                                             |
| DB_USERNAME |    Y     |           -            | PostgreSQL database username                                                         |
| DB_PASSWORD |    Y     |           -            | PostgreSQL database password                                                         |
| API_VERSION |    N     | `package.json version` | Official API version                                                                 |

## Deploying WASP Thing Service on WASP-Cluster with Helm/Kubernetes

### Install

```
brew install minikube helm
```

### WASP-Cluster

Obtain the `wasp-cluster` from the repo: `https://github.com/digicatapult/wasp-cluster.git`, and follow the readme instructions.

Eval is required to provide helm with visibility for your local docker image repository:

```
eval $(minikube docker-env)
```

Build the docker image:

```
docker build -t wasp-thing-service .
```

To run/deploy the application on kubernetes via helm charts use the following values.yaml with the corresponding overrides:

```
helm install wasp-thing-service helm/wasp-thing-service -f helm/wasp-thing-service/ci/ct-values.yaml
```

## Database structure

The structure of the database backing `wasp-thing-service` can be found in [docs/db.md](./docs/db.md)
