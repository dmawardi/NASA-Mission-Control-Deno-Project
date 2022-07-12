import { join, BufReader, parse } from "../deps.ts";
import { _ } from "../deps.ts";

// now `_` is imported in the global variable, which in deno is `self`
// const _ = (self as any)._;

// interface Planet {
//   // key is string with string value
//   [key: string]: string;
// }
// alternative way to write
type Planet = Record<string, string>;

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    // Use Number constructor to ensure they're numbers
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);
    // Return planet if it has favorable characteristics
    return (
      planet["koi_disposition"] === "CONFIRMED" &&
      //   Ideal planet radius
      planetaryRadius > 0.5 &&
      planetaryRadius < 1.5 &&
      //   Ideal stellar mass
      stellarMass > 0.78 &&
      stellarMass < 1.04 &&
      //   Ideal stellar radius
      stellarRadius > 0.99 &&
      stellarRadius < 1.01
    );
  });
}

let planets: Array<Planet>;

/**
 * Loads planet data from CSV file and
 * filters for habitable planets
 */
async function loadPlanetsData() {
  // join takes a folder and file name as params
  //   helps ensure that the path is OS ambiguous
  const path = join("data", "kepler_exoplanets_nasa.csv");

  //   Open the file using std library
  const data = await Deno.open(path);

  // Read csv data using BufReader
  const bufReader = new BufReader(data);
  //   Parse with options
  const parsedData = await parse(bufReader, {
    comment: "#",
    skipFirstRow: true,
  });
  //   Close the file using the id
  Deno.close(data.rid);

  //   Type assertion in TS
  const planets = filterHabitablePlanets(parsedData as Array<Planet>);

  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad",
      "koi_srad",
      "koi_smass",
      "kepler_name",
      "koi_count",
      "koi_steff",
    ]);
  });
}

planets = await loadPlanetsData();

// for (const planet of planets) {
//   console.log(planet);
// }

console.log(`${planets.length} habitable planets found!`);

/**
 * Returns data extracted from the keplar planet db csv
 * @returns planets data from csv
 */
export function getAllPlanets() {
  return planets;
}
