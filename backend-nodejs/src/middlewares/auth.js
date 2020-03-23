const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //simple verifications for performance improvement

    if (!authHeader)
        return res.status(401).send({ error: 'No token provided' });

    const tokenBody = authHeader.split(' ');

    if (tokenBody.length !== 2)
        return res.status(401).send({ error: 'Token malformatted' });

    const [scheme, token] = tokenBody;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' });

    jwt.verify(token, authConfig.secret, (err, decoded) =>
    {
        if(err) 
            return res.status(401).send({error:'Invalid token'});

        req.userId = decoded.id;
        
        return next();
    });
};