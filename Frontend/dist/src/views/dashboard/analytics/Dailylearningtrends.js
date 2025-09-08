import Chart from 'react-apexcharts'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const lineColors = {
    series1: '#9570ec', // Purple
    series2: '#b2dd61', // Green
    series3: '#2bdac7', // Teal
    series4: '#f5a623', // Orange
    series5: '#ff6b6b', // Red
    series6: '#2b9bf4', // Blue
    series7: '#9C27B0'  // Violet
}

const ApexLineCharts = ({ direction }) => {
    const options = {
        chart: {
            type: 'line',
            height: 400,
            parentHeightOffset: 0,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            width: [5, 4, 3, 4, 3, 4, 5], // different line widths
            curve: 'smooth'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'start',
            tooltipHoverFormatter: function (val, opts) {
                return (
                    val +
                    ' - <strong>' +
                    opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                    '</strong>'
                )
            }
        },
        markers: {
            size: 0,
            hover: { sizeOffset: 6 }
        },
        grid: {
            borderColor: '#f1f1f1',
            xaxis: { lines: { show: true } }
        },
        colors: [
            lineColors.series1,
            lineColors.series2,
            lineColors.series3,
            lineColors.series4,
            lineColors.series5,
            lineColors.series6,
            lineColors.series7
        ],
        xaxis: {
            categories: ['Telugu', 'English', 'Maths', 'Science', 'Social', 'Hindi']
        },
        tooltip: {
            y: [
                {
                    title: {
                        formatter: val => val
                    }
                }
            ]
        },
        yaxis: {
            opposite: direction === 'rtl'
        }
    }

    const series = [
        { name: 'Sunday', data: [240, 220, 180, 270, 280, 375] },
        { name: 'Monday', data: [100, 120, 90, 170, 130, 160] },
        { name: 'Tuesday', data: [70, 110, 80, 100, 90, 180] },
        { name: 'Wednesday', data: [20, 40, 30, 70, 40, 60] },
        { name: 'Thursday', data: [40, 30, 70, 40, 60, 50] },
        { name: 'Friday', data: [140, 120, 100, 140, 180, 220] },
        { name: 'Saturday', data: [60, 50, 140, 120, 100, 140] }
    ]

    return (
        <Card>
            <CardHeader className='d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Weekly Learning Trends
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody>
                <Chart options={options} series={series} type='line' height={300} />
            </CardBody>
        </Card>
    )
}

export default ApexLineCharts
