const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../db');
const Client = require('../models/client');
const { update } = require('../models/client');

//endpoint to add Client 
router.post("/", async (req, res) => {
    try {
      const { firstname, lastname, streetAddress, city } = req.body;
      db.getConnection().then(async () => {
        const client = new Client({
          firstname,
          lastname,
          streetAddress,
          city
        });

        client.save();
        res.status(200).json(client);
      });
    } catch (err) {
      console.log(err);
      return res.json(status);
    }
  });

//Endpoint to find all clients
router.get('/', async (req, res) => {
    try {
        // 1. return clients from database instead
        let clients = await Client.find().exec();
        res.json(clients);
    } catch (err) {
        console.log({ message: err })
    };
});

//endpoint to Update the client
router.put("/:id", async (req, res) => {
    const _id = req.params.id;
    const currentClient = req.body;
  
    try {
      const updatedClient = await Client.findByIdAndUpdate(
        {
          _id,
          firstname: update.firstname,
          lastname: update.lastname,
          cityAddress: update.cityAddress,
          city: update.city,
        },
        currentClient,
        {
          new: true,
          useFindAndModify: false,
        }
      );
      res.send(updatedClient);
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  });

/*
, {
            'firstname' : update.firstname,
            'lastname'  : update.lastname,
            'streetAddres' : update.streetAddress,
            'city' : update.city
        }
*/
    
//{$set: Client}

//the endpoint to delete a client.
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndRemove({
            _id: req.params.id
        });
        res.send(client)

    } catch (error) {
      console.log(error);
      return res.sendStatus(500)  
    }
  })


//returns a certain Client by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if(!id){
      return res.status(401).json({message: "No id provided"})
    }
    console.log(id)
      try {
          const client = await Client.findById(id);
          res.json(client);
      }
      catch (err) {
          console.log({ message: err });
      };
  });




module.exports = router;