import dotenv from "dotenv-extended";
dotenv.load();

import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js";
import * as middleware from "./middleware.js";

const hummingbird = new Hummingbird();
hummingbird.app.use(middleware.authorize);

hummingbird.get("/", "index");
hummingbird.get("/products", controllers.products.index);
hummingbird.get("/products/create", "create_product");
hummingbird.post("/products/create", controllers.products.handle_create);
hummingbird.get("/product/:product_id", controllers.products.show);
hummingbird.get("/product/:product_id/policies/create", controllers.policies.create);
hummingbird.post("/product/:product_id/policies/create", controllers.policies.handle_create);
hummingbird.get("/product/:product_id/licenses/create", controllers.licenses.create);
hummingbird.post("/product/:product_id/licenses/create", controllers.licenses.handle_create);
hummingbird.get("/license/:license_id", controllers.licenses.show);

hummingbird.app.post("/webhooks/paddle", controllers.paddle.handle_webhook);

await hummingbird.start();
