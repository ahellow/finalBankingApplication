const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../db');
const Client = require('../models/client');

//endpoint to add Client 
router.post("/", async (req, res) => {
    try {
      const { firstname, lastname, streetAddress, city } = req.body;
      db.getConnection().then(async () => {
        const client = new Client({
          //enter correct fields
          firstname,
          lastname,
          streetAddress,
          city
        });

        client.save();
        res.status(201).json(client);
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

//endpoint to update client by id 
router.put("/:id", async (req, res) => {
    const client = req.params.body;

    try {
        db.getConnection().then(async () => {
            const updatedClient = await Client.findByIdAndUpdate({query, set : client}); 
            return res.status(204).json(updatedClient)
        });
        } catch (err) {
            console.log(err);
    }
});
    
//{$set: Client}

//the endpoint to delete an account.
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

module.exports = router;