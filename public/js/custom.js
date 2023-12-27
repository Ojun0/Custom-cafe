
var cupSize = 0; // 초기 값

function hideRow() {
    const row = document.getElementById('ingredient');
    const row2 = document.getElementById('ingredient2');
    const row3= document.getElementById('ingredient3');
    const row4 = document.getElementById('ingredient4');
    const row5 = document.getElementById('ingredient5');
    row.style.display = 'none';
    row2.style.display = 'none';
    row3.style.display = 'none';
    row4.style.display = 'none';
    row5.style.display = 'none';
  }


  document.addEventListener('DOMContentLoaded', function() {
    hideRow(); // 페이지 로드 시 오렌지 행 숨김
  });



// 추가
function showRow1()  {
    const row = document.getElementById('ingredient');
    row.style.display = '';
  }
  function showRow2()  {
    const row = document.getElementById('ingredient2');
    row.style.display = '';
  }
  function showRow3()  {
    const row = document.getElementById('ingredient3');
    row.style.display = '';
  }
  function showRow4()  {
    const row = document.getElementById('ingredient4');
    row.style.display = '';
  }
  function showRow5()  {
    const row = document.getElementById('ingredient5');
    row.style.display = '';
  }
// 삭제
function deleteRow1()  {
    const row = document.getElementById('ingredient');
    row.style.display = 'none';
  }
  function deleteRow2()  {
    const row = document.getElementById('ingredient2');
    row.style.display = 'none';
  }
  function deleteRow3()  {
    const row = document.getElementById('ingredient3');
    row.style.display = 'none';
  }
  function deleteRow4()  {
    const row = document.getElementById('ingredient4');
    row.style.display = 'none';
  }
  function deleteRow5()  {
    const row = document.getElementById('ingredient5');
    row.style.display = 'none';
  }





function updateCupSize(select) {
    cupSize = select.value;
    var cupSizeDisplay = document.getElementById("cupSize");
    cupSizeDisplay.textContent = cupSize;
    updateTotalMl();
}


function updateBase(select) {
    var baseMl = select.data-price;

    document.getElementById("baseMl").textContent = baseMl;
    updateTotalMl();
}    

function updateingredientMl(select) {
    var ingredientMl = select.value;

    // Find the closest row and then find the .ingredientMl element within that row
    var row = select.closest('tr');
    var ingredientMlElement = row.querySelector(".ingredientMl");
    var quantity2 = parseInt(row.querySelector('.quantity').value);

    ingredientMlElement.textContent = ingredientMl;
    var totalingredientMl = ingredientMl * quantity2;
    row.querySelector(".totalingredientMl").textContent = totalingredientMl;


    updateTotalMl();
}


function updatetotalingredientMl(select) {
    

    // Find the closest row and then find the .ingredientMl element within that row
    var row = select.closest('tr');
    var ingredientMl = select.value;
    var baseMl = parseInt(document.getElementById("ingredientMl").textContent);
    var quantity2 = parseInt(row.querySelector('.quantity').value);
    
    var totalingredientMl = ingredientMl * quantity2;
    row.querySelector(".totalingredientMl").textContent = totalingredientMl;

    updateTotalMl();
}



function updateTotalMl() {
    var quantityElement = document.getElementById('quantity_order');
    var baseMl = parseInt(document.getElementById("baseMl").textContent);
    var quantity = parseInt(quantityElement.value)
    var totalBaseMl = baseMl * quantity;
    document.getElementById("totalBaseMl").textContent = totalBaseMl


    var ingredientRows = document.querySelectorAll("#mlTable tbody tr");
    var ingredientTotal = 0;

    
    ingredientRows.forEach(function (row) {
        ingredientTotal += parseInt(row.cells[5].textContent);
    });

    var totalMl = ingredientTotal;

    document.getElementById("totalMlValue").textContent = totalMl;

    // Check if totalMl is greater than cupSize
    if (totalMl > cupSize) {
        alert("오류: 총 ml 수가 컵 사이즈를 초과했습니다!");
    }
}

function calculateTotal() {
    // Add your logic to handle the "등록하기" button click
}


