// Fichero de configuración de la bd y puertos
module.exports ={
	port: process.env.PORT || 3001,
	db: process.env.MONGODB || 'mongodb://admin:admin@ds157641.mlab.com:57641/heroku_xtldxzhc',
	SECRET_TOKEN: 'miclavedetokens'
}
 //nube - mongodb://admin:admin@ds157641.mlab.com:57641/heroku_xtldxzhc
 //local - mongodb://usuarioevo:123@localhost/evohr
