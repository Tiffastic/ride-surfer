const Bios = require("../models").Bios;
const User = require("../models").User;

const MyChats = require("../models").MyChats;
const Chats = require("../models").Chats;
const model = require("../models");

module.exports = {
  getChatSessionInfo_ByEmail(req, res) {
    // from Users
    // where email = req.query.email
    // select userId  AS youId
    // if not, send back 404

    // from MyChats
    // where senderId = req.query.meId AND youId
    // select chatId
    // if not, go to Chats table, get highest chatId
    // create a new row in MyChats with meId, youId, and highest chatId + 1

    // send back recipient info and chatId

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
        let userId, firstName, lastName, image, chatId;

        // get the bio info of the user
        var bioPromise = Bios.findOne({
          where: {
            userId: user.id
          }
        })
          .then(bio => {
            userId = user.id;
            firstName = user.firstName;
            lastName = user.lastName;
            image = bio.image;
          })
          .catch(err => {
            console.log(err);
          });

        let chatPromise = new Promise((resolve, reject) => {
          MyChats.findOne({
            where: {
              senderId: req.query.meId,
              recipientId: user.id
            }
          })
            .then(result => {
              if (!result) {
                // This might be a brand new chat between you and me, so we might need to insert in a row into MyChats
                // in order to insert in a row, we need a chatId

                model.sequelize
                  .query(
                    'SELECT "chatId" FROM public."Chats" ORDER BY "chatId" DESC LIMIT 1',
                    { type: model.sequelize.QueryTypes.SELECT }
                  )
                  .then(function(data) {
                    if (data.length === 0) {
                      // nothing in the chats table yet
                      chatId = 1;
                      resolve("success");
                    } else {
                      // console.log("DATA TO GET HIGHEST CHAT ID ", data);
                      chatId = data[0].chatId + 1;
                      resolve("success");
                    }
                  });
              } else {
                chatId = result.chatId;
                resolve("success");
              }
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        });

        Promise.all([bioPromise, chatPromise])
          .then(results => {
            res.status(200).json({
              recipientId: userId,
              recipientFirstName: firstName,
              recipientLastName: lastName,
              recipientImage: image,
              recipientEmail: user.email,
              chatId: chatId
            });
          })
          .catch(err => {
            res.status(404).json({
              message: err
            });
          });
      }
    });
  },

  saveChatSessionMessage(req, res) {
    Chats.create(req.body, { fields: Object.keys(req.body) })
      .then(chat => {
        //
        // from MyChats, search for the chatId, if it is not there, the insert two rows: 1) I am the sender and you are the recipient.  2) you are the sender and I am the recipient
        // insert into MyChats table a new chat session between you and me

        MyChats.findOne({
          where: {
            chatId: req.body.chatId
          }
        })
          .then(result => {
            if (!result) {
              MyChats.create({
                senderId: req.body.senderId,
                recipientId: req.body.youId,
                chatId: req.body.chatId
              })
                .then(() => {
                  if (req.body.senderId !== req.body.youId) {
                    // case where I sent a message to myself
                    // I want you to also have the same chat session between us where you are the sender and I am the recipient
                    MyChats.create({
                      senderId: req.body.youId,
                      recipientId: req.body.senderId,
                      chatId: req.body.chatId
                    })
                      .then(() => {
                        res.status(201).json(chat);
                      })
                      .catch(error => res.status(400).json({ message: error }));
                  }
                })
                .catch(error => res.status(400).json({ message: error }));
            } else {
              res.status(201).json(chat);
            }
          })
          .catch(error => res.status(400).json({ message: error }));
      })
      .catch(error => res.status(400).json(error));
  },

  getLatestChatSessionMessages_RawQuery(req, res) {
    if (!req.query.meId.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.meId is a number and nothing else
      res.status(400).json({ message: "id is not a valid integer" });
    }
    model.sequelize
      .query(
        'SELECT "recipientId" AS "partnerId", "firstName", "lastName", email, image AS "userImage", MyChats."chatId", message AS "chatMessage", Chats."createdAt" AS date' +
          ' FROM public."MyChats" AS MyChats' +
          ' INNER JOIN public."Users" AS Users ON MyChats."recipientId" = Users.id' +
          ' INNER JOIN public."Bios" AS Bios ON MyChats."recipientId" = Bios."userId"' +
          ' INNER JOIN (SELECT rank() OVER (PARTITION BY "chatId" ORDER BY "createdAt" DESC) AS rank, "chatId", "createdAt", message FROM public."Chats") AS Chats ON MyChats."chatId" = Chats."chatId"' +
          ' WHERE MyChats."senderId" = ' +
          req.query.meId +
          " AND Chats.rank = 1" +
          " ORDER By date DESC;",

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ myRecentChats: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  },

  getLatestChatSessionMessages(req, res) {
    // from MyChats
    // where senderId = meId
    // select all chatIds

    // for each chatId
    // go to Chats table
    // from Chats
    // where chatId = chatId
    // order by createdAt desc
    // limit 1

    MyChats.findAll({
      where: {
        senderId: req.query.meId
      },
      limit: 10, // limit the number of previous chats
      order: [["createdAt", "DESC"]] // get the latest previous chats
    }).then(array => {
      let myRecentChats = [];
      var countRows = 0;
      if (array.length == 0) {
        res.status(200).json({ myRecentChats: myRecentChats });
      }

      array.forEach(row => {
        let partnerId,
          partnerFirstName,
          partnerLastName,
          partnerEmail,
          partnerImage,
          chatId,
          chatMessage,
          date;

        var recentChatPromise = Chats.findOne({
          where: {
            chatId: row.chatId
          },
          order: [["createdAt", "DESC"]],
          limit: 1
        })
          .then(mostRecentChat => {
            chatId = mostRecentChat.chatId;
            chatMessage = mostRecentChat.message;
            date = mostRecentChat.createdAt;
          })
          .catch(err => console.log(err));

        var userInfoPromise = new Promise((resolve, reject) => {
          User.findOne({
            where: {
              id: row.recipientId
            }
          })
            .then(user => {
              partnerId = user.id;
              partnerFirstName = user.firstName;
              partnerLastName = user.lastName;
              partnerEmail = user.email;
            })
            .then(user => {
              Bios.findOne({
                where: {
                  userId: partnerId
                }
              })
                .then(bio => {
                  partnerImage = bio.image;
                  resolve("success");
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });

        Promise.all([recentChatPromise, userInfoPromise])
          .then(() => {
            myRecentChats.push({
              partnerId: partnerId,
              firstName: partnerFirstName,
              lastName: partnerLastName,
              email: partnerEmail,
              userImage: partnerImage,
              chatId: chatId,
              chatMessage: chatMessage,
              date: date
            });

            countRows++;
          })
          .then(() => {
            if (countRows >= array.length) {
              res.status(200).json({ myRecentChats: myRecentChats });
            }
          });
      });
    });
  },

  getOurChatSessionConversations(req, res) {
    MyChats.findOne({
      where: {
        senderId: req.query.meId,
        recipientId: req.query.youId
      }
    }).then(row => {
      Chats.findAll({
        where: {
          chatId: row.chatId
        },
        order: [["createdAt", "ASC"]]
      })
        .then(array => {
          ourChats = [];

          array.forEach(item => {
            ourChats.push({
              userIdSender: item.senderId,
              message: item.message,
              date: item.createdAt
            });
            /*
            userIdSender: item.userIdSender,
            userIdRecipient: item.userIdRecipient,
            message: item.message
          */
          });

          res.status(200).json({ ourChats: ourChats });
        })
        .catch(err => res.status(400).json({ message: err }));
    });
  },

  sendChatMessage_ByRecipientId(req, res) {
    var chatIdPromise = new Promise((resolve, reject) => {
      let chatId;

      MyChats.findOne({
        where: {
          senderId: req.body.meId,
          recipientId: req.body.youId
        }
      })
        .then(result => {
          if (!result) {
            // This might be a brand new chat between you and me, so we might need to insert in a row into MyChats
            // in order to insert in a row, we need a chatId

            model.sequelize
              .query(
                'SELECT "chatId" FROM public."Chats" ORDER BY "chatId" DESC LIMIT 1',
                { type: model.sequelize.QueryTypes.SELECT }
              )
              .then(function(data) {
                if (data.length === 0) {
                  // nothing in the chats table yet
                  chatId = 1;
                } else {
                  // console.log("DATA TO GET HIGHEST CHAT ID ", data);
                  chatId = data[0].chatId + 1;
                }
              })
              .then(() => {
                // create a new chat between you and me
                MyChats.create({
                  senderId: req.body.meId,
                  recipientId: req.body.youId,
                  chatId: chatId
                }).then(() => {
                  if (req.body.meId !== req.body.youId) {
                    MyChats.create({
                      senderId: req.body.youId,
                      recipientId: req.body.meId,
                      chatId: chatId
                    }).then(() => {
                      resolve({ chatId: chatId });
                    });
                  } else {
                    resolve({ chatId: chatId });
                  }
                });
              });
          } else {
            chatId = result.chatId;
            resolve({ chatId: chatId });
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

    Promise.all([chatIdPromise])
      .then(resolve => {
        Chats.create({
          chatId: resolve[0].chatId,
          message: req.body.message,
          senderId: req.body.meId
        }).catch(error => {
          console.log("ERROR CREATING CHAT ", error);
        });

        res.status(200).json({
          chatSent: req.body.message,
          senderId: req.body.meId,
          recipientId: req.body.youId,
          chatId: resolve[0].chatId
        });
      })

      .catch(error => res.status(400).json({ message: error }));
  }
};
