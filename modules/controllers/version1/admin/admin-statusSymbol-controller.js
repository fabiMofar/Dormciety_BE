const Controller = require('../../controller');
const {validationResult} = require('express-validator');


class adminStatusSymbolController extends  Controller {

    index = (req , res) => {
        const page = req.query.page || 1;
        const select = 'label symbol';
        this.model.Symbol.paginate(
            {  },
            { page : page , limit : 10  ,  sort : { createdAt: -1 } , select  }
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

        if(req.file){
            var symbolFile = req.file.path.replace(/\\/g , '/');
        }
        let statusSymbol = new this.model.Symbol({
            user : req.user._id,
            label : req.body.label,
            symbol : symbolFile
        })

        statusSymbol.save((err) => {
            if (err){
                if (err.code === 11000)
                    return res.json({
                        data : 'you have submitted with this label',
                        success : false,
                        status : 11000
                    })


                return res.json({
                    data : err,
                    success : false,
                    status : 500
                })
            }

            return res.json({
                data : 'Your statusSymbol has been successfully submitted.',
                success : true,
                status : 201
            })
        })

    };

    destroy = (req , res) => {
        this.model.Symbol.findByIdAndDelete(req.params.id , (err) => {
            if (err)
                return res.json({
                    data : 'server Error',
                    success : false,
                    status : 500
                })

            return res.json({
                data : 'status symbol deleted',
                success : true,
                status : 200
            })

        })
    }

}


module.exports = new adminStatusSymbolController();
