const express = require('express');
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = 8000;

app.use("/js", express.static("./public/js"))
app.use("/css", express.static("./public/css"))
app.use("/img", express.static("./public/img"))

// ENDPOINTS

/**
 * Landing page
 */
app.get('/', (req, res) => {
	const doc = fs.readFileSync("./html/index.html", "utf8");
    res.send(doc);
});

/**
 * Compare page
 */
app.get('/compare', (req, res) => {
	// TODO: Using query parameters, prepopulate the dom with the correct settings
	res.send("WIP: Should point to comparison interface")
})

/**
 * Language pages
 */
app.get('/language', (req, res) => {
	// TODO: by checking a the id query parameter, send back the language page filled out using JSDom with the correct language info
	res.send("WIP: Should point to specific language page according to query parameter")
})

// TEST ENDPOINTS 

app.get('/test-page', (req,res) => {
	const doc = fs.readFileSync("./html/test.html", "utf8");
    res.send(doc);
})

app.get('/test-call', (req,res) => {
	const request = {"time":"2004-02-11+2023-03-11","resolution":"MONTH","locale":"en-US","comparisonItem":[{"geo":{"region":"CA-BC"},"complexKeywordsRestriction":{"keyword":[{"type":"ENTITY","value":"/m/05z1_"}]}},{"geo":{"region":"CA-BC"},"complexKeywordsRestriction":{"keyword":[{"type":"ENTITY","value":"/m/01t6b"}]}},{"geo":{"region":"CA-BC"},"complexKeywordsRestriction":{"keyword":[{"type":"ENTITY","value":"/m/0jgqg"}]}}],"requestOptions":{"property":"","backend":"IZG","category":0},"userConfig":{"userType":"USER_TYPE_LEGIT_USER"}}
	fetch("https://trends.google.com/trends/api/widgetdata/multiline?tz=480&req=" + JSON.stringify(request) + "&token=APP6_UEAAAAAZA5QR4Mh_wv1lzkG19UlyUG4ZCOf3l6j")
		.then(res => res.text())
		.then(data => res.send(data.slice(5)))
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);
