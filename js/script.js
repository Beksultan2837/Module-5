(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += " <img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load
document.addEventListener("DOMContentLoaded", function (event) {

  // TODO: STEP 0 — уже объяснено в комментариях

  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,   // ← STEP 1
    true); // JSON
});

// Builds HTML for the home page based on categories array
function buildAndShowHomeHTML(categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      // STEP 2: Выбираем случайную категорию
      var chosenCategoryShortName = chooseRandomCategory(categories).short_name;

      // STEP 3: Подставляем с кавычками (очень важно!)
      var homeHtmlToInsertIntoMainPage = 
        insertProperty(homeHtml, 
                       "randomCategoryShortName", 
                       "'" + chosenCategoryShortName + "'");

      // STEP 4: Вставляем на страницу
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    },
    false); // plain HTML
}

// Returns a random category object
function chooseRandomCategory(categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

// ==================== ОСТАЛЬНОЙ КОД (не меняй) ====================

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

// ... (весь остальной код buildAndShowCategoriesHTML, buildCategoriesViewHtml и т.д. остаётся как в оригинальном файле)

})(window);
