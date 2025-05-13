const { VERIFICATION_EMAIL_TEMPLATE } = require("./mailTemplates");
const { sender, mailtrapClient } = require("./mailtrap.config");

exports.sendVerificationEmail = async (userEmail, verificationToken) => {
  try {
    const recipients = [{ email: userEmail }];
    const res = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent successfully", res);
  } catch (error) {
    console.error(`Error sending verification`, error.message);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};
