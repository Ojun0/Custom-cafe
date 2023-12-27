const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
  try {
    // 데이터베이스에서 share_is가 "Y"인 레시피 목록을 조회
    const [rows] = await pool.query('SELECT * FROM db_team.recipe WHERE share_is = "1" ORDER BY total_order_num DESC');
    const [totalOrderNumberRows] = await pool.query('SELECT COUNT(total_order_num) AS totalOrderNumber FROM db_team.recipe WHERE share_is = "1"');
    const totalOrderNumber = totalOrderNumberRows.length > 0 ? totalOrderNumberRows[0].totalOrderNumber : 0;
    res.render('managerorder', { recipeList: rows, totalOrderNumber });
  } catch (error) {
    console.error('MySQL에서 데이터를 가져오는 중 오류 발생:', error);
    res.status(500).send('내부 서버 오류');
  }
});

router.post('/setTopDrinks', async (req, res) => {
  try {
    // 상위 10개 레시피 번호 가져오기
    const [topRecipes] = await pool.query('SELECT recipe_num FROM db_team.recipe ORDER BY total_order_num DESC LIMIT 10');
    // 메뉴당 가장 많이 구매한 사람에게 포인트 지급
    for (const recipe of topRecipes) {
      const [orderRank] = await pool.query(`
        SELECT customdrink.user_userid
        FROM db_team.customdrink
        INNER JOIN db_team.recipe ON customdrink.recipe_recipe_num = recipe.recipe_num
        WHERE customdrink.recipe_recipe_num = ?
        ORDER BY customdrink.order_count DESC
        LIMIT 1
      `, [recipe.recipe_num]);

      if (orderRank.length > 0) {
        const topUser = orderRank[0].user_userid;

        // 사용자가 존재하는지 확인
        const [user] = await pool.query('SELECT * FROM db_team.user WHERE userid = ?', [topUser]);

        if (user.length > 0) {
          // 사용자에게 포인트 부여
          await pool.query('UPDATE db_team.user SET total_point = total_point + 500 WHERE userid = ?', [topUser]);
          console.log(`포인트가 부여되었습니다. 사용자: ${topUser}`);
        } else {
          console.log('사용자가 존재하지 않습니다.');
        }
      } else {
        console.log('주문 랭킹이 없습니다.');
      }
    }

    // 가져온 레시피 번호들의 month_drink_is와 month_drink_count를 업데이트
    await Promise.all(
      topRecipes.map(async (recipe) => {
        await pool.query('UPDATE db_team.recipe SET month_drink_is = 1, month_drink_count = month_drink_count + 1 WHERE recipe_num = ?', [recipe.recipe_num]);
      })
    );

  
    // 가져온 레시피 번호들의 month_drink_is를 1로 업데이트
    await Promise.all(
      topRecipes.map(async (recipe) => {
        await pool.query('UPDATE db_team.recipe SET month_drink_is = 1, month_drink_count = month_drink_count + 1 WHERE recipe_num = ?', [recipe.recipe_num]);
      })
    );

    // 이벤트 페이지로 리다이렉트 또는 이벤트 페이지에 필요한 데이터 전달
    // 여기에서는 리다이렉트 예시로 홈페이지로 돌아가도록 설정했습니다.
    res.redirect('/managerevent');
  } catch (error) {
    console.error('이달의 음료 설정 중 오류 발생:', error);
    res.status(500).json({ error: '오류가 발생했습니다. 다시 시도해주세요.' });
  }
});

module.exports = router;