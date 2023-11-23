const dbService = require("../../services/db.service")
const logger = require("../../services/logger.service")
const utilService = require("../../services/util.service")
const ObjectId = require("mongodb").ObjectId

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection("codeblock")
    var codeblocks = await collection
      .find(criteria)
      .sort({ title: 1 })
      .toArray()
    return codeblocks
  } catch (err) {
    logger.error("cannot find codeblocks", err)
    throw err
  }
}

async function getById(codeblockId) {
  try {
    const collection = await dbService.getCollection("codeblock")
    const codeblock = collection.findOne({ _id: ObjectId(codeblockId) })
    return codeblock
  } catch (err) {
    logger.error(`while finding codeblock ${codeblockId}`, err)
    throw err
  }
}

async function remove(codeblockId) {
  try {
    const collection = await dbService.getCollection("codeblock")
    await collection.deleteOne({ _id: ObjectId(codeblockId) })
    return codeblockId
  } catch (err) {
    logger.error(`cannot remove codeblock ${codeblockId}`, err)
    throw err
  }
}

async function add(codeblock) {
  try {
    const collection = await dbService.getCollection("codeblock")
    await collection.insertOne(codeblock)
    return codeblock
  } catch (err) {
    logger.error("cannot insert codeblock", err)
    throw err
  }
}

async function update(codeblock) {
  try {
    const codeblockToSave = {
      name: codeblock.name,
      desc: codeblock.desc,
      imgUrl: codeblock.imgUrl,
      category: codeblock.category,
      price: codeblock.price,
      isInStock: codeblock.isInStock,
      salesAmount: codeblock.salesAmount,
    }
    const collection = await dbService.getCollection("codeblock")
    await collection.updateOne(
      { _id: ObjectId(codeblock._id) },
      { $set: codeblockToSave }
    )
    return codeblock
  } catch (err) {
    logger.error(`cannot update codeblock ${codeblock._id}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.title) {
    const nameCriteria = { $regex: filterBy.name, $options: "i" }
    criteria.name = nameCriteria
  }
  return criteria
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
}
