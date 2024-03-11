
export function authorize(req, res, next) {
    const reject = () => {
        res.setHeader("www-authenticate", "Basic");
        res.sendStatus(401);
    };

    if (req.path === "/webhooks/paddle") {
        return next();
    }

    const authorization = req.headers.authorization;

    if (!authorization) {
        return reject();
    }

    const [username, password] = Buffer.from(
        authorization.replace("Basic ", ""),
        "base64"
    )
        .toString()
        .split(":");

    if (!(username === process.env.SITE_USER && password === process.env.SITE_PASSWORD)) {
        return reject();
    }

    next();
}