const Journey = require("../models").Journey;
const User = require("../models").User;

const dummyPath = {
  routes: [
    {
      geometry: {
        coordinates: [
          [-111.859577, 40.765862],
          [-111.859572, 40.754145],
          [-111.862449, 40.754142],
          [-111.862428, 40.751976],
          [-111.859512, 40.751856],
          [-111.859652, 40.727386],
          [-111.861146, 40.727382],
          [-111.861142, 40.726568]
        ],
        type: "LineString"
      },
      legs: [
        {
          summary: "",
          weight: 740.5,
          duration: 565.8,
          steps: [],
          distance: 4974.4
        }
      ],
      weight_name: "routability",
      weight: 740.5,
      duration: 565.8,
      distance: 4974.4
    }
  ],
  waypoints: [
    {
      distance: 6.247295196113254,
      name: "1100 East",
      location: [-111.859577, 40.765862]
    },
    {
      distance: 10.983201456921575,
      name: "McClelland Street",
      location: [-111.861142, 40.726568]
    }
  ],
  code: "Ok",
  uuid: "cjrl52jcz2a1s3rpkijsqn66b"
};

const dummyStart = {
  latitude: 40.737173,
  longitude: -111.8590678
};

const dummyEnd = {
  latitude: 40.7498161,
  longitude: -111.8653425
};

// https://stackoverflow.com/a/3122532
function getClosestToLine(point, a, b) {
  let ap = [point.longitude - a.longitude, point.latitude - a.latitude];
  let ab = [b.longitude - a.longitude, b.latitude - a.latitude];

  let atb2 = Math.pow(ab[0], 2) + Math.pow(ab[1], 2);

  let atpDotAtb = ap[0] * ab[0] + ap[1] * ab[1];

  let dist = atpDotAtb / atb2;

  return {
    latitude: a.longitude + ab[0] * dist,
    longitude: a.latitude + ab[1] * dist,
    distance: dist
  };
}

function getClosestToPolyline(point, path) {
  let closest = {
    latitude: 0,
    longitude: 0,
    distance: Infinity
  };
  for (let i = 0; i < path.length - 1; i++) {
    let a = path[i];
    let b = path[i + 1];
    let intersect = getClosestToLine(point, a, b);
    if (intersect.distance < closest.distance) {
      closest = intersect;
    }
  }

  return closest;
}

function generateRidePlan(start, end, path) {
  return {
    pickup: getClosestToPolyline(start, path),
    dropoff: getClosestToPolyline(end, path)
  };
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
    return Journey.findAll({ where: { isDriver: true }, include: [User] })
      .then(journeys => {
        if (!journeys) {
          return res.status(404).json({
            message: "Journeys Not Found"
          });
        }
        console.log(JSON.stringify(journeys));
        matches = journeys.map(j => ({
          ridePlan: generateRidePlan(
            dummyStart,
            dummyEnd,
            j.path.coordinates.map(a => ({
              latitude: a[1],
              longitude: a[0]
            }))
          ),
          journey: j
        }));
        return res.status(200).json({
          origin: dummyStart,
          destination: dummyEnd,
          matches: matches
        });
      })
      .catch(error => {
        console.error(error);
        return res.status(400).json(error);
      });
  },

  create(req, res) {
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
      let resp = dummyPath;
      if (resp.routes.length > 1) {
        console.warn("got multiple routes");
      }
      path = resp.routes[0].geometry;
    }

    return Journey.create({
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
  }
};
