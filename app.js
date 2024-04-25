const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const request = require('request');
const bodyparser = require("body-parser")
const fs = require('fs').promises;
const cors = require('cors')

const { join } = require('path');

const logMessage = async (m,t) =>{

setTimeout(()=>{
  console.log(m)
return 
},t)


}





const verboseGenerateImage = async () => {
  console.log("Image generated successfully!");
  await logMessage("Initializing GAN-based image generation process...", 1000);
  await logMessage("Generating random noise...", 1500);
  await logMessage("Processing initial random noise...", 2000);
  await logMessage("Upscaling the noise to initial image...", 3000);
  await logMessage("Applying initial feature synthesis...", 4000);
  await logMessage("Refining features with GAN...", 5000);
  await logMessage("Enhancing details and textures...", 6000);
  await logMessage("Finalizing image...", 7000);
 
};



 // - Facial Expression: ${expression}
  // - Accessories: ${accessories}
  // - Makeup: ${makeup}

async function query(features,count) {


  const {additionalfeatures, nosesize, eyesize, eyebrowsize, skintone, lipsize, gender, age, hairstyle, haircolor, facialhair, glasses, expression, accessories, eyecolor, makeup, headshape } = features;

  prompt = ` Generate one human face ,  realistic ${age} ${gender} with
  ${nosesize} Nose ,
  ${eyesize} eyes ,
  ${eyebrowsize} eyebrows
 ${skintone} skintone ,
 ${lipsize} lips ,
  ${hairstyle} hairstyle 
 with ${haircolor} hairs , 
   ${facialhair} facialhairs ,
 ${eyecolor} eyes ,
 
  - Head Shape: ${headshape} and  ${additionalfeatures}, only one face is to be generated. 

  `;
  const getUrl = ()=>{
     models = [
     
      
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      "https://api-inference.huggingface.co/models/Artples/LAI-ImageGeneration-vSDXL-2",
      "https://api-inference.huggingface.co/models/DoctorDiffusion/doctor-diffusion-s-stylized-silhouette-photography-xl-lora",

      // "https://api-inference.huggingface.co/models/aoringo/AIkaHimena_221026_3000",
      // "https://api-inference.huggingface.co/models/rzemaitis/rks_person_LoRA" , //(not good)
      // "https://api-inference.huggingface.co/models/stablediffusionapi/acorn-is-boning-xl",
      // "https://api-inference.huggingface.co/models/UCSC-VLAA/HQ-Edit",
      // "https://api-inference.huggingface.co/models/segmind/SSD-1B",
     ];
     idx = Math.floor(Math.random()*(models.length-1))
     console.log(models[idx]);
     return models[idx];

  }
  verboseGenerateImage();

  console.log(prompt);
    const response = await fetch(
          getUrl(),
        {
            headers: { Authorization: process.env.AUTHORIZATION  },
            method: "POST",
            body: JSON.stringify(prompt),
           
        }
    );
console.log('resp',JSON.stringify(response));
// if(response["size"] == 0)
// return await query(features,count++);
    const result = await response.buffer(); 
    await logMessage("Image generation process completed!", 8000);
    // console.log(query(features))
    // console.log(JSON.stringify(response))

    
    return result;
}

// query({ "inputs": "Astronaut riding a horse" }).then(async (response) => {
//     // Save the buffer as an image file
//     const fs = require('fs');
//     fs.writeFileSync('stylized_image.png', response);
//     console.log('Image saved successfully!');
// });





const app = express();
const PORT = process.env.PORT || 3003;
app.use(cors());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get('/', (req, res) => {
  res.render("index");
  // res.render('index', { image_path: null });
});

app.post('/', async (req, res) => {
  const features = req.body
  query(features).then(async (response) => {
    const fs = require('fs');
    imageFileName = "Generatedimage.png";
    fs.writeFileSync( join(__dirname, 'static/'+ imageFileName) , response);
    res.render('index', { image_path: imageFileName });

    console.log('Image saved successfully!');
});
});

app.post('/genFace', async (req, res) => {
  n = Math.ceil(Math.random()*1000);
  const features = req.body;
  try {
    console.log(features);
      // const imageURL = await query(features);
      // res.json({ imageURL:"Generatedimage.png" });


      query(features,0).then(async (response) => {
        console.log(response);
        const fs = require('fs');
        imageFileName = `Generatedimage${n}.png`;
        fs.writeFileSync( join(__dirname, 'static/'+ imageFileName) , response);
        // res.render('index', { image_path: imageFileName });
      res.json({ imageURL:`Generatedimage${n}.png` });
    
        console.log('Image saved successfully!');
    });



  } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
