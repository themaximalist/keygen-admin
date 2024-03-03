import Keygen from "@themaximalist/keygen.js"

const keygen = new Keygen({
    account_id: process.env.KEYGEN_ACCOUNT_ID,
    base_url: process.env.KEYGEN_BASE_URL,
});

export default keygen;