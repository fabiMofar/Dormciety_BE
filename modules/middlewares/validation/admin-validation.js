const { check } = require('express-validator');
const path = require('path');


exports.validate = (method) => {
    switch (method){
        case 'register' : {
            return [
                check('emailWork').isEmail().withMessage('invalid work Email'),
                check('password').isLength({min : 8 }).withMessage('enter your Password'),
                check('firstname').not().isEmpty().withMessage('enter your firstname'),
                check('lastname').not().isEmpty().withMessage('enter your Lastname'),
                check('username').not().isEmpty().withMessage('enter your username'),
                check('mobile').not().isEmpty().withMessage('enter your Mobile'),
                check('birthday').not().isEmpty().withMessage('enter your Birthday'),
                check('title').not().isEmpty().withMessage('enter your title'),
                check('street').not().isEmpty().withMessage('enter your street'),
                check('houseNumber').not().isEmpty().withMessage('enter your houseNumber'),
                check('postalCode').not().isEmpty().withMessage('enter your postalCode'),
                check('city').not().isEmpty().withMessage('enter your city'),
                check('emailPrivate').isEmail().withMessage('Enter your private email'),
                check('sex').not().isEmpty().withMessage('enter your sex'),
                check('organisation_name').not().isEmpty().withMessage('enter your organisation Name'),
            ]
        }

        case 'login' : {
            return [
                check('username').not().isEmpty().withMessage('enter your username'),
                check('password').not().isEmpty().withMessage('enter your password'),
            ]
        }

        case 'city' : {
            return [
                check('name').not().isEmpty().withMessage('enter your name of city'),
            ]
        }

        case 'update-user' : {
            return [
                check('emailWork').isEmail().withMessage('invalid work Email'),
                check('firstname').not().isEmpty().withMessage('enter your firstname'),
                check('lastname').not().isEmpty().withMessage('enter your Lastname'),
                check('username').not().isEmpty().withMessage('enter your username'),
                check('mobile').not().isEmpty().withMessage('enter your Mobile'),
                check('birthday').not().isEmpty().withMessage('enter your Birthday'),
                check('title').not().isEmpty().withMessage('enter your title'),
                check('street').not().isEmpty().withMessage('enter your street'),
                check('houseNumber').not().isEmpty().withMessage('enter your houseNumber'),
                check('postalCode').not().isEmpty().withMessage('enter your postalCode'),
                check('city').not().isEmpty().withMessage('enter your city'),
                check('emailPrivate').isEmail().withMessage('Enter your private email'),
                check('sex').not().isEmpty().withMessage('enter your sex'),
                check('organisation_name').not().isEmpty().withMessage('enter your organisation Name'),
                check('organisation_logo')
                    .custom(async (value , {req}) => {
                        if (!value) throw new Error('organisation_logo')
                        let fileExt = ['.png', '.jpg' , 'jpeg',];
                        if (! fileExt.includes(path.extname(value)))
                            throw new Error('image format is invalid')
                    })

            ]
        }

        case 'update-profile' : {
            return [
                check('mobile').not().isEmpty().withMessage('enter your Mobile'),
                check('street').not().isEmpty().withMessage('enter your street'),
                check('houseNumber').not().isEmpty().withMessage('enter your houseNumber'),
                check('postalCode').not().isEmpty().withMessage('enter your postalCode'),
                check('city').not().isEmpty().withMessage('enter your city'),
                check('emailPrivate').isEmail().withMessage('Enter your private email'),
            ]
        }
        case 'change-avatar' : {
            return [
                check('avatar')
                    .custom(async (value , {req}) => {
                        if (!value) throw new Error('avatar is empty')
                        let fileExt = ['.png', '.jpg' , 'jpeg',];
                        if (! fileExt.includes(path.extname(value)))
                            throw new Error('image format is invalid')
                    })
            ]
        }
        case 'toggle-active' : {
            return [
                check('active').not().isEmpty().withMessage('enter your active'),
            ]
        }

        case 'dormitory' : {
            return [
                check('street').not().isEmpty().withMessage('enter your street'),
                check('houseNumber').not().isEmpty().withMessage('enter your houseNumber'),
                check('postalCode').not().isEmpty().withMessage('enter your postalCode'),
                check('city_id').not().isEmpty().withMessage('enter your city'),
                check('name').not().isEmpty().withMessage('Enter your  name'),
            ]
        }

        case 'role' : {
            return [
                check('permissions').not().isEmpty().withMessage('enter your permissions'),
                check('name').not().isEmpty().withMessage('Enter your  name'),
                check('label').not().isEmpty().withMessage('enter your label'),
            ]
        }

        case 'permission'  : {
            return [
                check('name').not().isEmpty().withMessage('Enter your  name'),
                check('label').not().isEmpty().withMessage('enter your label'),
            ]
        }

        case 'review-council'  : {
            return [
                check('review').not().isEmpty().withMessage('Enter your  review'),
                check('review_note').not().isEmpty().withMessage('enter your note'),
            ]
        }

        case 'memo'  : {
            return [
                check('title').not().isEmpty().withMessage('Enter your  title'),
                check('description').not().isEmpty().withMessage('enter your description'),
                check('validFrom').not().isEmpty().withMessage('enter your validFrom'),
                check('validUntil').not().isEmpty().withMessage('enter your validUntil'),
                check('dormitories').not().isEmpty().withMessage('enter your dormitories'),
            ]
        }

        case 'report-category'  : {
            return [
                check('label').not().isEmpty().withMessage('Enter your label'),
            ]
        }
        case 'report-review'  : {
            return [
                check('review_note').not().isEmpty().withMessage('Enter your review_note'),
            ]
        }
        case 'update-student'  : {
            return [
                check('firstname').not().isEmpty().withMessage('Enter your firstname'),
                check('lastname').not().isEmpty().withMessage('Enter your lastname'),
                check('email').not().isEmpty().withMessage('Enter your email'),
            ]
        }

        case 'event' : {
            return [
                check('title').not().isEmpty().withMessage('enter your title'),
                check('participantCount').not().isEmpty().withMessage('enter your participantCount'),
                check('showEventLink').not().isEmpty().withMessage('enter your showEventLink'),
                check('eventDate').not().isEmpty().withMessage('enter your eventDate'),
                check('eventTime').not().isEmpty().withMessage('enter your eventTime'),
                check('entryPrice').not().isEmpty().withMessage('enter your entryPrice'),
                check('type').not().isEmpty().withMessage('enter your type'),
            ]
        }
    }
}
