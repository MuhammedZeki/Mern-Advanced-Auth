const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./mailTemplates");
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
exports.sendVerifyEmail = async (userEmail, userName) => {
  try {
    const recipients = [{ email: userEmail }];
    const res = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "79770280-2dcd-4a76-8344-c2b5015294e3",
      template_variables: {
        name: userName,
        company_info_name: "MZY Company",
      },
    });
    console.log("Verify email sent successfully ", res);
  } catch (error) {
    console.log("Error sending verify", error.message);
    throw new Error(`Error sending verify code : ${error.message}`);
  }
};
exports.sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const recipients = [{ email }];
    const res = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Reset password sent successfully", res);
  } catch (error) {
    throw new Error(`Error sending reset Pasword :${error.message}`);
  }
};
exports.sendResetSuccessEmail = async (email) => {
  try {
    const recipients = [{ email }];
    await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset Success Email",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Reset Success",
    });
  } catch (error) {
    throw new Error("Error sending Reset Email Success", error);
  }
};
