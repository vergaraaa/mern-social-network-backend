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

const deleteFollow = async (req, res) => {
    try {
        let { id: userId } = req.user;
        let { id: followedId } = req.params;

        const follow = await Follow.findOneAndDelete({
            "user": userId,
            "followed": followedId,
        });

        if (!follow) {
            return res.status(404).json({
                status: "failure",
                message: "Follow relation not found"
            });
        }

        return res.status(200).json({
            status: "success",
            follow,
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
    deleteFollow,
}