import fs from "fs";

function partTwo(argv) {
  let file = process.argv[2];
  //fetch the csv file.
  let data = fs.readFileSync(file, "utf8");

  //split to array with line breaks and ignoring the heading values
  const table = data.split("\n").slice(1);

  //iterate over the array to create an array of objects

  const tableObj = table.map(function (str) {
    //separating indidvidual values from array
    let obj = str.split(",");

    //returns an array of objects
    return {
      Vendor: obj[0],
      Category: obj[1],
      Subcategory: obj[2],
      Spend: obj[3],
    };
    return obj;
  });

  // helper function for autofilling categories and sub categories for missing fields.
  // pushes to a new array only the objects with categories and sub categories for reference
  let categoriesArr = [];
  function categories() {
    for (let i = 0; i < tableObj.length; i++) {
      if (tableObj[i].Category !== "" && tableObj[i].Subcategory !== "") {
        categoriesArr.push(tableObj[i]);
      }
    }
  }
  categories();

  // function compares object values against categoriesArr and auto assigns required fields.
  function assignValues() {
    for (let i = 0; i < tableObj.length; i++) {
      if (tableObj[i].Category == "") {
        // finding the relevant category
        const temp = categoriesArr.find(
          ({ Vendor }) => Vendor === tableObj[i].Vendor
        );

        tableObj[i].Category = temp.Category;
        tableObj[i].Subcategory = temp.Subcategory;
      }
    }
  }
  assignValues();

  // sorting function

  // convert the Spend category to int

  for (let i = 0; i < tableObj.length; i++) {
    tableObj[i].Spend = Number(tableObj[i].Spend);
  }

  // create an array of objects with categories, subcategories and sub categoryTotal.
  // sorted based on unique subcategories and adding up the related expenses
  let summary = [];

  tableObj.reduce(function (prevVal, currentVal) {
    //checking if the subcategory exists
    if (!prevVal[currentVal.Subcategory]) {
      prevVal[currentVal.Subcategory] = {
        Category: currentVal.Category,
        Subcategory: currentVal.Subcategory,
        Spend: 0,
      };
      summary.push(prevVal[currentVal.Subcategory]);
    }
    // aading the spend
    prevVal[currentVal.Subcategory].Spend += currentVal.Spend;
    return prevVal;
  }, {});

  // sorting the summary array by categories

  summary.sort(function (a, b) {
    let categoryA = a.Category.toLowerCase(); // case insensitve
    let categoryB = b.Category.toLowerCase(); // case insensitve
    if (categoryA < categoryB) {
      return -1;
    }
    if (categoryA > categoryB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  // Create a SET of unique values by subcategories
  let uniqueCategories = [...new Set(summary.map((item) => item.Category))];
  // console.log(uniqueCategories);

  //customSummary for the console

  let customSummary = function () {
    for (let i = 0; i < uniqueCategories.length; i++) {
      console.log(uniqueCategories[i]);
      if (uniqueCategories[i]) {
        for (let j = 0; j < summary.length; j++) {
          if (summary[j].Category == uniqueCategories[i]) {
            console.log(
              "   " + summary[j].Subcategory,
              "      " + "$",
              Math.floor(summary[j].Spend)
            );
          }
        }
      }
    }
  };
  customSummary();
}
partTwo();
