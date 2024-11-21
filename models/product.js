// นำเข้า mongoose
const mongoose = require('mongoose');

// กำหนด URL ของ MongoDB
const dbUrl = 'mongodb://127.0.0.1:27017/productDB';

// ฟังก์ชันเชื่อมต่อกับ MongoDB
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connected to MongoDB'); // ถ้าเชื่อมต่อสำเร็จ
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err); // ถ้ามีข้อผิดพลาด
    });

// ตรวจสอบสถานะการเชื่อมต่อ
mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// ออกแบบ Schema
const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String
});

// สร้างโมเดล
const Product = mongoose.model('Product', productSchema);

// ส่งออกโมเดล
module.exports = Product

//ออกแบบฟังก์ชั่นสำหรับบันทึกข้อมูล
module.exports.saveProduct = async function(data) {
    try {
        await data.save(); // บันทึกข้อมูลโดยใช้ await
        console.log('Product saved successfully');
    } catch (error) {
        console.error('Error saving product:', error);
        throw error; // โยน error กลับไปเพื่อให้ router 
    }
};



