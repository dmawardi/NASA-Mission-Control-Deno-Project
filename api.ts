import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "NASA Program running";
});

router.get("/planets", (ctx) => {
  // ctx.throw(501, "Sorry, planets aren't available");
  ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", (ctx) => {
  // ctx.throw(501, "Sorry, planets aren't available");
  ctx.response.body = launches.getAll();
});

router.get("/launches/:id", (ctx) => {
  // Will return undefined if params doesn't exist rather than error
  if (ctx.params?.id) {
    const launch = launches.getOne(Number(ctx.params.id));
    if (launch) {
      ctx.response.body = launch;
    } else {
      ctx.throw(400, "Launch with that ID doesn't exist");
    }
  }
});

router.delete("/launches/:id", (ctx) => {
  // Will return undefined if params doesn't exist rather than error
  if (ctx.params?.id) {
    const result = launches.removeOne(Number(ctx.params.id));
    ctx.response.body = { success: true };
  }
});

router.post("/launches", async (ctx) => {
  const body = await ctx.request.body().value;
  launches.addOne(body);

  // set body
  ctx.response.body = { success: true };
  // set response
  ctx.response.status = 201;
});

export default router;
