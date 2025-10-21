import express from 'express'
import promBundle from 'express-prom-bundle'
const app= express();

const PORT =3000
const metricsMiddleware =promBundle({
    includeMethod:true,
    includePath:true,
    includeStatusCode:true,
    includeUp:true,
    customLabels:{app:'express-docker-app'},
    promClient:{
        collectDefaultMetrics:{
            timeout:1000
        }
    }
})

app.use(metricsMiddleware);
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello from server');
})

app.get('/health',(req,res)=>{
    res.json({status:'healthy',timestamp:new Date()})
})

app.get('/slow', async (req,res)=>{
    await new Promise(resolve=>setTimeout(resolve,2000));
    res.json({message:'Slow response'});
})

app.get('/error',(req,res)=>{
    res.status(500).json({error:"Simulated error"})
})

app.listen(PORT,()=>{console.log('Server running')
      console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
