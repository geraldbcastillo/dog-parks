import React from "react";
import ReactDOM from "react-dom";
import FormInput from "./FormInput";

let lat;
let lng;
let limit;
let radius;
let dogParks = [];

const GOOGLE_API = "https://maps.googleapis.com/maps/api/geocode/json?key=";
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_REQUEST = GOOGLE_API + GOOGLE_API_KEY;

const FOUR_SQUARE_API =
  "https://api.foursquare.com/v2/venues/search?v=20180323&query=dog+park";
const FOUR_SQUARE_CLIENT_ID = process.env.REACT_APP_FOUR_SQUARE_CLIENT_ID;
const FOUR_SQUARE_CLIENT_SECRET =
  process.env.REACT_APP_FOUR_SQUARE_CLIENT_SECRET;
const FOUR_SQUARE_REQUEST =
  FOUR_SQUARE_API +
  "&client_id=" +
  FOUR_SQUARE_CLIENT_ID +
  "&client_secret=" +
  FOUR_SQUARE_CLIENT_SECRET;

const FormContainer = function(props) {
  return (
    <div>
      <h1>Dog Park Locator</h1>
      {props.children}
    </div>
  );
};

const FormSubmit = function() {
  return (
    <div className="text-center">
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </div>
  );
};

const Validate = function(state) {
  if (state.zip.length !== 5) {
    alert("Enter a 5 digit zip code");
    return false;
  }
  if (state.limit < 1 || state.limit > 50) {
    alert("Enter a valid maximum number of result [1,50]");
    return false;
  }
  if (state.radius < 1 || state.radius > 100) {
    alert("Enter a valid radius [1,100]");
    return false;
  }
  return true;
};

const createPark = function(element) {
  return {
    name: element.name,
    address: element.location.formattedAddress,
    distance: (element.location.distance / 1609.344).toFixed(2),
    latitude: element.location.lat,
    longitude: element.location.lng,
    link:
      "//www.google.com/maps/@" +
      element.location.lat +
      "," +
      element.location.lng +
      ",15z",
    title: "Link to " + element.name + " on Google Maps"
  };
};

const FourSquareRequest = function(limit, radius, lat, lng) {
  return (
    FOUR_SQUARE_REQUEST +
    ("&limit=" + limit) +
    ("&radius=" + radius * 1609.344) +
    ("&ll=" + lat + "," + lng)
  );
};

const FourSquareRequestResponse = function(response) {
  return response.json().then(function(data) {
    data.response.venues.forEach(function(element) {
      dogParks.push(createPark(element));
    });
    dogParks = sortParks(dogParks);
    const dogParkLocations = createDogParkLocations(dogParks);

    ReactDOM.render(
      <ul>{dogParkLocations}</ul>,
      document.getElementById("parkResults")
    );
  });
};

const sortParks = function(parks) {
  return dogParks.sort((a, b) =>
    parseFloat(a.distance) > parseFloat(b.distance) ? 1 : -1
  );
};

const createDogParkLocations = function(arr) {
  return arr.map((arr, i) => (
    <li key={arr.name + ": " + i}>
      <p>
        <strong>{arr.name}</strong>, {arr.distance} miles away
      </p>
      <p>
        {arr.address[0]}, {arr.address[1]}, {arr.address[2]}
      </p>
    </li>
  ));
};

class Form extends React.Component {
  sendData = () => {
    this.props.appCallback(true);
  };
  constructor() {
    super();
    this.state = {
      zip: "",
      radius: "20",
      limit: "10"
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  changeZip(event) {
    this.setState({ zip: event.target.value });
  }
  changeRadius(event) {
    this.setState({ radius: event.target.value });
  }
  changeLimit(event) {
    this.setState({ limit: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (Validate(this.state)) {
      if (this.state.limit) {
        limit = this.state.limit;
        this.sendData();
        radius = this.state.radius;
        fetch(GOOGLE_REQUEST + ("&address=" + this.state.zip)).then(function(
          response
        ) {
          response.json().then(function(data) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            fetch(FourSquareRequest(limit, radius, lat, lng))
              .then(function(response) {
                FourSquareRequestResponse(response);
              })
              .catch(function() {
                // Code for handling errors
              });
          });
        });
      }
    }
  }

  formInputLabel(key) {
    return key === "zip"
      ? "Zip Code"
      : key === "radius"
      ? "Radius (mi.)"
      : "Maximum Number of Results";
  }

  formOnChange(key) {
    return key === "zip"
      ? event => this.changeZip(event)
      : key === "radius"
      ? event => this.changeRadius(event)
      : event => this.changeLimit(event);
  }

  render() {
    let inputFields = Object.keys(this.state).map((key, i) => {
      return (
        <FormInput
          key={i + ": " + key}
          label={this.formInputLabel(key)}
          id={key === "zip" ? "zipCode" : key === "radius" ? "radius" : "limit"}
          value={this.state[key]}
          onChange={this.formOnChange(key)}
        />
      );
    });
    return (
      <FormContainer>
        <form onSubmit={this.handleSubmit}>
          {inputFields}
          <FormSubmit />
        </form>
      </FormContainer>
    );
  }
}

export default Form;
