const User = require('../models/User');
const Follow = require('../models/Follow');
const followService = require("../services/followUserIds");
const mongoosePagination = require('mongoose-pagination');


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

const getFollowing = async (req, res) => {
    try {
        let { id: userId } = req.user;

        if (req.params.id) userId = req.params.id;

        // check page
        let page = req.params.page ? req.params.page : 1;

        const itemsPerPage = 5;

        const total = await Follow.find({ user: userId }).countDocuments();

        const following = await Follow
            .find({ user: userId })
            // .populate("user followed", "name lastname");
            .populate("user followed", "-password -role -__v")
            .paginate(page, itemsPerPage);


        // get persons that i follow and follow me in common
        const followUserIds = await followService.followUserIds(userId);

        return res.status(200).json({
            status: "success",
            following,
            total,
            pages: Math.ceil(total / itemsPerPage),
            userFollowing: followUserIds.following,
            userFollowers: followUserIds.followers,
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const getFollowers = async (req, res) => {
    try {
        return res.status(200).json({
            status: "success",
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
    getFollowing,
    getFollowers,
}