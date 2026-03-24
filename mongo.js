const mongoose = require('mongoose')
require('dotenv').config()


mongoose.connect(process.env.MONGODB_URL,{family : 4}).then(()=>console.log('connected to mongo db')).catch(err => console.log(err))

function phoneValidator(params) {
  return params[2] === '-' || params[3] === '-'
}
const PersonsSchema = new mongoose.Schema({
  name : {
    type : String,
    minLength : 3,
    require : true
  } ,
  number : {
    type : String,
    minLength : 8 ,
    required : true,
    validate :{
      validator : v => phoneValidator(v)
    }
  }
})
PersonsSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = new mongoose.model('Person',PersonsSchema)


if(process.argv.length == 3){
  Person.find({}).then(persons => {
    persons.map(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
}


module.exports = Person