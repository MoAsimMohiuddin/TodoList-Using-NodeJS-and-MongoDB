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
    const tasks=await model.find();

    return tasks;
}

async function findWorkTasks() {
    const workSchema=new mongoose.Schema({
        task: String
    });

    const model=mongoose.models.workTasks || mongoose.model('workTasks', workSchema);
    const works=await model.find();

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
        // console.log("Today Tasks Before updating");
        // console.log(todayTasks);
        todayTasks=updateTasks(todayTasks);

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
        // console.log("Today Tasks Before updating");
        // console.log(todayTasks);
        workTasks=updateTasks(workTasks);

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
        // tasks.add(req.body.task);
        addTaskToTodayList(req.body.task);
    }

    let todayTasks;

    findTodayTasks().then((tasks)=>{
        todayTasks=tasks;
        // console.log("Today Tasks Before updating");
        // console.log(todayTasks);
        todayTasks=updateTasks(todayTasks);

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
        // tasks.add(req.body.task);
        addTaskToWorkList(req.body.work);
    }

    let workTasks;

    findWorkTasks().then((tasks)=>{
        workTasks=tasks;
        // console.log("Today Tasks Before updating");
        // console.log(todayTasks);
        workTasks=updateTasks(workTasks);

        res.render(__dirname+"/views/work.ejs", 
        {
            workArray: workTasks,
            day:corrDay,
            month: corrMonth,
            date: corrDate
        });
    })
})

function updateTasks(tasks) {
    let newList=[];

    // console.log("Today Tasks In function");
    // console.log(todayTaskss);
    tasks.forEach((value)=>{
        let newObj={};

        newObj.task=value.task;

        newList.push(newObj);
    });

    // for(let value of todayTaskss) {
    //     let newObj={};
    //     newObj.task=value.task;

    //     newList.push(newObj);
    // }

    // console.log("New List");
    // console.log(newList);

    return newList;
}

app.listen(3000, ()=>{
    console.log("Listening on Port 3000")
})