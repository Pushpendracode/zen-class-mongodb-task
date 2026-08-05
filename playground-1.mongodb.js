/* global use, db */
// ==========================================
// ZEN CLASS PROGRAMME - MongoDB Task
// ==========================================

use('zen_class_db');

// ------------------------------------------
// STEP 1: Clean up old data (safe to re-run)
// ------------------------------------------
db.getCollection('users').drop();
db.getCollection('codekata').drop();
db.getCollection('attendance').drop();
db.getCollection('topics').drop();
db.getCollection('tasks').drop();
db.getCollection('company_drives').drop();
db.getCollection('mentors').drop();

// ------------------------------------------
// STEP 2: Insert MENTORS
// ------------------------------------------
db.getCollection('mentors').insertMany([
  { _id: ObjectId('64a000000000000000000001'), name: 'Ravi Sharma', mentee_count: 18 },
  { _id: ObjectId('64a000000000000000000002'), name: 'Anita Verma', mentee_count: 12 },
  { _id: ObjectId('64a000000000000000000003'), name: 'Suresh Iyer', mentee_count: 20 },
]);

// ------------------------------------------
// STEP 3: Insert USERS
// ------------------------------------------
db.getCollection('users').insertMany([
  { _id: ObjectId('64b000000000000000000001'), name: 'Pushpendra', email: 'push@example.com', mentor_id: ObjectId('64a000000000000000000001') },
  { _id: ObjectId('64b000000000000000000002'), name: 'Amit Kumar', email: 'amit@example.com', mentor_id: ObjectId('64a000000000000000000001') },
  { _id: ObjectId('64b000000000000000000003'), name: 'Sneha Patel', email: 'sneha@example.com', mentor_id: ObjectId('64a000000000000000000002') },
  { _id: ObjectId('64b000000000000000000004'), name: 'Rahul Singh', email: 'rahul@example.com', mentor_id: ObjectId('64a000000000000000000003') },
]);

// ------------------------------------------
// STEP 4: Insert CODEKATA (problems solved)
// ------------------------------------------
db.getCollection('codekata').insertMany([
  { user_id: ObjectId('64b000000000000000000001'), problems_solved: 145 },
  { user_id: ObjectId('64b000000000000000000002'), problems_solved: 98 },
  { user_id: ObjectId('64b000000000000000000003'), problems_solved: 210 },
  { user_id: ObjectId('64b000000000000000000004'), problems_solved: 60 },
]);

// ------------------------------------------
// STEP 5: Insert TOPICS (taught in Oct 2020)
// ------------------------------------------
db.getCollection('topics').insertMany([
  { _id: ObjectId('64c000000000000000000001'), topic_name: 'Express Routing', taught_date: new Date('2020-10-05'), mentor_id: ObjectId('64a000000000000000000001') },
  { _id: ObjectId('64c000000000000000000002'), topic_name: 'MongoDB Aggregation', taught_date: new Date('2020-10-16'), mentor_id: ObjectId('64a000000000000000000002') },
  { _id: ObjectId('64c000000000000000000003'), topic_name: 'React Hooks', taught_date: new Date('2020-09-25'), mentor_id: ObjectId('64a000000000000000000003') },
]);

// ------------------------------------------
// STEP 6: Insert TASKS
// ------------------------------------------
db.getCollection('tasks').insertMany([
  { task_name: 'Build REST API', topic_id: ObjectId('64c000000000000000000001'), assigned_date: new Date('2020-10-06'), user_id: ObjectId('64b000000000000000000001'), submitted: true },
  { task_name: 'Aggregation Practice', topic_id: ObjectId('64c000000000000000000002'), assigned_date: new Date('2020-10-17'), user_id: ObjectId('64b000000000000000000002'), submitted: false },
  { task_name: 'Hooks Assignment', topic_id: ObjectId('64c000000000000000000003'), assigned_date: new Date('2020-09-26'), user_id: ObjectId('64b000000000000000000003'), submitted: true },
  { task_name: 'Aggregation Extra', topic_id: ObjectId('64c000000000000000000002'), assigned_date: new Date('2020-10-20'), user_id: ObjectId('64b000000000000000000003'), submitted: false },
]);

// ------------------------------------------
// STEP 7: Insert ATTENDANCE
// ------------------------------------------
db.getCollection('attendance').insertMany([
  { user_id: ObjectId('64b000000000000000000001'), date: new Date('2020-10-17'), status: 'Present' },
  { user_id: ObjectId('64b000000000000000000002'), date: new Date('2020-10-17'), status: 'Absent' },
  { user_id: ObjectId('64b000000000000000000003'), date: new Date('2020-10-20'), status: 'Absent' },
  { user_id: ObjectId('64b000000000000000000004'), date: new Date('2020-10-20'), status: 'Present' },
]);

// ------------------------------------------
// STEP 8: Insert COMPANY DRIVES
// ------------------------------------------
db.getCollection('company_drives').insertMany([
  {
    company_name: 'TCS',
    drive_date: new Date('2020-10-18'),
    students_appeared: [ObjectId('64b000000000000000000001'), ObjectId('64b000000000000000000002')],
    students_selected: [ObjectId('64b000000000000000000001')]
  },
  {
    company_name: 'Infosys',
    drive_date: new Date('2020-10-25'),
    students_appeared: [ObjectId('64b000000000000000000003'), ObjectId('64b000000000000000000004')],
    students_selected: []
  },
  {
    company_name: 'Wipro',
    drive_date: new Date('2020-09-10'),
    students_appeared: [ObjectId('64b000000000000000000001')],
    students_selected: [ObjectId('64b000000000000000000001')]
  },
]);

console.log('Dummy data inserted successfully!');

// ==========================================
// QUERY 1: Topics and Tasks taught in October
// ==========================================
const octTopics = db.getCollection('topics').find({
  taught_date: { $gte: new Date('2020-10-01'), $lte: new Date('2020-10-31T23:59:59') }
}).toArray();
console.log('Q1 - October Topics:', octTopics);

const octTasks = db.getCollection('tasks').find({
  assigned_date: { $gte: new Date('2020-10-01'), $lte: new Date('2020-10-31T23:59:59') }
}).toArray();
console.log('Q1 - October Tasks:', octTasks);

// ==========================================
// QUERY 2: Company drives between 15 Oct - 31 Oct 2020
// ==========================================
const drivesInRange = db.getCollection('company_drives').find({
  drive_date: { $gte: new Date('2020-10-15'), $lte: new Date('2020-10-31T23:59:59') }
}).toArray();
console.log('Q2 - Drives 15-31 Oct:', drivesInRange);

// ==========================================
// QUERY 3: Company drives + students who appeared
// ==========================================
const drivesWithStudents = db.getCollection('company_drives').aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'students_appeared',
      foreignField: '_id',
      as: 'appeared_students'
    }
  },
  {
    $project: {
      company_name: 1,
      drive_date: 1,
      'appeared_students.name': 1,
      'appeared_students.email': 1
    }
  }
]).toArray();
console.log('Q3 - Drives with appeared students:', drivesWithStudents);

// ==========================================
// QUERY 4: Number of problems solved by each user in codekata
// ==========================================
const problemsSolved = db.getCollection('codekata').aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user_info'
    }
  },
  { $unwind: '$user_info' },
  {
    $project: {
      _id: 0,
      user_name: '$user_info.name',
      problems_solved: 1
    }
  }
]).toArray();
console.log('Q4 - Problems solved per user:', problemsSolved);

// ==========================================
// QUERY 5: Mentors with mentee count > 15
// ==========================================
const topMentors = db.getCollection('mentors').find({
  mentee_count: { $gt: 15 }
}).toArray();
console.log('Q5 - Mentors with >15 mentees:', topMentors);

// ==========================================
// QUERY 6: Number of users absent AND task not submitted (15-31 Oct 2020)
// ==========================================
const result = db.getCollection('attendance').aggregate([
  {
    $match: {
      status: 'Absent',
      date: { $gte: new Date('2020-10-15'), $lte: new Date('2020-10-31T23:59:59') }
    }
  },
  {
    $lookup: {
      from: 'tasks',
      let: { uid: '$user_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$user_id', '$$uid'] },
                { $eq: ['$submitted', false] },
                { $gte: ['$assigned_date', new Date('2020-10-15')] },
                { $lte: ['$assigned_date', new Date('2020-10-31T23:59:59')] }
              ]
            }
          }
        }
      ],
      as: 'unsubmitted_tasks'
    }
  },
  {
    $match: { 'unsubmitted_tasks.0': { $exists: true } }
  },
  {
    $count: 'totalUsers'
  }
]).toArray();

const count = result.length > 0 ? result[0].totalUsers : 0;
console.log('Q6 - Number of users absent AND task not submitted:', count);