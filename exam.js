// DOM Elements
const examForm = document.getElementById('examForm');
const resultsTable = document.getElementById('resultsTable');
const resultsBody = document.getElementById('resultsBody');
const noResults = document.getElementById('noResults');
const filterStudent = document.getElementById('filterStudent');
const filterSubject = document.getElementById('filterSubject');
const clearFilters = document.getElementById('clearFilters');
const totalStudents = document.getElementById('totalStudents');
const totalExams = document.getElementById('totalExams');
const topPerformer = document.getElementById('topPerformer');
const modal = document.getElementById('resultModal');
const closeModal = document.querySelector('.close-modal');

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Load exam results from localStorage
let examResults = JSON.parse(localStorage.getItem('examResults')) || [];

// Initialize the app
function init() {
    renderResults();
    updateStatistics();
    updateFilters();

    // Event listeners
    examForm.addEventListener('submit', addExamResult);
    clearFilters.addEventListener('click', clearAllFilters);
    filterStudent.addEventListener('change', filterResults);
    filterSubject.addEventListener('change', filterResults);
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Add new exam result
function addExamResult(e) {
    e.preventDefault();

    // Get form values
    const studentName = document.getElementById('studentName').value;
    const relationship = document.getElementById('relationship').value;
    const examName = document.getElementById('examName').value;
    const examDate = document.getElementById('examDate').value;
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;
    const comments = document.getElementById('comments').value;

    // Create result object
    const newResult = {
        id: Date.now(),
        studentName,
        relationship,
        examName,
        examDate,
        subject,
        grade,
        comments
    };

    // Add to results array
    examResults.push(newResult);

    // Save to localStorage
    saveResults();

    // Reset form
    examForm.reset();

    // Update UI
    renderResults();
    updateStatistics();
    updateFilters();

    // Show success message
    alert('Exam result added successfully!');
}

// Save results to localStorage
function saveResults() {
    localStorage.setItem('examResults', JSON.stringify(examResults));
}

// Render results table
function renderResults(filteredResults = null) {
    const results = filteredResults || examResults;
    
    // Clear results table
    resultsBody.innerHTML = '';
    
    if (results.length === 0) {
        resultsTable.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        resultsTable.style.display = 'table';
        noResults.style.display = 'none';
        
        // Add results to table
        results.forEach(result => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(result.examDate);
            const formattedDate = date.toLocaleDateString();
            
            row.innerHTML = `
                <td>${result.studentName}</td>
                <td>${result.relationship}</td>
                <td>${result.examName}</td>
                <td>${formattedDate}</td>
                <td>${result.subject}</td>
                <td>${result.grade}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${result.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${result.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            resultsBody.appendChild(row);
        });
        
        // Add event listeners to view and delete buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', viewResult);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteResult);
        });
    }
}

// View result details
function viewResult(e) {
    const resultId = parseInt(e.currentTarget.getAttribute('data-id'));
    const result = examResults.find(res => res.id === resultId);
    
    if (result) {
        // Format date
        const date = new Date(result.examDate);
        const formattedDate = date.toLocaleDateString();
        
        // Populate modal
        document.getElementById('modalStudentName').textContent = result.studentName;
        document.getElementById('modalRelationship').textContent = result.relationship;
        document.getElementById('modalExamName').textContent = result.examName;
        document.getElementById('modalExamDate').textContent = formattedDate;
        document.getElementById('modalSubject').textContent = result.subject;
        document.getElementById('modalGrade').textContent = result.grade;
        document.getElementById('modalComments').textContent = result.comments || 'No comments provided';
        
        // Show modal
        modal.style.display = 'block';
    }
}

// Delete result
function deleteResult(e) {
    if (confirm('Are you sure you want to delete this result?')) {
        const resultId = parseInt(e.currentTarget.getAttribute('data-id'));
        
        // Remove from array
        examResults = examResults.filter(res => res.id !== resultId);
        
        // Save to localStorage
        saveResults();
        
        // Update UI
        renderResults();
        updateStatistics();
        updateFilters();
    }
}

// Update filters
function updateFilters() {
    // Clear existing options
    filterStudent.innerHTML = '<option value="all">All Students</option>';
    filterSubject.innerHTML = '<option value="all">All Subjects</option>';
    
    // Get unique students and subjects
    const students = [...new Set(examResults.map(res => res.studentName))];
    const subjects = [...new Set(examResults.map(res => res.subject))];
    
    // Add options to student filter
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student;
        option.textContent = student;
        filterStudent.appendChild(option);
    });
    
    // Add options to subject filter
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        filterSubject.appendChild(option);
    });
}

// Filter results
function filterResults() {
    const studentFilter = filterStudent.value;
    const subjectFilter = filterSubject.value;
    
    let filteredResults = examResults;
    
    // Apply student filter
    if (studentFilter !== 'all') {
        filteredResults = filteredResults.filter(res => res.studentName === studentFilter);
    }
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
        filteredResults = filteredResults.filter(res => res.subject === subjectFilter);
    }
    
    // Render filtered results
    renderResults(filteredResults);
}

// Clear all filters
function clearAllFilters() {
    filterStudent.value = 'all';
    filterSubject.value = 'all';
    renderResults();
}

// Update statistics
function updateStatistics() {
    // Count unique students
    const uniqueStudents = [...new Set(examResults.map(res => res.studentName))];
    totalStudents.textContent = uniqueStudents.length;
    
    // Count total exams
    totalExams.textContent = examResults.length;
    
    // Find top performer
    if (examResults.length > 0) {
        // Group results by student
        const studentResults = {};
        
        examResults.forEach(res => {
            if (!studentResults[res.studentName]) {
                studentResults[res.studentName] = [];
            }
            studentResults[res.studentName].push(res);
        });
        
        // Find student with most results (as a simple metric)
        let maxCount = 0;
        let topStudent = '';
        
        for (const student in studentResults) {
            if (studentResults[student].length > maxCount) {
                maxCount = studentResults[student].length;
                topStudent = student;
            }
        }
        
        topPerformer.textContent = topStudent || '-';
    } else {
        topPerformer.textContent = '-';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init); 