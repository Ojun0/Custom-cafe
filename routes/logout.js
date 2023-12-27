const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    // 세션을 삭제하여 로그아웃
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;