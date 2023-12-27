// routes/managerevent.js

const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
  try {
    // 이달의 음료 여부가 1인 레시피 목록을 조회
    const [rows] = await pool.query('SELECT * FROM db_team.recipe WHERE month_drink_is = 1');

    // 조회된 레시피 목록을 렌더링할 EJS 파일에 전달
    res.render('managerevent', { monthDrinkList: rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/releaseTopDrinks', async (req, res) => {
  try {
    // 이달의 음료를 해제하는 작업을 수행
    await pool.query('UPDATE db_team.recipe SET month_drink_is = 0 WHERE month_drink_is = 1');

    // 클라이언트에 응답
    res.status(200).send('이달의 음료가 해제되었습니다.');
  } catch (error) {
    console.error('이달의 음료 해제 중 오류 발생:', error);
    res.status(500).json({ error: '오류가 발생했습니다. 다시 시도해주세요.' });
  }
});

module.exports = router;
