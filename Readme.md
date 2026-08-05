# Zen Class Programme - MongoDB Task

This repository contains the database design and MongoDB queries for the Zen Class Programme assessment, covering user management, attendance tracking, coding practice (CodeKata), topics, tasks, company placement drives, and mentor management.

## Collections

- **users** — student profile info, linked to a mentor
- **codekata** — number of problems solved per user
- **attendance** — daily attendance status per user
- **topics** — topics taught, with date and mentor
- **tasks** — tasks assigned per topic, with submission status
- **company_drives** — placement drives with appeared/selected students
- **mentors** — mentor info with mentee count

## Schema Overview

```javascript
// users
{
  _id: ObjectId,
  name: String,
  email: String,
  mentor_id: ObjectId // ref mentors
}

// codekata
{
  user_id: ObjectId,      // ref users
  problems_solved: Number
}

// attendance
{
  user_id: ObjectId,      // ref users
  date: Date,
  status: String          // "Present" | "Absent"
}

// topics
{
  topic_name: String,
  taught_date: Date,
  mentor_id: ObjectId      // ref mentors
}

// tasks
{
  task_name: String,
  topic_id: ObjectId,      // ref topics
  assigned_date: Date,
  user_id: ObjectId,       // ref users
  submitted: Boolean
}

// company_drives
{
  company_name: String,
  drive_date: Date,
  students_appeared: [ObjectId],  // ref users
  students_selected: [ObjectId]   // ref users
}

// mentors
{
  name: String,
  mentee_count: Number
}
```

## Task Questions & Queries

### 1. Topics and tasks taught in October
```javascript
db.getCollection('topics').find({
  taught_date: { $gte: new Date('2020-10-01'), $lte: new Date('2020-10-31T23:59:59') }
});

db.getCollection('tasks').find({
  assigned_date: { $gte: new Date('2020-10-01'), $lte: new Date('2020-10-31T23:59:59') }
});
```

### 2. Company drives between 15 Oct 2020 and 31 Oct 2020
```javascript
db.getCollection('company_drives').find({
  drive_date: { $gte: new Date('2020-10-15'), $lte: new Date('2020-10-31T23:59:59') }
});
```

### 3. Company drives and students who appeared
```javascript
db.getCollection('company_drives').aggregate([
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
]);
```

### 4. Number of problems solved by each user in CodeKata
```javascript
db.getCollection('codekata').aggregate([
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
]);
```

### 5. Mentors with mentee count greater than 15
```javascript
db.getCollection('mentors').find({
  mentee_count: { $gt: 15 }
});
```

### 6. Number of users absent AND task not submitted (15-31 Oct 2020)
```javascript
db.getCollection('attendance').aggregate([
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
  { $count: 'totalUsers' }
]);
```

## How to Run

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) or use MongoDB Atlas.
2. Open this project in VS Code with the **MongoDB for VS Code** extension.
3. Connect to your MongoDB instance (`mongodb://localhost:27017/` for local).
4. Open `playground-1.mongodb.js`.
5. Run the full file to insert dummy data and execute all 6 queries.
6. View results in the **Output** panel.

## Tech Stack

- MongoDB
- VS Code MongoDB Playground

## Author

**Pushpendra** ([Pushpendracode](https://github.com/Pushpendracode))