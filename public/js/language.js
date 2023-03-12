// import { courses } from './course-data.js';
// import { languages } from '../../app.mjs';
let languages = {}
let courses = []
let languageName
function findLanguageInfo(name) {
    //returns language object with name,description, and mcode
    const languageList = languages;
    const langInfo = languageList.find(e => e.name == name);

    return langInfo
}

function getDescription(name){
    //returns description of a language as a string
    const lang = findLanguageInfo(name);

    return lang.description
}

function getMcode(name){
    //returns mcode of a language as a string
    const lang = findLanguageInfo(name);
    return lang.mCode
}

function getName(name){
    //returns name of a language as a string
    const lang = findLanguageInfo(name);
    return lang.name
}

function filterCourses(name){
    //filters courses
    return courses.filter(obj => Array.isArray(obj[CourseName]) && obj[CourseName].includes(name));
}

function getCourses(name){
    //returns list of course objects that match the language
    const retCourses = filterCourses(name);
    return retCourses
}

function displayObjectInHTML(obj) {

    const ul = document.createElement('ul');
  

    for (let prop in obj) {

      const li = document.createElement('li');
  

      const text = document.createTextNode(`${prop}: ${obj[prop]}`);
      li.appendChild(text);
  

      ul.appendChild(li);
    }
  

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(ul);
  }


const loadName = () => {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	  });
	  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
	languageName = params.name;
}
const loadChart = async function(period) {

	// TODO: Only load the charts once
	const response = await fetch("/languageCharts")
	charts = await response.json()		
	let selectedChart = JSON.parse(charts[languageName.toLowerCase()])
	const timeArray = selectedChart.default.timelineData.map(point => new Date(parseInt(point.time * 1000)))
	const points = selectedChart.default.timelineData.map(point => point.value[0])
	const chart = c3.generate({
		bindto: '#graph',
		data: {
			x: 'x',
		  columns: [
			['x', ...timeArray],
			[languageName, ...points]
		  ]
		},
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: '%Y-%m-%d'
				}
			}
		}
	});
	
}
const loadDetails = async function () {
	const response = await fetch("/languageDetails")
	languages = await response.json()
	const langInfo = findLanguageInfo(languageName)
	document.querySelector("#languageName").innerHTML = languageName
	document.querySelector("#languageDescription").innerHTML = langInfo.description

}
const loadCourseData = async function ()  {
	const response = await fetch("/courseData")
	courses = await response.json()
	courses = courses.courses
	const template = document.getElementsByTagName("template")[0]
	for(let i = 0; i < courses.length; i++) {
		const course = courses[i]
		if(course.Language.includes(languageName)) {
			const clone = template.content.cloneNode(true)
			clone.querySelector("#courseName").innerHTML = course.CourseName;
			document.querySelector("#" + course.School).appendChild(clone)
		}
	}
}
loadName()
loadDetails()
loadCourseData()
loadChart()