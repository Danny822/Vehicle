const express =require('express');
const cors = require('cors');
const mysql=require('mysql');
const session =require('express-session');

const app = express();

app.use(cors());

app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'123',
    cookie:{
        maxAge:6000,
    }
}));

const SELECT_ALL_PROUCTS_QUERY = 'SELECT * FROM `admin`';

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'car_rental'
});
connection.connect(err=>{
    if(err){
        return err;
    }
});



app.get('/try-session',(req,res)=>{
    req.session.views=req.session.views|0;
    req.session.views++;
    res.contentType('text/plain');
    res.write('拜訪次數:'+req.session.views+'\n');
    res.end(JSON.stringify(req.session));
})


app.get('/test',(req,res)=>{
    connection.query(SELECT_ALL_PROUCTS_QUERY,(err,results)=>{
        if(err){
            return res.send(err)

        }
        else{
            return res.json({
                data: results
            })
        }
    })
});
app.get('/user',(req,res)=>{
    sql='SELECT * FROM lessee';
    connection.query(sql,(err,results)=>{
        if(err){
            return res.send(err)

        }
        else{
            return res.json({
                data: results
            })
        }
    })
});
app.get('/diver',(req,res)=>{
    sql='SELECT * FROM driver';
    connection.query(sql,(err,results)=>{
        if(err){
            return res.send(err)

        }
        else{
            return res.json({
                data: results
            })
        }
    })
});
app.get('/store',(req,res)=>{
    sql='SELECT * FROM user_shop';
    connection.query(sql,(err,results)=>{
        if(err){
            return res.send(err)

        }
        else{
            return res.json({
                data: results
            })
        }
    })
});
app.get('/userlogin',(req,res)=>{
    
    const {account,password}=req.query;
    const data={success:false,message:"",account:account,password:password}
    console.log(account,password)
    const sql=`SELECT * FROM lessee WHERE mAccount = "${account}" AND mPwd="${password}"`;
    connection.query(sql,(err,results,rowCount) => {
         
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
           
            data.massage="障號密碼錯誤"
            data.success=false
            res.json({data})
            return 

        }else{
            data.massage="登入"
            data.success=true
            res.json({data})
            
            return  
        }
    });
});
app.get('/diverlogin',(req,res)=>{
    const {account,password}=req.query;
    const data={success:false,message:"",account:account,password:password}
    console.log(account,password)
    const sql=`SELECT * FROM driver WHERE driverAccount = "${account}" AND driverPwd="${password}"`;
    connection.query(sql,(err,results,rowCount) => {
         
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
           
            data.massage="障號密碼錯誤"
            data.success=false
            res.json({data})
            return 

        }else{
            data.massage="登入"
            data.success=true
            res.json({data})
             
            return  
        }
    });
});
app.get('/storelogin',(req,res)=>{
    const {account,password}=req.query;
    const data={success:false,message:"",account:account,password:password}
    console.log(account,password)
    const sql=`SELECT * FROM user_shop WHERE shopAccount = "${account}" AND shopPwd="${password}"`;
    connection.query(sql,(err,results,rowCount) => {
         
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
           
            data.massage="障號密碼錯誤"
            data.success=false
            res.json({data})
            return 

        }else{
            data.massage="登入"
            data.success=true
            res.json({data})
            return  
        }
    });
});
app.listen(4000,()=>{
    console.log(`Products server listening on port 4000`)
});