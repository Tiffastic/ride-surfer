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
    rides: [] as any[],
    selectedRide: null as number | null,
    loading: true
  };

  private fetchRides = () => {
    return Promise.all([
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
      return rides
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
    });
  };

  componentWillMount() {
    this.fetchRides().then(activeRides => {
      this.setState({
        rides: activeRides,
        selectedRide: activeRides.length > 0 ? activeRides[0].id : null,
        loading: false
      });
    });
  }

  private selectRide = (ride: any) => {
    this.setState({ selectedRide: ride.id });
  };

  private refresh = () => {
    this.fetchRides().then(activeRides => {
      this.setState({ rides: activeRides });
    });
  };

  private renderRide = (ride: any, i: number) => {
    let selected = ride.id === this.state.selectedRide;

    return (
      <div
        className={"rideListItem" + (selected ? " selected" : "")}
        key={ride.id}
        onClick={() => this.selectRide(ride)}
      >
        <p>
          <UserNametag userId={ride.passengerJourney.userId} /> riding with{" "}
          <UserNametag userId={ride.driverJourney.userId} />
        </p>
      </div>
    );
  };

  private renderSidebar() {
    if (this.state.loading) {
      return <div style={{ width: 250 }}>Loading . . . </div>;
    }
    return (
      <div style={{ width: 250 }}>
        <p>
          {this.state.rides.length} active rides |{" "}
          <a onClick={this.refresh}>[refresh]</a>
        </p>
        <div>{this.state.rides.map(this.renderRide)}</div>
      </div>
    );
  }

  render() {
    return (
      <section style={{ display: "flex", flex: 1 }}>
        {this.renderSidebar()}
        <RideMap
          onUpdate={this.refresh}
          ride={
            this.state.selectedRide
              ? this.state.rides.find(r => r.id === this.state.selectedRide)
              : null
          }
        />
      </section>
    );
  }
}

interface RideMapProps {
  onUpdate: () => void;
  ride: any | null;
}

class RideMap extends React.Component<RideMapProps> {
  state = {
    map: null as null | any
  };

  componentDidMount() {
    this.setState({
      map: new mapboxgl.Map({
        container: "active-rides-map",
        style: "mapbox://styles/mapbox/outdoors-v11",
        center: saltLakeCenter,
        zoom: 12
      })
    });
  }

  render() {
    return (
      <div style={{ flex: 1 }} id="active-rides-map">
        {this.state.map !== null &&
          this.props.ride !== null && [
            this.props.ride.passengerJourney.currentLocation !== null && (
              <RideMapMarker
                key="passenger"
                map={this.state.map}
                journey={this.props.ride.passengerJourney}
                onUpdate={this.props.onUpdate}
              />
            ),
            this.props.ride.driverJourney.currentLocation !== null && (
              <RideMapMarker
                key="driver"
                map={this.state.map}
                journey={this.props.ride.driverJourney}
                onUpdate={this.props.onUpdate}
              />
            )
          ]}
      </div>
    );
  }
}

interface RideMapMarkerProps {
  map: mapboxgl.Map;
  journey: any;
  onUpdate: () => void;
}

class RideMapMarker extends React.Component<RideMapMarkerProps> {
  constructor(props: RideMapMarkerProps) {
    super(props);
    let el = document.createElement("img");
    el.id = "marker";
    el.width = 30;
    el.height = 30;

    el.src = defaultProfile;

    el.addEventListener("dragstart", e => {
      e.preventDefault();
      return false;
    });

    this.marker = new mapboxgl.Marker(el, {
      draggable: true
    });

    this.marker.on("dragend", this.onDrag);
  }

  marker: mapboxgl.Marker;

  componentDidMount() {
    this.marker.addTo(this.props.map);
  }

  componentWillUnmount() {
    this.marker.remove();
  }

  render() {
    let coordinates = this.props.journey.currentLocation.coordinates;
    this.marker.setLngLat(coordinates);
    (this.marker.getElement() as HTMLImageElement).src = defaultProfile;
    fetchAPI("/getUserImage/" + this.props.journey.userId)
      .then(resp => resp.json())
      .then(json => {
        if (json.userImage === null) {
          (this.marker.getElement() as HTMLImageElement).src = defaultProfile;
        } else {
          (this.marker.getElement() as HTMLImageElement).src = json.userImage;
        }
      });
    return null;
  }

  private onDrag = () => {
    var lngLat = this.marker.getLngLat();
    console.log(`moving user #${this.props.journey.userId} to new location: `, [
      lngLat.lat,
      lngLat.lng
    ]);
    fetchAPI("/journeys/updateLocation/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: this.props.journey.userId,
        currentLocation: [lngLat.lat, lngLat.lng]
      })
    })
      .then(async resp => {
        if (resp.status !== 200) {
          throw new Error("backend responded with error");
        }
        let j = await resp.json();
        this.marker.getElement().style.borderColor = "white";
        this.props.onUpdate();
      })
      .catch(error => {
        console.log(error);
      });
    this.marker.getElement().style.borderColor = "orange";
  };
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
