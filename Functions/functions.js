const { Client } = require("@notionhq/client");
require("dotenv").config();

//Intit notion
const databaseId = "9d700650724d45a4b1bd9b5b39860113";

const notion = new Client({
  auth: "secret_ipspghV3Ud2Kuwi5DeBdcDn44CA0iDKjux10xetRBS6",
});

module.exports = async function addUser(name, phoneNumber, testResults) {
  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Phone: {
        phone_number: phoneNumber,
      },
      Results: {
        number: testResults,
      },
      Subscribed: {
        checkbox: true,
      },
    },
  });
};
