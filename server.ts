import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename=fileURLToPath(import.meta.url); const __dirname=path.dirname(__filename); const app=express(); const PORT=Number(process.env.PORT)||3000;
app.use(express.json({limit:'1mb'}));
app.get('/health',(_req:Request,res:Response)=>res.status(200).json({status:'ok'}));
app.post('/api/advisor',(_req:Request,res:Response)=>res.status(501).json({error:'Gemini advisor endpoint is not yet restored'}));
async function startServer(){ if(process.env.NODE_ENV!=='production'){const {createServer}=await import('vite'); const vite=await createServer({server:{middlewareMode:true},appType:'spa'}); app.use(vite.middlewares);} else {const distPath=path.join(process.cwd(),'dist'); app.use(express.static(distPath)); app.get('*',(_req,res)=>res.sendFile(path.join(distPath,'index.html')));} app.listen(PORT,'0.0.0.0',()=>console.log(`Green Digital Ethiopia server running on port ${PORT}`)); }
startServer();
