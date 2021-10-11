const { describe, before, it } = require('mocha')
const { expect } = require('chai')
const { setupServer } = require('./helpers/server')
const { cleanup } = require('./seeds/things')
const { API_MAJOR_VERSION } = require('../app/env')

describe('Ingests', function () {
  describe('GET ingests', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 200', async function () {
      const ingest = { name: 'ingestOne' }
      await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingest)

      context.response = await context.request.get(`/${API_MAJOR_VERSION}/ingest`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(1)
      expect(context.response.body[0].name).to.equal(ingest.name)
    })
  })

  describe('GET ingest', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 404 (ingest does not exist)', async function () {
      context.response = await context.request.get(`/${API_MAJOR_VERSION}/ingest/ingestZero`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const ingestOne = { name: 'ingestOne' }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestOne)

      context.response = await context.request.get(`/${API_MAJOR_VERSION}/ingest/${body.name}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.name).to.equal('ingestOne')
    })
  })

  describe('POST ingest', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid request body)', async function () {
      context.response = await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send({})

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 201', async function () {
      const ingest = { name: 'ingestOne' }
      context.response = await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingest)

      expect(context.response.status).to.equal(201)
      expect(context.response.body.name).to.equal('ingestOne')
    })

    it('should return 409 (ingest exists)', async function () {
      const ingest = { name: 'ingestOne' }

      context.response = await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingest)

      expect(context.response.status).to.equal(409)
      expect(context.response.body).to.deep.equal({})
    })
  })

  describe('PUT ingest', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid request body)', async function () {
      context.response = await context.request.put(`/${API_MAJOR_VERSION}/ingest/ingestZero`).send({})

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404 (ingest does not exist)', async function () {
      context.response = await context.request.put(`/${API_MAJOR_VERSION}/ingest/ingestZero`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const ingestOne = { name: 'ingestOne' }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestOne)

      const ingestTwo = { name: 'ingestTwo' }
      context.response = await context.request.put(`/${API_MAJOR_VERSION}/ingest/${body.name}`).send(ingestTwo)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.name).to.equal('ingestTwo')
    })
  })

  describe('DELETE ingest', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 404 (ingest does not exist)', async function () {
      context.response = await context.request.delete(`/${API_MAJOR_VERSION}/ingest/ingestZero`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const ingestOne = { name: 'ingestOne' }
      const { body } = await context.request.post(`/${API_MAJOR_VERSION}/ingest`).send(ingestOne)

      context.response = await context.request.delete(`/${API_MAJOR_VERSION}/ingest/${body.name}`)

      expect(context.response.status).to.equal(204)
      expect(context.response.body).to.deep.equal({})
    })
  })
})
