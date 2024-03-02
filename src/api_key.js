import keygen from "./keygen.js";

const token = await keygen.createToken(
    process.env.KEYGEN_ACCOUNT_EMAIL,
    process.env.KEYGEN_ACCOUNT_PASSWORD
);

const api_key = token.attributes.token;

export default api_key;
