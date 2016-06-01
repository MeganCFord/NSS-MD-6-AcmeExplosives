"use strict";

var explosives = (function (explosives) {

  $(document).ready(function(){

    const productObject = {
      category: {},
      types: [], 
      products: []
    };

    let selectedCategory = null;

    //event listener for submit button.
    $("form").submit(function(e){
      //keeps page from refreshing.
      e.preventDefault();

      selectedCategory = $(this).find(".categories:selected").val();

      explosives.loadJSON("data/categories.json")
        .then(explosives.setCategory);
    });

    //stock JSON loader function. returns a promise object that can be used with 'then' even though I'm using jquery inside the function.
    explosives.loadJSON = function(url) {
      return new Promise(function(resolve, reject) {
        $.get(url)
          .done(function (data) {
            resolve(data);
          }).fail(function (err) {
            reject(err);
          });
      });
    };

    explosives.setCategory = function(data) {
      let typesURL = "";
      productObject.category = data.categories[selectedCategory];

      $(".categoryTitle").text(productObject.category.name);
      
      if (productObject.category.name === "Fireworks") {
        typesURL = "data/fireworks.json";

      } else if (productObject.category.name === "Demolition") {
        typesURL = "data/explosives.json";
      }
      explosives.loadJSON(typesURL)
        .then(explosives.setType);
    };

  //build object based on each one of these jsons
    explosives.setType = function(data) {
      productObject.types = data.types;
      explosives.loadJSON("data/products.json")
        .then(explosives.setProducts)
        .then(explosives.injectIntoDom);
    };

  //load the products.json and filter based on category 
    explosives.setProducts = function(productData) {

      productData.products.forEach(function(product) {
        if (product.category === productObject.category.id) {
          productObject.products.push(product);
        }
      });
      return productObject;
    };

    //inject the completed object properties into the DOM. 
    explosives.injectIntoDom = function() {
      productObject.products.forEach(function(product) {
        const productCategoryName = productObject.types[product.type];
        const productDiv = `<div class="productDiv col col-xs-3">
                            <h2>${product.name}</h2>
                            <p>${product.description}</p>
                            <h4>type: ${productCategoryName.name}</h4>
                            <p> ${productCategoryName.description}</p>
                          </div>`;
        $(".productsRow").append(productDiv);
      });
    };

  });//end of jquery ready function

  return explosives;
}(explosives || {}));
