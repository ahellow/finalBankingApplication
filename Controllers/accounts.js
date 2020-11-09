const express = require('express');
const router = express.Router();
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
      const { firstname, lastname, balance, branch, accountType } = req.body;
      db.getConnection().then(async () => {
        const user = new Account({
          //enter correct fields
          firstname,
          lastname,
          balance,
          branch,
          accountType,
        });

        const message = 'Data recieved, updating user...'

        user.save();
        res.json(user, message);
      });
    } catch (err) {
      console.log(`err: ${err}`);
    }
  });


// Implement a new endpoint, that will be able to return a specific account by id.
//returns a certain account by id
router.get('/:id', async (req, res) => {
  const id = req.query.params.id;
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

//gets the individual users balance and name
router.get('/:id/balance', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        res.send(`Hey ${account.firstname} ;) The balance of your account is: ${account.balance}Dkk`);
    }
    catch (err) {
        console.log({ message: err });
    };
    
});


//the endpoint to delete a user.
router.delete('/:id', async (req, res) => {
    try {
        const account = await Account.findByIdAndRemove({
            _id: req.params.id
        });
        res.send(account)

    } catch (error) {
        res.send(500)
    }
  })

  //the endpoint for depositing to account 
  router.post("/:id/deposit", async (req, res) => {
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
            return res.send("please provide deposit amount");
          }
        });
      });
    } catch (err) {
      console.log({ message: err });
    }
  });

  //the endpoint for withdrawing
  router.post("/:id/withdraw", async (req, res) => {
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

router.post("/transaction/:senderId", async (req, res) => {
    try {
      db.getConnection().then(async () => {
        const { amount, receiptId } = req.body;
        await Account.findById(
          { _id: req.params.senderId },
          async (err, user) => {
            if (err) console.log(err);
            else
              await Account.findById({ _id: receiptId }, (err, receipt) => {
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