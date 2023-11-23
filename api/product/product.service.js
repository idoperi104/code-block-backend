const dbService = require("../../services/db.service")
const logger = require("../../services/logger.service")
const utilService = require("../../services/util.service")
const ObjectId = require("mongodb").ObjectId

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    const sortCriteria = _buildSortCriteria(filterBy)
    const collection = await dbService.getCollection("product")
    var products = await collection
      .find(criteria)
      .sort(sortCriteria)
      .limit(filterBy.amount)
      .toArray()
    return products
  } catch (err) {
    logger.error("cannot find products", err)
    throw err
  }
}

async function getById(productId) {
  try {
    const collection = await dbService.getCollection("product")
    const product = collection.findOne({ _id: ObjectId(productId) })
    return product
  } catch (err) {
    logger.error(`while finding product ${productId}`, err)
    throw err
  }
}

async function remove(productId) {
  try {
    const collection = await dbService.getCollection("product")
    await collection.deleteOne({ _id: ObjectId(productId) })
    return productId
  } catch (err) {
    logger.error(`cannot remove product ${productId}`, err)
    throw err
  }
}

async function add(product) {
  try {
    const collection = await dbService.getCollection("product")
    await collection.insertOne(product)
    return product
  } catch (err) {
    logger.error("cannot insert product", err)
    throw err
  }
}

async function update(product) {
  try {
    const productToSave = {
      name: product.name,
      desc: product.desc,
      imgUrl: product.imgUrl,
      category: product.category,
      price: product.price,
      isInStock: product.isInStock,
      salesAmount: product.salesAmount,
    }
    const collection = await dbService.getCollection("product")
    await collection.updateOne(
      { _id: ObjectId(product._id) },
      { $set: productToSave }
    )
    return product
  } catch (err) {
    logger.error(`cannot update product ${product._id}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.name) {
    const nameCriteria = { $regex: filterBy.name, $options: "i" }
    criteria.name = nameCriteria
  }
  if (filterBy.category) {
    criteria.category = filterBy.category
  }
  if (filterBy.stock) {
    switch (filterBy.stock) {
      case "inStock":
        criteria.isInStock = true
        break
      case "outOfStock":
        criteria.isInStock = false
        break
      default:
        break
    }
  }

  return criteria
}

function _buildSortCriteria(filterBy) {
  const criteria = {}

  if (filterBy.sortBy) {
    switch (filterBy.sortBy) {
      case "salesAmount":
        criteria.salesAmount = -1
        break
      default:
        break
    }
  } else {
    criteria.name = 1
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
