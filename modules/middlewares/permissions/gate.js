let ConnectRoles = require('connect-roles');

const Permission = require('./../../models/permission');

let gate = new ConnectRoles({
    failureHandler: function (req, res, action) {
        var accept = req.headers.accept || '';
        return res.json({
            data : 'Access Denied - You don\'t have permission to: ' + action,
            success : false,
            status : 403

        })
    }
});

const permissions = async () => {
    return await Permission.find({}).populate('roles').exec();
}

permissions()
    .then(permissions => {
        permissions.forEach(permission => {
            let roles = permission.roles.map(item => item._id);
            gate.use(permission.name , (req , res) => {
                return (req.user)
                    ? req.user.hasRole(roles)
                    : false
            })
        })
    })



module.exports = gate;
