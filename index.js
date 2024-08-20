const http=require('http');
const app=require('./app');
const server=http.createServer(app);
const port=6000;
server.listen(port,()=>{
    console.log(`running....inport ${port}`)
})