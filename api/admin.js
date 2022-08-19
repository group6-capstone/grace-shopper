require('dotenv').config();
const express = require("express");

//const jwt = require('jsonwebtoken')
//const { JWT_SECRET } = process.env;
const { requireUser, requireAdmin } = require('./utils')
const adminRouter = express.Router();
const { getAllProducts,
    getProductById,
    createProduct,
    deactivateProduct,
    getAllUsers,
    getUserById,
    updateProduct } = require('../db/models')


adminRouter.get('/', requireAdmin, (req, res, next) => {
    res.send("A request is being made to /admin");
    next();
})


adminRouter.get('/users/:userId', requireAdmin, async (req, res, next) => {
  const {userId} = req.params;
  try {
    const user = await getUserById(userId)
    res.send(user);
  } catch (error) {
    next(error)
  }
})


adminRouter.get('/products', requireAdmin, async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (error) {
        next(error)
    }
})

adminRouter.post('/products', requireAdmin, async (req, res, next) => {
    const { name,
        price,
        category,
        quantity,
        img_url,
        condition,
        album_name,
        artist,
        description,
        genre,
        status = "" } = req.body;

    const productData = { name, 
        price,
        category,
        quantity,
        img_url,
        condition,
        album_name,
        artist,
        description,
        genre,
        status };

    console.log("ProductData: ", productData)
    try {
        const newProduct = await createProduct(productData);
        if (newProduct) {
            res.send(newProduct)
            next();
        } else {
            next({
                name: 'FailedCreateProduct',
                message: "Could not create new product with provided details"
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})

// adminRouter.patch('/deactivate/:productId', requireAdmin, async (req, res, next) => {
// //   const { productId } = req.params;
  
// //   try {
// //     const deletedProduct = await deactivateProduct(productId)
// //     res.send(deletedProduct)
// //   } catch (error) {
// //     next(error)
// //   }
// })

adminRouter.patch('/products/:productId', requireAdmin, async (req, res, next) => {
    const { productId } = req.params;
    const { name, 
            price, 
            category, 
            quantity, 
            img_url, 
            condition, 
            album_name, 
            artist, 
            description, 
            genre,
            status } = req.body;
      const updateFields = {};

      updateFields.id = Number(productId)

      if (name) {
        updateFields.name = name;
      }
      if (price) {
        updateFields.price = price;
      }
      if (category) {
        updateFields.category= category;
      }
      if (quantity) {
        updateFields.quantity= quantity;
      }
      if (img_url) {
        updateFields.img_url = img_url;
      }
      if (condition) {
        updateFields.condition = condition;
      }
      if (album_name) {
        updateFields.album_name = album_name
      }
      if (artist) {
        updateFields.artist = artist
      }
      if (description) {
        updateFields.description = description
      }
      if (genre) {
        updateFields.genre = genre
      }
      if (status) {
        updateFields.status = status
      }

      try {
 
        console.log("Updatefields: ", updateFields)
        const updatedProduct = await updateProduct(updateFields);

        res.send(updatedProduct)
     } 
      catch ({name, message}) {
        next({name, message})
      }
  })



adminRouter.get('/users', requireAdmin, async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.send(users);
    } catch (error) {
        next(error)
    }
})



module.exports = adminRouter;