const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const addUser = require("./Functions/functions");

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

app.get("/api/questions", (req, res) => {
  const questions = { questions: [] };
  const query = 'SELECT * FROM Questions ORDER BY RAND() LIMIT 7'; 

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    questions.questions = results;
    res.json(questions);
  });
});

// Get Signs
app.get("/api/signs", (req, res) => {
  connection.query('SELECT * FROM Signs', (error, results, fields) => {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.listen(PORT, HOST, () => {
  console.log("Server Running");
});
