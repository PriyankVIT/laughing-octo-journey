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
 *  threshold: threshold of relevence: (float) 
 * }
 * 
 * respose
 * {
 *  success: (boolean),
 *  summary: (array of string)
 * }
 */

app.post('/',(req,res) =>{
    // let s = "We Sanchhaya Education Pvt. Ltd., are registered and headquartered at BC 227, 2nd Floor, Matrix Business Tower, B4, Sector 132, Noida, UP-201301, hereinafter referred to as GeeksforGeeks. We also offer paid Courses managed by Sanchhaya Classes Pvt. Ltd. with registered office address B-142, Vishwash Park, Uttam Nagar, New Delhi, North Delhi, Delhi, India, 110059. At GeeksforGeeks, we value your trust & respect your privacy. This privacy statement (“Privacy Statement”) applies to the treatment of personally identifiable information submitted by, or otherwise obtained from, you in connection with the associated application (“Application”). The Application is provided by GeeksforGeeks (and may be provided by Geeksforgeeks on behalf of a GeeksforGeeks licensor or partner (“Application Partner”). By using or otherwise accessing the Application, you acknowledge that you accept the practices and policies outlined in this Privacy Statement. Like many other Web sites, GeeksforGeeks may receive and store any information you submit to the Application (or otherwise authorize us to obtain – such as, from (for example) your Facebook account). These files merely logs visitors to the site – usually a standard procedure for hosting companies and a part of hosting services’ analytics. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. This information is used to analyze trends, administer the site, track user’s movement around the site, and gather demographic information. IP addresses, and other such information are not linked to any information that is personally identifiable. We employ other companies and people to perform tasks on our behalf and need to share your information with them to provide products or services to you. Unless we tell you differently, GeeksforGeeks’ agents do not have any right to use personal information we share with them beyond what is necessary to assist us. You hereby consent to our sharing of personal information for the above purposes. Business Transfers: In some cases, we may choose to buy or sell assets. In these types of transactions, customer information is typically one of the business assets that are transferred. Moreover, if GeeksforGeeks, or substantially all of its assets were acquired, or in the unlikely event that GeeksforGeeks goes out of business or enters bankruptcy, user information would be one of the assets that is transferred or acquired by a third party. You acknowledge that such transfers may occur, and that any acquirer of GeeksforGeeks may continue to use your personal information as set forth in this policy.We may release personal information when we believe in good faith that release is necessary to comply with the law; enforce or apply our conditions of use and other agreements; or protect the rights, property, or safety of GeeksforGeeks, our employees, our users, or others. This includes exchanging information with other companies and organizations for fraud protection and credit risk reduction."
    let s = req.body.text;
    
    let a = s.split(/[.!?]/)
    let sentenceList = new Array()
    
    a.forEach((i)=>{            // removing empty strings
        if(i.length>0)
            sentenceList.push(i)
    })
    console.log(sentenceList)
    fetch('https://apiv2.indico.io/relevance/batch', {
        method: 'POST',
        body: JSON.stringify({
            api_key: 'f5b733e727ae970ef2cfe47bd4fba445',
            data: sentenceList,
            queries: ["privacy", "protection","fear"]
        })
    })
    .then(r => r.json())
    .then(response => {
        response = response.results;
        let relevanceData = new Array();
        
        response.forEach((sen,index)=>{
            let rel = 0;
            sen.forEach((i)=>{
                rel+=i;
            })
            let threshold = 0.8;
            if(rel>=threshold){
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

app.listen(3000,()=>console.log("connected to port ",3000))