module.exports = (req , res , next) => {
    if (req.student.verified === true){
        next();
        return;
    }
    return res.json({
        data : 'no access to this route',
        success : false,
        status : 403
    })
}
