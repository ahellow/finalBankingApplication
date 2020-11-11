const express = require('express');
const router = express.Router();
const db = require('../db');
const Account = require('../models/account');

// curl localhost/accounts
//Endpoint for all users
router.get('/', async (req, res) => {
    try {
        // 1. return accounts from database instead
        let accounts = await Account.find().exec();
        res.json(accounts);
    } catch (err) {
        console.log({ message: err })
    };
});

// use postman or curl -d data=example1&data2=example2 http://URL/example.cgi
//endpoint to add user 
router.post("/", async (req, res) => {
    try {
      const { client_id, balance, alias } = req.body;
      db.getConnection().then(async () => {
        const user = new Account({
          //enter correct fields
          client_id,
          balance,
          alias
        });

        user.save();
        return res.status(200).send(user);
      });
    } catch (err) {
      console.log(`err: ${err}`);
    }
  });


// Implement a new endpoint, that will be able to return a specific account by id.
//returns a certain account by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if(!id){
    return res.status(401).json({message: "No id provided"})
  }
  console.log(id)
    try {
        const account = await Account.findById(id);
        res.json(account);
    }
    catch (err) {
        console.log({ message: err });
    };
});

//gets the individual account balance and name/alias
router.get('/:id/balance', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        return res.send(`Hey ;) The balance of your ${account.alias} account is: ${account.balance}Dkk`);
    }
    catch (err) {
        console.log({ message: err });
    };
    
});



//the endpoint to delete an account.
router.delete('/:id', async (req, res) => {
    try {
        const account = await Account.findByIdAndRemove({
            Id: req.params.id
        });
        res.send(account)

    } catch (error) {
      console.log(error);
      return res.sendStatus(200)  
    }
  })

  //the endpoint for depositing to account 
  router.put("/:id/deposit", async (req, res) => {
    try {
      db.getConnection().then(async () => {
        const { deposit } = req.body;
        await Account.findById({ _id: req.params.id }, (err, user) => {
          if (err) console.log(err);
          else if (deposit !== null) {
            user.balance += Number(deposit);
            user.save();
            return res.send("Amount deposited  successfully");
          } else {
            return res.send("Please provide deposit amount");
          }
        });
      });
    } catch (err) {
      console.log({ message: err , message : 'Something went wrong'});
    }
  });

  //the endpoint for withdrawing
  router.put("/:id/withdraw", async (req, res) => {
    try {
      db.getConnection().then(async () => {
        const { withdraw } = req.body;
        await Account.findById({ _id: req.params.id }, (err, user) => {
          if (err) console.log(err);
          else if (user.balance >= Number(withdraw) && withdraw) {
            user.balance -= Number(withdraw);
            user.save();
            return res.send("Amount withdraw successfully");
          } else {
            return res.send("please provide withdraw amount");
          }
        });
      });
    } catch (err) {
      console.log({ message: err });
    }
  });
 
  //This is the endpoint for transferring money from one account to another
// Transfer money from one account to another.

router.post("/transfer/:senderId", async (req, res) => {
    try {
      db.getConnection().then(async () => {
        const { amount, receipientId } = req.body;
        await Account.findById(
          { _id: req.params.senderId },
          async (err, user) => {
            if (err) console.log(err);
            else
              await Account.findById({ _id: receipientId }, (err, receipt) => {
                if (err) console.log(err);
                else if (user.balance >= Number(amount)) {
                  user.balance -= Number(amount);
                  user.save();
                  receipt.balance += Number(amount);
                  receipt.save();
                  return res.send("transaction completed successfully");
                } else {
                  return res.send("Balance is low");
                }
              });
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  });
  

module.exports = router;