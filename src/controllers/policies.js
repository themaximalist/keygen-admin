import keygen from "../keygen.js";
import getAPIKey from "../api_key.js";

export async function create(req, res) {
    const { product_id } = req.params;
    const api_key = await getAPIKey();
    const product = await keygen.getProduct(api_key, product_id);
    res.render('create_policy', { product });
}

export async function handle_create(req, res) {
    const { product_id } = req.params;
    const api_key = await getAPIKey();
    const product = await keygen.getProduct(api_key, product_id);

    const { data } = req.body;
    try {
        const attributes = JSON.parse(data);
        const policy = await keygen.createPolicy(api_key, product.id, attributes);
        return res.redirect(`/product/${product.id}`);
    } catch (e) {
        return res.render('create_policy', { error: "Invalid JSON data", data, product });
    }
}