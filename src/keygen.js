import Keygen from "@themaximalist/keygen.js"

const keygen = new Keygen({
    account_id: process.env.KEYGEN_ACCOUNT_ID,
    ignore_ssl: true,
});

export default keygen;