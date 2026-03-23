const mongoose = require('mongoose');
require('dotenv').config()


mongoose.connect(process.env.MONGODB_URL,{family : 4}).then(()=>console.log('connected to mongo db')).catch(err => console.log(err))

const PersonsSchema = new mongoose.Schema({
    name : String ,
    number : Number
})
PersonsSchema.set('toJSON',{
    transform:(document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Person = new mongoose.model("Person",PersonsSchema)


if(process.argv.length == 3){
   Person.find({}).then(persons => {
    persons.map(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
   })
}


module.exports = Person;