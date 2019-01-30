"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Bios",
      [
        {
          userId: 1,
          description:
            "I like to swim next to Two Fish.  Someday I want to swim around a ship wreck to look for treasures. ",
          ridesGiven: 1,
          ridesTaken: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: 2,
          description:
            "One Fish and I hang out all the time.  I wonder what it's like on land. ",
          ridesGiven: 1,
          ridesTaken: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: 3,
          description:
            "Purple is the color when Blue Fish and I twirl together real fast. I am looking to swim with more colorful fishes to see other colors we can make together!",
          ridesGiven: 1,
          ridesTaken: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },

        {
          userId: 4,
          description:
            "Although I'm blue in color, I am not blue in spirit, I love life as a fish!  I always wanted to try dark chocolate.",
          ridesGiven: 1,
          ridesTaken: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Bios");
  }
};
