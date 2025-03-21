# Student Fees Management System
A web-based application for managing university student fees, built with Node.js, Express, and Supabase as a Storage as a Service (STaaS) solution. Deployed on Render’s free tier, this project allows admins to add students and record payments, while students can check their fee status (total, paid, and outstanding amounts). Supabase provides cloud-hosted PostgreSQL storage, demonstrating STaaS principles like scalability and accessibility.

## Features

- Add new students with details (ID, name, email, total fees).
- Record payments linked to existing students.
- View fee status for any student via a simple web interface.
- Error handling for invalid inputs or missing student records.
  
## Tech Stack

- Frontend: HTML, JavaScript
- Backend: Node.js, Express
- Storage: Supabase (PostgreSQL as STaaS)
- Hosting: Render (free tier)
- Dependencies: express, @supabase/supabase-js

## Purpose

Created as part of Cloud Computing Assignment No. 3 to study and implement Storage as a Service. Supabase serves as the primary STaaS provider, with potential extensions to AWS S3, Glacier, or Azure Storage explored conceptually.

## Setup

- Clone the repo: git clone https://github.com/Prathamesh282/student-fees.git
- Install dependencies: npm install
- Set environment variables: SUPABASE_URL and SUPABASE_KEY (from your Supabase project).
- Run locally: npm start
- Deploy to Render with GitHub integration.

## Live Demo

Access the deployed app at: https://student-fees.onrender.com
