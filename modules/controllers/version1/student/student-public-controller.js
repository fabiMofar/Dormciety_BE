const Controller = require('../../controller');


class studentPublicController extends Controller {

    cities = (req, res) => {
        const select = 'name';
        this.model.City.paginate(
            { deleted : false , active : true } ,
            {   sort : { firstname : 1 } , select }
        ).then(cities => {
            return res.json({
                data : cities.docs,
                total : cities.total,
                success: true,
                status: 200
            })
        })
            .catch(err => {
                return res.json({
                    data : 'Server Error',
                    success: false,
                    status: 500
                })
            })
    };

    dormitories = async (req, res) => {
        try {
            const result = await this.model.Dormitory.find({ deleted : false , active : true , city : req.query.city_id }).sort({ firstname : 1}).exec();
            return res.json({
                data : result,
                success : true,
                status : 200
            })
        }catch (e) {
            console.log(e)
        }
    };

}

module.exports = new studentPublicController();
