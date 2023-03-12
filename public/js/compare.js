let charts = {}
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

const selectAllTime = () => {
	loadChart(0)
}

const selectOneYear = () => {
	loadChart(1)
}

const selectFiveYears = () => {
	loadChart(2)
}

const loadChart = async function(period) {
	// TODO: Only load the charts once
	const response = await fetch("/3wayCharts")
	charts = await response.json()
	let selectedChart
	if (period === 0) {
		selectedChart = JSON.parse(charts.allTime)
	} else if (period === 1) {
		selectedChart = JSON.parse(charts.oneYear)
	} else {
		selectedChart = JSON.parse(charts.fiveYears)
	}
	const timeArray = selectedChart.default.timelineData.map(point => new Date(parseInt(point.time * 1000)))
	const pythonPoints = selectedChart.default.timelineData.map(point => point.value[0])
	const cPoints = selectedChart.default.timelineData.map(point => point.value[1])
	const cppPoints = selectedChart.default.timelineData.map(point => point.value[2])
	const chart = c3.generate({
		bindto: '#chart',
		data: {
			x: 'x',
		  columns: [
			['x', ...timeArray],
			['Python', ...pythonPoints],
			['C', ...cPoints],
			['C++', ...cppPoints]
		  ]
		},
		axis: {
			x: {
				type: 'timeseries',
				tick: {
					format: '%Y-%m-%d'
				}
			}
		}
	});
	
}
selectAllTime()
