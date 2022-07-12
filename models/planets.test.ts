import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { filterHabitablePlanets } from "./planets.ts";

const HABITABLE_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1",
};
const UNCONFIRMED_PLANET = {
  koi_disposition: "FALSE POSITIVE",
};
const LARGE_RADIUS_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1.5",
  koi_srad: "1",
  koi_smass: "1",
};
const LARGE_SOLAR_RADIUS_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1.01",
  koi_smass: "1",
};
const LARGE_SOLAR_MASS_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1.04",
};

// Method 1 for testing
Deno.test("Filter only habitiable planets", () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    UNCONFIRMED_PLANET,
    LARGE_RADIUS_PLANET,
    LARGE_SOLAR_MASS_PLANET,
    LARGE_SOLAR_RADIUS_PLANET,
  ]);
  assertEquals(filtered, [HABITABLE_PLANET]);
});
// Method 2 for testing
Deno.test({
  name: "example test",
  fn() {
    assertEquals("deno", "deno");
    assertNotEquals({ runtime: "deno" }, { runtime: "node" });
  },
});
