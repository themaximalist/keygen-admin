import keygen from "../keygen.js";
import getAPIKey from "../api_key.js";

export async function show(req, res) {
    const { license_id } = req.params;
    const api_key = await getAPIKey();
    const license = await keygen.getLicense(api_key, license_id);
    res.render('license', { license });
}

export async function create(req, res) {
    const { product_id, policy_id } = req.params;
    const api_key = await getAPIKey();
    const product = await keygen.getProduct(api_key, product_id);
    const policies = await keygen.getPolicies(api_key, product_id);
    res.render('create_license', { product, policies });
}

export async function handle_create(req, res) {
    const { policy_id, email } = req.body;
    const api_key = await getAPIKey();

    const license = await keygen.createLicense(api_key, policy_id, { email });
    return res.redirect(`/license/${license.id}`);
}


export async function handle_delete(req, res) {
    const { license_id } = req.params;
    const api_key = await getAPIKey();
    const license = await keygen.getLicense(api_key, license_id);
    if (!license) {
        return res.status(404).send('License not found');
    }

    await keygen.deleteLicense(api_key, license.id);
    return res.redirect(`/product/${license.relationships.product.data.id}`);
}