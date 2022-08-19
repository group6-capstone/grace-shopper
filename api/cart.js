require("dotenv").config();
const express = require("express");
const { requireUser } = require("./utils");
const cartRouter = express.Router();
const {
  addItemToCart,
  getMyCartWithItems,
  deleteItemFromCart,
  createUserCart,
  createGuestCart,
} = require("../db/models/cart");

cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");
  next();
});

// Gets a user's cart
cartRouter.get("/myCart", requireUser, async (req, res, next) => {
  const userId = req.user.id;
  console.log("userId: ", userId);
  try {
    const myCart = await getMyCartWithItems(userId);
    if (myCart.length !== 0){
      res.send(myCart)
    } else {
      res.send("There is no cart")
    }
  } catch (error) {
    next(error);
  }
});

// Create a user's cart
cartRouter.post("/newUserCart", async (req, res, next) => {
  const { user_id, order_status } = req.body
  try {
    const newCart = await createUserCart({
      user_id: user_id,
      order_status: "active",
    });
    res.send(newCart);
  } catch (error) {
    next(error);
  }
});

// Create a guest cart
cartRouter.post("/newGuestCart", async (req, res, next) => {
  const { sessionID } = req;
  try {
    const guestCart = await createGuestCart({
      session_id: sessionID,
      order_status: "active",
    });
    res.send(guestCart);
  } catch (error) {
    next(error);
  }
});

// Adds item to a cart
cartRouter.post("/", async (req, res, next) => {
  // const userId = req.user.id;
  const { product_id, priceAtPurchase, cart_id } = req.body;
  try {
    const newItem = await addItemToCart({
      product_id,
      priceAtPurchase,
      cart_id,
    });
    res.send(newItem);
  } catch (error) {
    next(error);
  }
});

// Deletes item from a cart
cartRouter.delete("/", async (req, res, next) => {
  const { cartedItemId } = req.body;
  console.log("This is request body: ", req.body);

  // console.log(req.user)
  console.log("this is carted item id in the api: ", cartedItemId);
  try {
    console.log("test");
    const deletedItem = await deleteItemFromCart(cartedItemId);
    res.send(deletedItem);
  } catch (error) {
    next(error);
  }
});

module.exports = cartRouter;