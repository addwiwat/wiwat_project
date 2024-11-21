const express = require('express')
const router = require('./routes/myRouter')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const app = express()

app.get('/favicon.ico', (req, res) => res.status(204));
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({secret:"mysession",resave:false,saveUninitialized:false}))
app.use(router)
app.use(express.static(path.join(__dirname,'public')))

app.listen(8080,()=>{
    console.log("server ทำงาน port 8080 Hey")
})