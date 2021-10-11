const { client } = require('../../app/db')

const cleanup = async () => {
  await client('things').del()
  await client('types').del()
  await client('ingest_things').del()
  await client('ingests').del()
}

module.exports = {
  cleanup,
}
