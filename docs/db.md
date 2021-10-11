# Database usage

`wasp-thing-service` is backed by a PostgreSQL database and is the canonical record of the things registered in a `WASP` instance.

## Database migrations

Database migrations are handled using [`knex.js`](https://knexjs.org/) and can be migrated manually using the following commands:

```sh
npx knex migrate:latest # used to migrate to latest database version
npx knex migrate:up # used to migrate to the next database version
npx knex migrate:down # used to migrate to the previous database version
```

## Table structure

The following tables exist in the `things` database.

### `ingests`

`ingests` represent the list of registered `ingest` mechanisms for things stored in `WASP`. An `ingest` must be registered prior to any `things` that receive data via that `ingest` being registered.

#### Columns

| column       | PostreSQL type            | nullable | default | description                             |
| :----------- | :------------------------ | :------- | :-----: | :-------------------------------------- |
| `name`       | `CHARACTER VARYING(50)`   | FALSE    |    -    | Name of the ingest for example `ttn-v2` |
| `created_at` | `Timestamp with timezone` | FALSE    | `now()` | When the row was first created          |
| `updated_at` | `Timestamp with timezone` | FALSE    | `now()` | When the row was last updated           |

#### Indexes

| columns | Index Type | description |
| :------ | :--------- | :---------- |
| `name`  | PRIMARY    | Primary key |

### `types`

`types` refer to the types of `things` present in a `WASP` instance. Each `type` is namespaced to the specific ingest used for that type. This is done so that we can rely on an arbitrary ingest defined identifier for a `thing` and allows us to support a wider variation of `ingests`. At some point we could allow extra ingest identifiers to be supported so that a thing can receive data from multiple ingests but this is currently not supported.

#### Columns

| column       | PostreSQL type            | nullable | default | description                    |
| :----------- | :------------------------ | :------: | :-----: | :----------------------------- |
| `name`       | `CHARACTER VARYING(50)`   |  FALSE   |    -    | Name of the `type`             |
| `created_at` | `Timestamp with timezone` |  FALSE   | `now()` | When the row was first created |
| `updated_at` | `Timestamp with timezone` |  FALSE   | `now()` | When the row was last updated  |

#### Indexes

| columns | Index Type | description |
| :------ | :--------- | :---------- |
| `name`  | PRIMARY    | Primary key |

### `things`

`things` refer to the IoT devices that can feed data into `WASP`

#### Columns

| column       | PostreSQL type            | nullable |       default        | description                                                                                                                                                           |
| :----------- | :------------------------ | :------: | :------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | `UUID`                    |  FALSE   | `uuid_generate_v4()` | Unique identifier for the `thing`                                                                                                                                     |
| `type`       | `CHARACTER VARYING(50)`   |  FALSE   |          -           | Name of the `type` for this `thing`                                                                                                                                   |
| `metadata`   | `JSONB`                   |  FALSE   |     `{}::jsonb`      | Stores metadata or settings for this `thing` that are not associated with network connectivity. For example it could store a record of the expected transmission rate |
| `created_at` | `Timestamp with timezone` |  FALSE   |       `now()`        | When the row was first created                                                                                                                                        |
| `updated_at` | `Timestamp with timezone` |  FALSE   |       `now()`        | When the row was last updated                                                                                                                                         |

#### Indexes

| columns | Index Type | description                                       |
| :------ | :--------- | :------------------------------------------------ |
| `id`    | PRIMARY    | Primary key                                       |
| `type`  | INDEX      | Allows quick filtering of `things` by `type` name |

#### Foreign Keys

| columns | References    | description                    |
| :------ | :------------ | :----------------------------- |
| `type`  | `types(name)` | Guarantees the `type` is valid |

### `ingest_things`

Registers a `thing` with an `ingest` with a unique identifier and configuration for the `ingest`

#### Columns

| column                 | PostreSQL type            | nullable |   default   | description                                           |
| :--------------------- | :------------------------ | :------: | :---------: | :---------------------------------------------------- |
| `ingest`               | `CHARACTER VARYING(50)`   |  FALSE   |      -      | `ingest` to register the `thing` with                 |
| `ingest_id`            | `CHARACTER VARYING(50)`   |  FALSE   |      -      | Unique identifier within the `ingest` for the `thing` |
| `thing_id`             | `UUID`                    |  FALSE   |      -      | `thing` id                                            |
| `ingest_configuration` | `JSONB`                   |  FALSE   | `{}::jsonb` | Configuration of the `thing` within the `ingest`      |
| `created_at`           | `Timestamp with timezone` |  FALSE   |   `now()`   | When the row was first created                        |
| `updated_at`           | `Timestamp with timezone` |  FALSE   |   `now()`   | When the row was last updated                         |

#### Indexes

| columns               | Index Type | description                                                       |
| :-------------------- | :--------- | :---------------------------------------------------------------- |
| `ingest`, `ingest_id` | PRIMARY    | Primary key                                                       |
| `thing_id`, `ingest`  | UNIQUE     | Guarentees a `thing` can only be registered with an `ingest` once |
| `ingest_id`           | INDEX      | Allows lookup of `things` by `ingest_id` only                     |

#### Foreign Keys

| columns    | References      | description                      |
| :--------- | :-------------- | :------------------------------- |
| `ingest`   | `ingests(name)` | Guarantees the `ingest` is valid |
| `thing_id` | `things(id)`    | Guarantees the `thing` is valid  |
