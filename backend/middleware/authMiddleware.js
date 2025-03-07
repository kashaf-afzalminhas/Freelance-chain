const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// router.get('/protected-metamask', authMiddleware, (req, res) => {
//     res.json({ message: 'This is a protected route for MetaMask users', wallet: req.user.walletAddress });
// });
