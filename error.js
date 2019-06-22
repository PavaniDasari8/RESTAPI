//TO-DO: handle 404 html and plain text formates

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

module.exports = (req, res) => {
    res.status(404);
    res.send({ error: '404 please check your route. Route Not found' });
    
    return true;
};

