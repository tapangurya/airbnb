const path = require('path'); 
const fs = require('fs');
const rootDir = require('../utils/pathutil');
 const homeDataPath =path.join(rootDir,"Data","homes.json");
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
      this.id = Math.random().toString();
      registeredHomes.push(this);
     
      fs.writeFile(homeDataPath,JSON.stringify(registeredHomes),error=>{
      console.log("File writing concluded: ",error );
      
    })
    })
    
  }
  static fetchAll(callback){
    
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
  static findById(homeId,callback){
    this.fetchAll(homes=>{
      const homeFound = homes.find( h => h.id === homeId);
      callback(homeFound);
    })
  }

};