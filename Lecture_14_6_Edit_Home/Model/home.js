const path = require("path");
const fs = require("fs");
const rootDir = require("../utils/pathutil");
const Favourite = require("./favorite");
const homeDataPath = path.join(rootDir, "Data", "homes.json");
// let registeredHomes =[];
module.exports = class Home {
  constructor(houseName, imageUrl, price, location, rating) {
    this.houseName = houseName;
    this.imageUrl = imageUrl;
    this.price = price;
    this.location = location;
    this.rating = rating;
  }

  save() {
    Home.fetchAll((registeredHomes) => {
      if(this.id){ // edit home case
      registeredHomes=registeredHomes.map(home=>home.id === this.id ?this:home);
    }
    else{ // add home case
      this.id = Math.random().toString();
      registeredHomes.push(this);
    }
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (error) => {
        console.log("File writing concluded: ", error);
      });
    }); 
  }


  static fetchAll(callback) {
    fs.readFile(homeDataPath, (err, data) => {
      /* if(!err){
        callback (JSON.parse(data));
      }
      else{
        callback ([]);
      }
      */
      callback(!err ? JSON.parse(data) : []);
    });
  }
  static findById(homeId, callback) {
    this.fetchAll((homes) => {
      const homeFound = homes.find((h) => h.id === homeId);
      callback(homeFound);
    });
  }

  static deleteById(homeId, callback) {
    this.fetchAll(homes=>{
      homes = homes.filter(home=>home.id !== homeId);
      fs.writeFile(homeDataPath, JSON.stringify(homes), err=>{
        Favourite.deleteById(homeId,callback);
      });
    })
  }
  
};
