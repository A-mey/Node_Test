const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const e = require('express');
const app=new express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
const urlencoderParser=bodyParser.urlencoded({extended:false});

const server=app.listen(8080, function(){
    const host=server.address().address;
    const port=server.address().port;
    console.log(`Server ${host} running on ${port}`);
});

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "project"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.get('/', function(req,res) {
    var sql = "Select * from Category";
    con.query (sql, function(err, rows) {
        if (err) throw err;
        else {
            res.render('home',{data:rows});
        }      
    });
})

app.post('/addCategory', urlencoderParser, function(req,res) {
    const CategoryName = req.body.CategoryName;
    var sql = "Insert into Category (CategoryName) values('"+CategoryName+"')";
    con.query (sql, function (err, result) {
        if (err) throw err;
        console.log("Record is added successfully");
    });
    res.redirect('/');
})

app.get('/deleteCategory/(:CategoryId)', function(req, res) {
    var sql = "Delete from Category where CategoryId = ?";
    con.query (sql, [req.params.CategoryId], function(err, result) {
        if (err) throw err;
        console.log("record deleted successfully");
    });
    res.redirect('/');
})

app.get('/editCategory/(:CategoryId)', function(req, res) {
    var sql = "Select * from Category where CategoryId = ?";
    con.query (sql, [req.params.CategoryId], function(err, rows) {
        if (err) throw err;
        res.render('editCategory',{
            CategoryId: rows[0].CategoryId,
            CategoryName: rows[0].CategoryName
        });
    })
})

app.post('/editCategory/:CategoryId', urlencoderParser, function(req, res) {
    const CategoryName = req.body.CategoryName;
    const CategoryId = req.params.CategoryId;
    var sql = "Update Category set CategoryName= ? where CategoryId= ?";
    con.query (sql, [CategoryName, CategoryId], function(err, result) {
        if (err) throw err;
        console.log("Updated successfully");
    });
    res.redirect('/');
})

app.get('/products/(:CategoryId)', function(req, res) {
    var sql = "Select ProductId, ProductName from Product where CategoryId = ?";
    con.query (sql, [req.params.CategoryId], function(err, rows) {
        if (err) throw err
        res.render('products', {data:rows});
    });
})

app.post('/addProduct/:CategoryId', urlencoderParser, function(req,res) {
    const ProductName = req.body.ProductName;
    const CategoryId = req.params.CategoryId;
    var sql = "Insert into Product (ProductName, CategoryId) values('"+ProductName+"', "+CategoryId+")";
    con.query (sql, function (err, result) {
        if (err) throw err;
        console.log("Record is added successfully");
    });
    res.redirect('/products/(:CategoryId)');
})

app.get('/deleteProduct/(:ProductId)', function(req, res) {
    var sql = "Delete from Product where ProductId = ?";
    con.query (sql, [req.params.ProductId], function(err, result) {
        if (err) throw err;
        console.log("record deleted successfully");
    });
    res.redirect('/');
})

app.get('/editProduct/(:ProductId)', function(req, res) {
    const ProductId = req.params.ProductId;
    var sql = "Select * from Product where ProductId =  "+ProductId+" ";
    con.query (sql, function(err, rows) {
        if (err) throw err;
        res.render('editProduct',{
            ProductId: rows[0].ProductId,
            ProductName: rows[0].ProductName
        });
    })
})

app.post('/editProduct/:ProductId', urlencoderParser, function(req, res) {
    const ProductName = req.body.ProductName;
    const ProductId = req.params.ProductId;
    var sql = "Update Category set ProductName= ? where ProductId= ?";
    con.query (sql, [ProductName, ProductId], function(err, result) {
        if (err) throw err;
        console.log("Updated successfully");
    });
    res.redirect('/');
})