const Controller = require('../../controller');


class adminCommentController extends Controller {

    experienceComments = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
        ]
        this.model.Comment.paginate(
            {
                event : null ,
                saleArticle : null ,
                question : null ,
                shareRide : null
            },
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No comment found',
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

    questionComments = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
        ]
        this.model.Comment.paginate(
            {
                event : null ,
                saleArticle : null ,
                shareRide : null,
                experience : null,
            },
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No comment found',
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

    saleArticleComments = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
        ]
        this.model.Comment.paginate(
            {
                event : null ,
                question : null ,
                shareRide : null,
                experience : null
            },
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No comment found',
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

    shareRideComments = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
        ]
        this.model.Comment.paginate(
            {
                event : null ,
                saleArticle : null ,
                question : null ,
                experience : null
            },
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No comment found',
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

    eventComments = (req , res) => {
        const page = req.query.page || 1;
        const populate = [
            {
                path : 'student',
                select : 'firstname lastname'
            },
        ]
        this.model.Comment.paginate(
            {
                saleArticle : null ,
                question : null ,
                shareRide : null,
                experience : null
            },
            { page : page , limit : 20  ,  sort : { createdAt: -1 } ,  populate }
        ).then( (result) => {
            if (!result)
                return res.json({
                    data : 'No comment found',
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


    destroy = (req , res) => {
        this.model.Comment.findByIdAndRemove(req.params.id  , (err , comment) => {
            if (err){
                if (!comment)
                    return res.json({
                        data : 'no comment Found',
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
                data : 'comment has successfully deleted',
                success : true,
                status : 200
            })
        })
    }

}

module.exports = new adminCommentController();
