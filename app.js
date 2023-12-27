var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require("method-override");
var app = express();
const session = require("express-session");
const sessionStore = require("./db/session");




app.use(methodOverride("_method"));



// 미들웨어를 추가하여 모든 요청에서 세션 값을 콘솔에 출력
app.use((req, res, next) => {
  next();
});

// 장바구니
var cartRouter = require('./routes/cart');
//커스텀 음료 등록
var customRouter = require('./routes/custom');
//메인
var homeRouter = require('./routes/home');
//로그인
var loginRouter = require('./routes/login');
//메뉴
var menuRouter = require('./routes/menu');
//커뮤니티
var communityRouter = require('./routes/community')
//음료 상세페이지
var drinkdetailRouter = require('./routes/drinkdetail')
//마이페이지
var mypageRouter = require('./routes/mypage')
//문의내역
var complainRouter = require('./routes/complainHistory')
//리뷰쓰기
var reviewWriteRouter = require('./routes/reviewWrite')
//리뷰내역
var reviewHistoryRouter = require('./routes/reviewHistory')
// 커스텀음료 등록 패이지
var myRegistration = require('./routes/myRegistration');
// 주문내역 페이지
var receiptRouter = require('./routes/receipt');
// 음료 좋아요 한사람
var likerRouter = require('./routes/liker');
// 팔로워
var followerRouter = require('./routes/follower');
// 팔로워 취소
var unfollowerRouter = require('./routes/unfollower');
//검색
var searchRouter = require('./routes/community');
//상대 유저
var userMainRouter = require('./routes/userMain')
var logoutRouter = require('./routes/logout');

// ---관리자 관련 페이지----
// 관리자 메인 페이지
var managerMainRouter = require('./routes/managerMain');
var managereventRouter = require('./routes/managerevent');
var managerorderRouter = require('./routes/managerorder');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : "sessionkey",
  resave : false,
  saveUninitialized:true,
  store: sessionStore
}));
// 미들웨어를 추가하여 모든 요청에서 세션 값을 콘솔에 출력
app.use((req, res, next) => {
  res.locals.user_id=""
  if(req.session.uid){
  res.locals.user_id = req.session.uid;
  console.log('현재 세션 값:', req.session.uid);
  console.log('현재 로컬 세션', res.locals.user_id);
  }
  next();
});


app.use('/cart', cartRouter);
app.use('/custom', customRouter);
app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/menu', menuRouter);
app.use('/community', communityRouter);
app.use('/drinkdetail', drinkdetailRouter);
app.use('/mypage',mypageRouter);
app.use('/complainhistory', complainRouter);
app.use('/reviewWrite', reviewWriteRouter);
app.use('/reviewHistory', reviewHistoryRouter);
app.use('/myRegistration', myRegistration);
app.use('/liker', likerRouter);
app.use('/follower', followerRouter);
app.use('/unfollower', unfollowerRouter);
app.use('/receipt', receiptRouter);
app.use('/search', searchRouter);
app.use('./userMain', userMainRouter)
app.use('/logout', logoutRouter);

// 관리자 관련 라우터
app.use('/managerMain', managerMainRouter);
app.use('/managerevent', managereventRouter);
app.use('/managerorder', managerorderRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
