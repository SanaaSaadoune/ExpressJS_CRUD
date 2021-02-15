const express = require('express');
const mongoose = require('mongoose');
const Joi = require ('joi');
const app = express();

//Connectin à la BD
mongoose.connect('mongodb://localhost/school')
    .then(() => console.log('mongodb is connected'))
    .catch((err) => console.log(err.message))

//Schema de la collection
const courseSchema = mongoose.Schema({
    name : String,
    author : String,
    price: Number
})

//Creation de la table en utilisant le schema
const Course = mongoose.model('Course', courseSchema);

//Middleware pour l'éxecution de requette en HTTP
app.use(express.json()); 

//Récupération des données
app.get('/courses', async (req,res) =>{
    const courses = await Course.find();
    res.send(courses);
});

//Ajout des champs à partir du body
app.post('/courses', async (req,res) =>{

    const courseValidate = Joi.object({
        name: Joi.string().min(3).required(),
        author : Joi.string().required(),
        price : Joi.number().required()
    });

    result = courseValidate.validate(req.body);

    if(result.error){
        return res.status(400).send(result.error.details[0].message);
        // return res.send(result);
    }

    else{
        const course = new Course({
        name : req.body.name,
        author: req.body.author,
        price: req.body.price
    })

    const newCourse = await course.save();

    res.send(newCourse)
    }
    

    
})

//Modification des données
app.put('/courses/:id', async (req,res) => {

    const id = req.params.id; 
    const course= await Course.findById(id);

    course.name= req.body.name;
    course.author= req.body.author;
    course.price= req.body.price;

    const result = await course.save();
    res.send(result);
})


// Suppression des données
app.delete('/courses/:id', async (req, res) => {
    const id= req.params.id;
    const course = await Course.findOne({ _id:id}); //findOne = findById

    const result = await course.delete();
    res.send(result);
})


app.listen(3000, () =>{
    console.log('app running on 3000 port');
});