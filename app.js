const express = require("express");
const request = require("request");
const bodyParser = require("body-parser"); //req.body.fName to display entered input from html
const https = require("https");
const { SocketAddress } = require("net");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//Get request to display signup.html file when server is Up

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})


//Send required data to Mailchimp server with post request when we click SIGNUP button on signup.html

app.post("/", function (req, res) {
    const firtName = req.body.fName;  //req.body.fName displays First Name from signup page using body-parser
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {                      //this is javacript format of mailchimp data which has to be sent
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firtName,
                    LNAME: lastName
                }
            }
        ]
    };
    console.log(data);
    const jsonData = JSON.stringify(data); //Convert JavaScript to JSON string
    console.log(jsonData);

    const url = "https://us9.api.mailchimp.com/3.0/lists/77e1de3910"
    const options = {
        method: 'POST',
        auth: 'karlo1:f56e49fc1948c2c915ea83ad019f4658-us9'  // user: APIkey
        // Refer : https://mailchimp.com/developer/marketing/docs/merge-fields/#add-merge-data-to-contacts
    };

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {

            const statusCode = response.statusCode; //HTML status code is saved in variable statusCode
            const parcedData = JSON.parse(data); //Convert data received from web server to JavaScript format
            console.log(parcedData);

            if (statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
                // res.write("There was an error. Please try again...");
                // res.write("Error Code : " + response.statusCode);
                // res.write("Error Detail : " + parcedData.detail);
                // res.send();
            }
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){ //Redirect to home page "/" when its failed to signup
    res.redirect("/");

})

app.listen(process.env.PORT || 5000, function () {
    console.log("Server is up and running on port 3000")
});


// API Key
// f56e49fc1948c2c915ea83ad019f4658-us9

// List ID/ Audience ID
// 77e1de3910