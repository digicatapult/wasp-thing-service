import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { setupServer } from './helpers/server.js'
import { cleanup } from './seeds/things.js'

async function createThingResource({ context, thingType, ingest }) {
  await context.request.post(`/v1/thingType`).send(thingType)
  await context.request.post(`/v1/ingest`).send(ingest)

  const { body: thingOneBody } = await context.request.post(`/v1/thing`).send({ type: thingType.name, metadata: {} })

  await context.request.post(`/v1/thing/${thingOneBody.id}/ingest`).send({
    ingest: ingest.name,
    ingestId: `${ingest.name}Id`,
    configuration: {},
  })
}

describe('Things', function () {
  describe('GET things', function () {
    const context = {}
    const thingTypes = [{ name: 'typeOne' }, { name: 'typeTwo' }, { name: 'typeThree' }]
    const ingests = [{ name: 'ingestOne' }, { name: 'ingestTwo' }, { name: 'ingestThree' }]

    before(async function () {
      await setupServer(context)

      await createThingResource({ context, thingType: thingTypes[1], ingest: ingests[0] })
      await createThingResource({ context, thingType: thingTypes[2], ingest: ingests[2] })
      await createThingResource({ context, thingType: thingTypes[1], ingest: ingests[1] })
    })

    after(async function () {
      await cleanup()
    })

    it('should return all things and 200', async function () {
      context.response = await context.request.get(`/v1/thing`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(3)
    })

    it('should return searched things by same type 200', async function () {
      context.response = await context.request.get(`/v1/thing?type=${thingTypes[1].name}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(2)
      expect(context.response.body[0].type).to.equal(thingTypes[1].name)
      expect(context.response.body[1].type).to.equal(thingTypes[1].name)
    })

    it('should return 200', async function () {
      context.response = await context.request.get(`/v1/thing?type=thingTypeZero`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.deep.equal([])
    })

    it('should return searched thing by ingest 200', async function () {
      context.response = await context.request.get(`/v1/thing?ingest=${ingests[1].name}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(1)
      expect(context.response.body[0].type).to.equal(thingTypes[1].name)
    })

    it('should return 200', async function () {
      context.response = await context.request.get(`/v1/thing?ingest=ingestZero`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.deep.equal([])
    })

    it('should return searched thing by ingestId 200', async function () {
      context.response = await context.request.get(`/v1/thing?ingestId=${ingests[2].name}Id`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(1)
      expect(context.response.body[0].type).to.equal(`${thingTypes[2].name}`)
    })

    it('should return 200', async function () {
      context.response = await context.request.get(`/v1/thing?ingestId=ingestZeroId`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.deep.equal([])
    })
  })

  describe('POST thing', function () {
    const context = {}

    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid type)', async function () {
      const type = { name: 'typeOne' }
      context.response = await context.request.post(`/v1/thing`).send({
        type: type.name,
        metadata: {},
      })

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 400 (invalid request body', async function () {
      const type = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(type)

      context.response = await context.request.post(`/v1/thing`).send({})

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 201', async function () {
      const type = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(type)

      const thing = {
        type: type.name,
        metadata: {},
      }
      context.response = await context.request.post(`/v1/thing`).send(thing)

      expect(context.response.status).to.equal(201)
      expect(context.response.body.type).to.equal('typeOne')
    })
  })

  describe('GET thing', function () {
    const context = {}

    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      context.response = await context.request.get(`/v1/thing/000a0000-a00a-00a0-a000-00000000000`)

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      context.response = await context.request.get(`/v1/thing/000a0000-a00a-00a0-a000-000000000000`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const type = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(type)

      const { body } = await context.request.post(`/v1/thing`).send({
        type: type.name,
        metadata: {},
      })

      context.response = await context.request.get(`/v1/thing/${body.id}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.type).to.equal('typeOne')
    })
  })

  describe('PUT thing', function () {
    const context = {}

    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      context.response = await context.request.put(`/v1/thing/000a0000-a00a-00a0-a000-0000000000`)

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 400 (invalid request body)', async function () {
      context.response = await context.request.put(`/v1/thing/000a0000-a00a-00a0-a000-000000000000`).send()

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      context.response = await context.request.put(`/v1/thing/000a0000-a00a-00a0-a000-000000000000`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const typeOne = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(typeOne)
      const typeTwo = { name: 'typeTwo' }
      await context.request.post(`/v1/thingType`).send(typeTwo)

      const { body } = await context.request.post(`/v1/thing`).send({
        type: typeOne.name,
        metadata: {},
      })

      const thingTwo = {
        type: typeTwo.name,
        metadata: { name: 'updatedThing' },
      }
      context.response = await context.request.put(`/v1/thing/${body.id}`).send(thingTwo)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.type).to.equal('typeTwo')
    })

    it('should return 400 (invalid type)', async function () {
      const type = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(type)

      const { body } = await context.request.post(`/v1/thing`).send({
        type: type.name,
        metadata: {},
      })
      const updatedThing = {
        type: 'typeZero',
        metadata: { name: 'updatedThing' },
      }

      context.response = await context.request.put(`/v1/thing/${body.id}`).send(updatedThing)

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })
  })

  describe('DELETE thing', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      context.response = await context.request.delete(`/v1/thing/000a0000-a00a-00a0-a000-0000000000`)

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist))', async function () {
      context.response = await context.request.delete(`/v1/thing/000a0000-a00a-00a0-a000-000000000000`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 204', async function () {
      const typeOne = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(typeOne)

      const { body } = await context.request.post(`/v1/thing`).send({
        type: typeOne.name,
        metadata: {},
      })

      context.response = await context.request.delete(`/v1/thing/${body.id}`)

      expect(context.response.status).to.equal(204)
      expect(context.response.body).to.deep.equal({})
    })
  })
})
