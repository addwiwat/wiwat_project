const fs = require('fs')

const data = fs.readFile('myfile/input.txt','utf-8',(err,data)=>{
    if(err) return console.log("เกิดข้อผิดพลาด",err)
    const outputText = `Hello Node.js \n ${data}\n ไฟล์นี้ถูกเขียนเมื่อ ${new Date()}`
    fs.writeFile("myfile/output.txt",outputText,err=>{
        if(err) return console.log("เกิดข้อผิดพลาด",err)
        console.log("เขียนไฟล์เรียบร้อย")
    })
})
console.log('จบการทำงาน')

// const outputtext = `Hello Node.js\n${data}\ไฟล์ถูกเขียนเมื่อ ${new Date()}`
// fs.writeFileSync("myfile/output.txt",outputtext)
// console.log('เขียนไฟล์เรียบร้อยแล้ว')