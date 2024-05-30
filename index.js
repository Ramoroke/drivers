const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const quests = require("./Services/questions");
const addUser = require("./Functions/functions");
const { Signs } = require("./Services/Signs");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;
const HOST = "localhost";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Bokaota",
});

// Estabilsh if Connection Successful
db.connect(function conTest(error) {
  if (error) {
    console.log(error, "Error Connecting to db");
  } else {
    console.log("Connection to db successful");
  }
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const testResults = req.body.testResults;
  const Have_License = req.body.license;
  const subscribed = 1;

  console.log(
    "Name: " +
      name +
      " Phone Number: " +
      phoneNumber +
      " Test Results: " +
      testResults +
      "Do posses License " +
      Have_License
  );

  // Using Notion Database
  // addUser(name, phoneNumber, testResults);

  // Using MYSQL DATA BASE
  const sql = "SELECT * FROM Users WHERE Phone = ? ";
  db.query(sql, [phoneNumber], (err, data) => {
    if (err) {
      return res.json(err);
    } else if (data.length !== 0) {
      // Update Name and Results on Phone Number
      const sqll =
        "UPDATE Users SET Name = ?, Have_License = ?, Test_Results = ? WHERE Users.Phone = ?";
      db.query(
        sqll,
        [name, Have_License, testResults, phoneNumber],
        (err, result) => {
          console.log(err);
        }
      );
    } else {
      // Insert into database
      db.query(
        "INSERT INTO Users (Name, Phone, Test_Results, Have_License, Subscribed) VALUES(?, ?, ?, ?, ?)",
        [name, phoneNumber, testResults, Have_License, subscribed],
        (err, result) => {
          console.log(err);
        }
      );
    }
  });

  // Send Message to whatsApp
});

// Gets Questions
app.get("/api/questions", (req, res) => {
  var count = 0;
  const questions = { questions: [] };
  while (count < 7) {
    const item = quests.quest[Math.floor(Math.random() * quests.quest.length)];
    questions.questions.push(item);
    count++;
  }
  res.send(questions);
});

// Get Signs
app.get("/api/signs", (req, res) => {
  res.send(Signs);
});

app.listen(PORT, HOST, () => {
  console.log("Server Running");
});
