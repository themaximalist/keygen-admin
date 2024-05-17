import { Paddle, Environment, WebhooksValidator } from "@paddle/paddle-node-sdk"
import keygen from "../keygen.js";
import getAPIKey from "../api_key.js";
import { sendLicenseEmail } from "../mail.js";

const mapping = JSON.parse(process.env.PRODUCT_POLICY_MAPPING || "{}");
if (Object.keys(mapping).length === 0) {
    console.log("Expected PRODUCT_POLICY_MAPPING to be set")
    process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
    WebhooksValidator.MAX_VALID_TIME_DIFFERENCE = 1000;
}

const environment = process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox;
const paddle = new Paddle(process.env.PADDLE_API_KEY, { environment });

export async function handle_webhook(req, res) {
    const api_key = await getAPIKey();

    const webhook = verifyWebhook(req);

    if (!webhook) {
        console.log("Invalid webhook signature");
        return res.status(401).send("Invalid webhook signature");
    }

    if (webhook.origin === "subscription_recurring") {
        console.log("Ignoring recurring subscription");
        return res.send("OK");
    }

    const data = await fetchData(webhook);

    const policy_id = mapping[data.productId];
    if (!policy_id) {
        console.log("Invalid product <-> policy mapping");
        return res.status(400).send("Invalid policy");
    }

    if (!webhook.items) {
        console.log("Invalid webhook data");
        return res.status(400).send("Invalid webhook data");
    }

    const price = webhook.items[0].price;
    if (!price) {
        console.log("Invalid webhook data");
        return res.status(400).send("Invalid webhook data");
    }

    if (!price.description) {
        console.log("Invalid webhook data");
        return res.status(400).send("Invalid webhook data");
    }

    const edition = price.description;

    const license = await keygen.createLicense(api_key, policy_id, {
        email: data.customerEmail,
        edition,
    });

    if (!license) {
        console.log("Error creating license");
        return res.status(500).send("Error creating license");
    }

    const key = license.attributes.key;

    const sentEmail = await sendLicenseEmail(data.customerEmail, key);
    if (!sentEmail) {
        console.log("Error sending email");
        return res.status(500).send("Error sending email");
    }

    res.send("OK");
}

async function fetchData(webhook) {
    const { id, customerId, items } = webhook;
    if (!id || !customerId || !items || items.length === 0) {
        console.log("Invalid webhook data");
        return null;
    }

    const priceId = items[0].price.id;
    const productId = items[0].price.productId;
    if (!priceId || !productId) {
        console.log("Invalid webhook data");
        return null;
    }

    const customer = await paddle.customers.get(customerId);
    if (!customer) {
        console.log("Invalid customer");
        return null;
    }

    return {
        id,
        customerId,
        priceId,
        productId,
        customerEmail: customer.email,
    };
}

function verifyWebhook(req) {
    const signature = req.headers["paddle-signature"] || "";
    const rawRequestBody = req.rawBody || "";
    const secretKey = process.env["PADDLE_WEBHOOK_SECRET"] || "";

    try {
        if (signature && rawRequestBody) {
            const eventData = paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
            if (!eventData.data) {
                console.log('Invalid webhook data');
                return null;
            }

            if (eventData.data.status !== "completed") {
                console.log('Ignoring non-completed event');
                return null;

            }

            return eventData.data;
        } else {
            console.log('Signature missing in header');
            return null;
        }
    } catch (e) {
        console.log("ERROR");
        console.log(e);
        return null;
    }
}
