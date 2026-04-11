import { registerLicense } from '@syncfusion/ej2-base';
registerLicense("Ngo9BigBOggjHTQxAR8/V1JHaF5cWWdCekx3Qnxbf1x2ZFZMZV1bRHFPIiBoS35RcEVgW3pecXFVQmlbU0N2VEFe");
import './addclick.js'
import '/index.css'
import 'choices.js/public/assets/styles/choices.min.css';
import {
    Chart,
    SplineSeries,
    SplineAreaSeries,
    ColumnSeries,
    Category,
    Legend,
    Tooltip
} from "@syncfusion/ej2-charts";
import { AccumulationChart, PieSeries, AccumulationLegend, AccumulationTooltip,AccumulationDataLabel } from '@syncfusion/ej2-charts';
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationTooltip,AccumulationDataLabel);
Chart.Inject(SplineSeries, SplineAreaSeries, Category, Legend, Tooltip, ColumnSeries);
        let data1 = [
        { x: "1", y: 1 },
        { x: "2", y: 3 },
        { x: "3", y: 2.5 },
        { x: "4", y: 3.8 },
        { x: "5", y: 3 },
        { x: "6", y: 4 }
        ];

        let data2 = [
        { x: "1", y: 1.5 },
        { x: "2", y: 3.4 },
        { x: "3", y: 3},
        { x: "4", y: 4.2 },
        { x: "5", y: 4.5 },
        { x: "6", y: 3.8 },
        ];

        let data3 = [
        { x: "1", y: 2},
        { x: "2", y: 3.9 },
        { x: "3", y: 3.4},
        { x: "4", y: 4.5 },
        { x: "5", y: 4 },
        { x: "6", y:  4.9}
        ];

        // ✅ create chart
        let chart = new Chart({
        background: "transparent",

        primaryXAxis: {
            valueType: "Category",
            majorGridLines: { width: 0},
            majorTickLines:{width:0},
            lineStyle: { width: 0 }
        },

        primaryYAxis: {
            minimum: 0,
            maximum: 5,
            startFromZero:0,
            interval: 1,
            majorGridLines: { width: 0.1 },
            majorTickLines:{width:0},
            lineStyle: { width: 0 }
        },

        chartArea: { border: { width: 0 } },

        // 🔥 هنا بنعمل gradient من JS

        series: [
            {
            type: "Spline",
            dataSource: data1,
            xName: "x",
            yName: "y",
            fill: "#0fa3ff",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 6,           // حجم النقاط
            height: 6,
            shape: 'Circle',    // شكل النقطة
            fill: '#0fa3ff',    // لون داخلي للنقطة
            border: { color: '#0fa3ff', width: 1 } // لون الحدود
            },
            width: 2,
            opacity:1,
            border: { color: '#56fffc', width: 3 } // لون الخط
            },
            {
            type: "Spline",
            dataSource: data2,
            xName: "x",
            yName: "y",
            fill: "#8b27fe",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 6,           // حجم النقاط
            height: 6,
            shape: 'Circle',    // شكل النقطة
            fill: '#8b27fe',    // لون داخلي للنقطة
            border: { color: '#8b27fe', width: 1 } // لون الحدود
            },
            width: 2,
            opacity:1,
            border: { color: '#f756ff', width: 3 } // لون الخط
            },
            {
            type: "Spline",
            dataSource: data3,
            xName: "x",
            yName: "y",
            fill: "#273dfe",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 6,           // حجم النقاط
            height:6,
            shape: 'Circle',    // شكل النقطة
            fill: '#273dfe',    // لون داخلي للنقطة
            border: { color: '#273dfef', width: 1 } // لون الحدود
            },
            width: 2,
            opacity:1,
            border: { color: '#273dfe', width: 3 } // لون الخط
            }
        ]
        });
        chart.appendTo("#chart");
const data4 = [
    { x: 'Merit-Based $180', y: 40, fill: '#8c4aff' },
    { x: 'Need-Based $23', y: 35, fill: '#2a8aff' },
    { x: 'Departmental $55', y: 15, fill: '#08bfd3' },
    { x: 'Other $32%', y: 10, fill: '#b6c5d1' }
    ];

const chart2 = new AccumulationChart({
    series: [
        {
        dataSource: data4,
        xName: 'x',
        yName: 'y',
        innerRadius: '60%',
        dataLabel: { visible: true, position: 'Inside' },
        // التحكم في الفجوة بين القطع
        explode: true,
        explodeOffset: '10%', 
        border: { width: 4, color: '#0f1219', dashArray: '4,2' }, 
        pointColorMapping: 'fill',
        }
    ],
    title: '',
    legendSettings: { visible: true , },
    tooltip: { enable: true }
    });

chart2.appendTo('#chart2');
export function render(){
    if(document.querySelector("#chart")){
        let data1 = [
        { x: "1", y: 1 },
        { x: "2", y: 3 },
        { x: "3", y: 2.5 },
        { x: "4", y: 3.8 },
        { x: "5", y: 3 },
        { x: "6", y: 4 }
        ];

        let data2 = [
        { x: "1", y: 1.5 },
        { x: "2", y: 3.4 },
        { x: "3", y: 3},
        { x: "4", y: 4.2 },
        { x: "5", y: 4.5 },
        { x: "6", y: 3.8 },
        ];

        let data3 = [
        { x: "1", y: 2},
        { x: "2", y: 3.9 },
        { x: "3", y: 3.4},
        { x: "4", y: 4.5 },
        { x: "5", y: 4 },
        { x: "6", y:  4.9}
        ];

        // ✅ create chart
        let chart = new Chart({
        background: "transparent",

        primaryXAxis: {
            valueType: "Category",
            majorGridLines: { width: 0},
            majorTickLines:{width:0},
            lineStyle: { width: 0 }
        },

        primaryYAxis: {
            minimum: 0,
            maximum: 5,
            startFromZero:0,
            interval: 1,
            majorGridLines: { width: 0.1 },
            majorTickLines:{width:0},
            lineStyle: { width: 0 }
        },

        chartArea: { border: { width: 0 } },

        // 🔥 هنا بنعمل gradient من JS

        series: [
            {
            type: "Spline",
            dataSource: data1,
            xName: "x",
            yName: "y",
            fill: "#0fa3ff",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 6,           // حجم النقاط
            height: 6,
            shape: 'Circle',    // شكل النقطة
            fill: '#0fa3ff',    // لون داخلي للنقطة
            border: { color: '#0fa3ff', width: 1 } // لون الحدود
            },
            width: 2,
            opacity:1,
            border: { color: '#56fffc', width: 3 } // لون الخط
            },
            {
            type: "Spline",
            dataSource: data2,
            xName: "x",
            yName: "y",
            fill: "#8b27fe",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 6,           // حجم النقاط
            height: 6,
            shape: 'Circle',    // شكل النقطة
            fill: '#8b27fe',    // لون داخلي للنقطة
            border: { color: '#8b27fe', width: 1 } // لون الحدود
            },
            width: 2,
            opacity:1,
            border: { color: '#f756ff', width: 3 } // لون الخط
            },
            {
            type: "Spline",
            dataSource: data3,
            xName: "x",
            yName: "y",
            fill: "#273dfe",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 6,           // حجم النقاط
            height:6,
            shape: 'Circle',    // شكل النقطة
            fill: '#273dfe',    // لون داخلي للنقطة
            border: { color: '#273dfef', width: 1 } // لون الحدود
            },
            width: 2,
            opacity:1,
            border: { color: '#273dfe', width: 3 } // لون الخط
            }
        ]
        });
        setTimeout(() => {
            chart.appendTo("#chart");    
        }, 0);
    }
    if(document.querySelector("#chart2")){
        const data4 = [
    { x: 'Merit-Based $180', y: 40, fill: '#8c4aff' },
    { x: 'Need-Based $23', y: 35, fill: '#2a8aff' },
    { x: 'Departmental $55', y: 15, fill: '#08bfd3' },
    { x: 'Other $32%', y: 10, fill: '#b6c5d1' }
    ];

    const chart2 = new AccumulationChart({
    series: [
        {
        dataSource: data4,
        xName: 'x',
        yName: 'y',
        innerRadius: '60%',
        dataLabel: { visible: true, position: 'Inside' },
        // التحكم في الفجوة بين القطع
        explode: true,
        explodeOffset: '10%', 
        border: { width: 4, color: '#0f1219', dashArray: '4,2' }, 
        pointColorMapping: 'fill',
        }
    ],
    title: '',
    legendSettings: { visible: true , },
    tooltip: { enable: true }
    });

    setTimeout(() => {
        chart2.appendTo('#chart2');  
    }, 0);
    }
    if(document.querySelector("#chart3")){
        let data1 = [
        { x: "1", y: 2 },
        { x: "2", y: 2.5 },
        { x: "3", y: 2.8 },
        { x: "4", y: 3 },
        { x: "5", y: 3.4 },
        { x: "6", y: 3.7 },
        { x: "6", y: 4 }
        ];
        let data2 = [
        { x: "1", y: 3.6 },
        { x: "2", y: 4 },
        { x: "3", y: 3.5},
        { x: "4", y: 4.2 },
        { x: "5", y: 5 },
        { x: "6", y: 5.8 },
        ];
        // ✅ create chart
        let chart = new Chart({
        background: "transparent",

        primaryXAxis: {
            valueType: "Category",
            majorGridLines: { width: 0},
            majorTickLines:{width:0},
            lineStyle: { width: 0 }
        },

        primaryYAxis: {
            minimum: 0,
            maximum: 5,
            startFromZero:0,
            interval: 1,
            majorGridLines: { width: 0.1 },
            majorTickLines:{width:0},
            lineStyle: { width: 0 }
        },

        chartArea: { border: { width: 0 } },

        // 🔥 هنا بنعمل gradient من JS

        series: [
            {
            type: "SplineArea",
            dataSource: data1,
            xName: "x",
            yName: "y",
            fill: "#0fa3ff",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 3,           // حجم النقاط
            height: 3,
            shape: 'Circle',    // شكل النقطة
            fill: '#0fa3ff',    // لون داخلي للنقطة
            border: { color: '#0fa3ff', width: 0.4 } // لون الحدود
            },
            width: 0.4,
            opacity:0.4,
            border: { color: '#56fffc', width: 0.8 } // لون الخط
            },
            {
            type: "SplineArea",
            dataSource: data2,
            xName: "x",
            yName: "y",
            fill: "#8b27fe",
            marker: { 
            visible: true,      // ظهور النقاط
            width: 3,           // حجم النقاط
            height: 3,
            shape: 'Circle',    // شكل النقطة
            fill: '#8b27fe',    // لون داخلي للنقطة
            border: { color:'#8b27fe', width: 1 } // لون الحدود
            },
            width: 0.4,
            opacity:0.4,
            border: { color: '#8b27fe', width: 0.8 } // لون الخط
            }
        ]
        });
        setTimeout(() => {
        chart.appendTo("#chart3");
    }, 0);
    }
    if(document.querySelector("#chartContainer")){
    const data8 = [
    { x: '1', y: 10 },
    { x: '2', y: 15 },
    { x: '3', y: 12 },
    { x: '4', y: 20 },
    { x: '5', y: 8 },
    { x: '6', y: 20 },
    { x: '7', y: 15 }
    ];

    const chart8 = new Chart({
    chartArea: { border: { width: 0 } },
    primaryXAxis: {
            valueType: "Category",
            majorGridLines: { width: 0},
            majorTickLines:{width:0},
            lineStyle: { width: 0.1 }
        },

        primaryYAxis: {
            minimum: 0,
            maximum: 25,
            startFromZero:0,
            interval: 5,
            majorGridLines: { width: 0.1 },
            majorTickLines:{width:0},
            lineStyle: { width: 0.1 }
        },
    legendSettings: { visible: false },
    tooltip: { enable: true },
    series: [
        {
        type: 'Column',
        dataSource: data8,
        xName: 'x',
        yName: 'y',
        name: '',
        fill: 'url(#grad)' // لون موحد للجميع
        }
    ],
    loaded: function() {
        // تعريف gradient واحد لكل الأعمدة
        const svg = chart8.svgObject;
        const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
        const grad = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
        grad.id = 'grad';
        grad.setAttribute('x1','0%'); grad.setAttribute('y1','0%');
        grad.setAttribute('x2','0%'); grad.setAttribute('y2','100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg','stop');
        stop1.setAttribute('offset','0%'); stop1.setAttribute('stop-color','#3193f4'); 
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg','stop');
        stop2.setAttribute('offset','100%'); stop2.setAttribute('stop-color','#737bfe'); // كدخ
        const stop3 = document.createElementNS('http://www.w3.org/2000/svg','stop');
        stop3.setAttribute('offset','100%'); stop2.setAttribute('stop-color','#8b75f8'); // كدخ
        grad.appendChild(stop1);
        grad.appendChild(stop2);
        grad.appendChild(stop3);
        defs.appendChild(grad);
        svg.insertBefore(defs, svg.firstChild);
    }
    });
setTimeout(() => {
    chart8.appendTo('#chartContainer');
}, 0);
    }
}
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const htmlElement = document.documentElement;
    
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light');
        const checkbox = document.querySelector('.bb8-toggle__checkbox');
        if (checkbox) checkbox.checked = true;
    } else {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
        const checkbox = document.querySelector('.bb8-toggle__checkbox');
        if (checkbox) checkbox.checked = false;
    }
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
const themeToggle = document.querySelector('.bb8-toggle__checkbox');
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const htmlElement = document.documentElement;
        
        if (themeToggle.checked) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            
            localStorage.setItem('theme', 'dark');
        }
    });
}
