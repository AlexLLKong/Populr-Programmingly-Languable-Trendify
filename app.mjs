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
	if(Objects.keys(req.query).length === 0) {
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

	if 	(req.query.time) {
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
	// const chart = LineChart(unemployment, {
	// 	x: d => d.date,
	// 	y: d => d.unemployment,
	// 	z: d => d.division,
	// 	yLabel: "↑ Unemployment (%)",
	// 	width,
	// 	height: 500,
	// 	color: "steelblue",
	// 	voronoi // if true, show Voronoi overlay
	// 	})
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

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/multi-line-chart
// function LineChart(data, {
// 	x = ([x]) => x, // given d in data, returns the (temporal) x-value
// 	y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
// 	z = () => 1, // given d in data, returns the (categorical) z-value
// 	title, // given d in data, returns the title text
// 	defined, // for gaps in data
// 	curve = d3.curveLinear, // method of interpolation between points
// 	marginTop = 20, // top margin, in pixels
// 	marginRight = 30, // right margin, in pixels
// 	marginBottom = 30, // bottom margin, in pixels
// 	marginLeft = 40, // left margin, in pixels
// 	width = 640, // outer width, in pixels
// 	height = 400, // outer height, in pixels
// 	xType = d3.scaleUtc, // type of x-scale
// 	xDomain, // [xmin, xmax]
// 	xRange = [marginLeft, width - marginRight], // [left, right]
// 	yType = d3.scaleLinear, // type of y-scale
// 	yDomain, // [ymin, ymax]
// 	yRange = [height - marginBottom, marginTop], // [bottom, top]
// 	yFormat, // a format specifier string for the y-axis
// 	yLabel, // a label for the y-axis
// 	zDomain, // array of z-values
// 	color = "currentColor", // stroke color of line, as a constant or a function of *z*
// 	strokeLinecap, // stroke line cap of line
// 	strokeLinejoin, // stroke line join of line
// 	strokeWidth = 1.5, // stroke width of line
// 	strokeOpacity, // stroke opacity of line
// 	mixBlendMode = "multiply", // blend mode of lines
// 	voronoi // show a Voronoi overlay? (for debugging)
//   } = {}) {
// 	// Compute values.
// 	const X = d3.map(data, x);
// 	const Y = d3.map(data, y);
// 	const Z = d3.map(data, z);
// 	const O = d3.map(data, d => d);
// 	if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
// 	const D = d3.map(data, defined);
  
// 	// Compute default domains, and unique the z-domain.
// 	if (xDomain === undefined) xDomain = d3.extent(X);
// 	if (yDomain === undefined) yDomain = [0, d3.max(Y, d => typeof d === "string" ? +d : d)];
// 	if (zDomain === undefined) zDomain = Z;
// 	zDomain = new d3.InternSet(zDomain);
  
// 	// Omit any data not present in the z-domain.
// 	const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));
  
// 	// Construct scales and axes.
// 	const xScale = xType(xDomain, xRange);
// 	const yScale = yType(yDomain, yRange);
// 	const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
// 	const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);
  
// 	// Compute titles.
// 	const T = title === undefined ? Z : title === null ? null : d3.map(data, title);
  
// 	// Construct a line generator.
// 	const line = d3.line()
// 		.defined(i => D[i])
// 		.curve(curve)
// 		.x(i => xScale(X[i]))
// 		.y(i => yScale(Y[i]));
  
// 	const svg = d3.create("svg")
// 		.attr("width", width)
// 		.attr("height", height)
// 		.attr("viewBox", [0, 0, width, height])
// 		.attr("style", "max-width: 100%; height: auto; height: intrinsic;")
// 		.style("-webkit-tap-highlight-color", "transparent")
// 		.on("pointerenter", pointerentered)
// 		.on("pointermove", pointermoved)
// 		.on("pointerleave", pointerleft)
// 		.on("touchstart", event => event.preventDefault());
  
// 	// An optional Voronoi display (for fun).
// 	if (voronoi) svg.append("path")
// 		.attr("fill", "none")
// 		.attr("stroke", "#ccc")
// 		.attr("d", d3.Delaunay
// 		  .from(I, i => xScale(X[i]), i => yScale(Y[i]))
// 		  .voronoi([0, 0, width, height])
// 		  .render());
  
// 	svg.append("g")
// 		.attr("transform", `translate(0,${height - marginBottom})`)
// 		.call(xAxis);
  
// 	svg.append("g")
// 		.attr("transform", `translate(${marginLeft},0)`)
// 		.call(yAxis)
// 		.call(g => g.select(".domain").remove())
// 		.call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
// 			.attr("x2", width - marginLeft - marginRight)
// 			.attr("stroke-opacity", 0.1))
// 		.call(g => g.append("text")
// 			.attr("x", -marginLeft)
// 			.attr("y", 10)
// 			.attr("fill", "currentColor")
// 			.attr("text-anchor", "start")
// 			.text(yLabel));
  
// 	const path = svg.append("g")
// 		.attr("fill", "none")
// 		.attr("stroke", typeof color === "string" ? color : null)
// 		.attr("stroke-linecap", strokeLinecap)
// 		.attr("stroke-linejoin", strokeLinejoin)
// 		.attr("stroke-width", strokeWidth)
// 		.attr("stroke-opacity", strokeOpacity)
// 	  .selectAll("path")
// 	  .data(d3.group(I, i => Z[i]))
// 	  .join("path")
// 		.style("mix-blend-mode", mixBlendMode)
// 		.attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
// 		.attr("d", ([, I]) => line(I));
  
// 	const dot = svg.append("g")
// 		.attr("display", "none");
  
// 	dot.append("circle")
// 		.attr("r", 2.5);
  
// 	dot.append("text")
// 		.attr("font-family", "sans-serif")
// 		.attr("font-size", 10)
// 		.attr("text-anchor", "middle")
// 		.attr("y", -8);
  
// 	function pointermoved(event) {
// 	  const [xm, ym] = d3.pointer(event);
// 	  const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
// 	  path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
// 	  dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
// 	  if (T) dot.select("text").text(T[i]);
// 	  svg.property("value", O[i]).dispatch("input", {bubbles: true});
// 	}
  
// 	function pointerentered() {
// 	  path.style("mix-blend-mode", null).style("stroke", "#ddd");
// 	  dot.attr("display", null);
// 	}
  
// 	function pointerleft() {
// 	  path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
// 	  dot.attr("display", "none");
// 	  svg.node().value = null;
// 	  svg.dispatch("input", {bubbles: true});
// 	}
  
// 	return Object.assign(svg.node(), {value: null});
//   }