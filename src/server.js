const app = require('./app');

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('Servidor JobLink rodando na porta 3333')
})