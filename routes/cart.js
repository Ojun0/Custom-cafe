var express = require('express');
var router = express.Router();
const pool = require('../db/db');
const time = require("../function/time");

const today = `${time.time().year}-${time.time().month}-${time.time().date}`

router.get('/', async (req, res) => {
    const userId = req.session.uid; 

    // 장바구니 보여주기
    const cartNum = await pool.query(`
    select * from db_team.shopping_cart inner join db_team.recipe on enroll_id = recipe_num where user_user_id = ?`, [userId])
    
    const cart = await pool.query(
        "select a.* , b.*from db_team.shopping_cart a inner join db_team.recipe b on a.enroll_id = b.recipe_num where user_user_id = ?",[userId]);
    console.log("cart:",cart[0]);
    res.render('cart', {
        cartNum : cartNum[0]
    })



})

router.post('/order', async (req, res) => {
    const userId = req.session.uid

    // 등록한 음료, 이달의 음료, 커뮤니티 음료 처리
    const cart = await pool.query(
        "select a.* , b.*from db_team.shopping_cart a inner join db_team.recipe b on a.enroll_id = b.recipe_num where user_user_id = ?",[userId]);
    // console.log("cart:",cart[0]);
    // 등록한 음료, 이달의 음료, 커뮤니티 음료  총액 계산
    let totalPrice = 0;
    for(i = 0; i < cart[0].length; i++){
        totalPrice += cart[0][i].recipe_price
    }
    

    // 등록한 음료, 이달의 음료, 커뮤니티 음료 order에 넣기 
    const orderAdd = await pool.query(`
    insert into \`order\`(id, date, total_price, user_userid) values(?,?,?,?)`, [null,today,totalPrice,userId])
    const result = await pool.query("SELECT LAST_INSERT_ID() as id");
    const result_id = result[0][0].id;


    // 등록한 음료, 이달의 음료, 커뮤니티 음료 order_has_menu에 넣기
    for (let i = 0; i < cart[0].length; i++) {
        // const orderListAdd = await pool.query(`
        //     INSERT INTO order_has_menu( order_id, count, price, customdrink_id, menu_id, recipe_id)
        //     VALUES (?,1, ?, NULL, NULL, ?)`, [userorderid ,price[0][i].recipe_price, enrollDrink[0][i].enroll_id]);
        const ordering = await pool.query("insert into order_has_menu values(null,?,?,null,null,?)",[
1, cart[0][i].recipe_price, cart[0][i].recipe_num
        ]);
    }
    let temp = [];
    const recipe = await pool.query("select * from recipe;");
    console.log("recipe:", recipe[0]);

    // 카트기 다 체크하게 하는 반복문
    for(var i=0; i< cart[0].length; i++){

        // console.log(select_total_order_num[0]);

        // 각 카트기 마다 레시피 테이블 다 체크해서 제품 맞으면 count +1 해주고 업데이트
        for(var j =0; j< recipe[0].length; j++){

            // 레시피 매번 변화한거 조회 ..
            const recipe2 = await pool.query("select * from recipe");
            try {
                // 레시피 번호 == 카트기 제품 번호 체크
                if(recipe2[0][j].recipe_num == cart[0][i].recipe_num){

                    // 카운트 변수 증가
                    let count = recipe2[0][j].total_order_num + 1;
                    // 업데이트문
                    const updateCount = await pool.query("update recipe set total_order_num = ?  where recipe_num = ? ",[
                    count,cart[0][i].recipe_num]);
                    const updateOrder = await pool.query("update customdrink set order_count = ? where recipe_recipe_num = ? and user_userid = ?",[
                    count,cart[0][i].recipe_num, userId
                    ])
                }
            } catch (error) {
                console.log(error);
                return res.send(`<script type = "text/javascript">alert("주문 중 문제가 발생했습니다 "); window.history.back();</script>`);
            }

        }

    }

    // 장바구니 비우기
    for (let i = 0; i < cart[0].length; i++) {
        const resetCart = await pool.query("delete from db_team.shopping_cart;");
    }

    // 메인으로 돌아가기
    return res.send(`<script type = "text/javascript">alert("주문이 완료되었습니다"); location.href = "/";</script>`)

    // console.log(select_total_order_num[0]);
    // const update_recipe_num = await pool.query("update recipe set total_order_num =? where recipe_num =?",[
    // cart[0][i].recipe_num
    // ]);


    // 주문 총 횟수 레시피 테이블 에 ? 
   
    // const menuNum = await pool.query(`
    // select recipe_id from db_team.order_has_menu group by recipe_id
    // `)

    // const orderCount = await pool.query(`
    // SELECT recipe_id, COUNT(*) as order_count
    // FROM db_team.order_has_menu
    // GROUP BY recipe_id
    // `)
    
    // for (let i = 0; i < menuNum[0].length; i++) {
    //     const recipeId = menuNum[0][i].recipe_id;
    //         const totalOrder = await pool.query(`
    //             UPDATE db_team.recipe
    //             SET total_order_num = total_order_num + ?
    //             WHERE recipe_num = ?
    //         `, [orderCount[0][i].order_count, recipeId]);
    // }
    // const orderCount = await pool.query(`
    // SELECT COUNT(enroll_id) AS count FROM shopping_cart WHERE enroll_id = ?`, [enrollDrink[0][0]]);

    // console.log(orderCount[0]);


    // for (let i = 0; i < cart[0].length; i++) {
    //     const deleteBusket = await pool.query(`
    //     delete from db_team.shopping_cart where enroll_id = ? and user_user_id = ? `,[
    //     enrollDrink[0][i].enroll_id, userId])
    // }

    
// return res.send("머고");
  });


module.exports = router;






// 구독한 음료 처리
    // const subDrink = await pool.query(`
    // select cutom_id from db_team.shopping_cart inner join db_team.customdrink on custom_id = recipe_recipe_num where user_user_id = ? ` [userId])

    // const  subprice = await pool.query(`
    // select price from db_team.shopping_cart inner join db_team.customdrink on  custom_id = recipe_recipe_num where user_user_id = ?`, [userId])


 // 구독한 음료 총액 계산
    // let subtotalPrice = 0;
    // for(i = 0; i < subprice[0].length; i++){
    //     totalPrice += subprice[0][i].recipe_price
    // }

 // 구독한 음료 총액 계산 order에 넣기 
    // const suborderAdd = await pool.query(`
    // insert into \`order\`(id, date, total_price, user_userid) values(?,?,?,?)`, [null,today,subtotalPrice,userId])
    

 // 구독한 음료 order_has_menu에 넣기
    // for (let i = 0; i < price[0].length; i++) {
    //     const suborderListAdd = await pool.query(`
    //         INSERT INTO order_has_menu( order_id, count, price, customdrink_id, menu_id, recipe_id)
    //         VALUES (?,1, ?, NULL, NULL, ?)`, [userorderid ,price[0][i].subrecipe_price, subDrink[0][i].custom_id]);
    // }