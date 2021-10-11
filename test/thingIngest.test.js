const { describe, before, it } = require('mocha')
const { expect } = require('chai')
const { setupServer } = require('./helpers/server')
const { cleanup } = require('./seeds/things')
const { API_MAJOR_VERSION } = require('../app/env')

describe('ThingIngests', function () {
  describe('GET thing ingests', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      context.response = await context.request.get(
        `/${API_MAJOR_VERSION}/thing/000a0000-a00a-00a0-a000-00000000000/ingest`
      )

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal([])
    })

    it('should return 404 (thing does not exist)', async function () {
      context.response = await context.request.get(
        `/${API_MAJOR_VERSION}/thing/000a0000-a00a-00a0-a000-000000000000/ingest`
      )

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal([])
    })

    it('should return 200', async function () {
      const type = { name: 'typeOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(type)
      const ingest = { name: 'ingestOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingest)

      const thing = {
        type: type.name,
        metadata: {},
      }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/thing`).send(thing)

      const thingIngest = {
        thingId: body.id,
        ingest: ingest.name,
        ingestId: 'ingestOneId',
        configuration: {},
      }

      await context.request.post(`/${API_MAJOR_VERSION}/thing/${body.id}/ingest`).send(thingIngest)

      context.response = await context.request.get(`/${API_MAJOR_VERSION}/thingType`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(1)
      expect(context.response.body[0]).to.deep.equal(type)
    })
  })

  describe('POST thing ingests', function () {
    const context = {}
    let thingId
    let ingest
    let ingestId

    before(async function () {
      await setupServer(context)

      ingest = { name: 'ingestOne' }
      ingestId = 'ingestOneId'
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      const thingId = '000a0000-a00a-00a0-a000-00000000000'
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      context.response = await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      const thingId = '000a0000-a00a-00a0-a000-000000000000'
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      context.response = await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 201', async function () {
      const type = { name: 'typeOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(type)
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingest)

      const thing = {
        type: type.name,
        metadata: {},
      }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/thing`).send(thing)
      thingId = body.id

      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }

      context.response = await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      expect(context.response.status).to.equal(201)
      expect(context.response.body.ingestId).to.equal('ingestOneId')
    })

    it('should return 409', async function () {
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      context.response = await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      expect(context.response.status).to.equal(409)
      expect(context.response.body).to.deep.equal({})
    })
  })

  describe('GET thing ingest', function () {
    const context = {}
    let thingId
    let ingest
    let ingestId

    before(async function () {
      await setupServer(context)

      const type = { name: 'typeOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(type)
      ingest = { name: 'ingestOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingest)

      const thing = {
        type: type.name,
        metadata: {},
      }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/thing`).send(thing)
      thingId = body.id

      ingestId = 'ingestOneId'
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      const invalidThingId = '000a0000-a00a-00a0-a000-00000000000'
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.get(
        `/${API_MAJOR_VERSION}/thing/${invalidThingId}/ingest/${ingest.name}`
      )

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      const invalidThingId = '000a0000-a00a-00a0-a000-000000000000'
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.get(
        `/${API_MAJOR_VERSION}/thing/${invalidThingId}/ingest/${ingest.name}`
      )

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      const invalidIngest = 'ingestZero'
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.get(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${invalidIngest}`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const thingIngest = {
        thingId: thingId,
        ingest: ingest.name,
        ingestId: ingestId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.get(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${ingest.name}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.ingestId).to.equal(ingestId)
    })
  })

  describe('PUT thing ingest', function () {
    const context = {}
    let thingId
    let ingestOne
    let ingestOneId
    let ingestTwo
    let thingIngestTwo

    before(async function () {
      await setupServer(context)
    })

    beforeEach(async function () {
      const typeOne = { name: 'typeOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(typeOne)
      ingestOne = { name: 'ingestOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestOne)
      const typeTwo = { name: 'typeTwo' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(typeTwo)
      ingestTwo = { name: 'ingestTwo' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestTwo)

      const thing = {
        type: typeOne.name,
        metadata: {},
      }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/thing`).send(thing)
      thingId = body.id

      ingestOneId = 'ingestOneId'
    })

    afterEach(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      const invalidThingId = '000a0000-a00a-00a0-a000-00000000000'
      const thingIngest = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.put(
        `/${API_MAJOR_VERSION}/thing/${invalidThingId}/ingest/${ingestOne.name}`
      )

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      const invalidThingId = '000a0000-a00a-00a0-a000-000000000000'
      const thingIngest = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.put(
        `/${API_MAJOR_VERSION}/thing/${invalidThingId}/ingest/${ingestOne.name}`
      )

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      const invalidIngest = 'ingestZero'
      const thingIngest = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request.put(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${invalidIngest}`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (ingest does not exist)', async function () {
      const invalidIngest = 'ingestZero'
      const thingIngest = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngest)

      context.response = await context.request
        .put(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${invalidIngest}`)
        .send(thingIngest)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const thingIngestOne = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngestOne)
      // thing ingest two props...
      const type = { name: 'typeTwo' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(type)
      ingestTwo = { name: 'ingestTwo' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestTwo)
      const ingestTwoId = 'ingestTwoId'
      thingIngestTwo = {
        thingId: thingId,
        ingest: ingestTwo.name,
        ingestId: ingestTwoId,
        configuration: {},
      }
      context.response = await context.request
        .put(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${ingestOne.name}`)
        .send(thingIngestTwo)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.ingestId).to.equal(ingestTwoId)
    })

    it('should return 400 (invalid ingestId)', async function () {
      thingIngestTwo = {
        thingId: thingId,
        ingest: ingestTwo.name,
        ingestId: '',
        configuration: {},
      }
      context.response = await context.request
        .put(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${ingestOne.name}`)
        .send(thingIngestTwo)

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 409 (ingestId exists)', async function () {
      const thingIngestOne = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngestOne)

      // thing ingest two props...
      const type = { name: 'typeTwo' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(type)
      const ingestTwo = { name: 'ingestTwo' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestTwo)
      // const ingestTwoId = 'ingestTwoId'
      const thingIngestTwo = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      context.response = await context.request
        .put(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${ingestOne.name}`)
        .send(thingIngestTwo)

      expect(context.response.status).to.equal(409)
      expect(context.response.body).to.deep.equal({})
    })
  })

  describe('DELETE thing ingest', function () {
    const context = {}
    let thingId
    let ingestOne
    let ingestOneId

    before(async function () {
      await setupServer(context)
    })

    beforeEach(async function () {
      const typeOne = { name: 'typeOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/thingType`).send(typeOne)
      ingestOne = { name: 'ingestOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestOne)

      const thing = {
        type: typeOne.name,
        metadata: {},
      }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/thing`).send(thing)
      thingId = body.id

      ingestOneId = 'ingestOneId'
    })

    afterEach(async function () {
      await cleanup()
    })

    it('should return 400 (invalid uuid)', async function () {
      const invalidThingId = '000a0000-a00a-00a0-a000-00000000000'
      await context.request.delete(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`)

      context.response = await context.request.put(
        `/${API_MAJOR_VERSION}/thing/${invalidThingId}/ingest/${ingestOne.name}`
      )

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (thing does not exist)', async function () {
      const invalidThingId = '000a0000-a00a-00a0-a000-000000000000'

      context.response = await context.request.delete(
        `/${API_MAJOR_VERSION}/thing/${invalidThingId}/ingest/${ingestOne.name}`
      )

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (ingest does not exist)', async function () {
      const invalidIngest = 'ingestZero'

      context.response = await context.request.delete(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${invalidIngest}`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (ingest does not exist)', async function () {
      const invalidIngest = 'ingestZero'

      context.response = await context.request.delete(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${invalidIngest}`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 204', async function () {
      const thingIngestOne = {
        thingId: thingId,
        ingest: ingestOne.name,
        ingestId: ingestOneId,
        configuration: {},
      }
      await context.request.post(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest`).send(thingIngestOne)

      context.response = await context.request.delete(`/${API_MAJOR_VERSION}/thing/${thingId}/ingest/${ingestOne.name}`)

      expect(context.response.status).to.equal(204)
      expect(context.response.body).to.deep.equal({})
    })
  })
})
