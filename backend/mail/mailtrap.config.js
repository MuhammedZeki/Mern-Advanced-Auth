const { MailtrapClient } = require("mailtrap");

const TOKEN = "53d57945a5d82e0deed5669138869804";

exports.client = new MailtrapClient({
  token: TOKEN,
});

exports.sender = {
  email: "hello@demomailtrap.co",
  name: "Muhammed",
};
