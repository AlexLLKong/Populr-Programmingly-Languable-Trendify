const express = require('express');
const googleTrends = require('google-trends-api');
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = 8000;

app.use("/js", express.static("./public/js"))
app.use("/css", express.static("./public/css"))
app.use("/img", express.static("./public/img"))

app.get('/', (req, res)=>{
	const doc = fs.readFileSync("./html/index.html", "utf8");
    res.send(doc);
});
  
app.get('/test-page', (req,res) => {
	const doc = fs.readFileSync("./html/test.html", "utf8");
    res.send(doc);
})

app.get('/test-call', (req,res) => {
	googleTrends.interestOverTime({keyword: 'Python'})
		.then(function(results){
			res.status(200);
			res.send(results)
			console.log(results);
		})
		.catch(function(err){
			console.error(err);
		});
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);