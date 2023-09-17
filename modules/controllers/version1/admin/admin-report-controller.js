const Controller = require('../../controller');
const { validationResult } = require('express-validator');


class adminReportController extends Controller {

    index = async (req , res) => {
        try{
            const result = await this.model.Report.aggregate([
                {
                  $match: {review : false}
                },
                {
                    $group : {
                        _id : {
                            question : '$question' ,
                            saleArticle : '$saleArticle' ,
                            event : '$event' ,
                            experience : '$experience' ,
                            shareRide : '$shareRide',
                            type : '$type'

                        },
                        detail: { $push: '$$ROOT' },
                        count: {
                            $sum: 1,
                        },
                    }
                },
            ]).exec();


            return res.json({
                data : result,
                success : true,
                status: 200
            })


        }catch (e) {
            console.log(e)
        }
    };

    single = (req, res) => {
        this.model.Report.findById(req.params.id , (err , result) => {
            if (err){
                return res.json({
                    data : 'no such report found',
                    success: false,
                    status: 404
                })
            }

            return res.json({
                data : result,
                success: true,
                status: 200
            })
        }).populate([
            {
                path : 'event',
            } ,
            {
                path : 'question',
            } ,
            {
                path : 'shareRide',
            } ,
            {
                path : 'saleArticle',
            } ,
            {
                path : 'experience',
            } ,
            {
                path : 'student',
                select : 'firstname lastname',
                populate : {
                    path : 'dormitory',
                    select : 'name'
                }
            } ,
            {
                path : 'reviewed_by',
                select : 'firstname lastname',
            }
        ])
    }

    review = (req , res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
                success: false,
                status : 422
            })
        }

        this.model.Report.updateMany({
            $or : [
                {
                    experience: req.body.feed_id,
                },
                {
                    question : req.body.feed_id
                },
                {
                    event : req.body.feed_id
                },
                {
                    shareRide : req.body.feed_id
                },
                {
                    saleArticle : req.body.feed_id
                }
            ]
        } , {
            review : true,
            reviewed_by : req.user._id,
            review_note : req.body.review_note,
            review_date : new Date(),
        } , (err , report) => {
            if (err){
                if (!report)
                    return res.json({
                        data : 'There is no such report',
                        success : false,
                        status : 404
                    })

                return res.json({
                    data : 'Operation failed',
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'report has been successfully reviewed.',
                success : true,
                status : 200
            })
        })


        // this.model.Report.findByIdAndUpdate(req.params.id, {
        //     review : true,
        //     reviewed_by : req.user._id,
        //     review_note : req.body.review_note,
        //     review_date : new Date(),
        // } , (err , report) => {
        //     if (err){
        //         if (!report)
        //             return res.json({
        //                 data : 'There is no such report',
        //                 success : false,
        //                 status : 404
        //             })
        //
        //         return res.json({
        //             data : 'Operation failed',
        //             success : false,
        //             status : 500
        //         })
        //     }
        //
        //     return res.json({
        //                 data : 'report has been successfully reviewed.',
        //                 success : true,
        //                 status : 200
        //             })
        // })
    }

    group = async (req , res) => {
        const page = req.query.page || 1;
        const populate = {
            path : 'student',
            select : 'firstname lastname dormitory',
            populate : {
                path : 'dormitory',
                select : 'name'
            }
        }
        this.model.Report.paginate(
            {
                $or : [
                    {
                        experience: req.query.feed_id,
                    },
                    {
                        question : req.query.feed_id
                    },
                    {
                        event : req.query.feed_id
                    },
                    {
                        shareRide : req.query.feed_id
                    },
                    {
                        saleArticle : req.query.feed_id
                    }
                ]
            },
            { page , limit : 10000 , sort : { createdAt : -1 } , populate }
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

    archive = (req, res) => {
        const page = req.query.page || 1;
        const populate = {
            path : 'student',
            select : 'firstname lastname dormitory',
            populate : {
                path : 'dormitory',
                select : 'name'
            }
        }
        this.model.Report.paginate(
            {
                review : true
            },
            { page , limit : 10000 , sort : { createdAt : -1 } , populate }
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
    }


}


module.exports = new adminReportController();
