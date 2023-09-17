const Controller = require('../../controller');


class studentProfileController extends Controller {

    index = (req , res) => {
        this.model.Profile.findOne({student : req.student._id}, (err , result) => {
            if (err)
                return res.json({
                    data : 'No such profile found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }).populate(
            {
                path : 'student',
                select : 'firstname lastname verified council avatar'
            }
        )
    }

    update = (req, res) => {
        this.model.Profile.findOneAndUpdate({student : req.student._id} , {
            birthday : req.body.birthday,
            showBirthday : req.body.showBirthday,
            mobile : req.body.mobile,
            showMobileNr : req.body.showMobileNr,
            sex : req.body.sex,
            showSex : req.body.showSex,
            subject : req.body.subject,
            showSubject : req.body.showSubject,
            inDorm : req.body.inDorm,
            showInDorm : req.body.showInDorm,
            degree : req.body.degree,
            showDegree : req.body.showDegree,
            hobbies : req.body.hobbies,
            showHobbies : req.body.showHobbies,
            statement : req.body.statement,
            showStatement : req.body.showStatement,
            roomNr : req.body.roomNr,
            showRoomNr : req.body.showRoomNr,
            languages : req.body.languages,
            showLanguages : req.body.showLanguages
        } , (err , profile) => {
            if (err){
                if (!profile)
                    return res.json({
                        data : 'no profile found',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'operation failed',
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'profile has successfully edited',
                success : true,
                status : 201
            })
        })
    };

    changeAvatar = (req , res) => {
        if (req.file){
            var avatar = req.file.path.replace(/\\/g , '/');
        }
        this.model.Student.findByIdAndUpdate(req.student._id , {
            avatar : avatar
        } , (err , student) => {
            if (err){
                if (!student)
                    return res.json({
                        data : 'student not Found',
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
                data : 'avatar has successfully changed.',
                success : true,
                status : 201
            })
        })
    };

    profileOfStudent = (req , res) => {
        this.model.Profile.findOne({student : req.query.student_id}, (err , result) => {
            if (err)
                return res.json({
                    data : 'No such profile found',
                    success : false,
                    status : 404
                })

            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }).populate(
            {
                path : 'student',
                select : 'firstname lastname verified council avatar'
            }
        )
    }

}

module.exports = new studentProfileController();
