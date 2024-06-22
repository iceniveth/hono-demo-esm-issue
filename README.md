This is a minial reproduction that an issue occurs when following the documentation from https://hono.dev/docs/getting-started/nodejs#dockerfile if we're using ESM import w/o the file extension.

Create a file `src/aboutRoute.ts` with the content:

```ts
import { Hono } from "hono";

const aboutRoute = new Hono().basePath("/about");
aboutRoute.get("/", (c) => {
  return c.text("This is about route!");
});

export default aboutRoute;
```

import that file in the Hono app `src/index.ts`

```diff
import { serve } from "@hono/node-server";
import { Hono } from "hono";
+import aboutRoute from "./aboutRoute";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

+app.route("/", aboutRoute);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

```

Run this in your terminal

```bash
docker compose up --build
```

It will produce

```bash
[+] Building 1.3s (16/16) FINISHED                                               docker:default
 => [app internal] load build definition from Dockerfile                                   0.0s
 => => transferring dockerfile: 655B                                                       0.0s
 => [app internal] load .dockerignore                                                      0.0s
 => => transferring context: 2B                                                            0.0s
 => [app internal] load metadata for docker.io/library/node:20-alpine                      1.1s
 => [app base 1/1] FROM docker.io/library/node:20-alpine@sha256:804aa6a6476a7e2a5df8db288  0.0s
 => [app internal] load build context                                                      0.0s
 => => transferring context: 16.80kB                                                       0.0s
 => CACHED [app runner 1/6] WORKDIR /app                                                   0.0s
 => CACHED [app runner 2/6] RUN addgroup --system --gid 1001 nodejs                        0.0s
 => CACHED [app runner 3/6] RUN adduser --system --uid 1001 hono                           0.0s
 => CACHED [app builder 1/4] RUN apk add --no-cache libc6-compat                           0.0s
 => CACHED [app builder 2/4] WORKDIR /app                                                  0.0s
 => CACHED [app builder 3/4] COPY package*json tsconfig.json src ./                        0.0s
 => CACHED [app builder 4/4] RUN npm ci &&     npm run build &&     npm prune --productio  0.0s
 => CACHED [app runner 4/6] COPY --from=builder --chown=hono:nodejs /app/node_modules /ap  0.0s
 => CACHED [app runner 5/6] COPY --from=builder --chown=hono:nodejs /app/dist /app/dist    0.0s
 => CACHED [app runner 6/6] COPY --from=builder --chown=hono:nodejs /app/package.json /ap  0.0s
Attaching to hono-demo-esm-issue-app-1
hono-demo-esm-issue-app-1  | node:internal/modules/esm/resolve:265
hono-demo-esm-issue-app-1  |     throw new ERR_MODULE_NOT_FOUND(
hono-demo-esm-issue-app-1  |           ^
hono-demo-esm-issue-app-1  |
hono-demo-esm-issue-app-1  | Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/dist/aboutRoute' imported from /app/dist/index.js
hono-demo-esm-issue-app-1  |     at finalizeResolution (node:internal/modules/esm/resolve:265:11)
hono-demo-esm-issue-app-1  |     at moduleResolve (node:internal/modules/esm/resolve:933:10)
hono-demo-esm-issue-app-1  |     at defaultResolve (node:internal/modules/esm/resolve:1157:11)
hono-demo-esm-issue-app-1  |     at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:383:12)
hono-demo-esm-issue-app-1  |     at ModuleLoader.resolve (node:internal/modules/esm/loader:352:25)
hono-demo-esm-issue-app-1  |     at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:227:38)
hono-demo-esm-issue-app-1  |     at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:87:39)
hono-demo-esm-issue-app-1  |     at link (node:internal/modules/esm/module_job:86:36) {
hono-demo-esm-issue-app-1  |   code: 'ERR_MODULE_NOT_FOUND',
hono-demo-esm-issue-app-1  |   url: 'file:///app/dist/aboutRoute'
hono-demo-esm-issue-app-1  | }
hono-demo-esm-issue-app-1  |
hono-demo-esm-issue-app-1  | Node.js v20.14.0
hono-demo-esm-issue-app-1 exited with code 1
```
