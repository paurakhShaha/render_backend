const express = require('express')
const morgan = require('morgan')
const Person = require('./mongo')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))


morgan.token("body", (req) => JSON.stringify(req.body));


app.use(express.json())
app.use(morgan(":method :url :status :response-time ms - :body"))

app.get("/" , (req,res) => {
    res.write("<h1>hello world</h1>")
})

app.get("/api/persons",(req,res)=>{
    Person.find({}).then((persons)=>  res.json(persons))
})


app.get("/api/persons/:id",(req,res)=>{
    const id = req.params.id;
    const person = persons.find(person => person.id == id) 
    if(person){
        res.json(person)
    }else{
       res.status(404).json({"msg" : "no details found"})
    }
    
})
app.get("/api/info",(req,res)=>{
    const len = persons.length
    const date = new Date();

    res.write(`<h1>PhoneBook has info for ${len} people</h1> <h1>${date.toString()}</h1>`)
})

app.post("/api/persons",(req,res)=>{
    const body = req.body;

    if (!body) {
        return res.status(400).json({ 
        error: 'content missing' 
        })
    }
    if(!body.name || !body.number){
        return res.status(400).json({ 
            error: 'Name or Number missing' 
        })
    }
    
    Person.create(body).then((persons)=>  res.json(persons))
    
})

app.delete("/api/persons/:id",(req,res)=>{
    const id = req.params.id;
    persons.filter(person => person.id !== id) 
    res.status(204).end() 
})

const PORT =  process.env.PORT || 8080
app.listen(PORT,()=> console.log('Server : http://localhost:8080/'))