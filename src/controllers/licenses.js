import keygen from "../keygen.js";
import api_key from "../api_key.js";

export async function show(req, res) {
    const { license_id } = req.params;
    const license = await keygen.getLicense(api_key, license_id);
    res.render('license', { license });
}