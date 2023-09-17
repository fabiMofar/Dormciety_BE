const Controller = require('../../controller');
const { validationResult } = require('express-validator');

class studentVerificationController extends Controller {

    //get information for letter page
    informationLetter = (req, res) => {
        this.model.Student.findById(req.student._id , (err, result) => {
            if (err){
                return res.json({
                    data : 'no such student found',
                    success: false,
                    status: 404
                })
            }
            return res.json({
                data : {
                    firstname : result.firstname,
                    lastname : result.lastname,
                    dormitory : result.dormitory,
                    city : result.city
                },
                success: true,
                status: 200
            })
        }).populate([
            {
                path : 'dormitory',
                select : 'street houseNumber postalCode'
            },
            {
                path : 'city',
                select : 'name'
            }
        ])
    };

    // request a letter for verification
    requestToVerifyByPost = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        // store verification  request in database
        let verification = new this.model.VerificationPerToken({
            student: req.student._id,
            verification_type : "per_post"
        })

        verification.save((err, verification) => {
            if (err){
                if (err.code === 11000){
                    return res.json({
                        data : 'verification process has started',
                        success: false,
                        status: 11000
                    })
                }
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            //update profile of student and store RoomNr.
            this.model.Profile.updateOne({student : req.student._id} , { roomNr : req.body.roomNr} , (err , profile) => {
                if (err){
                    if (!profile){
                        return res.json({
                            data : 'no profile Found',
                            success: false,
                            status : 404
                        })
                    }

                    return res.json({
                        data : 'server error',
                        success: false,
                        status : 500
                    })
                }
            })

            return res.json({
                data : 'request to Verification has created.',
                success: true,
                status : 201
            })
        })
    };

    // student verified code by letter
    submitVerifiedByLetter = async (req , res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.json({
                    errors: errors.array(),
                    success: false,
                    status : 422
                })
            }

            const verification = await this.model.VerificationPerToken.findOne({ student : req.student._id}).exec();
            const student = await this.model.Student.findById(req.student._id).exec()
            if (!verification){
                return res.json({
                    data : 'no verification found',
                    success: false,
                    status : 404
                })
            }

            const token = await this.model.VerifyToken.findById(verification.verifyToken).exec();
            if (!token){
                return res.json({
                    data : 'not found',
                    success: false,
                    status : 404
                })
            }
            if (token.value !== req.body.code)
                return res.json({
                    data : 'this Code is incorrect',
                    success: false,
                    status : 202
                })

            if (token.used === true)
                return res.json({
                    data : 'this Token is not valid',
                    success: false,
                    status : 202
                })

            let date = new Date();
            if ( date >= token.valid_until )
                return res.json({
                    data : 'this Token is expired',
                    success: false,
                    status : 202
                })

             verification.verified_at = new Date();
             token.used = true;
             student.verified = true;
             student.verified_at = new Date();

             await verification.save()
             await token.save();
             await student.save();

             return res.json({
                 data : 'verified',
                 success: true,
                 status : 201
             })

        }catch (e) {
            console.log(e)
        }
        // const errors = validationResult(req);
        // if (!errors.isEmpty()){
        //     return res.json({
        //         errors: errors.array(),
        //         success: false,
        //         status : 422
        //     })
        // }
        //
        //
        //
        // await this.model.VerificationPerToken.findOne({ student : req.student._id } , (err , result) => {
        //     if (!result){
        //         return res.json({
        //             data : 'no verification',
        //             success: false,
        //             status : 404
        //         })
        //     }
        //     this.model.VerifyToken.findOne({_id : result.verifyToken} , (err , token) => {
        //         if (!token){
        //             return res.json({
        //                 data : 'not found',
        //                 success: false,
        //                 status : 404
        //             })
        //         }
        //         if (token.used === true)
        //             return res.json({
        //                 data : 'this Token is not valid',
        //                 success: false,
        //                 status : 202
        //             })
        //
        //         let date = new Date();
        //         if ( date >= token.valid_until )
        //             return res.json({
        //                 data : 'this Token is expired',
        //                 success: false,
        //                 status : 202
        //             })
        //
        //         if (token.value !== req.body.code)
        //             return res.json({
        //                 data : 'this Code is incorrect',
        //                 success: false,
        //                 status : 202
        //             })
        //
        //
        //         this.model.VerificationPerToken.updateOne({student : req.student._id} , { verified_at : new Date()} , (err) => {
        //             this.model.VerifyToken.updateOne({_id : token._id} , { used : true} , (err) => {
        //                 if (err)
        //                     return res.json({
        //                         data : err,
        //                         success: false,
        //                         status : 500
        //                     })
        //
        //                 this.model.Student.findByIdAndUpdate(req.student._id , {
        //                     verified : true,
        //                     verified_at : new Date()
        //                 } , (err , student) => {
        //                     if (err)
        //                         return res.json({
        //                             data : 'server error',
        //                             success : false,
        //                             status : 500
        //                         })
        //
        //                     return res.json({
        //                         data : 'student is verified',
        //                         success : true,
        //                         status : 201,
        //                     })
        //                 })
        //             });
        //         });
        //     })
        // })
    };

    //council generate a Code with this function
    registerToken = (req , res) => {

        let verifyToken = new this.model.VerifyToken({
            student : req.student._id, // council
            valid_from : Date.now(),
            valid_until : this.addDays(28),
            value : this.generateToken()
        });

        verifyToken.save((err , token) => {
            if (err){
                return res.json({
                    data : 'server error',
                    success: false,
                    status : 500
                })
            }

            return res.json({
                data : token,
                success: true,
                status: 201
            })
        });
    };

    // verification Routes for councils
    councilVerification = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        if(req.files.image){
            var image = req.files.image.map(image => image.path.replace(/\\/g , '/'));
        }
        if(req.files.attachment){
            var attachment = req.files.attachment.map(attachment => attachment.path.replace(/\\/g , '/'));
        }

        const councilVerification = new this.model.CouncilVerification({
            student : req.student._id,
            protocol_image : image ,
            protocol_attachment : attachment,
            review : 'waiting'
        })

        councilVerification.save((err , council) => {
            if (err)
                return res.json({
                    data : 'server error',
                    success : false,
                    status : 500
                })

            return res.json({
                data : 'your verification request has successfully submited',
                success : true,
                status : 201
            })
        })
    };

    // submit verified by admin & council Code
    submitVerifiedTokenByCouncil = async(req , res) => {
        try {
            // find verify token of student code
            const verifyToken = await this.model.VerifyToken.findOne({value : req.body.verifyCode}).exec();
            // check verify token is or not
            if (!verifyToken){
                return res.json({
                    data : 'not found',
                    success : false,
                    status : 404
                })
            }

            const date = new Date();

            // check the code is valid
            if (verifyToken.valid_until <= date){
                return res.json({
                    data : 'code is invalid',
                    success: false,
                    status : 402
                })
            }

            // check the code not used
            if (verifyToken.used === true){
                return res.json({
                    data : 'code is invalid',
                    success: false,
                    status : 402
                })
            }


            //find verification of student
            const verification = await this.model.VerificationPerToken.findOne({ student : req.student._id}).exec();

            //check the student not verified before
            if (verification){
                await verification.remove()
            }

            // update verify token collection and the code is used
            verifyToken.used = true;
            await verifyToken.save()

            // create a verfication collection for the student
            let newVerification = new this.model.VerificationPerToken({
                student : req.student._id,
                verifyToken : verifyToken._id,
                verified_at : date,
                verification_type : 'per-council'
            })
            await newVerification.save();

            // update the student and verified
            this.model.Student.findByIdAndUpdate(req.student._id , {
                verified : true,
                verified_at : date
            } , (err) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success: false,
                        status : 500
                    })

                return res.json({
                    data : 'student is verified',
                    success: true,
                    status : 201
                })
            })
        }catch (e){
            console.log(e)
        }
    }

    generateToken(){
        let randomChars = '0123456789';
        let result = '';
        for ( let i = 0; i < 6; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result
    }

    addDays(days) {
        let result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }
}


module.exports = new studentVerificationController();
