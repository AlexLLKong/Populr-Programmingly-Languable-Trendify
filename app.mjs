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
		description: "Python is a high-level, dynamic-typed and interpreted programming language that is used in a wide variety of applications, from web development to machine learning to scientific computing. Its simplicity, readability, and wide range of libraries and tools make it an excellent choice for both beginner and experienced programmers."
	},
	{
		name: "C",
		mCode: "01t6b",
		description: "C is a high-level compiled programming language that is widely used for systems programming, embedded systems, game development, and scientific computing. Its low-level control, portability, and efficiency make it an excellent choice for developers who need to develop fast and efficient code for a wide variety of platforms."
	},
	{
		name: "C++",
		mCode: "0jgqg",
		description: "C++ is a high-level, general-purpose, programming languagethat is an extension of the C. It is widely used for developing software applications of all types. Its support for object-oriented programming, speed and efficiency, and low-level control make it an excellent choice for developers who need to develop high-performance applications for a wide variety of platforms."
	},
	{
		name: "C#",
		mCode: "07657k",
		description: "C# is a modern, high-level programming language that was developed by Microsoft in the early 2000s. It is widely used for developing applications for the Microsoft .NET Framework and related technologies. Its support for object-oriented programming, type safety, garbage collection, and platform independence make it an excellent choice for developers who need to develop high-quality applications for a wide variety of platforms."
	},
	{
		name: "HTML",
		mCode: "03g20",
		description: "HTML (Hypertext Markup Language) is a markup language used to create and design web pages. It is a foundational technology for the World Wide Web and is essential for creating and displaying content on websites."
	},
	{
		name: "CSS",
		mCode: "015tjh",
		description: "CSS (Cascading Style Sheets) is a style sheet language used to describe the presentation and styling of HTML (Hypertext Markup Language) and XML (Extensible Markup Language) documents. It is used to define the visual appearance of web pages, including layout, color, font, and other stylistic elements."
	},
	{
		name: "JavaScript",
		mCode: "02p97",
		description: "JavaScript is a high-level, interpreted programming language that is commonly used for creating interactive web pages and applications. It is a client-side scripting language, which means that it runs within the web browser of the user rather than on a web server."
	},
	{
		name: "Kotlin",
		mCode: "0_lcrx4",
		description: "Kotlin is a modern, open-source programming language that runs on the Java Virtual Machine (JVM) and can be used to develop a wide range of applications, including Android mobile apps, web applications, desktop applications, and server-side applications."
	},
	{
		name: "SQL",
		mCode: "075st",
		description: "SQL (Structured Query Language) is a programming language used to manage and manipulate data stored in relational databases. It is used to create, modify, and delete databases, tables, and data within those tables."
	},
	{
		name: "Assembly",
		mCode: "0p8g",
		description: "Assembly language is a low-level programming language that is used to write programs for specific hardware architectures. It is often used to write system software, such as device drivers and operating systems, as well as firmware for embedded systems."
	},
	{
		name: "PHP",
		mCode: "060kv",
		description: "PHP (Hypertext Preprocessor) is a server-side scripting language used to develop dynamic web applications. It is widely used for building websites and web applications that interact with databases and other web-based services."
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