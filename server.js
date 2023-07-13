const app = require('express')()
const mongoose = require('mongoose')
const { mongo } = require('./config.js')

app.get('/', (req, res) => res.send(`YOU SHOULD NOT BE HERE`))

app.listen(3000, () => console.log(`Bot running on`))

module.exports = async() =>{
	await mongoose.connect(mongo, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	return mongoose
}