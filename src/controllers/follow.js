const User = require('../models/User');
const Follow = require('../models/Follow');

const saveFollow = async (req, res) => {
    try {
        let { followed } = req.body;
        let { id: userId } = req.user;

        let userToFollow = new Follow({
            user: userId,
            followed
        });

        const newFollowed = await userToFollow.save();

        return res.status(200).json({
            status: "success",
            follow: newFollowed
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}


module.exports = {
    saveFollow,
}