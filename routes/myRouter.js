const express = require('express');
const router = express.Router()
// เรียกใช้งาน model
const Product = require('../models/product')
const fs = require('fs');
const path = require('path');

//อัพโหลดไฟล์
const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/products')  // ตำแหน่งจัดเก็บไฟล์
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg") //กำหนดชื่อไฟล์
    }

})

//เริ่มต้น upload
const upload = multer({
    storage:storage
})

router.get('/', async (req, res) => {
    try {
        const doc = await Product.find();
        res.render('index', { product: doc });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching products');
    }
});

router.get('/manage', async (req, res) => {
    if(req.session.login){
       try {
            const doc = await Product.find();
            res.render('manage', { product: doc });
        } catch (err) {
            console.log(err);
            res.status(500).send('Error fetching products');
        }
    }else{
        res.render('admin')
    }  
    console.log(req.sessionID)
    console.log(req.session)
});

router.get('/form',(req,res)=>{
    if(req.session.login){
        res.render('form')
    }else{
        res.render('admin')
    }
})

//ลบข้อมูล
router.get('/delete/:id', async (req, res) => {
    try {
        // ค้นหาผลิตภัณฑ์ในฐานข้อมูล
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const imagePath = path.join('./public/images/products', product.image); // สร้างเส้นทางไปยังไฟล์รูปภาพ
        console.log(imagePath)

        
        fs.unlink(imagePath, async (err) => { // ลบไฟล์รูปภาพจากระบบ
            if (err) {
                console.error('Error deleting image:', err);
                return res.status(500).send('Error deleting image, product not deleted');
            }

            // หากการลบไฟล์สำเร็จ ให้ลบผลิตภัณฑ์จากฐานข้อมูล
            await Product.findByIdAndDelete(req.params.id);
            res.redirect('/manage');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
  
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        res.redirect('/manage')
    })


    //clear cookie
    // res.clearCookie('username')
    // res.clearCookie('password')
    // res.clearCookie('login')
    // res.redirect('/manage')
})  

router.get('/:id', async (req, res) => {
    try {
      const productID = req.params.id;
      const product = await Product.findOne({ _id: productID });
      res.render('products', { product });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving product');
    }
  });

router.post('/insert',upload.single("picture"), async (req, res) => {
    console.log(req.file)
    try {
        // สร้าง instance ของ Product ด้วยข้อมูลที่รับมา
        let data = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.file.filename,
            description: req.body.detail
        });

        // เรียกใช้ saveProduct และรอการบันทึกข้อมูล
        await Product.saveProduct(data);

        // บันทึกสำเร็จจะเปลี่ยนเส้นทางไปที่หน้าแรก
        res.redirect('/');
    } catch (err) {
        // แสดง error ใน console หากเกิดข้อผิดพลาด
        console.log(err);
        res.status(500).send('Error saving product');
    }
});

router.post('/edit', async (req, res) => {
    try {
        const edit_id = req.body.edit_id;
        const product = await Product.findOne({ _id: edit_id });
        res.render('edit', { product:product });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving product');
      }

});

router.post('/login', async (req, res) => {
        const username = req.body.username
        const password = req.body.password
        const timeExpire = 20000 // 20 วินาที

        console.log(username)
        console.log(password)

        if(username=== "admin" && password=== "123"){
            //สร้าง session
            req.session.username = username
            req.session.password = password
            req.session.login = true
            req.session.cookie.maxAge=timeExpire
            res.redirect('manage')

            //สร้าง cookie
            // res.cookie('username',username,{maxAge:timeExpire})
            // res.cookie('password',password,{maxAge:timeExpire})
            // res.cookie('login',true,{maxAge:timeExpire})
            // res.redirect('/manage')
        }else{
            res.render('404')
        }
});

router.post('/update', async (req, res) => {
    try {
        const update_id = req.body.update_id; 
        let data = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.detail
        };

        // ตรวจสอบค่าที่ได้
        console.log('ProductID:', update_id);
        console.log('Data :', data);
        
        // อัปเดตข้อมูลในฐานข้อมูล
        const updatedProduct = await Product.findByIdAndUpdate(update_id, data);
    
        res.redirect('/manage'); 
    } catch (err) {
        console.error(err); // แสดงข้อผิดพลาดใน console
        res.status(500).send('Error updating product'); // ส่งสถานะ 500 หากเกิดข้อผิดพลาด
    }
});



module.exports = router

//render ข้อมูลแบบเก่า
// router.get('/',(req,res)=>{
//         const name = "wiwat khatmai"
//         const age = 17
//         const address = "<h2>ที่อยู่ : กรุงเทพมหานคร</h2>"
//         const product =["เสื้อ","กางเกง","พัดลม","แอร์","กระเป๋า","รองเท้า",'ทีวี']
//         const productOB = [
//             {name:"โน๊ตบุ๊ค",price:25000,image:"images/products/product1.png"},
//             {name:"เสื้อ",price:500,image:"images/products/product2.png"},
//             {name:"หูฟัง",price:5000,image:"images/products/product3.png"}
//         ]
//         res.render('index.ejs',{name:name,age:age,address:address,product:product,productOB:productOB})
// })


// const path = require('path');

// router.get("/",(req,res)=>{
//     res.status(200)
//     res.type('text/html')
//     res.sendFile(path.join(__dirname,"../templates/index.html"))
// })

// router.get("/product/:id",(req,res)=>{
//     const productID = req.params.id
//     if(productID ==="1"){
//          res.sendFile(path.join(__dirname,"../templates/product1.html"))
//     }else if(productID ==="2"){
//         res.sendFile(path.join(__dirname,"../templates/product2.html"))
//     }else if(productID ==="3"){
//         res.sendFile(path.join(__dirname,"../templates/product3.html"))
//     }else{
//         res.status(404)
//         res.redirect('/')
//     }
// })

// module.exports = router
