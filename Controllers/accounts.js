const express = require('express');
const router = express.Router();
const db = require('../db');
const { update } = require('../models/account');
const Account = require('../models/account');

// curl localhost/accounts
//Endpoint for showing all users
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
  const id = req.params.id

    try {
        const account = await Account.findById(id);
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
            _id: req.params.id
        });
        res.send(account)

    } catch (error) {
      console.log(error);
      return res.sendStatus(200)  
    }
  })

    //This is the endpoint for transferring money from one account to another
// Transfer money from one account to another.

router.put("/transfer", async (req, res) => {
  try {
    db.getConnection().then(async () => {
      const {fromAccount, toAccount, amount} = req.body;
      await Account.findById(
       fromAccount,
        async (err, user) => {
          if (err) console.log(err);
          else
            await Account.findById(toAccount, (err, recepient) => {
              if (err) console.log(err);
              else if (user.balance >= Number(amount)) {
                user.balance -= Number(amount);
                user.save();
                recepient.balance += Number(amount);
                recepient.save();
                return res.send("transaction completed successfully");
              } else {
                return res.send("Something went wrong");
              }
            });
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
});

//updates the balance 
router.put("/:id", async (req, res) => {
  


  try {
    db.getConnection().then(async () => {
      const currentAccount = req.body;
       await Account.findByIdAndUpdate( 
         req.params.id,
        currentAccount,
      
      {
        new: true,
        useFindAndModify: false,
      });
   res.status(200).send(currentAccount);
   //console.log('balance updated succesfully');
   return

  });
    
  } catch (err) {
    console.log(err);
  }
});



  //the endpoint for depositing to account 
  router.put("/:id", async (req, res) => {
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
  router.put("/:id", async (req, res) => {
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



 


module.exports = router;