var indico = require('indico.io');
var express = require('express')
var app = express();
var fetch = require('node-fetch')
var bodyParser  = require('body-parser')


require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
/**
 * method: POST
 * 
 * request
 * {
 *  text: terms and condition text: (string),
 *  keyword: list of keywords: (array),
 *  minval: threshold of relevence: (float) 
 * }
 * 
 * respose
 * {
 *  success: (boolean),
 *  summary: (array of string)
 * }
 */

app.post('/',(req,res) =>{
    let s = req.body.text;
    
    let a = s.split(/[.!?]/)
    let sentenceList = new Array()
    
    a.forEach((i)=>{            // removing empty strings
        if(i.length>0)
            sentenceList.push(i)
    })
    console.log(req.body.keyword)
    fetch('https://apiv2.indico.io/relevance/batch', {
        method: 'POST',
        body: JSON.stringify({
            api_key: 'f5b733e727ae970ef2cfe47bd4fba445',
            data: sentenceList,
            queries: req.body.keyword
        })
    })
    .then(r => r.json())
    .then(response => {
        response = response.results;
        let relevanceData = new Array();
        let minval = req.body.minval;
        response.forEach((sen,index)=>{
            let rel = 0;
            sen.forEach((i)=>{
                rel+=i;
            })
                       
            if(rel>minval){
                relevanceData.push(sentenceList[index])
            }
        })
        
        res.json({success: true, summary: relevanceData})
    })
    .catch(err => {
        console.log(err)
        res.json({success: false})
    });
})

app.listen(3500,()=>console.log("connected to port ",3500))