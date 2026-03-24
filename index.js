const express = require('express')
const morgan = require('morgan')
const Person = require('./mongo')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))


morgan.token('body', (req) => JSON.stringify(req.body))


app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :body'))


app.get('/api/persons',(req,res,next) => {
  Person.find({}).then((persons) =>  res.json(persons)).catch(error => next(error))
})


app.get('/api/persons/:id',(req,res,next) => {
  const id = req.params.id
  const person = Person.findById(id).then(person => res.json(person)).catch(error => next(error))
  if(!person){
    res.status(404).json({ 'msg' : 'no details found' })
  }
})
app.get('/api/info',(req,res,next) => {
  const date = new Date()
  Person.countDocuments({}).then(count => res.write(`<h1>PhoneBook has info for ${count} people</h1> <h1>${date.toString()}</h1>`)).catch(error => next(error))
  // res.write(`<h1>PhoneBook has info for ${len} people</h1> <h1>${date.toString()}</h1>`)
})

app.post('/api/persons',(req,res,next) => {
  const body = req.body
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
  return Person.create(body).then((persons) =>  res.json(persons))
    .catch(error => next(error))
})

app.put('/api/persons/:id',(req,res,next) => {
  const body = req.body
  console.log(body.id)
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
  Person.findById(body.id).then( person => {
    if (!person) {
      return res.status(404).end()
    }
    person.number = body.number
    return person.save().then((updatedPersons) =>  res.json(updatedPersons))
  }).catch(error => next(error))})


app.delete('/api/persons/:id',(req,res,next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))

})




const unkownEndpoint = (request ,response) => {
  response.status(404).json({ 'message' : 'No page found with this route' })
}

app.use(unkownEndpoint)

const errorHandeler = (error,req,res,next) => {
  console.log('error'+ error)
  if(error.name === 'CastError'){
    res.status(402).json({ error : 'malformed id' })
  }else if(error.name === 'ValidationError'){
    res.status(400).json({ error: error.message })
  }else{
    res.status(500).json({ error : 'Something went wrong' })
  }
  next(error)

}
app.use(errorHandeler)
const PORT =  process.env.PORT || 8080
app.listen(PORT,() => console.log('Server : http://localhost:8080/'))