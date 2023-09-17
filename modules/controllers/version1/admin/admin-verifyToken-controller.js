const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class adminVerifyTokenController extends Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname',
                populate : {
                    path : 'dormitory',
                    select : 'name'
                }
            },
            {
                path : 'user',
                select : 'firstname lastname'
            }
        ]
        this.model.VerifyToken.paginate(
            { },
            { page : page , limit : 10  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {

            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
                success : true,
                status :200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            })
    };

    store = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        let verifyToken = new this.model.VerifyToken({
            user : req.user._id,
            valid_from : Date.now(),
            valid_until : this.addDays(28),
            value : this.generateToken() // this value should unique bin
        });

        verifyToken.save((err , token) => {
            if (err)
                return res.json({
                    data: err,
                    success: false,
                    status: 500
                })

            return res.json({
                data : token,
                success: true,
                status: 201
            })
        })
    }

    generateToken(){
        let randomChars = '0123456789';
        let result = '';
        for ( let i = 0; i < 6; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }

        //check token unique
        this.model.VerifyToken.findOne({value : result} , (err , verifyToken) => {
            if (verifyToken) return this.generateToken()
        })
        return result
    };

    addDays(days) {
        let result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    };

}


module.exports = new adminVerifyTokenController()
