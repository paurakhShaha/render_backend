const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
morgan.token("body", (req) => JSON.stringify(req.body));


app.use(express.json())
app.use(morgan(":method :url :status :response-time ms - :body"))

app.get("/" , (req,res) => {
    res.write("<h1>hello world</h1>")
})

app.get("/api/persons",(req,res)=>{
    res.json(persons)
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
    
    const nameMatch = persons.find(person => person.name == body.name) 
    if(nameMatch){
         return res.status(400).json({ 
            error: 'Name is Same' 
        })
    }
    const id = Math.floor(Math.random() * 1000000000);
    body.id = String(id)
    persons = persons.concat(body)
    res.json(persons)
})

app.delete("/api/persons/:id",(req,res)=>{
    const id = req.params.id;
    persons.filter(person => person.id !== id) 
    res.status(204).end() 
})

const PORT =  process.env.PORT || 8080
app.listen(PORT,()=> console.log('Server : http://localhost:8080/'))