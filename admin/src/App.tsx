import React from "react";

import { fetchAPI } from "./Backend";
import logo from "./logo.svg";
// import "./App.css";

interface Page {
  name: string;
  render: () => JSX.Element;
}

const pages: Page[] = [
  { name: "Users", render: () => <Users /> },
  { name: "Journeys", render: () => <Journeys /> }
];

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
            <li key={journey.id}>
              <p>Id: {journey.id}</p>
            </li>
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
      <div className="App">
        <header className="App-header">
          <nav>
            {pages.map(page => (
              <a key={page.name} onClick={e => this.setState({ page: page })}>
                {page.name}
              </a>
            ))}
          </nav>
          <main>
            {this.state.page ? this.state.page.render() : "No page selected"}
          </main>
        </header>
      </div>
    );
  }
}

export default App;
