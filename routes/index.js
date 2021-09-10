const { Router } = require("express");
const axios = require("axios");
const router = Router();
const { client } = require("../db/dbConnect");
const ObjectID = require("mongodb").ObjectID;

const isAuth = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.status(401).json({ msg: "Log in first" });
};

router.get("/allCards", async (req, res, next) => {
  const cards = await axios.get(`${process.env.YGO_API}/cardinfo.php?`);
  res.status(200).json({ cards: cards.data.data });
});

router.post("/selectRole", async (req, res, next) => {
  try {
    const id = new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { role: req.body.role } }
    );
    res.status("200").json({ message: `Todo ha salido bien, redirigiendo!` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.put("/storeExtraInfo", async (req, res, next) => {
  try {
    const {
      storeName,
      street,
      postalCode,
      number,
      city,
      facebookLink,
      instagramLink,
      twitterLink,
      phoneNumber,
    } = req.body;
    const id = await new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          storeName,
          address: {
            street,
            postalCode,
            number,
            city,
          },
          contact: {
            facebookLink,
            instagramLink,
            twitterLink,
            phoneNumber,
          },
        },
      }
    );
    res.status(200).json({ message: "Registro exitoso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.put("/updateStoreExtraInfo", async (req, res, next) => {
  try {
    const {
      storeName,
      street,
      postalCode,
      number,
      city,
      facebookLink,
      instagramLink,
      twitterLink,
      phoneNumber,
    } = req.body;
    const id = await new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          storeName,
          address: {
            street,
            postalCode,
            number,
            city,
          },
          contact: {
            facebookLink,
            instagramLink,
            twitterLink,
            phoneNumber,
          },
        },
      }
    );
    res
      .status(200)
      .json({
        message:
          "La información sera actualziada la proxima vez que inicies sesión",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.post("/getStoreById", async (req, res, next) => {
  try {
    const id = await new ObjectID(req.body.id);
    const collection = await client
      .db(process.env.MONGO_DB_NAME)
      .collection("users");
    const user = await collection.findOne({ _id: id });
    res.status("200").json({
      store: {
        address: user.address,
        contact: user.contact,
        storeName: user.storeName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.get("/getAllArchetypes", async (req, res, next) => {
  try {
    const response = await axios.get(`${process.env.YGO_API}/archetypes.php`);
    res.status(200).json({archetypes: response.data});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
