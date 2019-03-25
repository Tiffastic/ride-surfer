const Bios = require("../models").Bios;
const User = require("../models").User;
const Messages = require("../models").Messages;
const Sequelize = require("sequelize");

module.exports = {
  getChatPartnerInfo_ByEmail(req, res) {
    User.findOne({
      where: {
        email: req.query.email
      }
    }).then(user => {
      if (!user) {
        res.status(404).json({
          message: "User Not Found"
        });
      } else {
        Bios.findOne({
          where: {
            userId: user.id
          }
        }).then(bio => {
          res.status(200).json({
            recipientId: user.id,
            recipientFirstName: user.firstName,
            recipientLastName: user.lastName,
            recipientImage: bio.image
          });
        });
      }
    });
  },

  saveChat(req, res) {
    // save chat message into database
    Messages.create(req.body, { fields: Object.keys(req.body) })
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  },

  getOurMostRecentChats(req, res) {
    // this endpoint is to populate the MessageConversationsScreen with the most recent chats that you and I have together.

    // select userIdSender, userIdRecipient, message
    // from the Messages table
    // where (userIdSender == userId AND userIdRecipient == recipientId)
    // OR(userIdSender == recipientId AND userIdRecipient == userId)
    // order by createdAt DESC
    // limit 15 -- some random number
    //

    var me = req.query.meId;
    var you = req.query.youId;

    var ourMessages = [];
    //https://stackoverflow.com/questions/20695062/sequelize-or-condition-object
    Messages.findAll({
      where: Sequelize.or(
        Sequelize.and({
          userIdSender: me,
          userIdRecipient: you
        }),

        Sequelize.and({
          userIdSender: you,
          userIdRecipient: me
        })
      ),

      limit: 15,
      order: [["createdAt", "DESC"]]
    })
      .then(array => {
        array.reverse(); // now that we have the most recent messages, we want to display them from the oldest first
        array.forEach(item => {
          ourMessages.push({
            userIdSender: item.userIdSender,
            userIdRecipient: item.userIdRecipient,
            message: item.message
          });
        });

        res.status(200).json({ ourChats: ourMessages });
      })
      .catch(err => {
        res.status(400).json({ message: err });
      });
  },

  getMyRecentChatPartners_WhoISentMailTo(req, res) {
    // to make sure all the ids in the set are unique
    const chatRecipients = new Set();

    //  const chatPartnersIds = [];
    var dict = {};
    var dictMessages = {};
    var dictDate = {};

    // get the recent people who've sent me messages
    Messages.findAll({
      where: { userIdSender: req.query.meId },

      order: [["createdAt", "DESC"]]
    })
      .then(array => {
        // if there are no messages, then return
        if (array.length == 0) {
          res.status(200).json({
            chatRecipients: dict
          });
        }
        // getting the unique partners and their messages
        array.forEach(item => {
          if (chatRecipients.size < 11) {
            // random number, limiting chats
            chatRecipients.add(item.userIdRecipient);
            if (!dictMessages.hasOwnProperty(item.userIdRecipient)) {
              dictMessages[item.userIdRecipient] = item.message;
              dictDate[item.userIdRecipient] = item.createdAt;
            }
          }
        });
      })
      .then(() => {
        for (let item of chatRecipients) {
          // console.log("set item = " + item);

          // if (!dict.hasOwnProperty(item)) {
          // for each person who sent me mail, get their user and bio information

          // for each person who sent me mail, get their user and bio information

          User.findOne({
            where: {
              id: item
            }
          })
            .then(user => {
              if (!user) {
                res.status(404).json({
                  message: "User Not Found"
                });
              } else {
                Bios.findOne({
                  where: {
                    userId: user.id
                  }
                })
                  .then(bio => {
                    dict[item] = {
                      userId: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      userImage: bio.image,
                      chatMessage: dictMessages[item],
                      date: dictDate[item]
                    };

                    // this is the trick, to show when to send the dict
                    if (Object.keys(dict).length == chatRecipients.size) {
                      res.status(200).json({
                        chatRecipients: dict
                      });
                    }
                  })
                  .catch(bioerr => {
                    res.status(400).json({ message: bioerr });
                  });
              }
            })
            .catch(usererr => res.status(400).json({ message: usererr }));
          // }
          //}
        }
      })

      .catch(error => res.status(400).json({ message: error }));
  },

  getMyRecentChatPartners_WhoSentMeMail(req, res) {
    // select distinct userIdRecipient
    // from Messages
    // where userIdSender == me
    // order by date desc
    // limit 7

    // select distinct userIdSender
    // from Messages
    // where userIdRecipient == me
    // order by date desc
    // limit 7

    // put the id in an array
    // send back the ids

    // to make sure all the ids in the set are unique
    const chatSenders = new Set();
    //  const chatPartnersIds = [];
    var dict = {};
    var dictMessages = {};
    var dictDate = {};

    // get the recent people who've sent me messages
    Messages.findAll({
      where: { userIdRecipient: req.query.meId },

      order: [["createdAt", "DESC"]]
    })
      .then(array => {
        // if there is no messages, then return
        if (array.length == 0) {
          res.status(200).json({
            chatSenders: dict
          });
        }
        // getting the unique partners and their messages
        array.forEach(item => {
          if (chatSenders.size < 11) {
            // random number, limiting chats
            chatSenders.add(item.userIdSender);
            if (!dictMessages.hasOwnProperty(item.userIdSender)) {
              dictMessages[item.userIdSender] = item.message;
              dictDate[item.userIdSender] = item.createdAt;
            }
          }
        });
      })
      .then(() => {
        for (let item of chatSenders) {
          // console.log("set item = " + item);

          // if (!dict.hasOwnProperty(item)) {
          // for each person who sent me mail, get their user and bio information

          // for each person who sent me mail, get their user and bio information

          User.findOne({
            where: {
              id: item
            }
          })
            .then(user => {
              if (!user) {
                res.status(404).json({
                  message: "User Not Found"
                });
              } else {
                Bios.findOne({
                  where: {
                    userId: user.id
                  }
                })
                  .then(bio => {
                    dict[item] = {
                      userId: user.id,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      userImage: bio.image,
                      chatMessage: dictMessages[item],
                      date: dictDate[item]
                    };

                    // this is the trick, to show when to send the dict
                    if (Object.keys(dict).length == chatSenders.size) {
                      res.status(200).json({
                        chatSenders: dict
                      });
                    }
                  })
                  .catch(bioerr => {
                    res.status(400).json({ message: bioerr });
                  });
              }
            })
            .catch(usererr => res.status(400).json({ message: usererr }));
          //  }
          //}
        }
      })

      .catch(error => res.status(400).json({ message: error }));
  },

  getChatPartnerInfo_ById(req, res) {}
};
