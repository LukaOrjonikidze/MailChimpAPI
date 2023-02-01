const express = require('express');
const https = require('https');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
})
app.post('/', (req, res)=>{
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = `https://us11.api.mailchimp.com/3.0/lists/65e1621c36`

    const options = {
        method:"POST",
        auth:"luka:7f742609d71d8a1cc308e4f06d15d700-us11"
    };

    const request = https.request(url, options, (response)=>{
        response.on("data", (data)=>{
            unJSONdata = JSON.parse(data);
            if (unJSONdata.error_count == 0){
                res.sendFile(__dirname + "/success.html")
            } else {    
                res.sendFile(__dirname + "/failure.html")
            }
            console.log(JSON.parse(data));
        })
        
    });

    request.write(jsonData);
    request.end()
})
app.post('/failure', (req, res)=>{
    res.redirect('/')
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Serves is Running on port 3000");
})
// api key
// 7f742609d71d8a1cc308e4f06d15d700-us11
// listid
// 65e1621c36