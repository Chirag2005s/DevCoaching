const AccessLog = require('../models/accessLog.models');

// Fetch access logs with server-side pagination and filters
exports.getAccessLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { search, action, status } = req.query;

        // Build query filters
        const query = {};

        if (action) {
            query.action = action;
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { ipAddress: searchRegex }
            ];
        }

        // Fetch logs with pagination, sorted by latest first
        const logs = await AccessLog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email role');

        const totalLogs = await AccessLog.countDocuments(query);

        // Fetch daily statistics (local/UTC day start to end)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Run dashboard stats in parallel
        const [
            totalLoginsToday,
            failedLoginsToday,
            registrationsToday,
            topDeviceStats
        ] = await Promise.all([
            AccessLog.countDocuments({
                action: 'login',
                status: 'success',
                createdAt: { $gte: startOfToday, $lte: endOfToday }
            }),
            AccessLog.countDocuments({
                action: 'login',
                status: 'failed',
                createdAt: { $gte: startOfToday, $lte: endOfToday }
            }),
            AccessLog.countDocuments({
                action: 'registration',
                status: 'success',
                createdAt: { $gte: startOfToday, $lte: endOfToday }
            }),
            AccessLog.aggregate([
                { 
                    $match: { 
                        createdAt: { $gte: startOfToday, $lte: endOfToday } 
                    } 
                },
                { 
                    $group: { 
                        _id: "$deviceType", 
                        count: { $sum: 1 } 
                    } 
                },
                { 
                    $sort: { count: -1 } 
                },
                { 
                    $limit: 1 
                }
            ])
        ]);

        const topDevice = topDeviceStats.length > 0 ? topDeviceStats[0]._id : 'Desktop';

        res.status(200).json({
            logs,
            pagination: {
                totalLogs,
                totalPages: Math.ceil(totalLogs / limit),
                currentPage: page,
                limit
            },
            stats: {
                totalLoginsToday,
                failedLoginsToday,
                registrationsToday,
                topDevice
            }
        });

    } catch (error) {
        console.error("Fetch Access Logs Error:", error);
        res.status(500).json({ message: "Server error during logs retrieval", error: error.message });
    }
};

// Log retention utility: Delete logs older than N days
exports.cleanupLogs = async (req, res) => {
    try {
        const days = parseInt(req.body.days || req.query.days) || 30;
        
        if (days < 1) {
            return res.status(400).json({ message: "Invalid retention days parameter" });
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await AccessLog.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        res.status(200).json({
            message: `Logs older than ${days} days cleared successfully`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Cleanup Logs Error:", error);
        res.status(500).json({ message: "Server error during logs cleanup", error: error.message });
    }
};
