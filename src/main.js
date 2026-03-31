import { registerLicense } from '@syncfusion/ej2-base';
registerLicense("Ngo9BigBOggjHTQxAR8/V1JHaF5cWWdCekx3Qnxbf1x2ZFZMZV1bRHFPIiBoS35RcEVgW3pecXFVQmlbU0N2VEFe");
import './addclick.js'
import '/index.css'
import Choices from 'choices.js';
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
    if(document.querySelector("#statue")){
        const element = document.getElementById('statue');
        const choices = new Choices(element, {
        searchEnabled: false,   // الغاء البحث
        removeItemButton: false,
        placeholder: true,
        placeholderValue:"Select Statue"
        });
    }
    if(document.querySelector("#statue2")){
        const element2 = document.getElementById('statue2');
        const choices = new Choices(element2, {
        searchEnabled: false,   // الغاء البحث
        removeItemButton: false,
        placeholder: true,
        placeholderValue:"Select Document Type"
        });
    }
    if(document.querySelector("#statue3")){
        const element3 = document.getElementById('statue3');
        const choices = new Choices(element3, {
        placeholder: true,
        placeholderValue:"Statue"
        });
    }
    if(document.querySelector("#statue4")){
        const element4 = document.getElementById('statue4');
        const choices = new Choices(element4, {
        placeholder: true,
        placeholderValue:"Document Type"
        });
    }
    if(document.querySelector("#statue5")){
        const element5 = document.getElementById('statue5');
        const choices = new Choices(element5, {
        placeholder: true,
        placeholderValue:"Deadline"
        });
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
export function click_modal(fun,array,fun2){
        let modal = document.querySelector(".modal");
        let closeModal = document.querySelector("#closeModal");
        let btn = document.querySelector(".add-application");
        let create_btn = document.querySelector("#create");
        btn.addEventListener("click",function(){
            modal.style.cssText="opacity:1;"
        })
        closeModal.addEventListener("click",function(){
            modal.style.cssText="opacity: 0;scale:0"
            setTimeout(() => {
                    fun2()
            }, 400);
        })
        create_btn.addEventListener("click",function(){
                let Months = ["Jan","Fep","Mar","Apr","May","Jun","Jul","agu","Sep","Oct","Nov","Dec"];
                let data=new Date()
                let current_date = `${Months[data.getMonth()]} ${data.getDate()},${data.getFullYear()}`;
                if(document.querySelector(".input_Major").value!="" && document.querySelector(".input_name").value!=""){
                    let inner_input_Major = document.querySelector(".input_Major").value.trim();
                    let inner_input_Name = document.querySelector(".input_name").value.trim();
                    let choice_document = document.querySelector("#statue2").value;
                    let choice_statue = document.querySelector("#statue").value;
                    fun2()
                    modal.style.cssText="opacity: 0;scale:0"
                    array.push({id:array[(array.length-1)].id +1,person:inner_input_Name,Major:inner_input_Major,Scholar:choice_document,Date:current_date,status:choice_statue});
                    document.querySelector(".meesage").style.cssText="opacity:1;display:block;"
                    setTimeout(() => {
                        document.querySelector(".meesage").style.cssText="opacity:0;display:none;"
                    }, 1400);
                    fun(array,document.querySelector(".body_table"),"eye","pencil")
                }
                else{
                    document.querySelector(".meesage2").style.cssText="opacity:1;display:block;"
                    setTimeout(() => {
                        document.querySelector(".meesage2").style.cssText="opacity:0;display:none;"
                    }, 2000);
                }
        })
}

// ============ THEME TOGGLE ============
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
