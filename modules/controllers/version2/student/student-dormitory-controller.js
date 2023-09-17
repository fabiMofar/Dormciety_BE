const Controller = require('../../controller');


class studentDormitoryController extends Controller {

    students = async (req , res) => {
        const blockUsers = await this.model.Block.find({ student : req.student._id}).select('blocker').exec();
        const users = []
        blockUsers.map((usr) =>{
            users.push(usr.blocker.toString());
        })
        const page = req.query.page || 1;
        const select = 'firstname lastname avatar status';
        const populate =
            {path : 'status', select : 'symbol', populate : {path : 'symbol', select : 'symbol',}}

        this.model.Student.paginate(
            {
                deleted : false ,
                dormitory : req.student.dormitory ,
                verified : true ,
                _id : {$ne : req.student._id , $nin : users},
            },
            { page , limit : 400 ,  sort : { firstname : 1 }  , select , populate }
        ).then(students => {

            return res.json({
                data : students.docs,
                current_page : students.page,
                pages : students.pages,
                total : students.total,
                success: true,
                status: 200
            })
        })
            .catch(err => {
                return res.json({
                    data : err,
                    success: false,
                    status: 500
                })
            })
    };

    searchStudent = async (req , res) => {
        const blockUsers = await this.model.Block.find({ student : req.student._id}).select('blocker').exec();
        const users = []
        blockUsers.map((usr) =>{
            users.push(usr.blocker.toString());
        })
        const page = req.query.page || 1;
        const select = 'firstname lastname avatar status';
        const populate =
            {path : 'status', select : 'symbol', populate : {path : 'symbol', select : 'symbol',}}

        this.model.Student.paginate(
            {
                $and :[
                    {
                        deleted : false ,
                        dormitory : req.student.dormitory ,
                        verified : true ,
                        _id : {$ne : req.student._id , $nin: users},
                    },
                    {
                        $or : [
                            {firstname : new RegExp(req.query.search , 'gi')},
                            {lastname : new RegExp(req.query.search , 'gi')}
                        ]
                    }
                ]
            },
            { page , limit : 400 ,  sort : { firstname : 1 }  , select , populate }
        ).then(students => {
            return res.json({
                data : students.docs,
                current_page : students.page,
                pages : students.pages,
                total : students.total,
                success: true,
                status: 200
            })
        })
            .catch(err => {
                return res.json({
                    data : err,
                    success: false,
                    status: 500
                })
            })
    };

    councils = async (req , res) => {
        const blockUsers = await this.model.Block.find({ student : req.student._id}).select('blocker').exec();
        const users = []
        blockUsers.map((usr) =>{
            users.push(usr.blocker.toString());
        })
        const page = req.query.page || 1;
        const select = 'firstname lastname avatar status';
        const populate =
            {path : 'status', select : 'symbol', populate : {path : 'symbol', select : 'symbol',}}
        this.model.Student.paginate(
            { deleted : false , dormitory : req.student.dormitory , council : true, verified : true , _id : {$ne : req.student._id, $nin : users}  },
            { page , limit : 400 ,  sort : { firstname : 1 }  , select , populate }
        ).then(students => {

            return res.json({
                data : students.docs,
                current_page : students.page,
                pages : students.pages,
                total : students.total,
                success: true,
                status: 200
            })
        })
            .catch(err => {
                return res.json({
                    data : err,
                    success: false,
                    status: 500
                })
            })
    };


}


module.exports = new studentDormitoryController();
