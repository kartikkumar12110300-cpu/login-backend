// bcrypt dotenv jsonwebtoken express nodemon cors

const express= require('express')
const app = express()
const routes = require('./Routes/UserRoutes');
const cors = require('cors')
const PORT = process.env.PORT || 8888

app.use(cors({
    origin:'*'
}))

app.use(express.json())  //body-parser
// app.use(express.urlencoded({extended:true}));
app.use('/pages',routes)

app.listen(PORT,()=>{
    console.log(`Server is running fine at ${PORT}`)
})
