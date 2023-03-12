import express from 'express';
import { readFile } from 'node:fs/promises';
import {JSDOM} from 'jsdom'
const app = express();
app.use(express.json());

const PORT = 8000;
const languages = [
	{
		name: "Python",
		mCode: "05z1_",
		description: "Description of Python"
	},
	{
		name: "C",
		mCode: "01t6b",
		description: "Description of C"
	},
	{
		name: "C++",
		mCode: "0jgqg",
		description: "Description of C++"
	}
]

app.use("/js", express.static("./public/js"))
app.use("/css", express.static("./public/css"))
app.use("/img", express.static("./public/img"))

// ENDPOINTS

/**
 * Landing page
 */
app.get('/', async function (req, res) {
	const doc = await readFile("./html/index.html", "utf8");
    res.send(doc);
});

/**
 * Compare page
 */
app.get('/compare', async function (req, res) {
	if(!req.query) {
		// respond with base page with nothing filled out
		res.send("WIP: Should send blank comparison page")
	} 
	
	const googleRequest = {
		locale: "en-US",
		requestOptions: {
			property: "",
			backend: "IZG",
			category:0
		},
		userConfig: {
			userType: "USER_TYPE_LEGIT_USER"
		}
	}

	if (req.query.q) {
		googleRequest.comparisonItem = createComparisonItem(req.query.q)
	}

	if	(req.query.time) {
		googleRequest.time = req.query.time
		googleRequest.resolution = createResolution(req.query.time)
	}

	const googleResponse = await fetch("https://trends.google.com/trends/api/widgetdata/multiline?tz=480&req=" + JSON.stringify(googleRequest) + "&token=APP6_UEAAAAAZA5QR4Mh_wv1lzkG19UlyUG4ZCOf3l6j")
	const googleResponseText = await googleResponse.text()
	const slicedGoogleResponseText = googleResponseText.slice(5)
	const doc = await readFile("./html/compare.html", "utf8")
	let index = new JSDOM(doc)
	index = await loadHTMLComponent(index, '#placeholder', '#content', './html/components/testComponent.html')
	// TODO: replace testComponent with actual compare component. Create multiline graph using slicedGoogleResponseText
	index.window.document.getElementById("callDump").innerHTML = slicedGoogleResponseText;
	res.send(index.serialize())
})

/**
 * Language pages
 */
app.get('/language', async function (req, res) {
	if (!req.query) {
		res.redirect("/compare")
	}

	let validLanguageName = false
	let languageDetails
	for (let i = 0; i < languages.length; i++) {
		if (Object.values(languages[i]).includes(req.query.name)) {
			validLanguageName = true
			languageDetails = languages[i]
			break
		}
	}

	if (!validLanguageName) {
		res.redirect("/compare")
	}

	// TODO: change this too language html when its ready
	const doc = await readFile("./html/test.html", "utf8")
	let language = new JSDOM(doc)
	language.window.document.getElementById("languageName").innerHTML = languageDetails.name;
	language.window.document.getElementById("languageDescription").innerHTML = languageDetails.description;
	// TODO: Make a call to Google Trends and insert a D3 linegraph here
	res.send(language.serialize())
})

// TEST ENDPOINTS 

app.get('/test-page', async function (req, res) {
	const doc = await readFile("./html/test.html", "utf8");
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

const loadHTMLComponent = async (baseDOM, placeholderSelector, componentSelector, componentLocation) => {
	const document = baseDOM.window.document;
	const placeholder = document.querySelector(placeholderSelector);
	// TODO: If placeholder is null here, throw an exception
	const html = await readFile(componentLocation, "utf8");
	const componentDOM = new JSDOM(html);
	placeholder.innerHTML = placeholder.innerHTML + componentDOM.window.document.querySelector(componentSelector).innerHTML;
	return baseDOM;
}

//geo is hardcoded for BC for simplicity/time
const createComparisonItem = (mCodes) => {
	const decodedMCodes = decodeURIComponent(mCodes)
	const mCodesArray = decodedMCodes.split(",")
	return mCodesArray.map(mCode => {
		return ({
			geo: {
				region: "CA-BC"
			},
			complexKeywordsRestriction: {
				keyword:[{
					type: "ENTITY",
					value: mCode
				}]
			}
		})
	})
}

const createResolution = (time) => {
	const timeArray = time.split(/,| /)
	const start = new Date(timeArray[0])
	const end = new Date(timeArray[1])
	const diff = end.getTime() - start.getTime()
	const threeMonthsMilliseconds = 7776000000
	if(diff >= threeMonthsMilliseconds) {
		return "MONTH"
	} 
	return "DAY"
}