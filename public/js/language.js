import { courses } from './course-data.js';
import { languages } from '../../app.mjs';

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

  displayObjectInHTML(findLanguageInfo("Python"))