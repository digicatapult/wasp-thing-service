import knex from 'knex'
import env from './env.js'

const client = knex({
  client: 'pg',
  migrations: {
    tableName: 'migrations',
  },
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
})

async function findThings({ type, ingest, ingestId }) {
  let query = client('things AS t').select(['t.id AS id', 't.type AS type', 't.metadata AS metadata']).orderBy('t.id')

  if (type) query = query.where({ type })
  if (ingest || ingestId) {
    query = query.join('ingest_things AS ti', 'ti.thing_id', '=', 't.id')
    if (ingest) {
      query = query.where({ 'ti.ingest': ingest })
    }
    if (ingestId) {
      query = query.where({ 'ti.ingest_id': ingestId })
    }
  }

  return query
}

async function findThingById({ id }) {
  return client('things').select(['id', 'type', 'metadata']).where({ id })
}

async function addThing(reqBody) {
  return client('things').insert(reqBody).returning(['id', 'type', 'metadata'])
}

async function updateThing({ id, type, metadata }) {
  return client('things').update({ type, metadata, updated_at: new Date() }, ['id', 'type', 'metadata']).where({ id })
}

async function removeThing({ id }) {
  await client('things').del().where({ id })
}

async function findThingTypes() {
  return client('types').select(['name'])
}

async function findThingTypeByName({ name }) {
  return client('types').select(['name']).where({ name })
}

async function addThingType(reqBody) {
  return client('types').insert(reqBody).returning(['name'])
}

async function updateThingType({ name }, reqBody) {
  return client('types').update({ name: reqBody.name, ingest: reqBody.ingest }).returning(['name']).where({ name })
}

async function removeThingType({ name }) {
  await client('types').del().where({ name })
}

async function findIngests() {
  return client('ingests').select(['name'])
}

async function findIngestByName({ name }) {
  return client('ingests').select(['name']).where({ name })
}

async function addIngest({ name }) {
  return client('ingests').insert({ name }).returning(['name'])
}

async function updateIngest({ name }, reqBody) {
  return client('ingests').update({ name: reqBody.name }).returning(['name']).where({ name })
}

async function removeIngest({ name }) {
  await client('ingests').del().where({ name })
}

async function findThingIngestByThingId({ thingId }) {
  return client('ingest_things')
    .select(['ingest', 'ingest_id AS ingestId', 'ingest_configuration AS configuration'])
    .where({ thing_id: thingId })
}

async function findThingIngestByIngestId({ ingest, ingestId }) {
  return client('ingest_things')
    .select(['ingest', 'ingest_id AS ingestId', 'ingest_configuration AS configuration'])
    .where({ ingest, ingest_id: ingestId })
}

async function findThingIngestByThingIdAndIngest({ thingId, ingest }) {
  return client('ingest_things')
    .select(['ingest', 'ingest_id AS ingestId', 'ingest_configuration AS configuration'])
    .where({ thing_id: thingId, ingest })
}

async function addThingIngest({ thingId }, reqBody) {
  await client('ingest_things').insert({
    thing_id: thingId,
    ingest: reqBody.ingest,
    ingest_id: reqBody.ingestId,
    ingest_configuration: reqBody.configuration,
  })

  return reqBody
}

async function updateThingIngestByThingIdAndIngest({ thingId, ingest }, reqBody) {
  await client('ingest_things')
    .update({
      ingest_id: reqBody.ingestId,
      ingest_configuration: reqBody.configuration,
      updated_at: new Date(),
    })
    .where({ thing_id: thingId, ingest })

  return { ingest, ...reqBody }
}

async function removeThingIngestByThingIdAndIngest({ thingId, ingest }) {
  await client('ingest_things').where({ thing_id: thingId, ingest }).del()
}

export {
  client,
  findThings,
  findThingById,
  addThing,
  updateThing,
  removeThing,
  findThingTypes,
  findThingTypeByName,
  addThingType,
  updateThingType,
  removeThingType,
  findIngests,
  findIngestByName,
  addIngest,
  updateIngest,
  removeIngest,
  findThingIngestByThingId,
  findThingIngestByIngestId,
  findThingIngestByThingIdAndIngest,
  addThingIngest,
  updateThingIngestByThingIdAndIngest,
  removeThingIngestByThingIdAndIngest,
}
