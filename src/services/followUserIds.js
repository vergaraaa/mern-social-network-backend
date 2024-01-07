const Follow = require("../models/Follow");

const followUserIds = async (userId) => {
    let followingDirty = await Follow
        .find({ user: userId })
        .select({ followed: 1, _id: 0 });

    let followersDirty = await Follow
        .find({ followed: userId })
        .select({ user: 1, _id: 0 });

    let following = [];

    followingDirty.forEach(follow => {
        following.push(follow.followed);
    });

    let followers = [];

    followersDirty.forEach(follow => {
        followers.push(follow.user);
    });


    return {
        following,
        followers,
    }
}

const followThisUser = async (userId, profileUserId) => {

}

module.exports = {
    followUserIds,
    followThisUser,
}