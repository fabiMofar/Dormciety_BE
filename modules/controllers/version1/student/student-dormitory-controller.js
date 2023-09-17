const Controller = require('../../controller');


class studentDormitoryController extends Controller {

    studentsOfDormitory = (req , res) => {
        const page = req.query.page || 1;
        const select = 'firstname lastname avatar status';
        const populate =
            {path : 'status', select : 'symbol', populate : {path : 'symbol', select : 'symbol',}}

        this.model.Student.paginate(
            { deleted : false , dormitory : req.student.dormitory , verified : true , _id : {$ne : req.student._id}  },
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

    filterOfStatus = async (req , res) => {
        try {
            const students = await this.model.Student.find({status : {symbol : '6092e14218031737ac895275'}}).populate('status').exec();
            return res.json({
                data : students,
                success : true,
                status : 200
            })
        }catch (e) {
            return res.json({
                data : e,
                success : false,
                status : 500
            })
        }
    };

    searchStudent = (req , res) => {
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
                        _id : {$ne : req.student._id}
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
    }

    councils = (req , res) => {
        const page = req.query.page || 1;
        const select = 'firstname lastname avatar status';
        const populate =
            {path : 'status', select : 'symbol', populate : {path : 'symbol', select : 'symbol',}}
        this.model.Student.paginate(
            { deleted : false , dormitory : req.student.dormitory , council : true, verified : true , _id : {$ne : req.student._id}  },
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


module.exports = new studentDormitoryController()
