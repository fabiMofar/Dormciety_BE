const Controller = require("../../controller");

class studentPartnerController extends Controller {
    index = (req, res) => {
        const page = req.query.page || 1;
        this.model.Partner.paginate(
            { deleted : false , dormitories : {$all : req.student.dormitory}} ,
            { page , limit : 400 , }
        ).then(partners => {

            return res.json({
                data : partners.docs,
                current_page : partners.page,
                pages : partners.pages,
                total : partners.total,
                success : true,
                status : 200
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

    employeesOfPartners = (req, res) => {
        const page = req.query.page || 1;
        this.model.Employee.paginate(
            {
                deleted : false,
                partner : req.query.partner,
            } ,
            { page , limit : 400 , }
        ).then(employees => {

            return res.json({
                data : employees.docs,
                current_page : employees.page,
                pages : employees.pages,
                total : employees.total,
                success : true,
                status : 200
            })
        })
            .catch(err => {
                return res.json({
                    data : err,
                    success : false,
                    status : 500
                })
            })
    };

}


module.exports = new studentPartnerController();



