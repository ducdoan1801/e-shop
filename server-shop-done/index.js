const express = require('express')
const userRouter = require('./route/userRoute');
const categoryRouter = require('./route/categoryRoute')
const productRouter = require('./route/productRoute')
const orderRoute = require('./route/orderRoute')
const images = require('./route/images')
const sliderRouter = require('./route/sliderRoute')
const cartRouter = require('./route/cartRoute')
const information = require('./route/informationRoute')
const review = require('./route/reviewRoute')

const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(express.json())
app.use(cors())

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://trongduc2001hd:trongduc2001hd@cluster0.9lc04ln.mongodb.net/test`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()


app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/image', images)
app.use('/api/slider', sliderRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRoute)
app.use('/api/information', information)
app.use('/api/review', review)



const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))