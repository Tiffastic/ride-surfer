const Journey = require("../models").Journey;
const User = require("../models").User;
const Vehicle = require("../models").Vehicle;
const https = require("https");
const turf = require("@turf/turf");

function generateRidePlan(start, end, path) {
  start = turf.point([start.longitude, start.latitude]);
  end = turf.point([end.longitude, end.latitude]);

  path = turf.lineString(path.coordinates);

  let pickup = turf.nearestPointOnLine(path, start);
  let dropoff = turf.nearestPointOnLine(path, end);

  let walkDist = Math.abs(pickup.properties.dist + dropoff.properties.dist);
  let driveDist = Math.abs(
    dropoff.properties.location - pickup.properties.location
  );

  return {
    pickup: {
      latitude: pickup.geometry.coordinates[1],
      longitude: pickup.geometry.coordinates[0],
      distance: pickup.properties.dist
    },
    dropoff: {
      latitude: dropoff.geometry.coordinates[1],
      longitude: dropoff.geometry.coordinates[0],
      distance: dropoff.properties.dist
    },
    walkingDistance: walkDist,
    drivingDistance: driveDist,

    // time taken to complete, assuming 2mph (3.2kph) walking speed and 20mph (32kph) driving speed
    weight: walkDist / 3.2 + driveDist / 32
  };
}

function parseCoordsString(str) {
  str = decodeURIComponent(str);
  let coords = str.split(";");
  if (coords.length !== 2) {
    return null;
  }
  let origin = coords[0].split(",");
  let dest = coords[1].split(",");
  if (origin.length !== 2 || dest.length !== 2) {
    return null;
  }
  origin = origin.map(n => +n);
  dest = dest.map(n => +n);
  if (origin.filter(isNaN).length > 0 || dest.filter(isNaN).length > 0) {
    return null;
  }
  return {
    origin: {
      latitude: origin[1],
      longitude: origin[0]
    },
    destination: {
      latitude: dest[1],
      longitude: dest[0]
    }
  };
}

const apiToken =
  "pk.eyJ1IjoiZXRoYW5yYW4iLCJhIjoiY2pya3V6MGwyMDF1NzQzbXRnMHl3cGN5aiJ9.Y-iyykoUZuKEG7OyfRZDQw";

async function fetchJourneyPath(start, end) {
  const coords = `${start.longitude},${start.latitude};${end.longitude},${
    end.latitude
  }`;
  const apiURI = `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(
    coords
  )}.json?access_token=${apiToken}&geometries=geojson`;

  return new Promise((resolve, reject) => {
    https.get(apiURI, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        console.log(body);
        body = JSON.parse(body);
        if (res.statusCode === 200) {
          resolve(body);
        } else {
          reject(body);
        }
      });
    });
  });
}

module.exports = {
  retrieveAll(req, res) {
    return Journey.findAll()
      .then(journeys => {
        if (!journeys) {
          return res.status(404).json({
            message: "Journeys Not Found"
          });
        }
        return res.status(200).json(journeys);
      })
      .catch(error => res.status(400).json(error));
  },

  retrieveMatches(req, res) {
    let coords = parseCoordsString(req.query["coords"]);
    if (coords === null) {
      return res.status(401).json({ message: "Couldn't parse coords string" });
    }
    return Journey.findAll({
      where: { isDriver: true },
      include: [User]
    })
      .then(journeys => {
        if (!journeys) {
          return res.status(404).json({
            message: "Journeys Not Found"
          });
        }
        matches = journeys
          .map(j => ({
            ridePlan: generateRidePlan(
              coords.origin,
              coords.destination,
              j.path
            ),
            journey: j
          }))
          .sort((a, b) => {
            // sort by weight, ascending
            if (a.weight < b) {
              return -1;
            }
            if (a.weight > b) {
              return 1;
            }
            return 0;
          });
        return res.status(200).json({
          origin: coords.origin,
          destination: coords.destination,
          matches: matches
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(400).json(error);
      });
  },

  async create(req, res) {
    var origin = {
      type: "Point",
      coordinates: req.body.origin,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };

    var destination = {
      type: "Point",
      coordinates: req.body.destination,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };

    let isDriver = false;
    if (req.body.isDriver && req.body.isDriver === true) {
      isDriver = true;
    }

    let path = null;
    if (isDriver) {
      try {
        let resp = await fetchJourneyPath(
          { latitude: origin.coordinates[0], longitude: origin.coordinates[1] },
          {
            latitude: destination.coordinates[0],
            longitude: destination.coordinates[1]
          }
        );
        if (resp.routes.length > 1) {
          console.warn("got multiple routes");
        }
        path = resp.routes[0].geometry;
      } catch (e) {
        console.error("Couldn't fetch from routing API: " + e);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
    }

    return await Journey.create({
      userId: req.body.userId,
      origin: origin,
      destination: destination,
      arrivalAt: req.body.arrivalAt,
      isDriver: isDriver,
      path: path
    })
      .then(journey => res.status(201).json(journey))
      .catch(error => res.status(400).json(error));
  },

  retrieve(req, res) {
    return Journey.findByPk(req.params.id)
      .then(journey => {
        if (!journey) {
          return res.status(404).json({
            message: "Journey Not Found"
          });
        }
        return res.status(200).json(journey);
      })
      .catch(error => res.status(400).json(journey));
  },

  update(req, res) {
    return Journey.find({
      where: {
        id: req.params.id
      }
    })
      .then(journey => {
        if (!journey) {
          return res.status(404).json({
            message: "Journey Not Found"
          });
        }

        return journey
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedJourney => res.status(200).json(updatedJourney))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },
  updateAll(req, res) {
    var location = {
      type: "Point",
      coordinates: req.body.currentLocation,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };
    return Journey.update(
      { currentLocation: location },
      { where: { userId: req.body.userId } }
    )
      .then(updatedJourney => res.status(200).json(updatedJourney))
      .catch(error => res.status(400).json(error));
  },
  async getDrivingRoute(req, res) {
    var origin = {
      type: "Point",
      coordinates: req.body.origin,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };

    var destination = {
      type: "Point",
      coordinates: req.body.destination,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };
    try {
      let resp = await fetchJourneyPath(
        { latitude: origin.coordinates[0], longitude: origin.coordinates[1] },
        {
          latitude: destination.coordinates[0],
          longitude: destination.coordinates[1]
        }
      );
      if (resp.routes.length > 1) {
        console.warn("got multiple routes");
      }
      path = resp.routes[0].geometry;
      res.status(200).json(path);
    } catch (e) {
      console.error("Couldn't fetch from routing API: " + e);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }
};
