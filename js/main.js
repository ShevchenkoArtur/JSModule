const eventCalendar = new EventCalendar()

const h1 = document.querySelector('h1')
const dateSpan = document.createElement('span')
dateSpan.innerText = eventCalendar.getTodayDate()
h1.append(dateSpan)

addBtn = document.querySelector(`#addBtn`)

eventCalendar.createTimeTable()
eventCalendar.renderTasks()

addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    eventCalendar.addTask()
})

const table = document.querySelector('#timeTable')
const events = document.querySelectorAll('.event')


table.addEventListener('click', (e) => {
    const target = e.target
    if (target.tagName === 'TABLE') return
    if (target.classList.value === 'delete-marker') eventCalendar.deleteTask(target.id)
})








