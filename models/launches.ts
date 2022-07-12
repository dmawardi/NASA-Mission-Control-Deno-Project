import * as log from "https://deno.land/std/log/mod.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

// Interfaces
interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}
// maps are like JS objects but the keys
// don't need to be strings
const launches = new Map<number, Launch>();

/**
 * Sends GET request to Space-X API for launch data
 * @returns Launch Data from spaceX
 */
async function downloadLaunchData() {
  log.info("Downloading launch data...");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
    method: "GET",
  });

  if (!response.ok) {
    log.warning("Problem downloading launch data.");
    throw new Error("Launch data download failed.");
  }
  //   console.log("response: ", response);
  const launchData = await response.json();
  for (const launch of launchData) {
    // Extract payload data
    const payloads = launch["rocket"]["second_stage"]["payloads"];

    //   Map through payloads extracting customer as single list
    const customers = _.flatMap(payloads, (payload: any) => {
      return payload["customers"];
    });
    // Extract values of importance
    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      // add above customers
      customers,
    };

    //   Add flight Number as key and flightdata as data
    launches.set(flightData.flightNumber, { ...flightData });
  }
  return launches;
}

// const response = await createNewPerson();
// import meta provides {url: filepath, main: Boolean}
// main indicates if its being used as main file or imported
await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches`);
// console.log("response.data: ", response);

export function getAll() {
  // Build array from map values
  return Array.from(launches.values());
}

export function getOne(id) {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
}

export function addOne(launch: Launch) {
  launches.set(
    launch.flightNumber,
    Object.assign(launch, { upcoming: true, customers: ["Danoya", "NASA"] })
  );
}

export function removeOne(id: number) {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.success = false;
    aborted.upcoming = false;
  }
  return aborted;
}
