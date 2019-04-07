var nodemailer = require("nodemailer");
const User = require("../models").User;
const ForgottenPasswords = require("../models").ForgottenPasswords;
const bcrypt = require("react-native-bcrypt");

module.exports = {
  sendPasswordResetLink(req, res) {
    // generate a random password
    // save that password in the ForgotPassword table
    // send an email with a link whose query contains email and random generated password
    // (user cannot see the link)
    // User click on the reset password link
    // that link goes to endpoint
    // that endpoint checks whether that email and random password matches what's in the ForgotPassword table
    // if matches, then set password in the User table
    // send an email to user telling them that their password has been reset and give them the temp password

    const userEmail = req.query.email;
    const hostURL = req.query.url;

    // check to see that email exists in the Users table:
    User.findOne({ where: { email: userEmail } }).then(result => {
      console.log("SEND PASSWORD RESET LINK: ', result");
      if (!result) {
        res.status(404).json({ message: "Email not found" });
      } else {
        // user exists, so generate a random password and store it in the ForgottenPasswords table.
        // later on when user goes to a reset password link, we can verify that the mail and random password match

        var randomPassword = "";
        const tokens =
          "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789_-ridesurferRideSurfer2019";
        for (let i = 0; i < 15; i++) {
          randomPassword += tokens.charAt(
            Math.floor(Math.random() * tokens.length)
          );
        }

        console.log("AUTO-GENERATED PASSWORD: ", randomPassword);

        // store the randomly generated password and email in the ForgottenPasswords table

        // if the user has reset the password once already but never clicked on the verify link sent to their email
        var promise1 = ForgottenPasswords.findOne({
          where: { email: userEmail }
        })
          .then(result => {
            if (result) {
              console.log("EMAIL ALREADY IN FORGOTTEN PASSWORDS TABLE");
              result.destroy();
            }
          })
          .catch(error => {
            res.status(400).json({ message: error });
          });

        var promise2 = ForgottenPasswords.create({
          email: userEmail,
          password: randomPassword
        })
          .then(result => {
            console.log("FORGOTTEN PASSWORD CREATED Result ", result);

            // email the user a reset password link to verify that they want to reset their password.
            // if they don't click this link, then their old password still works.

            var resetLink = `${hostURL}/verifiedResetPasswordLink?email=${userEmail}&resetPassword=${randomPassword}`;

            console.log("RESET LINK: ", resetLink);
            // req.query.url + /endpoint?email=""&resetpassword=""

            var transporter = nodemailer.createTransport({
              service: "outlook",
              auth: {
                user: "RideSurfer@outlook.com",
                pass: "Capstone2019"
              }
            });

            var mailOptions = {
              from: "RideSurfer@outlook.com",
              to: userEmail,
              subject: "Ride Surfer Reset Password Link",
              html: `<h1>Reset Password for Ride Surfer</h1><p>Verify that you requested a reset password, click on this link:</p><p><a href="${resetLink}">Reset Ride Surfer Password</a></p>`
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                res.status(400).json({ error: error });
              } else {
                res
                  .status(200)
                  .json({ message: "Email sent: " + info.response });
              }
            });
          })
          .catch(error => {
            res.status(400).json({ message: "Try again" });
          });

        Promise.all([promise1, promise2]);
      }
    });
  },

  verifiedResetPasswordLink(req, res) {
    // endpoint checks whether that email and random password matches what's in the ForgotPassword table
    // if matches, then set password in the User table
    // send an email to user telling them that their password has been reset and give them the temp password

    const resetPassword = req.query.resetPassword;
    const userEmail = req.query.email;

    console.log("VERIFIED EMAIL: ", userEmail);
    console.log("RESET PASSWORD = ", resetPassword);

    ForgottenPasswords.findOne({
      where: {
        email: userEmail
      }
    }).then(result => {
      if (!result) {
        res.status(404).json({
          message: "User has not requested forgotten password. Request again."
        });
      } else if (!bcrypt.compareSync(resetPassword, result.password)) {
        res.status(404).json({ message: "Password not correct" });
      } else {
        // email and password match
        // now update the User table with the new random auto-generated password
        User.findOne({
          where: {
            email: userEmail
          }
        }).then(user => {
          if (!user) {
            res.status(404).json({ message: "User not found" });
          } else {
            user.update({ password: resetPassword }).then(() => {
              // delete from the ForgottenPasswords table
              // send email with random password

              var transporter = nodemailer.createTransport({
                service: "outlook",
                auth: {
                  user: "RideSurfer@outlook.com",
                  pass: "Capstone2019"
                }
              });

              var mailOptions = {
                from: "RideSurfer@outlook.com",
                to: userEmail,
                subject: "Ride Surfer New Random Password",
                html: `<h1>Auto-Generated Password for Ride Surfer</h1><p>The following is an auto-generated password for your Ride Surfer account. Please change this password after logging in.</p><p>${resetPassword}</p>`
              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  res.status(400).json({ error: error });
                } else {
                  // destroy the entry in the forgottn password table after we sent the user their new password

                  res.status(200).json({
                    message:
                      "Successfully reset password for Ride Surfer! Email sent with new auto-generated password."
                  });

                  result.destroy();
                }
              });
            });
          }
        });
      }
    });
  }
};
