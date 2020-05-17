
const express =require('express');
const cors = require('cors');
const mysql=require('mysql');
const bodyparser=require('body-parser');
const session =require('express-session');
const multer = require('multer');
const fs =require('fs')
const upload = multer({dest:'../Vehicle/public/uploads/'});
const uuidv4 = require('uuid/v4');
const app = express();
var MySQLStore = require('express-mysql-session')(session);
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(express.static('/public'))

app.use(express.json({ limit: '50mb' }))

var whitelist = ['http://localhost:4000', undefined,'http://localhost:3000'];
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log('origin: '+origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};
app.use(cors(corsOptions));
var options = {
    host: 'localhost',
    port: 3306,
    user: 'danny',
    password: '1234',
    database: 'session_test'
};
 

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

const SELECT_ALL_PROUCTS_QUERY = 'SELECT * FROM `admin`';

const connection = mysql.createConnection({
    host:'localhost',
    user:'danny',
    password:'1234',
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
    req.session.abc="fuckyou"
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
app.get('/driver',(req,res)=>{
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
app.post('/userregistered',upload.single('File'),(req,res,next)=>{
  
    const data={
        success:false,
        message:""}
        data.body = req.body;
     
    
    let type = ''; 

    if(req.file && req.file.originalname){
        let myUrl='http://localhost:3000';
        switch(req.file.mimetype){
          
            case 'image/png':
                type = '.png';
            case 'image/jpeg':
                if(!type){
                    type = '.jpg';
                }
                case 'image/jpg':
                  if(!type){
                      type = '.jpg';
                  }
                  
                fs.createReadStream(req.file.path)
                .pipe(fs.createWriteStream( __dirname + '/../Vehicle/public/uploads/'+ req.file.filename + type ));

                req.body.file=`${myUrl}/uploads/`+ req.file.filename + type;
                console.log(req.body.file);
                console.log(__dirname);
                console.log(req.file)
                
                var sql ="INSERT INTO `lessee` (`mNo`, `mName`, `mAccount`, `mPwd`, `mPhone`, `mPhoto`, `mEmail`, `mAddress`, `mBirthday`, `mId`, `mGender`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql,[req.body.Name,req.body.Account,req.body.Password,req.body.Phone,req.body.file,req.body.Email,req.body.Address,req.body.Birthday,req.body.ID,req.body.Gender],(err,results,rowCount) => {
 if(err){console.log(err)}
                    if(results) {
                    data.message="註冊成功";
                    data.success=true;
                    res.json({data})
                        return
                    }else{
                 
                    data.message="註冊失敗";
                    data.success=false;
                    res.json({data})
                        return
                    }
                })
        }}})
    
app.post('/registereduseraccountcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM lessee WHERE mAccount = (?)`;
    connection.query(sql,[req.body.account],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});    

app.post('/registereduserphonecheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM lessee WHERE mphone = (?)`;
    connection.query(sql,[req.body.phone],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});    

app.post('/registereduseremailcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM lessee WHERE mEmail = (?)`;
    connection.query(sql,[req.body.email],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});                          
app.post('/registereduseridcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM lessee WHERE mId = (?)`;
    connection.query(sql,[req.body.ID],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});                       

app.post('/driverregistered',upload.single('File'),(req,res,next)=>{
  
    const data={
        success:false,
        message:""}
        data.body = req.body;
     
    
    let type = '';  

    if(req.file && req.file.originalname){
        let myUrl='http://localhost:3000';
        switch(req.file.mimetype){
          
            case 'image/png':
                type = '.png';
            case 'image/jpeg':
                if(!type){
                    type = '.jpg';
                }
                
                fs.createReadStream(req.file.path)
                .pipe(fs.createWriteStream( __dirname + '/../Vehicle/public/uploads/'+ req.file.filename + type ));
                req.body.file=`${myUrl}/uploads/`+ req.file.filename + type;
                
                var sql="INSERT INTO `driver` (`driverNo`, `driverName`, `driverAccount`, `driverPwd`, `driverPhone`, `driverPhotoName`, `driverEmail`, `driverAddress`, `driverBirthday`, `driverId`, `driverGender`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql,[req.body.Name,req.body.Account,req.body.Password,req.body.Phone,req.body.File,req.body.Email,req.body.Address,req.body.Birthday,req.body.ID,req.body.Gender],(err,results,rowCount) => {
                    
                    
                    if(results) {
                    data.message="註冊成功";
                    data.success=true;
                    res.json({data})
                        return
                    }else{
                 
                    data.message="註冊失敗";
                    data.success=false;
                    res.json({data})
                        return
                    }
                })
        }}})
    
app.post('/registereddriveraccountcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM driver WHERE driverAccount = (?)`;
    connection.query(sql,[req.body.account],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});    

app.post('/registereddriveremailcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM driver WHERE driverEmail = (?)`;
    connection.query(sql,[req.body.email],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});                          
app.post('/registereddriveridcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM driver WHERE driverId = (?)`;
    connection.query(sql,[req.body.ID],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
}); 

app.post('/storeregistered',upload.single('File'),(req,res,next)=>{
  
    const data={
        success:false,
        message:""}
        data.body = req.body;
     
    
    let type = '';  

   if (req.file && req.file.originalname) {
    let myUrl = 'http://localhost:3000'
    let fname = uuidv4()
    switch (req.file.mimetype) {
      case 'image/png':
        type = '.png'
      case 'image/jpeg':
        type = '.jpg'
      default:
    }
    console.log(req.file)
    fs.createReadStream(req.file.path).
    pipe(fs.createWriteStream( __dirname + '/../Vehicle/public/uploads/'+ req.file.filename + type ));
    req.body.file=`${myUrl}/uploads/`+ req.file.filename + type;
                console.log(req.body)
                var sql="INSERT INTO `user_shop` (`shopNo`, `shopName`, `shopAccount`, `shopPwd`, `shopPhone`, `shopEmail`, `shopOwner`, `shopAgent`, `shopAddress`, `shopAddressUrl`, `shopInfo`, `shopId`, `shopImg`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql,[req.body.Name,req.body.Account,req.body.Password,req.body.Phone,req.body.Email,req.body.ShopOwner,req.body.ShopAgent,req.body.Address,req.body.ShopAddressUrl,req.body.Info,req.body.ID,req.body.file],(err,results,rowCount) => {
                    if(err){
                        console.log(err)
                    }
                    
                    if(results) {
                    data.message="註冊成功";
                    data.success=true;
                    res.json({data})
                        return
                    }else{
                 
                    data.message="註冊失敗";
                    data.success=false;
                    res.json({data})
                        return
                    }
                })
        }})
    
app.post('/registeredstoreaccountcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM user_shop WHERE shopAccount = (?)`;
    connection.query(sql,[req.body.account],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});    

app.post('/registeredstorephonecheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM user_shop WHERE shopPhone = (?)`;
    connection.query(sql,[req.body.phone],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});                          
app.post('/registeredstoreemailcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM user_shop WHERE shopEmail = (?)`;
    connection.query(sql,[req.body.email],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
});                          
app.post('/registeredstoreidcheck',(req,res)=>{
    
    const data={find:false}
    data.body=req.body;

    const sql=`SELECT * FROM user_shop WHERE shopId = (?)`;
    connection.query(sql,[req.body.ID],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
            data.find=false
            res.json({data})
            return

        }else{
            data.find=true
            res.json({data})
            return
        }
    });
}); 


app.post('/userlogin',(req,res)=>{
    
    const data={success:false,message:"",account:"",password:""}
    data.body=req.body;

    const sql=`SELECT * FROM lessee WHERE mAccount = (?)`;
    connection.query(sql,[req.body.account],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
              data.message="障號密碼錯誤"
            data.success=false
            res.json({data})
            return

        }if(results[0].mPwd===req.body.password){
            
            req.session.views = req.session.views || 0;
            req.session.views++;
            data.message="登入"
            data.success=true
            
            req.session.No=results[0].mNo;
            req.session.Name=results[0].mName;
            req.session.Gender=results[0].mGender;
            req.session.Account=results[0].mAccount;
            req.session.Pwd=results[0].mPwd;
            req.session.Phone=results[0].mPhone;
            req.session.Email=results[0].mEmail;
            req.session.Address=results[0].mAddress;
            req.session.Birthday=results[0].mBirthday;
            req.session.Id=results[0].mId;
            req.session.Img=results[0].mPhoto;
            req.session.IsLogined=true;
            req.session.Loginman='user';

             res.json({data})
            return  
        }else{
            data.message="障號密碼錯誤"
            data.success=false
            res.json({data})
            return
        }
    });
});
app.post('/driverlogin',(req,res)=>{
    const data={success:false,message:""}
    data.body=req.body;

    const sql=`SELECT * FROM driver WHERE driverAccount = (?)`;
    connection.query(sql,[req.body.account,req.body.password],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
              data.message="障號密碼錯誤"
            data.success=false
            res.json({data})
            return

        }if(results[0].driverPwd===req.body.password){
            req.session.views = req.session.views || 0;
            req.session.views++;
            data.message="登入"
            data.success=true
            
            req.session.No=results[0].driverNo;
            req.session.Name=results[0].driverName;
            req.session.Gender=results[0].driverGender;
            req.session.Account=results[0].driverAccount;
            req.session.Pwd=results[0].driverPwd;
            req.session.Phone=results[0].driverPhone;
            req.session.Email=results[0].driverEmail;
            req.session.Address=results[0].driverAddress;
            req.session.Birthday=results[0].driverBirthday;
            req.session.Id=results[0].driverId;
            req.session.Img=results[0].driverPhotoName;
            req.session.IsLogined=true;
            req.session.Loginman='driver';
            
            res.json({data})
     

            return  
        }else{
            data.message="障號密碼錯誤"
            data.success=false
            res.json({data})
            return
        }
    });
});

app.post('/storelogin',(req,res)=>{
    const data={success:false,message:"",account:"",password:""}
    data.body=req.body;
    const sql=`SELECT * FROM user_shop WHERE shopAccount = (?)`;
    connection.query(sql,[req.body.account,req.body.password],(err,results,rowCount) => {
        if(err) {
           return err;
        }
        
        if(results[0]===undefined){
              data.message="障號密碼錯誤"
            data.success=false
            res.json({data})
            return

        }if(results[0].shopPwd===req.body.password){
            req.session.views = req.session.views || 0;
            req.session.views++;
            data.message="登入"
            data.success=true
            
            
            req.session.No=results[0].shopNo;
            req.session.Name=results[0].shopName;
            req.session.Account=results[0].shopAccount;
            req.session.Pwd=results[0].shopPwd;
            req.session.Phone=results[0].shopPhone;
            req.session.Email=results[0].shopEmail;
            req.session.Owner=results[0].shopOwner;
            req.session.Agent=results[0].shopAgent;
            req.session.Address=results[0].shopAddress;
            req.session.AddressUrl=results[0].shopAddressUrl;
            req.session.Info=results[0].shopInfo;
            req.session.Id=results[0].shopId;
            req.session.Img=results[0].PhotoName;
            req.session.IsLogined=true;
            req.session.Loginman='store';
            res.json({data})
            return  
        }else{
            data.message="障號密碼錯誤"
            data.success=false
            res.json({data})
            return
        }
    });
});

app.get(('/islogin'), (req, res)=>{
    
    res.json({
        Account: req.session.Account,
        No:req.session.No,
        Loginman: req.session.Loginman,
        IsLogined:req.session.IsLogined,
        Name:req.session.Name,
        Gender:req.session.Gender,
        Pwd:req.session.Pwd,
        Phone:req.session.Phone,
        Email:req.session.Email,
        Address:req.session.Address,
        Birthday:req.session.Birthday,
        Id:req.session.Id,
        Img:req.session.Img,
        Owner:req.session.Owner,
        Agent:req.session.Agent,
        AddressUrl:req.session.AddressUrl,
        Info:req.session.Info,  
    });
});

app.get(('/logout'),(req,res)=>{
    
    req.session.destroy();
    res.json({
        loginUser: '',
        isLogined: '',
        user_id:'',
        IsLogined:'',
    })
    
});
app.put(('/useredit'),upload.single('Img'),(req,res,next)=>{
    const data={success:false,message:"",account:"",password:""}
    data.body=req.body;
console.log(req.body)
const sql ="UPDATE `lessee` SET `mName` = ?, `mAccount` = ?, `mPwd` = ?, `mPhone` = ?, `mPhoto` = ?, `mEmail` = ?, `mAddress` = ?, `mBirthday` = ?, `mId` = ?, `mGender` = ? WHERE `lessee`.`mNo` = ?"
connection.query(sql,[req.body.Name,req.body.Account,req.body.Pwd,req.body.Phone,req.body.Img,req.body.Email,req.body.Address,req.body.Birthday,req.body.Id,req.body.Gender,req.body.No],(err,results,rowCount) => {
    if(err){
                        console.log(err)
                    }
                    
                    if(results) {
                    data.message="修改成功";
                    data.success=true;
                    
                    res.json({data})
                        return
                    }else{
                 
                    data.message="修改失敗";
                    data.success=false;
                    res.json({data})
                        return
                    }
})
})

app.put(('/driveredit'),upload.single('Img'),(req,res,next)=>{
    const data={success:false,message:"",account:"",password:""}
    data.body=req.body;
console.log(req.body)
const sql ="UPDATE `driver` SET `driverName` = ?, `driverGender` = ?, `driverAccount` = ?, `driverPwd` = ?, `driverPhone` = ?, `driverEmail` = ?, `driverAddress` = ?, `driverBirthday` = ?, `driverId` = ?, `driverPhotoName` = ? WHERE `driver`.`driverNo` = ?;"
connection.query(sql,[req.body.Name,req.body.Gender,req.body.Account,req.body.Pwd,req.body.Phone,req.body.Email,req.body.Address,req.body.Birthday,req.body.Id,req.body.Img,req.body.No],(err,results,rowCount) => {
    if(err){
                        console.log(err)
                    }
                    
                    if(results) {
                    data.message="修改成功";
                    data.success=true;
                    res.json({data})
                        return
                    }else{
                 
                    data.message="修改失敗";
                    data.success=false;
                    res.json({data})
                        return
                    }
})
})
app.put(('/storeedit'),upload.single('Img'),(req,res,next)=>{
    const data={success:false,message:"",account:"",password:""}
    data.body=req.body;
console.log(req.body)
const sql ="UPDATE `user_shop` SET `shopName` = ?, `shopAccount` = ?, `shopPwd` = ?, `shopPhone` = ?, `shopEmail` = ?, `shopOwner` = ?, `shopAgent` = ?, `shopAddress` = ?, `shopAddressUrl` = ?, `shopInfo` = ?, `shopId` = ?, `shopImg` = ? WHERE `user_shop`.`shopNo` = ?;"
connection.query(sql,[req.body.Name,req.body.Account,req.body.Pwd,req.body.Phone,req.body.Email,req.body.Owner,req.body.Agent,req.body.Address,req.body.AddressUrl,req.body.Info,req.body.Id,req.body.Img,req.body.No],(err,results,rowCount) => {
    if(err){
                        console.log(err)
                    }
                    
                    if(results) {
                    data.message="修改成功";
                    data.success=true;
                    res.json({data})
                        return
                    }else{
                 
                    data.message="修改失敗";
                    data.success=false;
                    res.json({data})
                        return
                    }
})
})







//加入收藏
app.get('/insertItem', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { mNo, pNo } = req.query
  console.log(pNo)
  const INSERT_MEMBERITEM_QUERY = `INSERT INTO lessee_item (mNo,pNo) VALUES (${mNo},${pNo})`
  connection.query(INSERT_MEMBERITEM_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.send('successfully added product')
    }
  })
})
//移除收藏
app.get('/deleteItem', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { mNo, pNo } = req.query
  console.log(pNo)
  const INSERT_DELETE_MEMBERITEM_QUERY = `DELETE FROM lessee_item WHERE mNo=${mNo} AND pNo=${pNo}`
  connection.query(INSERT_DELETE_MEMBERITEM_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.send('successfully added product')
    }
  })
})

// 收藏清單
app.get('/memberCollection', (req, res) => {
  const { mNo } = req.query
  console.log(mNo)
  const SELECT_ONE_PRODUCTS_QUERY = `SELECT * FROM lessee_item WHERE mNo = ${mNo}`
  connection.query(SELECT_ONE_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
// 訂單清單(會員)
app.get('/memberOrdering', (req, res) => {
  const { mNo } = req.query
  console.log(mNo)
  const SELECT_M_ORDER_QUERY1 = `SELECT * FROM order2 WHERE mNo = ${mNo} AND orderFinish=1`
  connection.query(SELECT_M_ORDER_QUERY1, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
app.get('/memberOrdered', (req, res) => {
  const { mNo } = req.query
  console.log(mNo)
  const SELECT_M_ORDER_QUERY2 = `SELECT * FROM order2 WHERE mNo = ${mNo} AND orderFinish=0`
  connection.query(SELECT_M_ORDER_QUERY2, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})

app.get('/memberCollectionList', (req, res) => {
  const { pNo } = req.query
  console.log(req.query)
  const SELECT_ONE_PRODUCTS_QUERY = `SELECT * FROM commodity WHERE pNo = ${pNo}`
  connection.query(SELECT_ONE_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
//收藏判定用
app.get('/mCollectPNo', (req, res) => {
  const { mNo } = req.query
  const SELECT_M_COLLECT_QUERY = `SELECT * FROM lessee_item WHERE mNo = ${mNo}`
  connection.query(SELECT_M_COLLECT_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
//加入收藏(商品頁面)
app.get('/insertCollect', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { pNo } = req.query
  console.log(pNo)
  const UPDATE_MEMBERITEM_QUERY = `UPDATE lessee_item SET state = 'fas' WHERE pNo = ${pNo}`
  connection.query(UPDATE_MEMBERITEM_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.send('successfully added product')
    }
  })
})
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM commodity'
// 商品清單
app.get('/product', (req, res) => {
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
//熱門
app.get('/hotproduct', (req, res) => {
  const SELECT_HOT_PRODUCTS_QUERY =
    'SELECT * FROM commodity ORDER BY pCollect DESC'
  connection.query(SELECT_HOT_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
// 商品頁面(單一商品)
app.get('/productMain', (req, res) => {
  const { pNo } = req.query
  console.log(pNo)
  const SELECT_ONE_PRODUCTS_QUERY = `SELECT * FROM commodity WHERE pNo = ${pNo}`
  connection.query(SELECT_ONE_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
//搜尋清單
//   SELECT SUM(Sales) FROM Store_Information
// WHERE Store_Name IN
// (SELECT Store_Name FROM Geography
// WHERE Region_Name = 'West');
//SELECT * FROM Store_Information WHERE (* LIKE 'inputkey') AND (篩選條件1 LIKE '%selectkey1%') ifAND1 (篩選條件2 LIKE '%selectkey2%') ifAND2 (篩選條件3 LIKE '%selectkey3%');

app.get('/searchList', (req, res) => {
  let { inputkey, searchkey1, searchkey2, searchkey3, searchkey4 } = req.query
  console.log('inputkey:' + inputkey)
  let input = !(inputkey == 0)
    ? `((pType LIKE '%${inputkey}%') OR (pNo LIKE '%${inputkey}%') OR (pBrand LIKE '%${inputkey}%') OR (pModel LIKE '%${inputkey}%') OR (pSit LIKE '%${inputkey}%') OR (pCc LIKE '%${inputkey}%'))`
    : ''
  console.log(input)
  let placeKey = !(searchkey1 == 0) ? searchkey1 : ''
  console.log('placeKey:' + placeKey)
  let key1 = !(searchkey2 == 0) ? `(pBrand LIKE '%${searchkey2}%')` : ''
  console.log('key1:' + key1)
  let key2 = !(searchkey3 == 0) ? `(pRent LIKE '%${searchkey3}%')` : ''
  console.log('key2:' + key2)
  let key3 = !(searchkey4 == 0) ? `(pAge LIKE '%${searchkey4}%')` : ''
  console.log('key3:' + key3)
  // let ifAND0 = input && key1 && key2 && key3 ? 'AND' : ''
  // console.log('ifAND0:' + ifAND0)
  // let ifAND1 = key1 && key2 && key3 ? 'AND' : ''
  // console.log('ifAND1:' + ifAND1)
  // let ifAND2 = key2 && key3 ? 'AND' : ''
  // console.log('ifAND2:' + ifAND2)

  const childQuery = placeKey
    ? `AND shopName IN (SELECT shopName FROM user_shop WHERE shopAddress LIKE '%${placeKey}%')`
    : ''
  // console.log(childQuery)
  //const  SELECT_SEARCHPLACE_QUERY= `SELECT * FROM commodity WHERE shopName IN (SELECT shopName FROM user_shop WHERE shopAddress LIKE '%${placeKey}%')`

  //const SELECT_SEARCH_PRODUCTS_QUERY = `SELECT * FROM commodity WHERE (* LIKE %${inputkey}%) ${ifAND0} (pBrand LIKE %${key1}%) ${ifAND1} (pRent LIKE %${key2}%) ${ifAND2} (pAge LIKE %${key3}%)`
  //`SELECT * FROM commodity WHERE ${input} ${ifAND0} ${key1} ${ifAND1} ${key2} ${ifAND2} ${key3}`
  console.log(
    ''.concat(
      `${Boolean(inputkey)}`,
      `${Boolean(key1)}`,
      `${Boolean(key2)}`,
      `${Boolean(key3)}`
    )
  )
  switch (
    ''.concat(
      `${Boolean(inputkey)}`,
      `${Boolean(key1)}`,
      `${Boolean(key2)}`,
      `${Boolean(key3)}`
    )
  ) {
    case 'truetruetruetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key1} AND ${key2} AND ${key3}`
      break
    case 'truetruetruefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key1} AND ${key2}`
      break
    case 'truetruefalsetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key1} AND ${key3}`
      break
    case 'truefalsetruetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key2} AND ${key3}`
      break
    case 'falsetruetruetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key1} AND ${key2} AND ${key3}`
      break
    case 'truetruefalsefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key1}`
      break
    case 'truefalsetruefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key2}`
      break
    case 'truefalsefalsetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input} AND ${key3}`
      break
    case 'falsetruetruefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key1} AND ${key2}`
      break
    case 'falsetruefalsetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key1} AND ${key3}`
      break
    case 'falsefalsetruetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key2} AND ${key3}`
      break
    case 'truefalsefalsefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${input}`
      break
    case 'falsetruefalsefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key1}`
      break
    case 'falsefalsetruefalse':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key2}`
      break
    case 'falsefalsefalsetrue':
      var SEARCH_QUERY = `SELECT * FROM commodity WHERE ${key3}`
      break
  }
  console.log('SEARCH_QUERY:' + SEARCH_QUERY)
  const SELECT_SEARCH_QUERY = !(
    inputkey == 0 &&
    searchkey2 == 0 &&
    searchkey3 == 0 &&
    searchkey4 == 0
  )
    ? SEARCH_QUERY
    : `SELECT * FROM commodity WHERE shopName IN (SELECT shopName FROM user_shop WHERE shopAddress LIKE '%${placeKey}%')`
  console.log(SELECT_SEARCH_QUERY)
  connection.query(SELECT_SEARCH_QUERY + childQuery, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
// app.get('./products', (req, res) => {})
app.get('/searchList2', (req, res) => {
  let { inputkey, mNo } = req.query

  const SELECT_SEARCH2_QUERY = `SELECT * FROM commodity WHERE ((pType LIKE '%${inputkey}%') OR (pNo LIKE '%${inputkey}%') OR (shopName LIKE '%${inputkey}%') OR (pBrand LIKE '%${inputkey}%') OR (pModel LIKE '%${inputkey}%') OR (pSit LIKE '%${inputkey}%') OR (pCc LIKE '%${inputkey}%')) AND pNo IN (SELECT pNo FROM lessee_item WHERE mNo = '${mNo}')`
  console.log(SELECT_SEARCH2_QUERY)
  connection.query(SELECT_SEARCH2_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
//取得車商編號
app.get('/shopNo', (req, res) => {
  let { shopName } = req.query

  const SELECT_SHOPNO_QUERY = `SELECT * FROM user_shop WHERE shopName = '${shopName}'`
  console.log(SELECT_SHOPNO_QUERY)
  connection.query(SELECT_SHOPNO_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})
//新增評價
app.get('/insertRate', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { shopNo, shopName, mNo, orderNo, rate, rateText } = req.query
  // console.log(pNo)
  const INSERT_MEMBERITEM_QUERY = `INSERT INTO shopratting (shopNo, shopName, mNo, orderNo, rate, rateText) VALUES ('${shopNo}','${shopName}','${mNo}','${orderNo}','${rate}','${rateText}')`
  connection.query(INSERT_MEMBERITEM_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.send('successfully added product')
    }
  })
})
//取得已評價清單
app.get('/rated', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { mNo } = req.query
  // console.log(pNo)
  const SELECT_RATED_QUERY = `SELECT * FROM shopratting WHERE mNo = '${mNo}'`
  console.log(SELECT_RATED_QUERY)
  connection.query(SELECT_RATED_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})

app.get('/OrderListing', (req, res) => {
  console.log(req.query.shopName)
  const SELECT_ALL_commodity_QUERY =
    `SELECT * FROM order2 WHERE orderFinish = 1 AND shopName='${req.query.shopName}'`
  connection.query(SELECT_ALL_commodity_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      // console.log(results)
      return res.json({
        data: results,
      })
    }
  })
})
app.get('/OrderListed', (req, res) => {
  const SELECT_ALL_commodity_QUERY =
    `SELECT * FROM order2 WHERE orderFinish = 0 AND shopName='${req.query.shopName}'`
  connection.query(SELECT_ALL_commodity_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      // console.log(results)
      return res.json({
        data: results,
      })
    }
  })
})
app.get('/OrderFinish', (req, res) => {
  const { orderNo } = req.query
  console.log(orderNo)
  const UPDATA_ORDERSTATE = `UPDATE order2 SET orderFinish = 0 WHERE orderNo = ${orderNo}`
  connection.query(UPDATA_ORDERSTATE, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      // console.log(results)
      return res.json({
        data: results,
      })
    }
  })
})
//車商商品頁面
const SELECT_ALL_commodity_QUERY = 'SELECT * FROM commodity'
app.get('/commodity', (req, res) => {
  connection.query(SELECT_ALL_commodity_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      // console.log(results)
      return res.json({
        data: results,
      })
    }
  })
})

//取得已評價清單
app.get('/israted', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { orderNo } = req.query
  console.log(orderNo)
  const SELECT_RATED_QUERY = `SELECT * FROM shopratting WHERE orderNo = ${orderNo}`
  console.log(SELECT_RATED_QUERY)
  connection.query(SELECT_RATED_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})


// Danny



const moment = require('moment-timezone')

const SELECT_ALL_ORDER_QUERY1 = 'SELECT * FROM order2'
const SELECT_ALL_ORDER_QUERY2 =
  "SELECT pNo, pBrand, pModel, pModel, shopName, pRent FROM commodity WHERE pNo='565'"

const SELECT_ALL_ORDER_QUERY9 =
  'SELECT pNo, pBrand, pModel, pModel, shopName, pRent FROM commodity WHERE pNo='

const SELECT_ALL_ORDER_QUERY3 = 'SELECT shopAddress FROM user_shop'
const SELECT_ALL_ORDER_QUERY4 = "SELECT mNo, mName FROM lessee WHERE mNo='1'"
// Danny
app.get('/order', (req, res) => {
  connection.query(SELECT_ALL_ORDER_QUERY1, (err, results) => {
    for (let s in results) {
      results[s].orderDate2 = moment(results[s].orderDate).format('YYYY-MM-DD') //轉換時間格式
      results[s].startDate2 = moment(results[s].startDate).format('YYYY-MM-DD') //轉換時間格式
      results[s].endDate2 = moment(results[s].endDate).format('YYYY-MM-DD') //轉換時間格式
    }
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        order: results,
      })
    }
  })
})



app.get('/member', (req, res) => {
  connection.query(SELECT_ALL_ORDER_QUERY4, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        member: results,
      })
    }
  })
})



app.get('/commoditydata', (req, res) => {
  const { pNo } = req.query
  const queryString = SELECT_ALL_ORDER_QUERY9 + "'" + pNo + "'"

  connection.query(queryString, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})

app.get('/shopAddress', (req, res) => {
  connection.query(SELECT_ALL_ORDER_QUERY3, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      let output = []
      results.forEach(function(val) {
        output.push(val['shopAddress'])
      })
      return res.json(output)
    }
  })
})


app.get('/orderAdd', (req, res) => {
  res.render('orderAdd')
})

app.post('/orderAdd', (req, res) => {
  const body = req.body
  let sql =
    'INSERT INTO order2 (`mNo`, `mName`, `orderDate`,`total`, `pNo`, `startDate`, `endDate`,`pRent`, `shopName`, `rentcarStatus`, `rentAddress`,`deliveryFee`, `startPlace`, `endPlace`, `pBrand`,`pModel`, `orderstate`, `orderFinish`) VALUES(?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)'
  // [body.sales_id, body.name, body.birthday],
  connection.query(
    sql,
    [
      body.mNo,
      body.mName,
      body.orderDate,
      body.total,
      body.pNo,
      body.startDate,
      body.endDate,
      body.pRent,
      body.shopName,
      body.rentcarStatus,
      body.rentAddress,
      body.deliveryFee,
      body.startPlace,
      body.endPlace,
      body.pBrand,
      body.pModel,
      body.orderstate,
      body.orderFinish,
    ],
    (error, results, fields) => {
      if (error) throw error
      if (results.affectedRows === 1) {
        res.send('success')
      } else {
        res.send('error')
      }
      // res.render("orderAdd", data);
    }
  )
})

app.post('/orderUpdate', (req, res) => {
  const body = req.body
  let sql = 'UPDATE order2 SET ? WHERE orderNo = ? '
  // [body.sales_id, body.name, body.birthday],
  connection.query(
    sql,
    [
      {
        orderstate: 1,
        orderFinish: 1,
      },
      req.body.orderNo,
    ],
    (error, results, fields) => {
      if (error) throw error
      if (results.affectedRows === 1) {
        res.send('success')
      } else {
        res.send('error')
      }
    }
  )
})

app.get('/try-moment', (req, res) => {
  // res.send(req.session.cookie.expires);
  const fm = 'YYYY-MM-DD'
  // const exp = req.session.cookie.expires;
  // const mo1 = moment(exp);
  const mo = moment()

  let out = ''

  res.contentType('text/plain')

  // out += mo1.format(fm) + "\n"; //多3分鐘是因為cookie maxAge: 180000 設為3分鐘
  out += mo.format(fm) + '\n'
  res.send(out)
})



app.use(express.json({ limit: '50mb' }))









const SELECT_pNo_commodity_QUERY = 'SELECT * FROM commodity WHERE pNo=?'
const SELECT_shopNo_commodity_QUERY = 'SELECT * FROM user_shop WHERE shopNo=?'
const SELECT_shopNo_rate_QUERY =
  ' SELECT avg(rate) as `avg` FROM shopratting WHERE shopNo= ?'
const SELECT_shopNo_count_QUERY =
  ' SELECT count(pNo) as `count` FROM commodity WHERE shopName= ?'



//車商商品頁面
const SELECT_ALL_commodity1_QUERY = 'SELECT * FROM commodity'
app.get('/commodity', (req, res) => {
  connection.query(SELECT_ALL_commodity1_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      // console.log(results)
      return res.json({
        data: results,
      })
    }
  })
})

//取得已評價清單
app.get('/rated', (req, res) => {
  // console.log('req:' + req.query) //req.query==={name:xxx, price:xxx}
  const { orderNo } = req.query
  // console.log(pNo)
  const SELECT_RATED_QUERY = `SELECT * FROM shopratting WHERE orderNo = '${orderNo}'`
  console.log(SELECT_RATED_QUERY)
  connection.query(SELECT_RATED_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
      })
    }
  })
})


app.get('/commodity1', (req, res) => {
  console.log(req.query.shopName)
  console.log("111")
  const SELECT_ALL_commodity_QUERY = `SELECT * FROM commodity WHERE shopName = '${req.query.shopName}'`
  connection.query(SELECT_ALL_commodity_QUERY, (err, results) => {
    if (err) {
      return res.send(err)
    } else {
      // console.log(results)

      return res.json({
        data: results,
      })
    }
  })
})

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../Vehicle/public/uploads')
  },
  filename: function(req, file, cb) {
    //   cb(null, file.fieldname + '-' + Date.now())
    cb(null, uuidv4() + '.' + file.originalname.split('.')[1])
  },
})
const upload2 = multer({ storage: storage })

app.post('/commodity/shopAdd', upload2.array('pImg'), (req, res, next) => {
  console.log('HERE')
  var a = {
    message: '',
    success: false,
  }
  var pImg_filename = req.files.map(item => item.filename).join()
  const INSERT_commodity_QUERY = `INSERT INTO commodity 
  (pBrand, 
    pModel,
    pSit,
    pType,
    pOdo,
    pCc,
    pAgeYear,
    pAgeMon,
    pRent,
    rentState,
    rentAssign,
    shopAddressSelect,
    pState,
    pIntro,
    shopName,
    pImg) 
  VALUES
  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  connection.query(
    INSERT_commodity_QUERY,
    [
      req.body.pBrand,
      req.body.pModel,
      req.body.pSit,
      req.body.pType,
      req.body.pOdo,
      req.body.pCc,
      req.body.pAgeYear,
      req.body.pAgeMon,
      req.body.pRent,
      req.body.rentState,
      req.body.rentAssign,
      req.body.shopAddressSelect,
      req.body.pState,
      req.body.pIntro,
      req.body.shopName,
      pImg_filename,
    ],
    (err, results) => {
      if (err) {
        a.message = '上傳失敗'
        a.success = false
        res.json(a)
      } else {
        a.message = '上傳成功'
        a.success = true
        res.json(a)
        return
      }
    }
  )
})
app.post('/commodity/shopEdit', upload2.array('pImg'), (req, res, next) => {
  console.log('HERE')
  var a = {
    message: '',
    success: false,
  }
  var pImg_filename = req.files.map(item => item.filename).join()
  if (pImg_filename === '') {
    const INSERT_commodity_QUERY = `UPDATE commodity SET 
  pBrand=?,
  pModel=?,
  pSit=?,
  pType=?,
  pOdo=?,
  pCc=?,
  pAgeYear=?,
  pAgeMon=?,
  pRent=?,
  rentState=?,
  rentAssign=?,
  shopAddressSelect=?,
  pState=?,
  pIntro=?

  WHERE pNo =?`
    connection.query(
      INSERT_commodity_QUERY,
      [
        req.body.pBrand,
        req.body.pModel,
        req.body.pSit,
        req.body.pType,
        req.body.pOdo,
        req.body.pCc,
        req.body.pAgeYear,
        req.body.pAgeMon,
        req.body.pRent,
        req.body.rentState,
        req.body.rentAssign,
        req.body.shopAddressSelect,
        req.body.pState,
        req.body.pIntro,
        req.body.pNo,
      ],

      (err, results) => {
        if (err) {
          a.message = '修改失敗'
          a.success = false
          res.json(a)
        } else {
          a.message = '修改成功'
          a.success = true
          res.json(a)
          return
        }
      }
    )
  } else {
    const INSERT_commodity_QUERY = `UPDATE commodity SET 
  pBrand=?,
  pModel=?,
  pSit=?,
  pType=?,
  pOdo=?,
  pCc=?,
  pAgeYear=?,
  pAgeMon=?,
  pRent=?,
  rentState=?,
  rentAssign=?,
  shopAddressSelect=?,
  pState=?,
  pIntro=?,
  pImg=?

  WHERE pNo =?`
    connection.query(
      INSERT_commodity_QUERY,
      [
        req.body.pBrand,
        req.body.pModel,
        req.body.pSit,
        req.body.pType,
        req.body.pOdo,
        req.body.pCc,
        req.body.pAgeYear,
        req.body.pAgeMon,
        req.body.pRent,
        req.body.rentState,
        req.body.rentAssign,
        req.body.shopAddressSelect,
        req.body.pState,
        req.body.pIntro,
        pImg_filename,
        req.body.pNo,
      ],
      (err, results) => {
        if (err) {
          a.message = '修改失敗'
          a.success = false
          res.json(a)
        } else {
          a.message = '修改成功'
          a.success = true
          res.json(a)
          return
        }
      }
    )
  }
})

app.post('/commodity/shopDelete', function(req, res, next) {
  var data = {
    message: '',
    success: false,
  }
  connection.query(
    'DELETE from commodity where pNo = ' + req.body.pNo + '',
    (err, results) => {
      if (err) {
        data.message = '刪除失敗'
        data.success = false
        res.json(data)
      } else {
        data.message = '刪除成功'
        data.success = true
        res.json(data)
        return
      }
    }
  )
})


app.post('/commodity/count', (req, res) => {
  console.log(req.body.key)
  connection.query(
    SELECT_shopNo_count_QUERY,
    [req.body.shopName],
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        // console.log(results)
        return res.json(results[0])
      }
    }
  )
})

app.post('/commodity/pNo', (req, res) => {
  console.log(req.body.key)
  connection.query(
    SELECT_pNo_commodity_QUERY,
    [req.body.key],
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        // console.log(results)
        return res.json(results[0])
      }
    }
  )
})
app.post('/user_shop/card', (req, res) => {
  console.log(req.body.shopNo)
  connection.query(
    SELECT_shopNo_commodity_QUERY,
    [req.body.shopNo],
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        // console.log(results)
        return res.json(results[0])
      }
    }
  )
})
app.post('/user_shop/cardrate', (req, res) => {
  console.log(req.body.shopNo)
  connection.query(
    SELECT_shopNo_rate_QUERY,
    [req.body.shopNo],
    (err, results) => {
      if (err) {
        return res.send(err)
      } else {
        // console.log(results)
        return res.json(results[0])
      }
    }
  )
})
app.post('/user_shop/cardDataEdit', (req, res, next) => {
  var data = {
    message: '',
    success: false,
  }

  const update_user_shop_QUERY = `UPDATE user_shop SET 
  shopName=?,
  shopPhone=?,
  shopEmail=?
  

  WHERE shopNo =?`

  connection.query(
    update_user_shop_QUERY,
    [
      req.body.shopName,
      req.body.shopPhone,
      req.body.shopEmail,
      req.body.shopNo,
    ],
    (err, results) => {
      if (err) {
        data.message = '修改失敗'
        data.success = false
        data.error = err.toString()
        res.json(data)
      } else {
        data.message = '修改成功'
        data.success = true
        res.json(data)
        return
      }
    }
  )
})
app.post('/user_shop/cardInfoEdit', (req, res, next) => {
  var data = {
    message: '',
    success: false,
  }

  const update_user_shop_QUERY = `UPDATE user_shop SET 
  shopInfo=?
  
  

  WHERE shopNo =?`

  connection.query(
    update_user_shop_QUERY,
    [req.body.shopInfo, req.body.shopNo],
    (err, results) => {
      if (err) {
        data.message = '修改失敗'
        data.success = false
        data.error = err.toString()
        res.json(data)
      } else {
        data.message = '修改成功'
        data.success = true
        res.json(data)
        return
      }
    }
  )
})

app.post('/shoplistcardpic', upload.single('File'), (req, res, next) => {
  
  console.log(req.file)
  const data = {
    success: false,
    message: '',
  }
  data.body = req.body

  let type = ''

  if (req.file && req.file.originalname) {
    let myUrl='http://localhost:3000';
    let fname = uuidv4()
    switch (req.file.mimetype) {
      case 'image/png':
        type = '.png'
      case 'image/jpeg':
        type = '.jpg'
      default:
    }
    fs.createReadStream(req.file.path).
    pipe(fs.createWriteStream( __dirname + '/../Vehicle/public/uploads/'+ req.file.filename + type ));
    req.body.file=`${myUrl}/uploads/`+ req.file.filename + type;
    console.log(req.body.file)
    var sql = `UPDATE user_shop SET 
        shopImg=? WHERE shopNo =?`
    connection.query(
      sql,
      [req.body.file, req.body.File],
      (err, results, rowCount) => {
        if (results) {
          data.message = '更換照片成功'
          data.success = true
          res.json({ data })
          return
        } else {
          data.message = '更換照片失敗'
          data.success = false
          res.json({ data })
          return
        }
      }
    )
  }
})

app.post('/shoplistbgpic', upload.single('File'), (req, res, next) => {
  console.log(req.file)
  const data = {
    success: false,
    message: '',
  }
  data.body = req.body

  let type = ''

  if (req.file && req.file.originalname) {
    let myUrl='http://localhost:3000';
    let fname = uuidv4()
    switch (req.file.mimetype) {
      case 'image/png':
        type = '.png'
      case 'image/jpeg':
        type = '.jpg'
      default:
    }
    fs.createReadStream(req.file.path).
    pipe(fs.createWriteStream( __dirname + '/../Vehicle/public/uploads/'+ req.file.filename + type ));
    req.body.file=`${myUrl}/uploads/`+ req.file.filename + type;
    console.log(req.body.file)
    var sql = `UPDATE user_shop SET 
        shopBgImg=? WHERE shopNo =?`
    connection.query(
      sql,
      [req.body.file, req.body.File],
      (err, results, rowCount) => {
        if (results) {
          data.message = '更換照片成功'
          data.success = true
          res.json({ data })
          return
        } else {
          data.message = '更換照片失敗'
          data.success = false
          res.json({ data })
          return
        }
      }
    )
  }
})

// 此段放在所有路由設定的後面
app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - 找不到網頁')
})


app.listen(4000,()=>{
  console.log(`Products server listening on port 4000`)
});