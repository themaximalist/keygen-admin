import dotenv from "dotenv-extended";
dotenv.load();

import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js";

const hummingbird = new Hummingbird();
hummingbird.get("/", "index");
hummingbird.get("/products", controllers.products.index);
hummingbird.get("/product/:product_id", controllers.products.show);
hummingbird.get("/license/:license_id", controllers.licenses.show);

await hummingbird.start();
