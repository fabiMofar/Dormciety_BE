const Controller = require('../../controller');
const mail = require('./../../../helpers/mail');
const bcrypt = require('bcrypt');



class studentPasswordForgottenController extends Controller{

    store = async (req , res) => {
        try {
            const student = await this.model.Student.findOne({ email : req.body.email }).exec();
            if (!student){
                return res.json({
                    data : 'Email is incorrect',
                    success : false,
                    status : 404
                })
            }
            const token = Math.floor(100000 + Math.random() * 900000)

            const resetPassword = this.model.PasswordForgotten({
                student : student._id,
                token : token,
                used : false
            })

            resetPassword.save((err, result) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })


                // send Token to Email
                let info = {
                    from: '"Dormciety Team" <info@dormciety.de>', // sender address
                    to: `${student.email}`, // list of receivers
                    subject: "Passwort zurücksetzen", // Subject line
                    text: `
                        Wir haben deine Anfrage erhalten!
                        Verwende den folgenden Code zur Bestätigung deiner Identität:
                        
                        ${token}
                        
                        Trage diesen Code in der App ein und erstelle ein neues Passwort. Dieser Code ist eine Stunde lang gültig.  Danach musst du einen neuen Code beantragen. 
                        
                        Du hast nicht um ein neues Passwort gebeten? 
                        Dann kannst du diese E-Mail ignorieren.
                    `,
                };
                mail.sendMail(info , (err , information) => {
                    if (err) return console.log(err)
                });

                return res.json({
                    data : 'password forgotten submitted',
                    success : true,
                    status : 201
                })
            })
        }catch (e){
            console.log(e)
        }
    };

    resetPassword = async (req , res) => {
        try {
            const passwordForgotten = await this.model.PasswordForgotten.findOne({ token : req.body.token , used : false}).exec();
            if (!passwordForgotten){
                return res.json({
                    data : 'Code is incorrect',
                    success : false,
                    status : 202
                })
            }

            const  diffMs = (new Date() - passwordForgotten.createdAt);
            const  diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

            if (diffMins > 30){
                return res.json({
                    data : 'over time',
                    success : false,
                    status : 202
                })
            }


            const student = await this.model.Student.findById(passwordForgotten.student).exec();

            passwordForgotten.used = true;
            passwordForgotten.resetDate = new Date();
            await passwordForgotten.save();

            //hash password
            let salt = bcrypt.genSaltSync(15);
            let hash = bcrypt.hashSync(req.body.password, salt);

            student.password = hash;
            await student.save((err) => {
                if (err)
                    return res.json({
                        data : 'server error',
                        success : false,
                        status : 500
                    })

                return res.json({
                    data : 'password reset',
                    success : true,
                    status : 200
                })
            })
        }catch (e){
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }
    };


}


module.exports = new studentPasswordForgottenController()
