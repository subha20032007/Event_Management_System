const mysql=require("mysql")

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"2003",
    database:"users_db"
})

db.connect((err)=>{
    if(err){
        console.log("err in connect",err)
    }
})

module.exports={
    db
}