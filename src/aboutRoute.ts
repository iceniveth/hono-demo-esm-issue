import { Hono } from "hono";

const aboutRoute = new Hono().basePath("/about");
aboutRoute.get("/", (c) => {
  return c.text("This is about route!");
});

export default aboutRoute;
