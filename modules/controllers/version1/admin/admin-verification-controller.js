const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class adminVerificationController extends Controller {

    // get All verifications
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
        ]
        this.model.VerificationPerToken.paginate(
            { },
            { page : page , limit : 400  ,  sort : { createdAt: -1 } , populate }
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
    }

    // get All verification requests by Post
    postVerification = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname city',
                populate : [
                    {
                        path : 'dormitory',
                        select : 'name street postalCode city houseNumber'
                    },
                    {
                        path : 'city',
                        select : 'name '
                    }
                ]
            },
            {
                path: 'verifyToken',
                select: 'value valid_from valid_until',
                populate : {
                    path: 'user',
                    select : 'firstname lastname'
                }
            }
        ]
        this.model.VerificationPerToken.paginate(
            { verification_type : 'per_post' },
            { page : page , limit : 400  ,  sort : { createdAt: -1 } , populate }
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

    // get single verification request by post
    singlePostVerification = (req, res) => {
        this.model.VerificationPerToken.findById(req.params.id , (err , result) => {
            if (err)
                return res.json({
                    data : 'No such verification found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }).populate(
            [
                    {
                        path : 'student',
                        select : 'firstname lastname',
                        populate : {
                            path : 'dormitory',
                            select : 'name'
                        }
                    },
                    {
                        path: 'verifyToken',
                        select: 'value valid_from valid_until',
                        populate : {
                            path: 'user',
                            select : 'firstname lastname'
                        }
                    }
            ]
        )
    };

    //generate Token for student and his verification by post
    registerTokenForPost = (req , res) => {
        // validation check
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        // In this section, it is checked whether there is such a document with these specifications

        this.model.VerificationPerToken.findOne({ student : req.body.student_id} , (err , result) =>{
            if (!result){
                return res.json({
                    data : 'No verification Found',
                    success: false,
                    status: 404
                })
            }

            // store a token in data base for this verification request

            let verifyToken = new this.model.VerifyToken({
                user : req.user._id,
                valid_from : Date.now(),
                valid_until : this.addDays(28),
                value : this.generateToken() // this value should unique bin
            });
            verifyToken.save((err , token) => {
                if (err)
                    return res.json({
                        data : err,
                        success: false,
                        status : 500
                    })


                // store verify token value for this verification
                this.model.VerificationPerToken.updateOne({ student : req.body.student_id} , { verifyToken : token.id} , (err , verification) => {
                    if (err)
                        return res.json({
                            data : 'server error',
                            success: false,
                            status : 500
                        })

                    return res.json({
                        data : 'token generiert',
                        success: true,
                        status : 201
                    });
                });
            });
        });
    };

    // send a letter to student
    sendLetter = (req, res) => {
        this.model.VerificationPerToken.findByIdAndUpdate(req.params.id , {
            post_send : true
        } , (err , verification) => {
            if (err) {
                if (!verification){
                    return res.json({
                        data : 'There is no such verification',
                        success : false,
                        status : 404
                    })
                }

                return res.json({
                    data : 'Server error',
                    success : false,
                    status : 500
                })
            }
            return res.json({
                data : 'The letter was sent',
                success : true,
                status : 200
            })
        })
    };

    // get all verification requests by Council
    verificationsByCouncil = (req, res) => {
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
                path : 'reviewed_by',
                select : 'firstname lastname',
            },
        ]
        this.model.CouncilVerification.paginate(
            { },
            { page : page , limit : 400  ,  sort : { createdAt: -1 }  ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No verification found',
                    success : false,
                    status : 404
                })

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

    //get single of verification by council document
    singleVerificationsByCouncil = (req, res) => {
        this.model.CouncilVerification.findById(req.params.id , (err , result) => {
            if (err)
                return res.json({
                    data : 'No such verification found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }).populate(
            [
                {
                    path : 'student',
                    select : 'firstname lastname',
                    populate : {
                        path : 'dormitory',
                        select : 'name'
                    }
                },
                {
                    path : 'reviewed_by',
                    select : 'firstname lastname'
                }
            ]
        )
    };

    // admin review the document and write a note
    reviewCouncilVerification = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        this.model.CouncilVerification.findByIdAndUpdate(req.params.id , {
            review : req.body.review,
            reviewed_by : req.user._id,
            review_note : req.body.review_note,
            review_date : new Date().toString(),
        } , (err , council) => {
            if (err){
                if (!council)
                    return res.json({
                        data : 'There is no such verification by council',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })
            }

            if (council.review === 'accept'){
                this.model.Student.findOneAndUpdate({_id : council.student} , {
                    council : true,
                    verified : true,
                    verified_at : new Date(),
                } , (err , student) => {
                    if (err){
                        if (!student)
                            return res.json({
                                data : 'There is no such student',
                                success : false,
                                status : 404
                            })

                        return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })
                    }

                    return res.json({
                        data : 'verification by council is accepted',
                        success : true,
                        status : 200
                    })
                })
            }

            if (council.review === 'reject'){
                return res.json({
                    data : 'this verification with this information by Council is rejected',
                    success : true,
                    status : 200
                });
            }

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
            if (verifyToken){
                this.generateToken()
            }
        })
         return result
    };

    addDays(days) {
        let result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    };


}

module.exports = new adminVerificationController();
