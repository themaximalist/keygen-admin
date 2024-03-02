import keygen from "../keygen.js";
import api_key from "../api_key.js";

export async function show(req, res) {
    const { license_id } = req.params;
    const license = await keygen.getLicense(api_key, license_id);
    res.render('license', { license });
}

export async function create(req, res) {
    const { product_id } = req.params;
    const product = await keygen.getProduct(api_key, product_id);
    // TODO: get policies for product
    // TODO: select which policy for license
    res.render('create_license', { product });
}

export async function handle_create(req, res) {
    const { product_id } = req.params;
    const product = await keygen.getProduct(api_key, product_id);

    const { data } = req.body;
    try {
        const policy = await keygen.createPolicy(api_key, product.id, attributes);
        return res.redirect(`/product/${product.id}`);
    } catch (e) {
        return res.render('create_policy', { error: "Invalid JSON data", data, product });
    }
}