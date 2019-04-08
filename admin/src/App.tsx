import React from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZXRoYW5yYW4iLCJhIjoiY2pya3V6MGwyMDF1NzQzbXRnMHl3cGN5aiJ9.Y-iyykoUZuKEG7OyfRZDQw";

import { fetchAPI } from "./Backend";
import logo from "./logo.svg";
import defaultProfile from "./default-profile.png";
// import "./App.css";

interface Page {
  name: string;
  render: () => JSX.Element;
}

const pages: Page[] = [
  { name: "Users", render: () => <Users /> },
  { name: "Journeys", render: () => <Journeys /> },
  { name: "Active Rides", render: () => <ActiveRides /> }
];

const saltLakeCenter = [40.7487805, -111.8718196].reverse() as [number, number];

class ProfilePic extends React.Component<{
  width?: number;
  height?: number;
  userId: number;
}> {
  state = {
    userImage: null as null | string
  };

  componentWillMount() {
    fetchAPI("/getUserImage/" + this.props.userId)
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          userImage: json.userImage as string
        });
      });
  }

  render() {
    return (
      <img
        src={
          this.state.userImage === null ? defaultProfile : this.state.userImage
        }
        width={this.props.width === undefined ? 75 : this.props.width}
        height={this.props.height === undefined ? 75 : this.props.height}
      />
    );
  }
}

class UserNametag extends React.Component<{ userId: number }> {
  state = {
    user: null as null | any
  };

  componentWillMount() {
    fetchAPI("/users/" + this.props.userId)
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          user: json
        });
      });
  }

  render() {
    if (this.state.user === null) {
      return <span>...</span>;
    }

    return (
      <span
        style={{ border: "1px solid #c3c3c3", borderRadius: 3, padding: 4 }}
      >
        <ProfilePic userId={this.props.userId} width={25} height={25} />{" "}
        {this.state.user.firstName}
      </span>
    );
  }
}

class JourneyMap extends React.Component<{
  id: number;
  origin: any;
  destination: any;
  path: any | null;
}> {
  componentDidMount() {
    var map = new mapboxgl.Map({
      container: this.domId(),
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: saltLakeCenter,
      zoom: 11
    });

    map.on("load", () => {
      if (this.props.path !== null) {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: this.props.path
            }
          },
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#888",
            "line-width": 8
          }
        });
      }

      map.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: this.props.origin.coordinates.reverse()
                },
                properties: {
                  title: "Start",
                  icon: "monument"
                }
              },
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: this.props.destination.coordinates.reverse()
                },
                properties: {
                  title: "End",
                  icon: "harbor"
                }
              }
            ]
          }
        },
        layout: {
          "icon-image": "{icon}-15",
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        }
      });
    });
  }

  private domId() {
    return `map-${this.props.id}`;
  }

  render() {
    return <section style={{ width: 500, height: 500 }} id={this.domId()} />;
  }
}

class Journey extends React.Component<{ journey: any }, { expanded: boolean }> {
  state = {
    expanded: false
  };

  private toggleExpanded = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    return (
      <li key={this.props.journey.id}>
        <p>
          Id: {this.props.journey.id} -{" "}
          <UserNametag userId={this.props.journey.userId} /> -{" "}
          {this.props.journey.isDriver ? "Driver" : "Passenger"}
        </p>
        {this.props.journey.isDriver && false && <UserNametag userId={99999} />}
        <p>
          Created At: {new Date(this.props.journey.createdAt).toLocaleString()}
        </p>
        <p>
          <button onClick={this.toggleExpanded}>
            {this.state.expanded ? "Hide Map" : "Show Map"}
          </button>
        </p>
        {this.state.expanded && (
          <p>
            <JourneyMap
              id={this.props.journey.id as number}
              origin={this.props.journey.origin}
              destination={this.props.journey.destination}
              path={this.props.journey.path}
            />
          </p>
        )}
      </li>
    );
  }
}

class ActiveRides extends React.Component {
  state = {
    rides: [],
    selectedRide: null,
    loading: true
  };

  componentWillMount() {
    Promise.all([
      fetchAPI("/journeys")
        .then(response => response.json())
        .then(json => {
          json.forEach((j: any) => {
            if (j.currentLocation !== null) {
              j.currentLocation.coordinates.reverse(); // in-place
            }
          });
          return json;
        }),
      fetchAPI("/passengerRides").then(response => response.json())
    ]).then(([journeys, rides]: [any, any]) => {
      let activeRides = rides
        .filter((r: any) => r.driverAccepted)
        .map((r: any) => {
          return {
            ...r,
            passengerJourney: journeys.find(
              (j: any) => j.id === r.passengerJourneyId
            ),
            driverJourney: journeys.find((j: any) => j.id === r.driverJourneyId)
          };
        });
      this.setState({
        rides: activeRides,
        selectedRide: activeRides.length > 0 ? activeRides[0] : null,
        loading: false
      });
    });
  }

  private selectRide = (ride: any) => {
    this.setState({ selectedRide: ride });
  };

  private renderRide = (ride: any, i: number) => {
    let selected = ride === this.state.selectedRide;

    return (
      <li
        className={"rideListItem" + (selected ? " selected" : "")}
        key={ride.id}
        onClick={() => this.selectRide(ride)}
      >
        <p>
          <UserNametag userId={ride.passengerJourney.userId} /> riding with{" "}
          <UserNametag userId={ride.driverJourney.userId} />
        </p>
      </li>
    );
  };

  renderSidebar() {
    if (this.state.loading) {
      return <div style={{ width: 250 }}>Loading . . . </div>;
    }
    return (
      <div style={{ width: 250 }}>
        <p>{this.state.rides.length} active rides</p>
        <ul>{this.state.rides.map(this.renderRide)}</ul>
      </div>
    );
  }

  render() {
    return (
      <section style={{ display: "flex", flex: 1 }}>
        {this.renderSidebar()}
        <RideMap ride={this.state.selectedRide} />
      </section>
    );
  }
}

class RideMap extends React.Component<{ ride: any | null }> {
  map = null as null | any;

  passengerMarker = null;
  driverMarker = null;

  componentDidMount() {
    console.log("map mount");

    this.map = new mapboxgl.Map({
      container: "active-rides-map",
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: saltLakeCenter,
      zoom: 12
    });

    this.updateMarkers();
  }

  private updateMarkers() {
    const updateMarker = (
      marker: any,
      coordinates: [number, number] | null,
      userId: null
    ) => {
      if (marker === null) {
        if (coordinates === null) {
          return null;
        }
        let el = document.createElement("img");
        el.id = "marker";
        el.width = 30;
        el.height = 30;

        marker = new mapboxgl.Marker(el, {
          draggable: true
        });

        marker.on("dragend", () => {
          var lngLat = marker.getLngLat();
          fetchAPI("/journeys/updateLocation/", {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: userId,
              currentLocation: [lngLat.lat, lngLat.lng]
            })
          })
            .then(resp => {
              marker.getElement().style.borderColor = "white";
            })
            .catch(error => {
              console.log(error);
            });
          marker.getElement().style.borderColor = "orange";
        });

        // marker.on("dragend", onDragEnd);
        el.addEventListener("dragstart", e => {
          e.preventDefault();
          return false;
        });
        el.addEventListener("click", () => {
          console.log("clicked: ", coordinates);
        });
      }

      if (coordinates !== null) {
        marker.setLngLat(coordinates).addTo(this.map);
        fetchAPI("/getUserImage/" + userId)
          .then(resp => resp.json())
          .then(json => {
            if (json.userImage === null) {
              marker.getElement().src = defaultProfile;
            } else {
              marker.getElement().src = json.userImage;
            }
          });
      } else {
        marker.remove();
      }

      return marker;
    };

    let passengerLocation = null;
    let passengerId = null;
    if (
      this.props.ride !== null &&
      this.props.ride.passengerJourney.currentLocation !== null
    ) {
      passengerLocation = this.props.ride.passengerJourney.currentLocation
        .coordinates;
      passengerId = this.props.ride.passengerJourney.userId;
    }
    let driverLocation = null;
    let driverId = null;
    if (
      this.props.ride !== null &&
      this.props.ride.driverJourney.currentLocation !== null
    ) {
      driverLocation = this.props.ride.driverJourney.currentLocation
        .coordinates;
      driverId = this.props.ride.driverJourney.userId;
    }

    this.passengerMarker = updateMarker(
      this.passengerMarker,
      passengerLocation,
      passengerId
    );
    this.driverMarker = updateMarker(
      this.driverMarker,
      driverLocation,
      driverId
    );
  }

  render() {
    if (this.map !== null) {
      this.updateMarkers();
    }
    return <div style={{ flex: 1 }} id="active-rides-map" />;
  }
}

class Journeys extends React.Component {
  state = {
    journeys: [],
    loading: true
  };

  componentWillMount() {
    fetchAPI("/journeys")
      .then(response => response.json())
      .then(json => this.setState({ loading: false, journeys: json }));
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <p>Found {this.state.journeys.length} Journeys</p>

        <ul>
          {this.state.journeys.map((journey: any) => (
            <Journey key={journey.id} journey={journey} />
          ))}
        </ul>
      </div>
    );
  }
}

class Users extends React.Component {
  state = {
    users: []
  };

  componentWillMount() {
    fetchAPI("/users/")
      .then(response => response.json())
      .then(json => {
        this.setState({ users: json });
      });
  }

  private renderUser = (user: any) => {
    return (
      <div>
        <p>
          <ProfilePic userId={user.id} />
        </p>
        <p>
          Name: {user.firstName} {user.lastName}
        </p>
        <p>Email: {user.email}</p>
        <hr />
      </div>
    );
  };

  render() {
    return <div>{this.state.users.map(this.renderUser)}</div>;
  }
}

class App extends React.Component {
  state = {
    page: pages.find(p => p.name === "Active Rides")
  };

  render() {
    return (
      <div
        className="container-fluid"
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <header className="App-header">
          <h1>Ride Surfer - Admin Dashboard</h1>
          <ul className="nav nav-tabs">
            {pages.map(page => (
              <li className="nav-item" key={page.name}>
                <a
                  className={
                    "nav-link " + (page === this.state.page ? " active" : "")
                  }
                  onClick={e => this.setState({ page: page })}
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </header>
        <main style={{ display: "flex", flex: 1 }}>
          {this.state.page ? this.state.page.render() : "No page selected"}
        </main>
      </div>
    );
  }
}

export default App;
