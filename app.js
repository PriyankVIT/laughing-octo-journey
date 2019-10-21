var indico      = require('indico.io'),
    express     = require('express'),
    app         = express(),
    fetch       = require('node-fetch'),
    bodyParser  = require('body-parser'),
    textract    = require('textract'),
    multer      = require('multer')
    upload      = multer({ dest: 'uploads/' }),
    fs= require('fs'),
    pdf = require('pdf-parse')
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const publicDir = require('path').join(__dirname,'/');
app.use(express.static(publicDir))

let s;

app.post('/fileUpload',upload.single('text'),(req,res)=>{
    console.log(req.file.path)

    let dataBuffer = fs.readFileSync(req.file.path);
    pdf(dataBuffer)
        .then(function(data) {
            console.log(data.text); 
            s = data.text;
            s.replace(/\r?\n|\r/g, ' ')
            res.json({success: true})
        })
        .catch((err)=>{
            console.log(err);
            res.json({success: false})
        })
})

app.post('/',(req,res) =>{
    console.log(req.body)
       
    let a = s.split(/[.!?]/)
    let sentenceList = new Array()
    
    a.forEach((i)=>{
        i=i.trim()                  // removing empty strings
        if(i.length>5)
            sentenceList.push(i)
    })

    console.log(sentenceList)
    fetch('https://apiv2.indico.io/relevance/batch', {
        method: 'POST',
        body: JSON.stringify({
            api_key: 'f5b733e727ae970ef2cfe47bd4fba445',
            data: sentenceList,
            queries: req.body.keyword
        })
    })
    .then((r) => r.json())
    .then((response) => {
        response = response.results;
        let relevanceData = new Array();
        let minval = req.body.minval;
        response.forEach((sen,index)=>{
            let rel = 0;
            sen.forEach((i)=>{
                rel+=i;
            })
            relevanceData.push(rel)
        })

        let threshhold = Math.max(...relevanceData)*minval;

        let data = new Array();
        relevanceData.forEach((i,index)=>{
            if(i>threshhold){
            
                let temp=sentenceList[index].slice(sentenceList[index].lenth-3)
                if(temp=='\n')
                    sentenceList[index]=sentenceList[index].slice(0,sentenceList[index].lenth-3)
                data.push(sentenceList[index]);
            }
                
        })
        console.log(data)
        res.json({success: true, summary: data})
    })
    .catch(err => {
        console.log(err)
        res.json({success: false})
    });
})


app.listen(3000,()=>{
    console.log("connected to port ",3000);
})