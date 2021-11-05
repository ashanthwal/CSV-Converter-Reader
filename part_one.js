import fs from "fs";
import { argv } from "process";

function getData(argv) {
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
  // has a list of all vendors
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

  // sorting the objects by Vendor name

  tableObj.sort(function (a, b) {
    let vendorA = a.Vendor.toLowerCase(); // case insensitve
    let vendorB = b.Vendor.toLowerCase(); // case insensitve
    if (vendorA < vendorB) {
      return -1;
    }
    if (vendorA > vendorB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  // console.log(tableObj);

  // Output a CSV file with all transactions Categorized and sorted

  // Create an array. Reverse the initial process.
  const csvOutput = [
    ["Vendor", "Category", "Subcategory", "Spend"],
    ...tableObj.map((item) => [
      item.Vendor,
      item.Category,
      item.Subcategory,
      item.Spend,
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n"); // Converting the array into strings
  console.log(csvOutput);

  //Output a CSV File. Creates the CSV in the data folder.
  //added a timestamp to file name for distinction.

  fs.writeFile(
    `./data/csvoutput_${Date.now()}.csv`,
    csvOutput,
    function (err, data) {
      if (err) throw err;
      console.log("File saved successfully to the data folder.");
    }
  );
}

getData();
