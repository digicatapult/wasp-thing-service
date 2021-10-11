exports.up = async (knex) => {
  // check extension is not installed
  const [extInstalled] = await knex('pg_extension').select('*').where({ extname: 'uuid-ossp' })

  if (!extInstalled) {
    await knex.raw('CREATE EXTENSION "uuid-ossp"')
  }

  const uuidGenerateV4 = () => knex.raw('uuid_generate_v4()')
  const now = () => knex.fn.now()

  await knex.schema.createTable('ingests', (def) => {
    def.string('name', 50).notNullable().primary()
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())
  })

  await knex.schema.createTable('types', (def) => {
    def.string('name', 50).primary()
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())
  })

  await knex.schema.createTable('things', (def) => {
    def.uuid('id').primary().defaultTo(uuidGenerateV4())
    def.string('type', 50).notNullable()
    def.jsonb('metadata').notNullable().default({})
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())

    def.index('type')
    def.foreign('type').references('name').on('types').onDelete('CASCADE').onUpdate('CASCADE')
  })

  await knex.schema.createTable('ingest_things', (def) => {
    def.string('ingest', 50).notNullable()
    def.string('ingest_id', 50).notNullable()
    def.uuid('thing_id').notNullable()
    def.jsonb('ingest_configuration').notNullable().default({})
    def.datetime('created_at').notNullable().default(now())
    def.datetime('updated_at').notNullable().default(now())

    def.primary(['ingest', 'ingest_id'])
    def.unique(['thing_id', 'ingest'])
    def.index('ingest_id')

    def.foreign('ingest').references('name').on('ingests').onDelete('CASCADE').onUpdate('CASCADE')
    def.foreign('thing_id').references('id').on('things').onDelete('CASCADE').onUpdate('CASCADE')
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('ingest_things')
  await knex.schema.dropTable('things')
  await knex.schema.dropTable('types')
  await knex.schema.dropTable('ingests')
  await knex.raw('DROP EXTENSION "uuid-ossp"')
}
