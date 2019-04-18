import React from "react";
import {
  TouchableHighlight,
  StyleSheet,
  View,
  Button,
  Text,
  ImageStore
} from "react-native";
import { Facebook } from "expo";
import Icon from "react-native-vector-icons/FontAwesome";
import { Styles } from "../../constants/Styles";
import Colors from "../../constants/Colors";
import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";

interface AuthLandingScreenProps {
  navigation: any;
}

export default class AuthLandingScreen extends React.Component<
  AuthLandingScreenProps
> {
  constructor(props: AuthLandingScreenProps) {
    super(props);
    this._bootstrapAsync();
  }

  state = {
    isLoading: false,
    status: null,
    user_status: null,
    vehicle_status: null,
    error: null
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let userDetails = await UserSession.get();
    if (userDetails != null) {
      this.props.navigation.navigate("Main");
    }
  };

  facebookLogIn = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync("374243250093123", {
        permissions: ["public_profile", "email", "user_link"]
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        console.log(token);
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,first_name,last_name,email,link,picture.height(500)&access_token=${token}&redirect=0`
        );
        const details = await response.json();

        //create user if this is their first time logging in

        const user = await this.getFacebookUser(details.email);
        if (user && user != null && this.state.status === 200) {
          this._saveUserAsync(user);
        } else {
          // now save the picture
          const uri = details.picture.data.url;

          this.toDataUrl(uri, (myBase64: any) => {
            let photo = myBase64;

            this.createUser(
              details.first_name,
              details.last_name,
              details.email,
              details.link,
              photo
            );
          });
        }
      } else {
        console.log("cancel");
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  toDataUrl(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  getFacebookUser(email: string) {
    return fetchAPI("/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: "facebook"
      })
    })
      .then(response => {
        //this is how to actual check status. you cannot after response.json()
        this.setState({
          status: response.status
        });
        return response.json();
      })
      .then(responseJson => {
        console.log(responseJson);
        if (this.state.status === 404) {
          this.setState({
            error: responseJson.message
          });
          return null;
        } else {
          return responseJson;
        }
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  }

  createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    facebookLink: string,
    photo: any
  ) => {
    this.setState({ isLoading: true });

    return fetchAPI("/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: "facebook",
        facebookLink: facebookLink
      })
    })
      .then(response => {
        //this is how to actual check status. you cannot after response.json()
        console.log("Server stat response: " + response.status);

        this.setState({
          user_status: response.status
        });
        return response.json();
      })
      .then(responseJson => {
        if (this.state.user_status === 400 || this.state.user_status === 500) {
          try {
            this.setState({
              error: responseJson.errors[0].message
            });
          } catch (err) {
            this.setState({
              error: "Something went very wrong"
            });
          }
          return;
        } else {
          fetchAPI("/vehicles", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: responseJson.id
            })
          })
            .then(response => {
              //this is how to actual check status. you cannot after response.json()
              console.log("Server stat response: " + response.status);

              this.setState({
                vehicle_status: response.status
              });
              return response.json();
            })

            .then(vehicleJson => {
              if (
                this.state.vehicle_status === 400 ||
                this.state.vehicle_status === 500
              ) {
                try {
                  this.setState({
                    error: vehicleJson.errors[0].message
                  });
                } catch (err) {
                  this.setState({
                    error: "Something went very wrong cars"
                  });
                }
              } else {
                responseJson.vehicles = [vehicleJson];
                return this._saveUserAsync(responseJson).catch(console.log);
              }
            })
            .catch(error => {
              console.log(error);
            });

          // create the user's bio
          fetchAPI("/createBio", {
            method: "POST",
            headers: {
              Accept: "appplicaton/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: responseJson.id,
              ridesGiven: 0,
              ridesTaken: 0,
              image: photo
            })
          }).catch(error => console.log(error));
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => this.setState({ isLoading: false }));
  };

  private _saveUserAsync = async (userDetails: any) => {
    await UserSession.set(userDetails);
    this.props.navigation.navigate("Main");
  };

  render() {
    return (
      <View style={[Styles.wrapper, Styles.container]}>
        <View style={styles.title}>
          <Text style={[Styles.titleText]}>Ride Surfer</Text>
        </View>

        <View style={styles.buttonsView}>
          <View style={styles.item}>
            <Button
              color={Colors.primary}
              title="Log in"
              onPress={() => this.props.navigation.navigate("Login")}
            />
          </View>
          <View style={styles.item}>
            <Button
              color={Colors.primary}
              title="Sign Up"
              onPress={() => this.props.navigation.navigate("Signup")}
            />
          </View>
          <View style={[styles.item, { flex: 1 }]}>
            <TouchableHighlight
              underlayColor="#99d9f4"
              onPress={this.facebookLogIn}
              style={{ height: 50 }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#3b5998",
                  paddingVertical: 7,
                  paddingHorizontal: 7,
                  borderRadius: 5,
                  justifyContent: "center"
                }}
              >
                <Icon name={"facebook"} color="white" size={25} />
                <Text
                  style={{
                    fontSize: 18,
                    color: "#FAFAFA",
                    marginLeft: 10,
                    marginTop: 2
                  }}
                >
                  Sign In with Facebook
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 2,
    justifyContent: "center"
  },
  item: {
    paddingBottom: 10
  },
  buttonsView: {
    flex: 1
  }
});
