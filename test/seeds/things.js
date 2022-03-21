const { client } = require('../../app/db')

const cleanup = async () => {
  await client('ingest_things').del()
  await client('ingests').del()
  await client('types').del()
  await client('things').del()
}

const seed = async () => {
  await cleanup()

  const thingTypeDetiPower = 'detiPower'
  const ingestTtnv2 = 'ttn-v2'
  const ingestMqtt = 'ingest-mqtt'

  const thingOneId = '283d818a-e115-4b88-b264-bb2033de21f0'
  const thingTypeOyster2 = 'oyster2'
  const ingestOemServer = 'oem-server'
  const ingestOemServerId = '356211690842850'

  const thingTwoId = '0bd3a47b-ae96-4222-99e3-fe321da4d410'
  const thingTypeThingy91 = 'thingy91'
  const ingestNordicCloud = 'nordic-cloud'
  const ingestNordicCloudId = 'nrf-352656101111600'

  const thingThreeId = '8c2a3af9-c9cc-4f4c-98c1-81dbc9c4eff0'
  const thingType264 = 'h264'
  const ingestRtmp = 'ingest-rtmp'
  const ingestRtmpId = 'stream-test'

  // create thing types
  await client('types').insert([
    {
      name: thingTypeThingy91,
    },
    {
      name: thingTypeDetiPower,
    },
    {
      name: thingTypeOyster2,
    },
    {
      name: thingType264,
    },
  ])

  // create ingests
  await client('ingests')
    .insert([
      {
        name: ingestTtnv2,
      },
      {
        name: ingestNordicCloud,
      },
      {
        name: ingestMqtt,
      },
      {
        name: ingestOemServer,
      },
      {
        name: ingestRtmp,
      },
    ])
    .returning('*')

  // create things
  await client('things')
    .insert([
      {
        id: thingOneId,
        type: thingTypeOyster2,
      },
      {
        id: thingTwoId,
        type: thingTypeThingy91,
      },
      {
        id: thingThreeId,
        type: thingType264,
      },
    ])
    .returning('*')

  // create ingest things
  await client('ingest_things')
    .insert([
      {
        thing_id: thingOneId,
        ingest: ingestOemServer,
        ingest_id: ingestOemServerId,
      },
      {
        thing_id: thingTwoId,
        ingest: ingestNordicCloud,
        ingest_id: ingestNordicCloudId,
      },
      {
        thing_id: thingThreeId,
        ingest: ingestRtmp,
        ingest_id: ingestRtmpId,
      },
    ])
    .returning('*')
}

module.exports = {
  cleanup,
  seed,
}
