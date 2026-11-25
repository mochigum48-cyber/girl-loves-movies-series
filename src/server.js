
require("dotenv").config();
const express=require("express"), mongoose=require("mongoose"), jwt=require("jsonwebtoken");
const multer=require("multer"), cloudinary=require("cloudinary").v2, cors=require("cors");
const app=express(); app.use(cors()); app.use(express.json({limit:"2mb"})); app.use(express.static("public"));
const schema=new mongoose.Schema({title:{type:String,required:true},titleMm:String,description:String,poster:String,banner:String,genre:String,status:{type:String,default:"Ongoing"},featured:Boolean,episodes:[{number:Number,title:String,thumbnail:String,telegramPostUrl:String}]},{timestamps:true});
const Series=mongoose.model("Series",schema);
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024}});
function admin(req,res,next){try{req.admin=jwt.verify((req.headers.authorization||"").replace(/^Bearer\\s+/i,""),process.env.JWT_SECRET);next()}catch{return res.status(401).json({error:"Admin login required"})}}
app.get("/api/health",(q,s)=>s.json({ok:true}));
app.get("/api/series",async(q,s)=>{try{s.json(await Series.find().sort({featured:-1,createdAt:-1}).lean())}catch(e){s.status(500).json({error:"Database error"})}});
app.get("/api/series/:id",async(q,s)=>{try{const x=await Series.findById(q.params.id);if(!x)return s.status(404).json({error:"Not found"});s.json(x)}catch(e){s.status(400).json({error:"Invalid ID"})}});
app.post("/api/admin/login",(q,s)=>{if(q.body.username!==process.env.ADMIN_USERNAME||q.body.password!==process.env.ADMIN_PASSWORD||!process.env.JWT_SECRET)return s.status(401).json({error:"Login failed"});s.json({token:jwt.sign({role:"admin"},process.env.JWT_SECRET,{expiresIn:"12h"})})});
app.post("/api/admin/series",admin,async(q,s)=>{try{s.status(201).json(await Series.create(q.body))}catch(e){s.status(400).json({error:e.message})}});
app.put("/api/admin/series/:id",admin,async(q,s)=>{try{const x=await Series.findByIdAndUpdate(q.params.id,q.body,{new:true,runValidators:true});if(!x)return s.status(404).json({error:"Not found"});s.json(x)}catch(e){s.status(400).json({error:e.message})}});
app.delete("/api/admin/series/:id",admin,async(q,s)=>{try{await Series.findByIdAndDelete(q.params.id);s.json({ok:true})}catch(e){s.status(400).json({error:"Delete failed"})}});
app.post("/api/admin/upload",admin,upload.single("image"),async(q,s)=>{if(!q.file)return s.status(400).json({error:"Choose an image"});if(!process.env.CLOUDINARY_CLOUD_NAME)return s.status(503).json({error:"Cloudinary not configured yet"});try{const data=`data:${q.file.mimetype};base64,${q.file.buffer.toString("base64")}`;const r=await cloudinary.uploader.upload(data,{folder:"girl-loves-series"});s.json({url:r.secure_url})}catch(e){s.status(500).json({error:"Upload failed"})}});
app.get("/admin",(q,s)=>s.sendFile(require("path").join(process.cwd(),"public","admin.html")));
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(process.env.PORT||3000,()=>console.log("GL Mini App server ready"))).catch(e=>{console.error("MongoDB connection failed:",e.message);process.exit(1)});
