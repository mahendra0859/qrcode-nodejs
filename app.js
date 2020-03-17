const express = require("express");
const mongoose = require("mongoose");
const QRcode = require("qrcode");
const UserModel = require("./models/user");

// Connecting to db
mongoose
  .connect("mongodb://localhost/qrdemo")
  .then(() => console.info("🏂  DB Connected "))
  .catch(err => console.error(err));

//   Initialize the express APP
const app = express();

// set template engine
app.set("view engine", "ejs");

// Fetch data from the request
app.use(express.urlencoded({ extended: false }));

// Default page
app.get("/", (req, res) => {
  UserModel.find((err, data) => {
    if (err) console.error(err);
    else {
      if (data != "") {
        let temp = [];
        for (let index = 0; index < data.length; index++) {
          let name = {
            data: data[index].name
          };
          temp.push(name);
          let phno = {
            data: data[index].phno
          };
          temp.push(phno);
        }
        // Returns a data URI containing a representaion of the QR code image
        QRcode.toDataURL(temp, { errorCorrectionLevel: "H" }, (err, url) => {
          console.log("URL", url);
          res.render("home", { data: url });
        });
      } else res.render("home", { data: "" });
    }
  });
});

// Add user data
app.post("/", (req, res) => {
  const { name, phno } = req.body;
  const user = new UserModel({ name, phno });
  user.save((err, data) => (err ? console.error(err) : res.redirect("/")));
});

// Start the server at partiular port
app.listen(3000, () => console.info("🥏 Server is running on 300 port number"));
