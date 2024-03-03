import keygen from "../keygen.js";
import api_key from "../api_key.js";

export async function show(req, res) {
    const { license_id } = req.params;
    const license = await keygen.getLicense(api_key, license_id);
    res.render('license', { license });
}

export async function create(req, res) {
    const { product_id, policy_id } = req.params;
    const product = await keygen.getProduct(api_key, product_id);
    const policies = await keygen.getPolicies(api_key, product_id);
    res.render('create_license', { product, policies });
}

export async function handle_create(req, res) {
    const { policy_id, email } = req.body;

    const license = await keygen.createLicense(api_key, policy_id, { email });
    return res.redirect(`/license/${license.id}`);
}