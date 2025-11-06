const cors = (req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': '*'
    });
    
    if (req.method === 'OPTIONS') {
        res.set({
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '600'
        });

        return res.status(204).end();
    }

    next();
};

module.exports = cors;