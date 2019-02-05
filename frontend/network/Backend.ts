const API_URL = "https://ride-surfer.herokuapp.com";

// const API_URL = "http://10.0.1.14:5000";

export function fetchAPI(path: string, info?: RequestInit) {
  console.log(`${(info && info.method) || "GET"} @ ${API_URL} to ${path}`);
  return fetch(API_URL + path, info);
}
