const Controller = require('../../controller');

class adminHomeController extends Controller {

    countModules = async (req , res) => {
        try {
            const mediaCount = await this.model.Media.find().count().exec();
            const studentsCount = await this.model.Student.find({ deleted : false }).count().exec();
            const dormitoriesCount = await this.model.Dormitory.find({ deleted : false }).count().exec();
            const reportsCount = await this.model.Report.find().count().exec();

            res.json({
                data : {
                    mediaCount,
                    studentsCount,
                    dormitoriesCount,
                    reportsCount
                },
                success : true,
                status : 200
            })

        }catch (e) {
            console.log(e)
        }
    };

    lastStudents = (req , res ) => {

    }

}


module.exports = new adminHomeController();
