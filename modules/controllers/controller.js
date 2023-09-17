//Models
const User = require('../models/user');
const City = require('../models/city');
const Dormitory = require('../models/dormitory');
const Role = require('../models/role');
const Permission = require('../models/permission');
const Student = require('../models/student');
const Profile = require('../models/profile');
const VerificationPerToken = require('../models/verification_per_token');
const VerifyToken = require('../models/verify_token');
const Question = require('../models/question');
const SaleArticle = require('../models/saleArticle');
const ShareRide = require('../models/shareRide');
const Event = require('../models/event');
const Experience = require('../models/experience');
const Feed = require('../models/feed');
const Media = require('../models/media');
const CouncilVerification = require('../models/councilVerification');
const Memo = require('../models/memo');
const ReportCategory = require('../models/reportCategory');
const Report = require('../models/report');
const Comment = require('../models/comment');
const Favorite = require('../models/favorite');
const ShareRideMember = require('../models/shareRideMember');
const Feedback = require('../models/feedback');
const UserActivity = require('../models/userActivity');
const EventMember = require('../models/eventMembers');
const TakePocket = require('../models/takePocket');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Symbol = require('../models/statusSymbole');
const ActivityStatus = require('../models/activityStatus');
const PasswordForgotten = require('../models/passwordForgotten');
const Calendar = require('../models/calendar');
const Partner = require('../models/partner');
const Employee = require('../models/employee');
const Advertising = require('../models/advertising');
const Block = require('../models/block');

module.exports = class Controller {
    constructor() {
        this.model = {
            User,
            City,
            Dormitory,
            Role,
            Permission,
            Student,
            Profile,
            VerificationPerToken,
            VerifyToken,
            Question,
            Event,
            Experience,
            ShareRide,
            SaleArticle,
            Feed,
            Media,
            CouncilVerification,
            Memo,
            ReportCategory,
            Report,
            Comment,
            Favorite,
            ShareRideMember,
            Feedback,
            UserActivity,
            EventMember,
            TakePocket,
            Conversation,
            Message,
            Symbol,
            ActivityStatus,
            PasswordForgotten,
            Calendar,
            Partner,
            Employee,
            Advertising,
            Block
        }
    }
}
