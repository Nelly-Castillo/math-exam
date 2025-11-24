module.exports = (req, res ) => {
    // res.send("API funcionando");
    return res.status(200).json(
        {
            code:200,
            message: "API working"
        }
    )
}