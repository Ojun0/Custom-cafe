var express = require('express');
var router = express.Router();
const pool = require('../db/db');

router.post('/', async (req, res) => {
    const {key} = req.body;
    if (key == "coffee"){
        key = "커피";
    }
    try{
        const drinkSearch = await pool.query(
            "select * from db_team.recipe where recipe_name like ?",
            ["%" + key + "%"]
        );
        if(drinkSearch[0] == []){
            return res.send(
                `<script type = "text/javascript">alert("해당 카테고리가 없습니다."); location.href= "/";</script>`
            );
        }
        return res.render('community', {customDrink:drinkSearch[0]})
    }catch (error) {
        return res.send(
          `<script type = "text/javascript">alert("해당 카테고리가 없습니다."); location.href= "/";</script>`
        );
      }
})



module.exports = router;
