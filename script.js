const courses = [
    { id: 1, title: 'Intro to CS in Java', credits: 6 },
    { id: 2, title: 'Linear Algebra 1', credits: 7 },
    { id: 3, title: 'Discrete Mathematics', credits: 4 },
    { id: 4, title: 'Programming Systems Workshop', credits: 4 },
    { id: 5, title: 'Linear Algebra 2', credits: 5 },
    { id: 6, title: 'Calculus 1', credits: 7 },
]

const students = [
  {
    id: 1,
    name: 'Alice Brown',
    grades: [
      { grade: 98, course: 1 },
      { grade: 95, course: 4 },
      { grade: 92, course: 2 },
      { grade: 90, course: 6 }
    ]
  },
  {
    id: 2,
    name: 'Bob Smith',
    grades: [
      { grade: 80, course: 1 },
      { grade: 100, course: 3 },
      { grade: 95, course: 5 },
    ]
  },
  {
    id: 3,
    name: 'Charlie Johnson',
    grades: [
      { grade: 91, course: 1 },
      { grade: 60, course: 3 },
      { grade: 61, course: 4 }
    ]
  },
  {
    id: 4,
    name: 'Dana Levi',
    grades: [
      { grade: 88, course: 2 },
      { grade: 85, course: 4 },
      { grade: 87, course: 1 },
      { grade: 89, course: 6 }
    ]
  },
  {
    id: 5,
    name: 'Emilia Garcia',
    grades: [
      { grade: 61, course: 3 },
      { grade: 60, course: 1 },
      { grade: 75, course: 4 }
    ]
  },
  {
    id: 6,
    name: "Frank O'Connor",
    grades: [
      { grade: 100, course: 4 },
      { grade: 100, course: 1 },
      { grade: 100, course: 5 }
    ]
  },
  {
    id: 7,
    name: 'Gina Kim',
    grades: [
      { grade: 84, course: 2 },
      { grade: 79, course: 3 },
      { grade: 88, course: 4 },
      { grade: 81, course: 6 },
      { grade: 90, course: 1 }
    ]
  },
  {
    id: 8,
    name: 'Hacker Man',
    grades: [
      { grade: 94, course: 1 },
      { grade: 91, course: 4 },
      { grade: 91, course: 2 }
    ]
  },
  {
    id: 9,
    name: 'Ivy Chen',
    grades: [
      { grade: 95, course: 4 },
      { grade: 94, course: 1 },
      { grade: 91, course: 3 }
    ]
  },
  {
    id: 10,
    name: 'John Long',
    grades: [
      { grade: 91, course: 4 },
      { grade: 94, course: 1 }
    ]
  }
];

// Demand number 1 - add new student
function addStudent(name, grades){
    //checking the required conditions
    const requiredCourseIds = [1, 4];
    const hasPassedPrereqs = requiredCourseIds.every(reqId =>
            {const gradeObj = grades.find(g => g.course === reqId);
             return gradeObj && Math.round(gradeObj.grade) >= 60;
            }
        );
    if (!hasPassedPrereqs) {
        throw new Error("The student can't be added: no passed the required courses");
    }
    // validating and rounding the grades and courses ID
    const processedGrades = grades.map(gradeObj => {
        const roundedGrade = Math.round(gradeObj.grade);
        if (roundedGrade < 0 || roundedGrade > 100) {
            throw new Error("The student can't be added: undefined grade.");
        }
        const courseExists = courses.some(c => c.id === gradeObj.course);
        if (!courseExists) {
            throw new Error("The student can't be added: course ID is not exist.");
        }
        return {
            grade: roundedGrade,
            course: gradeObj.course
        };
    });
    //find the student ID
    const maxId = students.reduce((max, s) => (s.id > max ? s.id : max), 0);
    const newId = maxId + 1;
    //create new student
    const newStudent = {
        id: newId,
        name: name,
        grades: processedGrades
    };
    //add to Students
    students.push(newStudent);
}
// Demand number 2 - Student preformance: grades average, exceptions and etc..
function preformanceCheck(studentId){
    const student = students.find(s => s.id === studentId);
    if(!student){
        throw new Error("The student ID is not exist.");
    } 
    //average caculate
    const passingGrades = student.grades.filter(g => g.grade >= 60);
    const average = passingGrades.length > 0 
        ? passingGrades.reduce((sum, g) => sum + g.grade, 0) / passingGrades.length 
        : 0;
    //checks if there is a grade > average grade + 20 points.
    const hasExceptionalGrade = student.grades.some(g => g.grade > average + 20);
    //checks if the 2 last grades > average.
    const lastTwoGrades = student.grades.slice(-2);
    const hasSignificantImprovement = lastTwoGrades.every(g => g.grade > average);
    const hasSignificantRegression = lastTwoGrades.every(g => g.grade < average);

    return {
        average: Number(average.toFixed(2)),
        hasExceptionalGrade: hasExceptionalGrade,
        hasSignificantImprovement: hasSignificantImprovement,
        hasSignificantRegression: hasSignificantRegression
    };
}


// Demand number 3 - checks suspects on Cheating.
function suspectsCheck(){
  let suspectsFound = false;
  for (let i = 0; i < students.length; i++) {
        for (let j = i + 1; j < students.length; j++) {
            const s1 = students[i];
            const s2 = students[j];
            const commonGrades = s1.grades.filter(g1 => {
                return s2.grades.some(g2 => g1.course === g2.course && g1.grade === g2.grade);
            });
            if (commonGrades.length > 1) {
                console.log(`Cheating suspects: ${s1.name} - ${s2.name}`);
                suspectsFound = true;
            }
        }
    }

    if (!suspectsFound) {
        console.log("No suspects found.");
    }
}


// Demand number 4 - sorting the students by grade.
function rankStudents(studentsList) {
    const sortedStudents = [...studentsList];
    sortedStudents.sort((a, b) => {
        const avgA = analyzePerformance(a.id).average;
        const avgB = analyzePerformance(b.id).average;
        if (avgA !== avgB) {
            return avgB - avgA; 
        }
        if (a.grades.length !== b.grades.length) {
            return b.grades.length - a.grades.length;
        }
        return a.name.localeCompare(b.name);
    });
    return sortedStudents;
}

// Demand number 5 - checks for failed students.
function failedStudents(){
  const failedList = []
  for (let i = 0; i < students.length; i++){
    const student = students[i];
    const avg = preformanceCheck(student.id).average;
    const hasLowGrades = preformanceCheck(student.id).hasSignificantRegression;
    if (avg < 70 || hasLowGrades){
      failedList.push(student.name);
      }
    }
  if(failedList.length > 0){
    console.log(failedList);
  }
  else{
    console.log('No failed students.');
  }   
}