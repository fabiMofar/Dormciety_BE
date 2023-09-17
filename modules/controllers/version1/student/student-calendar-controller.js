const Controller = require('../../controller');



class studentCalendarController extends Controller{
    index = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'event',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }
            },
            {
                path : 'shareRide',
                populate : {
                    path : 'student',
                    select : 'firstname lastname avatar'
                }

            }
        ]
        this.model.Calendar.paginate(
            { dormitory: req.student.dormitory },
            { page , sort : { createdAt : -1 } , limit : 1000 , populate }
        ).then(result => {
            return res.json({
                data : result.docs,
                current_page : result.page,
                pages : result.pages,
                total : result.total,
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

    checkEvent = async (req , res) => {
        try {
            switch (req.query.type) {
                case 'shareRide' : {
                    const member = await this.model.ShareRideMember.findOne({
                        shareRide : req.query.id,
                        guest : req.student._id
                    }).exec();

                    if (!member)
                        return res.json({
                            data : 'not found',
                            success : false,
                            status : 404
                        });

                    return res.json({
                        data : member.status,
                        success : true,
                        status : 200
                    })
                }

                case 'student-event' : {
                    const member = await this.model.EventMember.findOne({
                        event : req.query.id,
                        guest : req.student._id
                    }).exec();

                    if (!member)
                        return res.json({
                            data : 'not found',
                            success : false,
                            status : 404
                        });

                    return res.json({
                        data : member.status,
                        success : true,
                        status : 200
                    })
                }
                case 'admin-event' : {
                    const member = await this.model.EventMember.findOne({
                        event : req.query.id,
                        guest : req.student._id
                    }).exec();

                    if (!member)
                        return res.json({
                            data : 'not found',
                            success : false,
                            status : 404
                        });

                    return res.json({
                        data : member.status,
                        success : true,
                        status : 200
                    })
                }

                default :
                    return res.json({
                            data : 'server error',
                            success : false,
                            status : 500
                        })
            }
        }catch (e) {
            return res.json({
                data : 'server error',
                success : false,
                status : 500
            })
        }
    }



}


module.exports = new studentCalendarController()
