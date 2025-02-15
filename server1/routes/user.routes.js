const { Router } = require("express");
const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');

const app= express();
const db = require("../db");
const fs =require('fs');
const {promisify} = require('util');
const pipeline= promisify(require('stream').pipeline)
const multer= require('multer');
const { debounce } = require("@material-ui/core");
const upload=multer();
app.use(fileUpload());
// router.get("/getusers", Userctl.apiGetAllUsers);
router.route("/getall").get((req, res) => {
  db.query("select * from user", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});
router.route("/getallitems").get((req, res) => {
  db.query("select * from supplier_item", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});
router.route("/createuser").post((req, res) => {
  const data = req.body;
  //console.log(req.body.us_name)
  const user_name = data.user_name;
  const password = data.password;
  const privatekey = data.privatekey;
  const role_id = data.role_id;
  const account_address = data.account_address;
  const email = data.email;
  const location = data.location;
 
  //console.log(req.body.user_name)
  db.query(
    "INSERT INTO user (user_name,password,role_id,privatekey,account_address,email,location) VALUES (?,?,?,?,?,?)",
    [user_name, password, privatekey,role_id, account_address, email, location],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(req.body);
      }
    }
  );
});
router.route("/getallproducts").get((req, res) => {
  db.query("select * from product", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});
router.route("/createitem", upload.single('file')).post((req, res) => {
  const upc = req.body.upc;
  const user_id = req.body.user_id;
  const material = req.body.material;
  const createdAt = req.body.createdAt;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const longitutde = req.body.longitutde;
  const latitude = req.body.latitude;
  // const filename= 'file'+ req.data.detectedFileExtension;
  // await pipeline(req.data.stream)
  const file= req.body.file;
console.log(file)
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log(file)
  }
 
  // name of the input is sampleFile
  uploadPath = __dirname + '/upload/' + req.files.file.name;

  console.log(req.files.file);

  // Use mv() to place file on the server
  req.files.file.mv(uploadPath, function (err) {
   
    if (err) return res.status(500).send(err);
      
      db.query("INSERT INTO SUPPLIER_ITEM(user_id,material,quantity,upc,price,longitude,latitude,createdAt,image) values(?,?,?,?,?,?,?,?,?)", [user_id, material, quantity, upc, price, longitutde, latitude, createdAt,req.files.file.name], (err, rows) => {
        if (!err) {
         res.send(req.body)
        } else {
          console.log(err);
        }
      });
    });
  // db.query(
  //   "INSERT INTO SUPPLIER_ITEM(user_id,material,quantity,upc,price,longitude,latitude,createdAt) values(?,?,?,?,?,?,?,?)",
  //   [user_id, material, quantity, upc, price, longitutde, latitude, createdAt],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send(req.body);
  //     }
  //   }
  // );
});
router.route("/updateuser").put((req, res) => {
  const user_id = req.body.id;
  const account_address = req.body.account_address;
  const password = req.body.password;
  const location = req.body.location;
  db.query(
    "UPDATE user SET account_address=?,password=?,location=? WHERE user_id=?",
    [account_address, password, location, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.route("/createproduct").post((req, res) => {
  const rawitemupc = req.body.rawitemupc;
  const merch_id = req.body.merch_id;
  const employee_id = req.body.employee_id;
  const treatements = req.body.treatements;
  const productupc = req.body.productupc;
  const machine_id = req.body.machine_id;
  const createdAt = req.body.createdAt;
  const cost_sku = req.body.cost_sku;
  //const pattern=req.body.pattern;
  const quality_inspection = req.body.quality_inspection;
  const quantity = req.body.quantity;

  db.query(
    "INSERT INTO product(merch_id,employee_id,machine_id,createdAt,productupc,cost_sku,quality_inspection,rawitemupc,treatements,quantity) values(?,?,?,?,?,?,?,?,?,?)",
    [
      merch_id,
      employee_id,
      machine_id,
      createdAt,
      productupc,
      cost_sku,
      quality_inspection,
      rawitemupc,
      treatements,
      quantity,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(req.body);
      }
    }
  );
});

router.route("/updateproduct").put((req, res) => {
  const cost_sku = req.body.cost_sku;
  const quantity = req.body.quantity;
  const product_id = req.body.product_id;
  db.query(
    "UPDATE product SET cost_sku=?,quantity=?WHERE product_id=?",
    [cost_sku, quantity, product_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
router.route("/getsuppliersItems").get((req, res) => {
  const user_id = req.body.user_id;
  db.query(
    "  select user.user_name,user.email, user.location, user.user_id, group_concat(supplier_item.upc separator ',') as Item_list  from user  JOIN supplier_item ON user.user_id = supplier_item.user_id group by user_id  ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


router.route("/updateitem").put((req, res) => {
  const quantity = req.body.quantity;
  const price = req.body.price;
  const id = req.body.item_id;
  db.query(
    "UPDATE supplier_item SET quantity=?,price=?WHERE item_id=?",
    [quantity, price, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
module.exports = router;
