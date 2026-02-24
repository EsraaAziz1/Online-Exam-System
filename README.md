# Online Exam System

An interactive online exam system that allows users to take timed multiple-choice exams.  
It validates user input, fetches questions dynamically from a JSON Server, and calculates the final score with a grade.

## Features

- User enters their name with validation (not empty, length limits)
- Timed exam with automatic submission when time ends
- Questions fetched dynamically from a JSON Server
- One question per page with Next/Previous navigation
- Final score and grade displayed at the end

## Technologies Used

- HTML, CSS, JavaScript
- JSON Server (to simulate backend and questions)
- Fetch API for dynamically retrieving questions

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/EsraaAziz1/Online-Exam-System.git
3. Install JSON Server if not already installed:
   ```bash
   npm install -g json-server
