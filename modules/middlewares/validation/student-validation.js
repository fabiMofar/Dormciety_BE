const { check } = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'register' : {
            return [
                check('password').isLength({min : 8 }).withMessage('Das Passwort muss mind. 8 Zeichen enthalten.'),
                check('firstname').isLength({min : 4}).withMessage('Der Vorname muss mind. 4 Zeichen enthalten.'),
                check('lastname').isLength({min : 4}).withMessage('Der Nachname muss mind. 4 Zeichen enthalten.'),
                check('email').isEmail().withMessage('Gib deine E-Mail-Adresse ein'),
                check('city_id').not().isEmpty().withMessage('Gib deine Stadt ein'),
                check('dormitory_id').not().isEmpty().withMessage('Gib dein Wohnheim ein'),
            ]
        }
        case 'login' : {
            return [
                check('password').isLength({min : 8 }).withMessage('Gib dein Passwort ein.'),
                check('email').isEmail().withMessage('Gib deine E-Mail-Adresse ein'),
            ]
        }

        case 'request-to-verification' : {
            return [
                check('roomNr').not().isEmpty().withMessage('Gib deine Zimmernummer ein'),
            ]
        }

        case 'question' : {
           return [
               check('description').not().isEmpty().withMessage('Stelle hier deine Frage'),
           ]
        }
        case 'saleArticle' : {
            return [
                check('title').not().isEmpty().withMessage('Gib bitte noch den Titel ein'),
                check('price').not().isEmpty().withMessage('Die Angabe des Preises fehlt'),
            ]
        }
        case 'experience' : {
            return [
                check('description').not().isEmpty().withMessage('Teile mit, was dir auf dem Herzen liegt'),
            ]
        }

        case 'shareRide' : {
            return [
                check('locationFrom').not().isEmpty().withMessage('Gib bitte an, von wo du losfährst\n'),
                check('locationTo').not().isEmpty().withMessage('Gib bitte an, wohin du fährst'),
                check('sitCount').not().isEmpty().withMessage('Gib bitte an, wie viele Personen mitfahren können'),
                check('departureDate').not().isEmpty().withMessage('Gib bitte an, wann du abfährst'),
                check('departureTime').not().isEmpty().withMessage('Gib bitte an, wie spät du abfährst'),
                check('price').not().isEmpty().withMessage('Gib bitte an, wie viel dir die Mitfahrenden zahlen sollen\n'),
                check('smoke').not().isEmpty().withMessage('Gib bitte an, ob bei dir geraucht werden darf'),
                check('animal').not().isEmpty().withMessage('Gib bitte an, ob ein Tier mitfahren darf'),
                check('baggage').not().isEmpty().withMessage('Gib bitte an, ob du Platz für Gepäck hast\n'),
            ]
        }
        case 'event' : {
            return [
                check('title').not().isEmpty().withMessage('Gib deinen Veranstaltungsnamen ein'),
                check('participantCount').not().isEmpty().withMessage('Gib die max. Teilnehmeranzahl ein '),
                check('withAuthorize').not().isEmpty().withMessage('Gib an, ob du die Teilnahme vorher bestätigen möchtest'),
                check('eventDate').not().isEmpty().withMessage('Gib ein Datum für dein Event ein'),
                check('eventTime').not().isEmpty().withMessage('Gib eine Uhrzeit für dein Event ein'),
                check('entryPrice').not().isEmpty().withMessage('Gib einen Eintrittspreis für dein Event ein'),
                check('type').not().isEmpty().withMessage('Gib bitte an, ob das Event live oder digital stattfindet'),
            ]
        }
        case 'report' : {
            return [
                check('description').not().isEmpty().withMessage('Gib eine Beschreibung ein\n'),
                check('type').not().isEmpty().withMessage('enter your type'),
            ]
        }

        case 'comment' : {
            return [
                check('comment').not().isEmpty().withMessage('Füge einen Kommentar hinzu'),
            ]
        }

        case 'favorite' : {
            return [
                check('feed_id').not().isEmpty().withMessage('Teile deinen Beitrag'),
            ]
        }

        case 'feedback' : {
            return [
                check('description').not().isEmpty().withMessage('Gib eine Beschreibung ein'),
                check('satisfaction_level').not().isEmpty().withMessage('Gib das Bereich ein'),
            ]
        }

        case 'takePost' : {
            return [
                check('owner_id').not().isEmpty().withMessage('enter your owner'),
            ]
        }
    }
}
