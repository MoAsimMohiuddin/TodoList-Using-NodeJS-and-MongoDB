const express=require("express");
const body_parser=require("body-parser");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

const d=new Date();

const days=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

let corrDay=days[d.getUTCDay()];
let corrMonth=months[d.getUTCMonth(months)];
let corrDate=d.getUTCDate();

mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');

function addTaskToTodayList(taskToAdd) {
    const todaySchema=new mongoose.Schema({
        task: String
    });

    const model=mongoose.models.todaysTasks || mongoose.model('todaysTasks', todaySchema);

    const doc=new model({
        task: taskToAdd
    });

    doc.save();
}

function addTaskToWorkList(taskToAdd) {
    const workSchema=new mongoose.Schema({
        task: String
    });

    const model=mongoose.models.workTasks || mongoose.model('workTasks', workSchema);

    const doc=new model({
        task: taskToAdd
    });

    doc.save();
}

async function findTodayTasks() {
    const todaySchema=new mongoose.Schema({
        task: String
    });

    const model=mongoose.models.todaysTasks || mongoose.model('todaysTasks', todaySchema);
    const tasks=await model.find({}, {task:1, _id:0});

    return tasks;
}

async function findWorkTasks() {
    const workSchema=new mongoose.Schema({
        task: String
    });

    const model=mongoose.models.workTasks || mongoose.model('workTasks', workSchema);
    const works=await model.find({}, {task:1, _id:0});

    return works;
}

let tasks=new Set();
app.get("/", (req, res)=>{
    const todaySchema=new mongoose.Schema({
        task: String
    });
    const model=mongoose.models.todaysTasks || mongoose.model('todaysTasks', todaySchema);

    let todayTasks;

    findTodayTasks().then((tasks)=>{
        todayTasks=tasks;

        res.render(__dirname+"/views/today.ejs", 
        {
            taskArray: todayTasks,
            day:corrDay,
            month: corrMonth,
            date: corrDate
        });
    })
})

let works=new Set();
app.get("/work", (req, res)=>{
    const workSchema=new mongoose.Schema({
        task: String
    });
    const model=mongoose.models.workTasks || mongoose.model('workTasks', workSchema);

    let workTasks;

    findWorkTasks().then((tasks)=>{
        workTasks=tasks;
        res.render(__dirname+"/views/work.ejs", 
        {
            workArray: workTasks,
            day:corrDay,
            month: corrMonth,
            date: corrDate
        });
    })
})

app.post("/", (req, res)=>{
    const todaySchema=new mongoose.Schema({
        task: String
    });
    const model=mongoose.models.todaysTasks || mongoose.model('todaysTasks', todaySchema);
    if(req.body.task!=""){
        addTaskToTodayList(req.body.task);
    }

    let todayTasks;

    findTodayTasks().then((tasks)=>{
        todayTasks=tasks;

        res.render(__dirname+"/views/today.ejs", 
        {
            taskArray: todayTasks,
            day:corrDay,
            month: corrMonth,
            date: corrDate
        });
    })
})

app.post("/work", (req, res)=>{
    const workSchema=new mongoose.Schema({
        task: String
    });
    const model=mongoose.models.workTasks || mongoose.model('workTasks', workSchema);
    if(req.body.work!=""){
        addTaskToWorkList(req.body.work);
    }

    let workTasks;

    findWorkTasks().then((tasks)=>{
        workTasks=tasks;

        res.render(__dirname+"/views/work.ejs", 
        {
            workArray: workTasks,
            day:corrDay,
            month: corrMonth,
            date: corrDate
        });
    })
})

app.listen(3000, ()=>{
    console.log("Listening on Port 3000")
})