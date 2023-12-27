var express = require('express');
var router = express.Router();
const pool = require('../db/db');



router.get('/', async (req, res) => {
  try {
    const userId = req.session.uid;

    // 미들웨어: 세션 체크
  const checkSession = (req, res, next) => {
  if (!userId) {
    // 세션에 사용자 ID가 없으면 로그인 페이지로 리다이렉트 또는 다른 조치를 취할 수 있음
    res.redirect('/login'); // 예시: 로그인 페이지로 리다이렉트
  } else {
    next(); // 다음 미들웨어로 진행
    }
  };
  const user_info = await pool.query(
    "select * from user where userid=?",
    [userId]
  );
  const userInfo = user_info[0][0]; // user_info 배열에서 첫 번째 요소의 첫 번째 객체를 가져옴
  console.log('사용자 정보:', userInfo);

  // const subDrink = await pool.query(`select recipe_num from db_team.customdrink inner join db_team.recipe on recipe_recipe_num = recipe_num
  // `)
  
  
    // 이달의 음료 = 1 인 음료
    const [monthDrinkList] = await pool.query('SELECT * FROM db_team.recipe WHERE month_drink_is = 1');


    // 유저 활동 포인트에 따른 등급 부여
    await pool.query(`
      UPDATE user
      SET user_rank = CASE
        WHEN total_act_point >= 3000 THEN 'gold'
        WHEN total_act_point >= 1000 THEN 'silver'
        ELSE 'bronze'
      END
      WHERE userid = ?;
    `, [userId]);

    
   
    

    const [updatedUser] = await pool.query('SELECT userid, total_act_point, user_rank FROM user WHERE userid = ?', [userId]);

    // 내가 등록한 음료 목록 조회
    const [myRecipes] = await pool.query('select * from db_team.customdrink inner join db_team.recipe on recipe_recipe_num = recipe_num where customdrink.user_userid = ?', [userId]);
    console.log(myRecipes);
    // 내가 구독한 음료 목록 조회
    const [mySubscriptions] = await pool.query(`
      SELECT * FROM db_team.customdrink WHERE user_userid = ?;
    `, [userId]);

    // user_rank만 추출하여 userRank로 사용
    const userRank = updatedUser && updatedUser[0] ? updatedUser[0].user_rank : 'unknown';

    res.render('home', { myRecipes, mySubscriptions, monthDrinkList, userRank, userInfo});
  } catch (error) {
    
    res.status(500).send('내부 서버 오류');
  }
});


    

router.post('/cart/:menuNumber', async (req, res) => {
  // const menuNumber = req.params.menuNumber;
  const menuNumber = req.body.menuNumber;

  const userName = req.session.uid
  
  const addCart = await pool.query('insert into db_team.shopping_cart values (?,?,?,?)', 
  [null,userName,null,menuNumber]
  )
  return res.redirect('/');
}
)

router.post('/cart2/:menuNumber2', async (req, res) => {
  const menuNumber = req.body.menuNumber2;

  const userName = req.session.uid;
  const addCart = await pool.query('insert into db_team.shopping_cart values (?,?,?,?)', [null, userName, null, menuNumber]);

  return res.redirect('/');
});

router.post('/:menuNumber3', async (req, res) => {
  const menuNumber = req.body.menuNumber3;

  const userName = req.session.uid;
  const addCart = await pool.query('insert into db_team.shopping_cart values (?,?,?,?)', [null, userName, null, menuNumber]);

  return res.redirect('/');
});

module.exports = router;
  