const File = require("../model/File");
const cloudinary=require("cloudinary").v2;
//cloudinary

// storing file locally not into cloudinary
exports.localFileUpload=async(req,res)=>{
    try{
        // fetching file from request 
       const file=req.files.file;
       console.log("File Fetched Sucessfully");

       // path jaha hume file dalni hai {/files/} is for path but aage ka if ki mujhe file ka nam kya rakhna hai
       let path =__dirname + "/files/" +Date.now() +`.${file.name.split('.')[1]}`;


       //file ko req se apne local database me upload kerene k liye mv wala function use kerte hai
       file.mv(path,(err)=>{
        console.log(err);
       });

       res.json({
        sucess:true,
        message:"file uploaded sucessfully to local computer",
       });


    }
    catch(error){
        console.log("Error during data uploading")
    }
}

// support type function 
 function isFileSupported(type,supportedTypes){
    return supportedTypes.includes(type);
 }

 // uploading to cloudinary
 async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder};
    console.log("temperory path is ",file.tempFilePath);
    if(quality){
        // options wale object me quality wale cheez add ker denge taki vo upload hote time vaha compress ho jayee
        options.quality=quality;
    }
    options.resource_type="auto";
    // upload keren k liye parameters me file and path bhejte hai humog and 
    return await cloudinary.uploader.upload(file.tempFilePath, options);
 }

exports.imageUpload = async (req,res)=>{
    try{
       // data fetch kerunga request se 
        const {name,email,tags}= req.body;
       console.log(name,email,tags);
      // file fetch kerunga req se 
      const file=req.files.imageFile;
      console.log(file);

      // checking weather file is supported or not 
      const supportedTypes=["jpg","jpeg","png"];
      const fileType=file.name.split('.')[1].toLowerCase();
      console.log("file type : ",fileType);
      
      // checking weather this file is supported or not
      if(!isFileSupported(fileType,supportedTypes)){
        return res.status(400).json({
            message:"file type is not supported",
            sucess:false
        })
      }
     console.log("Now uploading to cloudinary");
    //  respone me bahut sare chezeen aate hai ek url bhe aayega usko store kerenge
     const response= await uploadFileToCloudinary(file,"ImageUpload");
     console.log(response);


    //  db me entry save kerenge
    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url,
    });
    res.json({
        sucess:true,
        message:"Image uploades To cloud sucessfully",
        image_url:response.secure_url,
    })
      
    }
    catch(error){
        sucess:false,
        console.log("error wile uploading photo")
    }
}

exports.videoUpload= async (req,res)=>{
    try{

    
    const { name ,tags,email}=req.body;
    console.log(name,tags,email);

    const file=req.files.videoFile;

    // validate kerenge file
    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("File Type:", fileType);

    //TODO: add a upper limit of 5MB for Video
    if(!isFileSupported(fileType, supportedTypes)) {
        return res.status(400).json({
            success:false,
            message:'File format not supported',
        })
    }
    //file aab supported hai
     console.log("uploading Video to Cloudinary");
     const response=await uploadFileToCloudinary(file,"Videos");
     console.log(response);
     
     // creating entery to database
     const fileData= await File.create({
        name,
        email,
        tags,
        imageUrl:response.secure_url,
     });
     res.json({
        sucess:true,
        message:"Video Uploaded sucessfully"
     })
    }
     catch(error){
        console.error(error);
        res.status(400),json({
         sucess:true,
         message:"sorry bhai koi dikkat hai"
        })

     }
}

exports.imageSizeReducer = async (req,res)=>{
    try{
        // data fetch kerunga request se 
         const {name,email,tags}= req.body;
        console.log(name,email,tags);
       // file fetch kerunga req se 
       const file=req.files.imageFile;
       console.log(file);
 
       // checking weather file is supported or not 
       const supportedTypes=["jpg","jpeg","png"];
       const fileType=file.name.split('.')[1].toLowerCase();
       console.log("file type : ",fileType);
       
       // checking weather this file is supported or not
       if(!isFileSupported(fileType,supportedTypes)){
         return res.status(400).json({
             message:"file type is not supported",
             sucess:false
         })
       }
      console.log("Now uploading to cloudinary");
     //  respone me bahut sare chezeen aate hai ek url bhe aayega usko store kerenge
      const response= await uploadFileToCloudinary(file,"ImageUpload",90);
      console.log(response);
 
 
     //  db me entry save kerenge
     const fileData = await File.create({
         name,
         tags,
         email,
         imageUrl:response.secure_url,
     });
     res.json({
         sucess:true,
         message:"Image uploades To cloud sucessfully",
         image_url:response.secure_url,
     })
       
     }
     catch(error){
         sucess:false,
         console.log("error wile uploading photo")
     }
}