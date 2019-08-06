import http from "k6/http";
// import { start } from "repl";
// import { sleep } from "k6";

export let options = {
  vus: 120,
  duration: "60s"
};

export default function () {
  let restaurant;
  const chance = Math.random();
  if (chance < .95) {
    restaurant = 10000000 - (1 + Math.floor(Math.random() * 10000));
  } else {
    restaurant = 1 + Math.floor(Math.random() * 10000);
  }

//   const categ = Math.floor(chance * 100);
//   const stars = Math.floor(chance * 5);

//   const payload = JSON.stringify({ dateStamp: "2012-12-21", star: stars });
//   const params = { headers: { "Content-Type": "application/json" } }

  http.get(`http://localhost:3100/${restaurant}/header`);
//   http.get(`http://localhost:3003/${restaurant}/${categ}`);
  // http.post(`http://localhost:3003/${restaurant}/header/review`, payload, params);
//   sleep(1);
}
