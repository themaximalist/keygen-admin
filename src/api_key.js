import keygen from "./keygen.js";

let lastUpdate = null;
let apiKey = null;
let updateInterval = 1000 * 60 * 60 * 24; // 24 hours

async function updateAPIKey() {
    console.log("Updating Keygen API key");
    const token = await keygen.createToken(
        process.env.KEYGEN_ACCOUNT_EMAIL,
        process.env.KEYGEN_ACCOUNT_PASSWORD
    )

    apiKey = token.attributes.token;
    lastUpdate = Date.now();
}

export default async function getAPIKey() {
    if (apiKey === null || lastUpdate === null || Date.now() - lastUpdate > updateInterval) {
        await updateAPIKey();
    }

    return apiKey;
}