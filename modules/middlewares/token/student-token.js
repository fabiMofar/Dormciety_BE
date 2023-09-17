const jwt = require('jsonwebtoken');
const Student = require('../../models/student');

//configuration Json Web Token

module.exports = new class studentToken {

    token(req , res , next){
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(token) {
            return jwt.verify(token , config.secret , (err , decoded ) => {
                if(err) {
                    return res.json({
                        data : 'To access this section, please log in first',
                        success : false ,
                        status : 403
                    })
                }

                Student.findById(decoded.id , (err , student) => {
                    if(err) throw err;
                    if(student) {
                        student.token = token;
                        req.student = student;
                        next();

                    } else {
                        return res.json({
                            data : 'To access this section, please log in first',
                            success : false ,
                            status : 403
                        });
                    }
                })

                // next();
                // return;
            })
        }
        return res.json({
            data : 'To access this section, please log in first',
            success : false,
            status : 403
        })
    }
}
