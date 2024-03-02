import dotenv from "dotenv-extended";
dotenv.load();

import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js";

const hummingbird = new Hummingbird();
hummingbird.get("/", controllers.products.index);
hummingbird.get("/product/:product_id", controllers.products.show);

await hummingbird.start();
