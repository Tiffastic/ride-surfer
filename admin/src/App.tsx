import React from "react";
import mapboxgl from "mapbox-gl";

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
  { name: "Journeys", render: () => <Journeys /> }
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
      <span>
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
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXRoYW5yYW4iLCJhIjoiY2pya3V6MGwyMDF1NzQzbXRnMHl3cGN5aiJ9.Y-iyykoUZuKEG7OyfRZDQw";
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
    page: pages.find(p => p.name === "Journeys")
  };

  render() {
    return (
      <div className="container">
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
        <main>
          {this.state.page ? this.state.page.render() : "No page selected"}
        </main>
      </div>
    );
  }
}

export default App;
