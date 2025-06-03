
let isLogin = true;
let db = {
    user: [
        
    ],
    currentUser: null,
    task: {
        
    },
    theme :'Default',

}

let logForm = document.querySelector('.login')
let signupForm = document.querySelector('.signup')
let registerClick = document.querySelector('.register-click')
let alredyUserClick = document.querySelector('.already-user-click')
registerClick.addEventListener('click',function(e){
    e.preventDefault()
    logForm.classList.add('hidden')
    signupForm.classList.remove('hidden')
    isLogin = false;
    formFill()
    
})
alredyUserClick.addEventListener('click',function(e){
    e.preventDefault()
    logForm.classList.remove('hidden')
    signupForm.classList.add('hidden')
    isLogin = true;
})




function setTheme(database){
    if(database.theme == 'Default'){
        document.documentElement.style.setProperty('--secondary-color', 'rgba(0, 128, 0, 0.842)');
        document.documentElement.style.setProperty('--third-color', 'rgb(213, 6, 6)');
    }else{
        document.documentElement.style.setProperty('--secondary-color', `${database.theme}`); 
        document.documentElement.style.setProperty('--third-color', `${database.theme}`);   
    }
         
}

function loadDb() {
    let database = JSON.parse(localStorage.getItem('database'))
    if (database) {
        return database;
    }
    else{
        localStorage.setItem('database', JSON.stringify(db))
        formFill()
    }
}

function saveDb(database){
    localStorage.setItem('database',JSON.stringify(database))
}

function isCurrentUser(){
    let database = loadDb();
    if(database.currentUser){
        loadData()
        setTheme(database)
    }else{
        formFill()
    }
}

let signForm = document.querySelector('#signupForm')

function formFill() {
    
    taskList.innerHTML = ''
    let database = loadDb();
    setTheme(database)
    overlay.classList.remove('hidden')
    if (isLogin) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let name = loginForm.querySelector('.input-name')
            let loginPassword = loginForm.querySelector('.login-password')
            let nameError = loginForm.querySelector('.name-error')
            let passwordError = loginForm.querySelector('.password-error')
            !name.value ? nameError.textContent = 'Enter Name' : nameError.textContent = ''
            !loginPassword.value ? passwordError.textContent = 'Enter Password' : passwordError.textContent = ''
            if (name.value && loginPassword.value) {
    
                let foundUser = database.user.find(u=>u.name == name.value);
                if(foundUser){
                    if(foundUser.password == loginPassword.value){
                            overlay.classList.add('hidden')
                            database.currentUser = name.value
                            saveDb(database)
                            loadData()
                            updateBar(database)
                    }else{
                        passwordError.textContent = 'Wrong Password'
                    }
                }
                else{
                    nameError.textContent = 'Invalid Name'
                }
                
            }
    
        })
    }else{
        signForm.addEventListener('submit',function(e){
            e.preventDefault()
            let signName = signForm.querySelector('.sign-input-name')
            let signupPassword = signForm.querySelector('.signup-password')
            let confirmPassword = signForm.querySelector('.c-password')
            let signNameError = signForm.querySelector('.sign-name-error')
            let signPasswordError = signForm.querySelector('.sign-password-error')
            let confirmPasswordError = signForm.querySelector('.sign-c-password-error')
            !signName.value ? signNameError.textContent = 'Enter Name' : signNameError.textContent = ''
            !signupPassword.value ? signPasswordError.textContent = 'Enter Password' : signPasswordError.textContent = ''
            !(signupPassword.value == confirmPassword.value) ? confirmPasswordError.textContent = 'Password not match' : confirmPasswordError.textContent = ''
            if (signName.value && signupPassword.value == confirmPassword.value) {
    
                let foundUser = database.user.find(u=>u.name == signName.value);
                
                if(foundUser){
                    signNameError.textContent = 'Name already exists !'
                }
                else{
                   overlay.classList.add('hidden')
                   database.user.push({name:signName.value,password:confirmPassword.value})
                   database.task[signName.value] = [{ tid: idGenerate(), task: "", completed: false }]
                   database.currentUser = signName.value
                   saveDb(database)
                   loadData()
                   updateBar(database)
                }
                
            }else{

            }
            
        })
        
    }


}

function idGenerate() {
    let timeStamp = Date.now();
    let randomId = Math.floor(Math.random() * 100);
    let generatedId = `${timeStamp}${randomId}`;
    return generatedId;
}

function updateBar() {
    let database = loadDb();
    let totalTask = database.task[database.currentUser].length;
    let totalComplete = database.task[database.currentUser].filter(t => t.completed).length
    let taskComplete = document.querySelector('.task-complete')
    taskComplete.textContent = `${totalComplete}/${totalTask} Completed`
    let taskBar = document.querySelector('.taskbar')
    let s = (totalComplete * 100) / totalTask
    s = 100 - s
    taskBar.style.transform = `translateX(-${s}%)`;
}

function addTask() {
    let database = loadDb();
    let taskList = document.querySelector('.task-list');
     let task = document.createElement('div')
    task.classList.add('task')
    let id = idGenerate()
    task.id = id
    
    task.innerHTML = `<div class="checkbox border">
                    <input type="checkbox">
                    <span class=""><i class="ri-check-line"></i></span>
                </div>
                <div class="input-box">
                    <input type="text" class="task-input" placeholder=" Add one Task...">
                    <span class="delete"><i class="ri-delete-bin-5-line"></i></span>
                </div>`
    taskList.append(task)
    database.task[database.currentUser].push({ tid: id, task: "", completed: false })
    saveDb(database)
    updateBar()

}

function displayNameAndTime(database) {
    let displayName = document.querySelector('.display-name');
    let day = document.querySelector('.day');
    let date = document.querySelector('.date');
    displayName.textContent = database.currentUser
    let newDate = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let currentDay = newDate.getDay();
    day.textContent = `${days[currentDay]}, `
    let currentDate = newDate.getDate();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let currentMonth = newDate.getMonth();
    date.textContent = `${currentDate} ${months[currentMonth]}`
}

let overlay = document.querySelector('.overlay')
let loginForm = document.querySelector('#loginForm')

function loadData() {
    let database = loadDb()
        
        overlay.classList.add('hidden')
        displayNameAndTime(database)
        let taskList = document.querySelector('.task-list');
        taskList.innerHTML = ''
        database.task[database.currentUser].forEach(function (t) {
            
            let task = document.createElement('div')
            task.classList.add('task')
            task.id = t.tid
            task.innerHTML = `<div class="checkbox border">
                            <input type="checkbox">
                            <span class=""><i class="ri-check-line"></i></span>
                        </div>
                        <div class="input-box">
                            <input type="text" class="task-input" placeholder=" Add one Task..." value=${t.task}>
                            <span class="delete"><i class="ri-delete-bin-5-line"></i></span>
                        </div>`
    
            let checkbox = task.querySelector('.checkbox')
            let span = checkbox.querySelector('span')
            if (t.completed) {
                let inputBox = task.querySelector('input[type="text"]')
                inputBox.style.cssText += 'text-decoration:line-through ;color:var(--secondary-color)'
                span.classList.add('ticked')
                checkbox.classList.remove('border')
                inputBox.disabled = true;
            }
            taskList.append(task)

        })
    updateBar()
}



let taskList = document.querySelector('.task-list');
taskList.addEventListener('click', function (e) {
    let database = loadDb();
    if (e.target.closest('.checkbox')) {
        let checkbox = e.target.closest('.checkbox')
        let task = checkbox.closest('.task')
        let span = checkbox.querySelector('span')
        let inputBox = task.querySelector('input[type="text"]')
        let taskbarError = document.querySelector('.taskbar-error')
        if (checkbox.classList.contains('border')) {
            if (!inputBox.value) {
                taskbarError.textContent = 'Buddy, set your all goals !'
            } else {
                checkbox.classList.remove('border')
                span.classList.add('ticked')
                database.task[database.currentUser].forEach(function (t) {
                    if (t.tid == task.id) {
                        t.completed = true;
                        inputBox.style.cssText += 'text-decoration:line-through ;color:var(--secondary-color)'
                        inputBox.disabled = true;
                        taskbarError.textContent = ''
                        saveDb(database)
                        updateBar()
                    }
                })
            }

        }
        else {
            span.classList.remove('ticked')
            checkbox.classList.add('border')
            database.task[database.currentUser].forEach(function (t) {
                if (t.tid == task.id) {
                    t.completed = false;
                    inputBox.style.cssText += 'text-decoration:none ;color:black'
                    inputBox.disabled = false;
                    saveDb(database)
                    updateBar()
                }
            })
        }
    }
    if (e.target.closest('.delete')) {
        let task = e.target.closest('.task')
        let taskList = e.target.closest('.task-list')
        database.task[database.currentUser] = database.task[database.currentUser].filter(t => t.tid != task.id)
        saveDb(database)
        taskList.innerHTML = ''
        loadData();
    }
})


function updateTaskValue(e) {
    let database = loadDb();
    if (e.target.tagName == 'INPUT') {
        let task = e.target.closest('.task')
        database.task[database.currentUser].filter(t => t.tid == task.id).map(t => t.task = e.target.value)
       saveDb(database)

    }
}
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearInterval(timer);
        timer = setTimeout(function () {
            fn.apply(this, args)
        }, delay)
    }

}
let betterHandle = debounce(updateTaskValue, 300)

let logOut = document.querySelector('.logout')


logOut.addEventListener('click',function(){
    let database = loadDb();
    console.log(logOut);
    database.currentUser = null
    saveDb(database);
    taskList.innerHTML = ''
    location.reload();
})


window.addEventListener("DOMContentLoaded", function () {
    isCurrentUser()

})

let newTask = document.querySelector('.add-task');
newTask.addEventListener('click', function () {
    addTask()
})

taskList.addEventListener('keyup', betterHandle)

let passToggle = document.querySelectorAll('.pass-toggle')
passToggle.forEach(function(p){
    p.addEventListener('click',function(e){
        let database = loadDb()
        let passInput = e.target.previousElementSibling
        
        if (passInput.type == "text") {
            passInput.type = "password"
            e.target.style.color = 'black'
        }else{
            passInput.type = "text"
            e.target.style.color = database.theme
        }
    })
    
})
let colors = ['Default','red','green','blue','orange','brown','crimson','purple']

let themeContainer = document.querySelector('.theme-container')
let themeTitle = document.querySelector('.theme-title')
let brush = document.querySelector('.brush')
let themeBox = document.querySelector('.theme-box')

themeTitle.addEventListener('click',function(e){
    logOut.classList.toggle('handleZ')
    themeBox.classList.toggle('hidden')
    
})

function loadTheme(){
   colors.forEach(function (c) {
        themeBox.innerHTML += `<p class=${c}>${c}</p>`
   })
}
loadTheme()

let colorsElem = themeBox.querySelectorAll('p')
colorsElem.forEach(function(p){
    
    p.addEventListener('mouseenter',function(e){
        if (e.target.textContent == "Default") {
            e.target.style.cssText += `background-color:white;color:black;scale: 1;` 
            brush.style.color = 'black'        
        }else{
            e.target.style.cssText += `background-color:${e.target.textContent};color:white;scale: 1.4;` 
            brush.style.color = e.target.textContent
        }
       
    })
    p.addEventListener('mouseleave',function(e){
        e.target.style.cssText += `background-color:white;color:black;scale: 1;` 
        brush.style.color = 'black'        
    })
    p.addEventListener('click',function (e) {
        let database = loadDb();
        if(e.target.textContent == 'Default'){
            document.documentElement.style.setProperty('--secondary-color', 'rgba(0, 128, 0, 0.842)');
            document.documentElement.style.setProperty('--third-color', 'rgb(213, 6, 6)');
        }
       else{
        document.documentElement.style.setProperty('--secondary-color', `${e.target.textContent}`); 
        document.documentElement.style.setProperty('--third-color', `${e.target.textContent }`);    
       }   
       themeBox.classList.add('hidden')
       logOut.classList.add('handleZ')
       database.theme = e.target.textContent
       saveDb(database)
    })
})
