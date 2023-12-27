// 날짜 함수 정의
const time = () => {
    let today = new Date();
    
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();

    const timeObject = {
        year : year,
        month : month,
        date : date
    }
    return timeObject;
}

module.exports = {time}