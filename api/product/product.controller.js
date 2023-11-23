const productService = require('./product.service.js')

const logger = require('../../services/logger.service.js')

async function getProducts(req, res) {
  try {
    logger.debug('Getting Products')
    const filterBy = {
      name: req.query.name || '',
      category: req.query.category || '',
      stock: req.query.stock || '',
      sortBy: req.query.sortBy || '',
      amount: Number(req.query.amount) || 0,
    }
    const products = await productService.query(filterBy)
    res.json(products)
  } catch (err) {
    logger.error('Failed to get products', err)
    res.status(500).send({ err: 'Failed to get products' })
  }
}

async function getProductById(req, res) {
  try {
    const productId = req.params.id
    const product = await productService.getById(productId)
    res.json(product)
  } catch (err) {
    logger.error('Failed to get product', err)
    res.status(500).send({ err: 'Failed to get product' })
  }
}

async function addProduct(req, res) {
  const {loggedinUser} = req

  try {
    const product = req.body
    const addedProduct = await productService.add(product)
    res.json(addedProduct)
  } catch (err) {
    logger.error('Failed to add product', err)
    res.status(500).send({ err: 'Failed to add product' })
  }
}


async function updateProduct(req, res) {
  try {
    const product = req.body
    const updatedProduct = await productService.update(product)
    res.json(updatedProduct)
  } catch (err) {
    logger.error('Failed to update product', err)
    res.status(500).send({ err: 'Failed to update product' })

  }
}

async function removeProduct(req, res) {
  try {
    const productId = req.params.id
    const removedId = await productService.remove(productId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove product', err)
    res.status(500).send({ err: 'Failed to remove product' })
  }
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  removeProduct,
}
