module.exports = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    // Handle preflight, it must return 200
    if (req.method === "OPTIONS") {
        // Stop the middleware chain
        return res.status(200).end();
    }
    next();
};