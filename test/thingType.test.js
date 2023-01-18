import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { setupServer } from './helpers/server.js'
import { cleanup } from './seeds/things.js'

describe('Thing Types', function () {
  describe('GET thing types', function () {
    const context = {}
    before(async function () {
      await setupServer(context)

      const type = { name: 'typeOne' }
      await context.request.post(`/v1/thingType`).send(type)

      context.response = await context.request.get(`/v1/thingType`)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 200', function () {
      expect(context.response.status).to.equal(200)
      expect(context.response.body).to.have.length(1)
      expect(context.response.body[0].name).to.equal('typeOne')
    })
  })

  describe('POST thing type', function () {
    const context = {}
    let type

    before(async function () {
      await setupServer(context)

      type = { name: 'typeOne' }
      context.response = await context.request.post(`/v1/thingType`).send(type)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 201', function () {
      expect(context.response.status).to.equal(201)
      expect(context.response.body.name).to.equal('typeOne')
    })

    it('should return 409', async function () {
      context.response = await context.request.post(`/v1/thingType`).send(type)

      expect(context.response.status).to.equal(409)
      expect(context.response.body).to.deep.equal({})
    })
  })

  describe('GET thing type', function () {
    const context = {}
    let thingType

    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 404', async function () {
      context.response = await context.request.get(`/v1/thingType/thingTypeZero`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      thingType = { name: 'typeOne' }
      const { body } = await context.request.post(`/v1/thingType`).send(thingType)

      context.response = await context.request.get(`/v1/thingType/${body.name}`)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.name).to.equal('typeOne')
    })
  })

  describe('PUT thing type', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 400 (invalid request body)', async function () {
      context.response = await context.request.put(`/v1/thingType/thingTypeZero`).send({})

      expect(context.response.status).to.equal(400)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 404', async function () {
      context.response = await context.request.put(`/v1/thingType/thingTypeZero`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 200', async function () {
      const typeOne = { name: 'typeOne' }
      const { body } = await context.request.post(`/v1/thingType`).send(typeOne)

      const typeTwo = { name: 'typeTwo' }
      const thingTwo = {
        name: typeTwo.name,
        metadata: { name: 'updatedThing' },
      }
      context.response = await context.request.put(`/v1/thingType/${body.name}`).send(thingTwo)

      expect(context.response.status).to.equal(200)
      expect(context.response.body.name).to.equal('typeTwo')
    })
  })

  describe('DELETE thing type', function () {
    const context = {}
    before(async function () {
      await setupServer(context)
    })

    after(async function () {
      await cleanup()
    })

    it('should return 404', async function () {
      context.response = await context.request.delete(`/v1/thingType/typeZero`)

      expect(context.response.status).to.equal(404)
      expect(context.response.body).to.deep.equal({})
    })

    it('should return 204', async function () {
      const typeOne = { name: 'typeOne' }
      const { body } = await context.request.post(`/v1/thingType`).send(typeOne)

      context.response = await context.request.delete(`/v1/thingType/${body.name}`)

      expect(context.response.status).to.equal(204)
      expect(context.response.body).to.deep.equal({})
    })
  })
})
