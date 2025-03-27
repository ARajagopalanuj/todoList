const{Pool}=require("pg");


    const db=new Pool(
    {
        user:"postgres",
        host:"localhost",
        database:"your database name",
        password:"your password",
        port:5432,
        

    });
    module.exports=db;
