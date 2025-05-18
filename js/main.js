const navBtn = document.querySelector(".navBtn");
const navBar = document.querySelector(".navBar");
const slideList = document.querySelector(".slideList");
const closeBtn = document.querySelector(".closeBtn");
const loader = document.querySelector(".loader");
const catBtn = document.querySelector("#catBtn");
const cate = document.querySelector(".cate");
const searchBtn = document.querySelector("#searchBtn");
const searchPage = document.querySelector(".searchPage");
const areaBtn = document.querySelector("#areaBtn");
const Ingredients = document.querySelector("#Ingredients");
const ingred = document.querySelector(".ingred");
const area = document.querySelector(".area");
const layers = document.querySelectorAll(".layer");
const nInput = document.querySelector("#nameInput");
const letterInput = document.querySelector("#letterInput");
const contactBtn = document.querySelector("#contactBtn");
const contact = document.querySelector(".contact");
const inputsForm = document.querySelector(".inputsForm");


let arr = [];

// -------------------- hide sections--------------------
function hideAllSections() {
  cate.classList.add("d-none");
  searchPage.classList.add("d-none");
  area.classList.add("d-none");
  ingred.classList.add("d-none");
  ingred.classList.add("d-none");
  inputsForm.classList.add("d-none");
  document.querySelector("#resultsRow").innerHTML = "";
}

// -------------------- Loader --------------------
function showLoader() {
  loader.classList.remove("d-none");
  loader.classList.add("d-flex");
}
function hideLoader() {
  loader.classList.remove("d-flex");
  loader.classList.add("d-none");
}

// -------------------- Navigation --------------------
function navClick() {
  navBtn.addEventListener("click", () => {
    navBar.classList.add("navShifted");
    slideList.classList.add("show");
    slideList.classList.remove("d-none");
    closeBtn.classList.remove("d-none");
    navBtn.classList.add("d-none");
  });

  closeBtn.addEventListener("click", () => {
    navBar.classList.remove("navShifted");
    slideList.classList.remove("show");
    slideList.classList.add("d-none");
    closeBtn.classList.add("d-none");
    navBtn.classList.remove("d-none");
  });
}
navClick();

async function loadInitialMeals() {
  showLoader();
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
  let data = await response.json();
  arr = data.meals 
  displayMeals();
  hideLoader();
}
loadInitialMeals()


// -------------------- Search --------------------
searchBtn.addEventListener("click", function () {
  hideAllSections();
  searchPage.classList.remove("d-none");
});

function displayMeals() {
  let cartona = "";

  if (arr.length === 0) {
    document.querySelector("#resultsRow").innerHTML = `<p class="text-center text-white fs-4">لا توجد وجبات بهذا الاسم</p>`;
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    cartona += `
      <div class="col-md-3 position-relative overflow-hidden">
        <div class="layer d-flex align-items-center">
          <h3 class="ps-3">${arr[i].strMeal}</h3>
        </div>
        <img src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}" class="img-fluid">
      </div>`;
  }

  document.querySelector("#resultsRow").innerHTML = cartona;
}

async function getApiByName(name) {
  if (name.trim() === "") {
    arr = [];
    return;
  }
  showLoader();
  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  let response = await request.json();
  arr = response.meals || [];
  displayMeals();
  hideLoader();
}

async function getApiByLetter(letter) {
  if (letter.trim() === "" || letter.length > 1) {
    arr = [];
    return;
  }
  showLoader();
  let request = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  let response = await request.json();
  arr = response.meals || [];
  displayMeals();
  hideLoader();
}

function setupSearchInputs() {
  nInput.addEventListener("input", () => {
    if (letterInput.value !== "") letterInput.value = "";
    getApiByName(nInput.value);
  });

  letterInput.addEventListener("input", () => {
    if (letterInput.value.length > 1) {
      letterInput.value = letterInput.value.charAt(0);
    }
    if (nInput.value !== "") nInput.value = "";
    getApiByLetter(letterInput.value.toLowerCase());
  });
}
setupSearchInputs();

// -------------------- Categories --------------------
catBtn.addEventListener("click", async function () {
  hideAllSections();
  cate.classList.remove("d-none");

  let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  let data = await response.json();
  const categories = data.categories;

  let cartona = "";
  for (let i = 0; i < categories.length; i++) {
    cartona += `
      <div class="col-md-3 position-relative overflow-hidden">
        <div class="layer d-flex align-items-center flex-column p-3">
          <h3 class="ps-3">${categories[i].strCategory}</h3>
          <p>${categories[i].strCategoryDescription.substring(0, 50)}...</p>
        </div>
        <img src="${categories[i].strCategoryThumb}" alt="${categories[i].strCategory}" class="img-fluid">
      </div>`;
  }

  document.querySelector("#categoriesRow").innerHTML = cartona;
});

// -------------------- Areas --------------------
areaBtn.addEventListener("click", async function () {
  hideAllSections();
  area.classList.remove("d-none");
  showLoader();

  let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  let data = await response.json();
  const areas = data.meals;

  let cartona = "";
  for (let i = 0; i < areas.length; i++) {
    cartona += `
      <div class="col-md-3 position-relative overflow-hidden">
        <div class="area-card text-white text-center p-4 cursor-pointer" data-area="${areas[i].strArea}">
          <i class="fa-solid fa-house-laptop fa-4x mb-2"></i>
          <h3 class="fw-bold">${areas[i].strArea}</h3>
        </div>
      </div>`;
  }

  document.querySelector("#resultsRow").innerHTML = cartona;
  hideLoader();

  document.querySelectorAll(".area-card").forEach(card => {
    card.addEventListener("click", function () {
      const selectedArea = this.getAttribute("data-area");
      getMealsByArea(selectedArea);
    });
  });
});

async function getMealsByArea(area) {
  showLoader();
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let data = await response.json();
  const meals = data.meals;

  let cartona = "";
  for (let i = 0; i < meals.length; i++) {
    cartona += `
      <div class="col-md-3 position-relative overflow-hidden">
        <div class="layer d-flex align-items-center">
          <h3 class="ps-3">${meals[i].strMeal}</h3>
        </div>
        <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}" class="img-fluid">
      </div>`;
  }

  document.querySelector("#resultsRow").innerHTML = cartona;
  hideLoader();
}

// -------------------- Ingredients --------------------
ingredBtn.addEventListener("click", async function () {
  hideAllSections();
  ingred.classList.remove("d-none");
  showLoader();

  let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  let data = await response.json();
  const ingredients = data.meals.slice(0, 20);

  let cartona = "";
  for (let i = 0; i < ingredients.length; i++) {
    cartona += `
      <div class="col-md-3 position-relative overflow-hidden">
        <div class="ingredient-card m-4 p-3 text-white bg-dark rounded-3 cursor-pointer text-center" data-ingred="${ingredients[i].strIngredient}">
          <i class="fa-solid fa-drumstick-bite fa-4x mb-2"></i>
          <h3 class="fw-bold">${ingredients[i].strIngredient}</h3>
          <p>${ingredients[i].strDescription ? ingredients[i].strDescription.substring(0, 50) : ""}...</p>
        </div>
      </div>`;
  }

  document.querySelector("#ingredientsRow").innerHTML = cartona;
  hideLoader();

  document.querySelectorAll(".ingredient-card").forEach(card => {
    card.addEventListener("click", function () {
      const selectedIngred = this.getAttribute("data-ingred");
      getMealsByIngredient(selectedIngred);
    });
  });
});

async function getMealsByIngredient(ingredient) {
  showLoader();
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  let data = await response.json();
  const meals = data.meals;

  let cartona = "";
  for (let i = 0; i < meals.length; i++) {
    cartona += `
      <div class="col-md-3 position-relative overflow-hidden">
        <div class="layer d-flex align-items-center">
          <h3 class="ps-3">${meals[i].strMeal}</h3>
        </div>
        <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}" class="img-fluid">
      </div>`;
  }

  document.querySelector("#resultsRow").innerHTML = cartona;
  ingred.classList.add("d-none");
  hideLoader();
}
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const ageInput = document.getElementById("ageInput");
const passwordInput = document.getElementById("passwordInput");
const repasswordInput = document.getElementById("repasswordInput");
const submitBtn = document.getElementById("submitBtn");


function validateName() {
  return /^[a-zA-Z ]+$/.test(nameInput.value);
}
function validateEmail() {
  return /^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(emailInput.value);
}
function validatePhone() {
  return /^01[0125][0-9]{8}$/.test(phoneInput.value); 
}
function validateAge() {
  return ageInput.value >= 12 && ageInput.value <= 100;
}
function validatePassword() {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordInput.value);
}
function validateRepassword() {
  return repasswordInput.value === passwordInput.value;
}


function validateForm() {
  if (
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAge() &&
    validatePassword() &&
    validateRepassword()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", false);
  }
}


contactBtn.addEventListener("click", function () {
  hideAllSections();     
  contact.classList.remove("d-none"); 
  inputsForm.classList.remove("d-none"); 
});


document.querySelectorAll(".inputsForm input").forEach((input) => {
  input.addEventListener("input", validateForm);
});
