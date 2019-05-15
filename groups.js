const _ = require('lodash');
const fs = require('fs');
const inquirer = require('inquirer');

try {
	var names = fs.readFileSync('names.txt'.toLocaleLowerCase());
} catch (error) {
	throw Error(
		'Please add a students.txt file with the names of the students to the root directory.  Separate the students names by a coma'
	);
}

function getGroups(a, b) {
	if (a % b == 0) {
		evenGroups(a, b);
		printStudentList(namesShuffle, b);
	} else {
		notEvenGroups(a, b);
		printStudentList(namesShuffle, b);
	}
}

var namesToString = String(names).split(',');
var namesShuffle = _.shuffle(namesToString);
var totalStudents = namesShuffle.length;
console.log(`You have ${totalStudents} students`);

inquirer
	.prompt([
		{
			type: 'input',
			name: 'groups',
			message: 'Please enter how many students per group you would like',
			validate: function(input) {
				var pass = /^[0-9][A-Za-z0-9 -]*$/.test(input);
				if (pass) {
					return true;
				}
				return 'Please enter a number';
			}
		}
	])
	.then((answers) => {
		getGroups(totalStudents, answers.groups);
	});

function evenGroups(a, b) {
	var evenGroupsOfStudents = a / b;
	console.log(`There will be ${evenGroupsOfStudents} groups of ${b} students`);
}

function notEvenGroups(a, b) {
	var evenGroupsOfStudents = _.toString(a / b).split('.');
	var studentsWOGroups = a % b;
	console.log(
		`There will be ${evenGroupsOfStudents[0]} groups of ${b} students and one group of ${studentsWOGroups} students`
	);
}

function printStudentList(array, size) {
	var finalGroups = _.chunk(array, size);
	finalGroups.forEach((group, i) => {
		fs.appendFileSync('studentGroups.txt', 'Group' + i + '\n');
		fs.appendFileSync('studentGroups.txt', group + '\n');
	});
	fs.appendFileSync('studentGroups.txt', '\n ============= \n');
	console.log(finalGroups);
}
