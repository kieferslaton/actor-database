const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));

const connection = process.env.MONGODB_SRV;
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => console.log("Database connected successfully.")).catch(err => console.log(err));

const modelRouter = require('./routes/data-route')

app.use('/models', modelRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port`)
});