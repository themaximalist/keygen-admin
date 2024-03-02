import keygen from "../keygen.js";
import api_key from "../api_key.js";

export async function index(req, res) {
    const products = await keygen.getProducts(api_key);
    res.render('products', { products });
}

export async function show(req, res) {
    const { product_id } = req.params;
    const product = await keygen.getProduct(api_key, product_id);
    const policies = await keygen.getPolicies(api_key, product_id);
    res.render('product', { product, policies });
}