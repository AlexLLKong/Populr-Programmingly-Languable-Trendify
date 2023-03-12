const generateWeekDates = () => {
    const current = new Date()
    const target = 1000 * 60 * 60 * 24 * 7
    const diff = current - target
    const result = new Date(diff)
    const str = "?time=2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}

const generateMonthDates = () => {
    const current = new Date()
    const target = 1000 * 60 * 60 * 24 * 30
    const diff = current - target
    const result = new Date(diff)
    const str = "?time=2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}

const generateThreeMonthDates = () => {
    const current = new Date()
    const target = 1000 * 60 * 60 * 24 * 90
    const diff = current - target
    const result = new Date(diff)
    const str = "?time=2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}

const generateYearDates = () => {
    const current = new Date()
    const target = 1000 * 60 * 60 * 24 * 365
    const diff = current - target
    const result = new Date(diff)
    const str = "?time=2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}

const generateFiveYearDates = () => {
    const current = new Date()
    const target = 1000 * 60 * 60 * 24 * 365 * 5
    const diff = current - target
    const result = new Date(diff)
    const str = "?time=2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}

const generateTenYearDates = () => {
    const current = new Date()
    const target = 1000 * 60 * 60 * 24 * 365 * 10
    const diff = current - target
    const result = new Date(diff)
    const str = "?time=2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}

const generateOldestGoogleDates = () => {
    // 2014-02-11 in milliseconds
    const result = new Date(1076457600000)
    const str = "?time=2004-02-11%2F2004-02-11%2F" + result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate()
    window.location.href = "/compare" + str
}