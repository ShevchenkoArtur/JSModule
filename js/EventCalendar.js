class EventCalendar {
    static addZeroForTime(value) {
        return value.toString().padStart(2, '0')
    }

    static getFormatTime(mins) {
        mins += 480
        let hours = Math.trunc(mins / 60)
        let minutes = mins % 60
        return `${EventCalendar.addZeroForTime(hours)}:${EventCalendar.addZeroForTime(minutes)}`
    }

    static parseFormatTime(time) {
        const [hrs, mins] = time.split(':')
        return (Number(hrs) - 8) * 60 + Number(mins)
    }

    static convertTimePoint(timePoint) {
        return Number(timePoint.childNodes[1].textContent)
    }

    static removeEvents() {
        const events = document.querySelectorAll('.event')
        events.forEach(el => el.remove())
    }

    static hexToRGB(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        if (alpha) {
            return `rgba(${r}, ${g}, ${b}, ${alpha})`
        } else {
            return `rgba(${r}, ${g}, ${b})`
        }
    }

    static showNotification(title, msg) {
        const notification = document.querySelector('.notification')
        const namePara = document.createElement('p')
        const msgPara = document.createElement('p')

        namePara.innerText = title
        msgPara.innerText = msg
        notification.append(namePara, msgPara)

        notification.classList.remove('hide-notification')
        notification.classList.add('show-notification')

        setTimeout(() => {
            notification.classList.remove('show-notification')
            notification.classList.add('hide-notification')
        }, 3000)
    }

    static setNotificationTimeout(startTime, title) {
        const date = new Date()
        startTime += 480
        let currentTime = EventCalendar.parseFormatTime(`${EventCalendar.addZeroForTime(date.getHours())}:${EventCalendar.addZeroForTime(date.getMinutes())}`)

        if (currentTime < startTime) {
            startTime *= 60000
            currentTime *= 60000
            let showingTime = startTime - currentTime
            let msg = 'Has been started'
            title = `Event - ${title}`
            setTimeout(() => EventCalendar.showNotification(title, msg), showingTime)
        }
    }

    static id = 10

    static tasks = [
        {id: 1, start: 0, duration: 15, title: 'Exercise', color: '#6e9ecf'},
        {id: 2, start: 25, duration: 30, title: 'Travel to work', color: '#6e9ecf'},
        {id: 3, start: 30, duration: 30, title: 'Plan day', color: '#6e9ecf'},
        {id: 4, start: 60, duration: 15, title: 'Review yesterday\'s commits', color: '#6e9ecf'},
        {id: 5, start: 100, duration: 15, title: 'Code review', color: '#6e9ecf'},
        {id: 6, start: 180, duration: 90, title: 'Have lunch with John', color: '#6e9ecf'},
        {id: 7, start: 360, duration: 30, title: 'Skype call', color: '#6e9ecf'},
        {id: 8, start: 370, duration: 45, title: 'Follow up with designer', color: '#6e9ecf'},
        {id: 9, start: 405, duration: 30, title: 'Push up branch', color: '#6e9ecf'},
    ]

    getTodayDate() {
        const date = new Date()

        const daysOfWeek = {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'}

        const months = {
            0: 'Jan',
            1: 'Feb',
            2: 'Mar',
            3: 'Apr',
            4: 'May',
            5: 'Jun',
            6: 'Jul',
            7: 'Aug',
            8: 'Sep',
            9: 'Oct',
            10: 'Nov',
            11: 'Dec'
        }

        return `${daysOfWeek[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
    }

    createTimeTable() {
        const main = document.querySelector('#main')
        const table = document.createElement('table')
        table.id = 'timeTable'

        for (let i = 0; i <= 540; i++) {
            const tr = document.createElement('tr')
            const td = document.createElement('td')
            const span = document.createElement('span')

            td.append(EventCalendar.getFormatTime(i))
            td.setAttribute('width', '200')
            span.append(i.toString())
            span.classList.add('d-none')

            if (i % 30) {
                td.classList.add('d-none')
            }

            if (!(i % 60)) {
                td.classList.add('bigTime')
            }

            if (!(i % 30) && (i % 60)) {
                td.classList.add('smallTime')
            }

            tr.append(td)
            tr.append(span)
            table.append(tr)
        }

        main.append(table)
    }

    addEvent() {
        let titleInput = document.querySelector('#titleInput')
        let startInput = document.querySelector('#startInput')
        let durationInput = document.querySelector('#durationInput')
        let colorInput = document.querySelector('#colorInput')

        if (titleInput.value && startInput.value) {
            EventCalendar.tasks.push({
                id: EventCalendar.id++,
                title: titleInput.value,
                start: EventCalendar.parseFormatTime(startInput.value),
                duration: Number(durationInput.value),
                color: colorInput.value
            })
        }

        this.renderEvents()
    }

    deleteEvent(id) {
        EventCalendar.tasks = EventCalendar.tasks.filter(el => el.id !== Number(id))
        this.renderEvents()
    }

    renderEvents() {
        const timePoints = Array.from(document.querySelector('#timeTable').childNodes)

        EventCalendar.removeEvents()

        if (EventCalendar.tasks.length) {
            EventCalendar.tasks.map(el => {
                const timePointIndex = timePoints.findIndex(item => EventCalendar.convertTimePoint(item) === el.start)

                if (timePointIndex === el.start) {

                    if (timePointIndex % 30) {
                        const eventTime = timePoints[timePointIndex].childNodes[0]
                        eventTime.classList.remove('d-none')
                        eventTime.classList.add('v-hidden')
                    }

                    const td = document.createElement('td')
                    const span = document.createElement('span')
                    td.innerText = el.title
                    td.classList.add('event')
                    td.setAttribute('style',
                        `background-color: ${EventCalendar.hexToRGB(el.color, 0.5)}; border-left: 3px solid ${el.color}`)
                    span.classList.add('delete-marker')
                    span.id = el.id

                    if (!el.duration) {
                        el.duration = 1
                    }

                    EventCalendar.setNotificationTimeout(el.start, el.title)

                    td.setAttribute('rowspan', el.duration)
                    td.append(span)
                    timePoints[timePointIndex].append(td)
                } else {
                    console.log('Время ограничено с 08 до 17')
                }
            })
        }
    }
}