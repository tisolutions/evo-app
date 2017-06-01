
const mongoose = require('mongoose')
const app = require('./app');
const config = require('./config')

mongoose.Promise = global.Promise;
mongoose.connect(config.db, (err,res) =>{
	if (err) {
		return console.log(`Error a la base de datos: ${err}`)
	}

	console.log('Conexión a la base de datos establecida')

	app.listen(config.port, ()=>{
		console.log(`Esta corriendo la aplicación en el puerto localhost ${config.port}` );
	})
})
