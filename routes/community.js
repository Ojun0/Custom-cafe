var express = require('express');
var router = express.Router();
const pool = require('../db/db');
const time = require("../function/time");

const today = `${time.time().year}-${time.time().month}-${time.time().date}`

router.get('/', async (req, res) => {

    const customDrink = await pool.query("select * from db_team.recipe where share_is = 1 order by total_order_num desc;")
    // const hashtag = await pool.query("select * from db_team.hashtag_history as a inner join hashtag_info as b on a.hashtag_info_id = b.id inner join recipe as c on  a.recipe_recipe_num = c.recipe_num where recipe_recipe_num = ?", [menuNumber])
    // console.log("@@@" ,customDrink[0], hashtag[0])
    res.render('community', {
        customDrink: customDrink[0]
    })
})


router.post('/search', async (req, res) => {
    // 해시태그 받아옴
    console.log(req.body)
    const hashtag = [];
    const hashtagInput = req.body.hashtag; 
    const slicedHashtags = hashtagInput.split('#');  // '#' 기준으로 문자열을 분리합니다.
    for (i=1; i<slicedHashtags.length; i++) {
        hashtag.push(slicedHashtags[i])
    }
    if (hashtag[0]) {
        const recipe = await pool.query('SELECT * FROM db_team.recipe WHERE share_is = 1 and recipe_num in (SELECT recipe_recipe_num FROM db_team.hashtag_history INNER JOIN db_team.hashtag_info ON hashtag_info_id = hashtag_info.id WHERE name = ?) order by total_order_num desc;',[hashtag]);
        res.render('community', { customDrink: recipe[0] });
    } else {
        const recipe = await pool.query('SELECT * FROM db_team.recipe;');
        res.render('community', { customDrink: recipe[0] });
    }
});

router.post('/:menuNum', async (req, res) => {
    const menuNumber = req.params.menuNum;
    const menuPrice = req.body.menuPrice;
    const menuName = req.body.menuName;
    const userid = req.session.uid;


    // 현재 세션에 저장된 사용자 ID

    // 해당 음료를 만든 사용자의 ID 조회
    const creater = await pool.query('SELECT user_userid FROM db_team.recipe WHERE recipe_num = ?', [menuNumber]);

    // 사용자가 이미 해당 음료를 구독한 이력 조회
    const subHistory = await pool.query('SELECT recipe_recipe_num FROM db_team.customdrink WHERE user_userid = ?', [req.session.uid]);

    if (userid !== creater[0].user_userid) {
        let alreadySubscribed = false;
        
        // 사용자가 이미 해당 음료를 구독한 이력이 있는지 확인
        for (let i = 0; i < subHistory.length; i++) {
            if (subHistory[i].recipe_recipe_num == menuNumber) {
                alreadySubscribed = true;
                break;
            }
        }

        if (!alreadySubscribed) {
            // 해당 음료를 구독한 이력이 없다면 새로운 구독 이력 추가
            await pool.query('INSERT INTO db_team.customdrink VALUES (?,?,?,?,?,?,?,?,?,?,?)', [null, menuName, 0, menuPrice, 0, today, null, 0, "Y", userid, menuNumber]);
            
            // 해당 레시피의 구독 수 증가
            await pool.query('UPDATE db_team.recipe SET sub_num = sub_num + 1 WHERE recipe_num = ?', [menuNumber]);

            return res.redirect('/community');
        } else {
            // 이미 구독한 이력이 있다면 경고 메시지 전송
            return res.send(
                `<script type="text/javascript">alert('이미 구독한 음료입니다.'); location.href = "/community";</script>`
            );
        }
    } else {
        // 본인이 만든 음료는 구독할 수 없음
        return res.send(
            `<script type="text/javascript">alert('본인이 만든 음료는 구독할 수 없습니다.'); location.href = "/community";</script>`
        );
    }
});

// router.post('/cart/:menuNumber', async (req, res) => {
//     const menuNumber = req.params.menuNumber;
//     console.log(menuNumber);
//     const menuPrice = req.body.menuPrice;
//     const userName = req.session.uid

//     const addCart = await pool.query('insert into db_team.shopping_cart values (?,?,?,?)', 
//     [null,userName,null,menuNumber]
//     )
//     return res.redirect('/community');
// }
// )
module.exports = router;