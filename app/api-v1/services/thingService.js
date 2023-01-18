import validator from 'validator'
import {
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
  removeThingIngestByThingIdAndIngest,
  updateThingIngestByThingIdAndIngest,
  addThingIngest,
  findThingIngestByThingIdAndIngest,
  findThingIngestByIngestId,
  findThingIngestByThingId,
  removeIngest,
  updateIngest,
  addIngest,
  findIngestByName,
  findIngests,
} from '../../db.js'

async function getThings({ type, ingest, ingestId }) {
  const result = await findThings({ type, ingest, ingestId })

  return {
    statusCode: 200,
    result,
  }
}

async function getThingById({ id }) {
  if (!id || !validator.isUUID(id)) return { statusCode: 400, result: {} }

  const things = await findThingById({ id })

  if (things.length === 0) {
    return { statusCode: 404, result: {} }
  } else {
    const result = things[0]
    return { statusCode: 200, result }
  }
}

async function postThing(reqBody) {
  const { statusCode: resultCode } = await getThingTypeByName({ name: reqBody.type })
  if (resultCode === 404) {
    return { statusCode: 400, result: {} }
  } else {
    const createdResult = await addThing(reqBody)

    const result = createdResult.length === 1 ? createdResult[0] : {}

    return { statusCode: 201, result }
  }
}

async function putThing({ id }, reqBody) {
  if (!reqBody) {
    return { statusCode: 400, result: {} }
  }

  const { type, metadata } = reqBody
  const { statusCode } = await getThingById({ id })
  if (statusCode === 400 || statusCode === 404) return { statusCode, result: {} }

  const { statusCode: resultCode } = await getThingTypeByName({ name: reqBody.type })
  if (resultCode === 400 || resultCode === 404) return { statusCode: 400, result: {} }

  const updatedResult = await updateThing({ id, type, metadata })
  const result = updatedResult.length === 1 ? updatedResult[0] : {}

  return { statusCode: 200, result }
}

async function deleteThing({ id }) {
  const { statusCode: resultCode } = await getThingById({ id })
  if (resultCode === 400 || resultCode === 404) return { statusCode: resultCode, result: {} }

  await removeThing({ id })

  return { statusCode: 204 }
}

async function getThingTypes() {
  const result = await findThingTypes()

  return { statusCode: 200, result }
}

async function getThingTypeByName({ name }) {
  const thingTypes = await findThingTypeByName({ name })

  const statusCode = thingTypes.length === 0 ? 404 : 200
  const result = statusCode === 404 ? {} : thingTypes[0]

  return { statusCode, result }
}

async function postThingType(reqBody) {
  const { name } = reqBody
  const { statusCode: resultCode } = await getThingTypeByName({ name })
  if (resultCode === 200) return { statusCode: 409, result: {} }

  const createdThingType = await addThingType(reqBody)
  const result = createdThingType.length === 1 ? createdThingType[0] : {}

  return { statusCode: 201, result }
}

async function putThingType({ name }, reqBody) {
  const { statusCode: resultCodeOne } = await getThingTypeByName({ name })
  if (resultCodeOne === 404) return { statusCode: 404, result: {} }

  if (name !== reqBody.name) {
    const { statusCode: resultCodeTwo } = await getThingTypeByName({ name: reqBody.name })
    if (resultCodeTwo === 200) return { statusCode: 409, result: {} }
  }

  const updatedThingType = await updateThingType({ name }, reqBody)
  const result = updatedThingType.length === 1 ? updatedThingType[0] : {}

  return { statusCode: 200, result }
}

async function deleteThingType({ name }) {
  const { statusCode: resultCode } = await getThingTypeByName({ name })
  if (resultCode === 404) return { statusCode: 404, result: {} }

  await removeThingType({ name })

  return { statusCode: 204 }
}

async function getIngests() {
  const result = await findIngests()

  return { statusCode: 200, result }
}

async function getIngestByName({ name }) {
  const ingests = await findIngestByName({ name })

  ingests.filter((ingest) => {
    if (ingest.name === name) return ingest
  })

  const statusCode = ingests.length === 0 ? 404 : 200
  const result = statusCode === 200 ? ingests[0] : {}

  return { statusCode, result }
}

async function postIngest(reqBody) {
  if (!reqBody) return { statusCode: 400, result: {} }

  const { name } = reqBody
  const { statusCode: resultCode } = await getIngestByName({ name })
  if (resultCode === 200) return { statusCode: 409, result: {} }

  const createdIngest = await addIngest({ name })
  const result = createdIngest.length === 1 ? createdIngest[0] : {}

  return { statusCode: 201, result }
}

async function putIngest({ name }, reqBody) {
  if (!reqBody) return { statusCode: 400, result: {} }

  const { statusCode: resultCodeOne } = await getIngestByName({ name })
  if (resultCodeOne === 404) return { statusCode: 404, result: {} }

  if (name !== reqBody.name) {
    const { statusCode: resultCodeTwo } = await getIngestByName({ name: reqBody.name })
    if (resultCodeTwo === 200) return { statusCode: 409, result: {} }
  }

  const updatedIngest = await updateIngest({ name }, reqBody)

  return { statusCode: 200, result: updatedIngest[0] }
}

async function deleteIngest({ name }) {
  const { statusCode: resultCode } = await getIngestByName({ name })
  if (resultCode === 404) return { statusCode: 404, result: {} }

  await removeIngest({ name })

  return { statusCode: 204 }
}

async function getThingIngests({ thingId }) {
  if (!thingId || !validator.isUUID(thingId)) return { statusCode: 400, result: [] }

  const { statusCode: thingResultCode } = await getThingById({ id: thingId })

  if (thingResultCode === 400 || thingResultCode === 404) {
    return { statusCode: thingResultCode, result: [] }
  }

  const { statusCode, result } = await getThingIngestByThingId({
    thingId,
  })

  return { statusCode, result }
}

async function getThingIngestByThingId({ thingId }) {
  if (!thingId || !validator.isUUID(thingId)) return { statusCode: 400, result: {} }

  const result = await findThingIngestByThingId({ thingId })

  return { statusCode: 200, result }
}

async function getThingIngestByIngestId({ ingest, ingestId }) {
  if (!ingest || !ingestId) return { statusCode: 400, result: {} }

  const result = await findThingIngestByIngestId({ ingest, ingestId })

  return { statusCode: 200, result }
}

async function getThingIngestByThingIdAndIngest({ thingId, ingest }) {
  if (!thingId || !validator.isUUID(thingId)) return { statusCode: 400, result: {} }

  const result = await findThingIngestByThingIdAndIngest({ thingId, ingest })

  if (result.length === 0) {
    return { statusCode: 404, result: {} }
  } else {
    return { statusCode: 200, result: result[0] }
  }
}

async function postThingIngest({ thingId }, reqBody) {
  const { statusCode: thingResultCode } = await getThingById({ id: thingId })
  if (thingResultCode === 400 || thingResultCode === 404) {
    return { statusCode: thingResultCode, result: {} }
  }

  const { statusCode: thingIngestByThingResultCode } = await getThingIngestByThingIdAndIngest({
    thingId,
    ingest: reqBody.ingest,
  })
  if (thingIngestByThingResultCode === 200) {
    return { statusCode: 409, result: {} }
  }

  const { statusCode: thingIngestByIngestResultCode, result: existingThingIngests } = await getThingIngestByIngestId({
    ingest: reqBody.ingest,
    ingestId: reqBody.ingestId,
  })
  if (thingIngestByIngestResultCode !== 200) {
    return { statusCode: thingIngestByIngestResultCode, result: {} }
  }
  if (existingThingIngests.length !== 0) {
    return { statusCode: 409, result: {} }
  }

  await addThingIngest({ thingId }, reqBody)

  return { statusCode: 201, result: reqBody }
}

async function putThingIngestByThingIdAndIngest({ thingId, ingest }, reqBody) {
  if (!reqBody || reqBody.ingestId === '') {
    return { statusCode: 400, result: {} }
  }

  const { statusCode: resultCodeOne } = await getThingIngestByThingIdAndIngest({ thingId, ingest })
  if (resultCodeOne !== 200) return { statusCode: resultCodeOne, result: {} }

  const { result: thingIngestResult } = await getThingIngestByIngestId({
    ingest,
    ingestId: reqBody.ingestId,
  })
  if (thingIngestResult.length !== 0) return { statusCode: 409, result: {} }

  await updateThingIngestByThingIdAndIngest({ thingId, ingest }, reqBody)

  return { statusCode: 200, result: { ingest, ...reqBody } }
}

async function deleteThingIngestByThingIdAndIngest({ thingId, ingest }) {
  const { statusCode: resultCodeOne } = await getThingIngestByThingIdAndIngest({ thingId, ingest })
  if (resultCodeOne !== 200) return { statusCode: resultCodeOne, result: {} }

  await removeThingIngestByThingIdAndIngest({ thingId, ingest })

  return { statusCode: 204 }
}

export default {
  getThings,
  getThingById,
  postThing,
  putThing,
  deleteThing,
  postThingType,
  putThingType,
  getThingTypes,
  getThingTypeByName,
  deleteThingType,
  getIngests,
  getIngestByName,
  postIngest,
  putIngest,
  deleteIngest,
  getThingIngests,
  getThingIngestByThingIdAndIngest,
  postThingIngest,
  putThingIngestByThingIdAndIngest,
  deleteThingIngestByThingIdAndIngest,
}
