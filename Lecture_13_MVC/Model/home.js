const path = require('path'); 
const fs = require('fs');
const rootDir = require('../utils/pathutil');
// let registeredHomes =[];
module.exports= class Home{
  constructor(houseName,imageUrl,price,location,rating){
    this.houseName = houseName;
    this.imageUrl = imageUrl;
    this.price = price;
    this.location =  location;
    this.rating = rating;

  }
  
  save(){
    Home.fetchAll(registeredHomes=>{
      registeredHomes.push(this);
      const homeDataPath =path.join(rootDir,"Data","homes.json");
      fs.writeFile(homeDataPath,JSON.stringify(registeredHomes),error=>{
      console.log("File writing concluded: ",error );
      
    })
    })
    
  }
  static fetchAll(callback){
    const homeDataPath =path.join(rootDir,"Data","homes.json");
    fs.readFile(homeDataPath,(err,data)=>{
      /* if(!err){
        callback (JSON.parse(data));
      }
      else{
        callback ([]);
      }
      */
     callback(!err?JSON.parse(data):[]);
    });
  }

}