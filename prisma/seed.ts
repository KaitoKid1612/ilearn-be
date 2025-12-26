import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👤 Creating users...');
  
  // Admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ilearn.com',
      password: await hashPassword('Admin@123'),
      name: 'Admin User',
      role: 'ADMIN',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  });

  // Regular users
  const user1 = await prisma.user.create({
    data: {
      email: 'leviet1612@gmail.com',
      password: await hashPassword('Viet1234'),
      name: 'Lê Việt',
      role: 'USER',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: await hashPassword('User@123'),
      name: 'John Doe',
      role: 'USER',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: await hashPassword('User@123'),
      name: 'Jane Smith',
      role: 'USER',
      avatar: 'https://i.pravatar.cc/150?img=44',
    },
  });

  console.log(`✅ Created ${4} users`);

  // Create courses
  console.log('📚 Creating courses...');

  const course1 = await prisma.course.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming language from scratch',
      content: `# JavaScript Fundamentals

This comprehensive course will teach you everything you need to know about JavaScript, from variables and data types to advanced concepts like closures and async/await.

## What you'll learn:
- Variables, data types, and operators
- Functions and scope
- Arrays and objects
- DOM manipulation
- ES6+ features
- Async programming

Perfect for beginners who want to start their web development journey!`,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
      isPublic: true,
      authorId: admin.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'React for Beginners',
      description: 'Build modern web applications with React',
      content: `# React for Beginners

Master React.js and build dynamic, interactive web applications. This course covers components, hooks, state management, and more.

## Course Content:
- React components and JSX
- State and Props
- React Hooks (useState, useEffect, etc.)
- Context API
- React Router
- Best practices

Get ready to build amazing user interfaces!`,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      isPublic: true,
      authorId: admin.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Node.js Backend Development',
      description: 'Create powerful backend APIs with Node.js and Express',
      content: `# Node.js Backend Development

Learn to build scalable backend applications using Node.js, Express, and modern development practices.

## Topics Covered:
- Node.js fundamentals
- Express.js framework
- RESTful API design
- Database integration (MongoDB, PostgreSQL)
- Authentication & Authorization
- Error handling
- Testing

Build production-ready APIs!`,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      isPublic: true,
      authorId: admin.id,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'Python for Data Science',
      description: 'Analyze data and build ML models with Python',
      content: `# Python for Data Science

Dive into data science with Python! Learn pandas, numpy, matplotlib, and scikit-learn.

## What You'll Master:
- Python basics
- NumPy for numerical computing
- Pandas for data manipulation
- Data visualization
- Machine Learning basics
- Real-world projects

Start your data science journey today!`,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
      isPublic: true,
      authorId: user2.id,
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: 'Flutter Mobile Development',
      description: 'Build beautiful cross-platform mobile apps',
      content: `# Flutter Mobile Development

Create stunning mobile applications for iOS and Android with a single codebase using Flutter and Dart.

## Course Outline:
- Dart programming language
- Flutter widgets
- State management (Provider, Riverpod)
- Navigation and routing
- API integration
- Firebase integration
- Publishing apps

Build your first mobile app!`,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
      isPublic: true,
      authorId: user2.id,
    },
  });

  console.log(`✅ Created ${5} courses`);

  // Create lessons for Course 1 (JavaScript)
  console.log('📝 Creating lessons...');

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction to JavaScript',
        content: `# Introduction to JavaScript

JavaScript is a versatile programming language that powers the modern web.

## History
Created in 1995, JavaScript has evolved into one of the most popular languages.

## Uses
- Web development
- Mobile apps
- Server-side programming
- Game development

Let's start learning!`,
        order: 1,
        courseId: course1.id,
        duration: 15,
      },
      {
        title: 'Variables and Data Types',
        content: `# Variables and Data Types

Learn how to store and manipulate data in JavaScript.

## Variable Declaration
\`\`\`javascript
let name = "John";
const age = 25;
var city = "New York";
\`\`\`

## Data Types
- String
- Number
- Boolean
- Object
- Array
- Null and Undefined

Practice creating variables!`,
        order: 2,
        courseId: course1.id,
        duration: 20,
      },
      {
        title: 'Functions in JavaScript',
        content: `# Functions

Functions are reusable blocks of code.

## Function Declaration
\`\`\`javascript
function greet(name) {
  return "Hello " + name;
}
\`\`\`

## Arrow Functions
\`\`\`javascript
const greet = (name) => "Hello " + name;
\`\`\`

Functions make code organized and reusable!`,
        order: 3,
        courseId: course1.id,
        duration: 25,
      },
    ],
  });

  // Create lessons for Course 2 (React)
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Getting Started with React',
        content: `# Getting Started with React

React is a JavaScript library for building user interfaces.

## Why React?
- Component-based architecture
- Virtual DOM for performance
- Rich ecosystem
- Large community

Let's build something amazing!`,
        order: 1,
        courseId: course2.id,
        duration: 10,
      },
      {
        title: 'React Components',
        content: `# React Components

Components are the building blocks of React apps.

## Functional Components
\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

Components make UI development easier!`,
        order: 2,
        courseId: course2.id,
        duration: 30,
      },
    ],
  });

  // Create lessons for Course 3 (Node.js)
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Node.js Basics',
        content: `# Node.js Basics

Node.js is a JavaScript runtime built on Chrome's V8 engine.

## Key Features
- Event-driven
- Non-blocking I/O
- NPM package manager

Perfect for building scalable applications!`,
        order: 1,
        courseId: course3.id,
        duration: 15,
      },
      {
        title: 'Express.js Framework',
        content: `# Express.js Framework

Express is a minimal web framework for Node.js.

## Creating a Server
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
\`\`\`

Build APIs quickly!`,
        order: 2,
        courseId: course3.id,
        duration: 25,
      },
    ],
  });

  console.log(`✅ Created lessons for courses`);

  // Create enrollments
  console.log('🎓 Creating enrollments...');

  // User1 enrolls in courses 1, 2, 3
  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      courseId: course1.id,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      courseId: course2.id,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      courseId: course3.id,
    },
  });

  // User3 enrolls in courses 4, 5
  await prisma.enrollment.create({
    data: {
      userId: user3.id,
      courseId: course4.id,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: user3.id,
      courseId: course5.id,
    },
  });

  console.log(`✅ Created enrollments`);

  // Create progress for user1
  console.log('📊 Creating progress records...');

  const course1Lessons = await prisma.lesson.findMany({
    where: { courseId: course1.id },
    take: 2,
  });

  // User1 completed first 2 lessons of course 1
  for (const lesson of course1Lessons) {
    await prisma.progress.create({
      data: {
        userId: user1.id,
        lessonId: lesson.id,
        isCompleted: true,
        timeSpent: 900, // 15 minutes in seconds
      },
    });
  }

  console.log(`✅ Created progress records`);

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Accounts created:');
  console.log('   Admin: admin@ilearn.com / Admin@123');
  console.log('   User 1: leviet1612@gmail.com / Viet1234');
  console.log('   User 2: john.doe@example.com / User@123');
  console.log('   User 3: jane.smith@example.com / User@123');
  console.log('');
  console.log('📚 5 courses created');
  console.log('📝 7 lessons created');
  console.log('🎓 5 enrollments created');
  console.log('📊 2 progress records created');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
