const Message = require('../models/message');
const User = require('../models/User');

exports.getRecentChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const recentChats = await Message.aggregate([
            { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$roomId',
                    lastMessage: { $first: '$content' },
                    timestamp: { $first: '$timestamp' },
                    unreadCount: { $sum: { $cond: [{ $in: [userId, '$readBy'] }, 0, 1] } },
                    userId: { $first: { $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId'] } }
                }
            },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
            { $unwind: '$userInfo' },
            { $project: { lastMessage: 1, timestamp: 1, unreadCount: 1, userInfo: { name: 1, avatar: 1 } } }
        ]);

        res.json(recentChats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent chats' });
    }
};
