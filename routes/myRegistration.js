const express = require('express');
const router = express.Router();
const pool = require('../db/db');


router.get('/', async (req, res) => {
  try {
    const userId = req.session.uid; // 세션에서 사용자 아이디 가져오기

    // 내가 등록한 음료 목록 조회
    const [myRecipes] = await pool.query('SELECT * FROM recipe WHERE user_userid = ?', [userId]);

    // 내가 구독한 음료 목록 조회
    const [mySubscriptions] = await pool.query(`
    select name from db_team.customdrink where user_userid = ?;
    `, [userId]);

    res.render('myRegistration', { myRecipes, mySubscriptions });
  } catch (error) {
    console.error('데이터 가져오는 중 오류 발생:', error);
    res.status(500).send('내부 서버 오류');
  }
});

module.exports = router;