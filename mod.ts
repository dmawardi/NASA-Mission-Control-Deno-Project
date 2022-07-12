import { Application, send } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import api from "./api.ts";
import * as log from "https://deno.land/std/log/mod.ts";

const app = new Application();
const port = 8000;

// Setup Logger
await log.setup({
  // Target the Info console handler
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  // for info levels and above
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

// Error event handler
app.addEventListener("error", (event) => {
  log.error(event.error);
});

app.use(async (ctx: any, next) => {
  // try to go to next middleware,
  try {
    await next();
    // but if any issues
  } catch (error) {
    // log.error(error);
    // Moved above to error handler (event listener above)
    ctx.response.body = "Internal server error";
    throw error;
  }
});

// next makes this an async function
app.use(async (ctx: any, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  log.info(`(${ctx.request.method}) ${ctx.request.url}: ${time}`);
});

// await next determines what stage it occurs
// While entering middleware downstream or exiting middleware upstream
app.use(async (ctx: any, next) => {
  const startTime = Date.now();
  await next();
  const delta = Date.now() - startTime;
  //   X- is convention for non standard headers
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

// Use routes from router in api.ts
// If no match found, serve static @ endpoint below
app.use(api.routes());
// Automatically uses a 405 response for unavailable request methods
app.use(api.allowedMethods());

// API Endpoints
// denoted by no next variables
app.use(async (ctx: any) => {
  // context is an object that contains
  // current state of application
  // properties: req and response
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.ico",
  ];
  //   If the file path is included in the whitelist
  if (fileWhitelist.includes(filePath)) {
    // then send file in filepath
    await send(ctx, filePath, {
      // Deno cwd is current working directory
      // root is the directory to serve
      root: `${Deno.cwd()}/public`,
    });
  }
});

if (import.meta.main) {
  log.info("Starting NASA Program");

  await app.listen({ port: port });
  log.info("Listening on port: " + port);
}
