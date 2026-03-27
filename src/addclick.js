let data_person=[
    {id:472042,person:"Jon Maged",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2024",statue:"Reviewing"},
    {id:472043,person:"Basem Mahomud",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2023",statue:"Pending Document"},
    {id:472044,person:"Jon Maged",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2024",statue:"Reviewing"},
    {id:472045,person:"Jon Basem",Major:"Doctor",Scholar:"Merit",Date:"Jan 1,2024",statue:"Need Document"},
    {id:472046,person:"Maged Ali",Major:"Engineering",Scholar:"Merit",Date:"Fep 14,2024",statue:"Interview Scheduled"},
    {id:472047,person:"Jon Maged",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2024",statue:"Reviewing"},
    {id:472048,person:"Basem Mahomud",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2023",statue:"Pending Document"},
    {id:472049,person:"Jon Maged",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2024",statue:"Reviewing"},
    {id:472050,person:"Jon Basem",Major:"Doctor",Scholar:"Merit",Date:"Jan 1,2024",statue:"Need Document"},
    {id:472051,person:"Maged Ali",Major:"Engineering",Scholar:"Merit",Date:"Fep 14,2024",statue:"Interview Scheduled"},
    {id:472052,person:"Jon Maged",Major:"Engineering",Scholar:"Merit",Date:"Jan 14,2024",statue:"Reviewing"},
]
let data_admin = [
    {file_type:"Transcript",file_name:"transcript_2023_pdf",statue:"Reviewing",Deadline:"01/02/2023",admin_name:"EvelyenReed"},
    {file_type:"Transcript",file_name:"transcript_2023_pdf",statue:"Missing",Deadline:"01/02/2023",admin_name:"EvelyenReed"},
    {file_type:"Transcript",file_name:"transcript_2023_pdf",statue:"Approved",Deadline:"01/02/2023",admin_name:"EvelyenReed"},
    {file_type:"Transcript",file_name:"transcript_2023_pdf",statue:"Missing",Deadline:"01/02/2023",admin_name:"EvelyenReed"},
    {file_type:"Transcript",file_name:"transcript_2023_pdf",statue:"Approved",Deadline:"01/02/2023",admin_name:"EvelyenReed"},
    {file_type:"Transcript",file_name:"transcript_2023_pdf",statue:"Missing",Deadline:"01/02/2023",admin_name:"EvelyenReed"},
]
let admin_setting = [
    {Admin_name:"James param",Email:"james@gmail,com" ,Role:"Super Adimin" ,lastlogin:"12 Jan,2022",statue:"Active"},
    {Admin_name:"James param",Email:"james@gmail,com" ,Role:"Super Adimin" ,lastlogin:"12 Jan,2022",statue:"Adle"},
    {Admin_name:"James param",Email:"james@gmail,com" ,Role:"Super Adimin" ,lastlogin:"12 Jan,2022",statue:"Adle"},
    {Admin_name:"James param",Email:"james@gmail,com" ,Role:"Super Adimin" ,lastlogin:"12 Jan,2022",statue:"Active"},
    {Admin_name:"James param",Email:"james@gmail,com" ,Role:"Super Adimin" ,lastlogin:"12 Jan,2022",statue:"Adle"},
    {Admin_name:"James param",Email:"james@gmail,com" ,Role:"Super Adimin" ,lastlogin:"12 Jan,2022",statue:"Adle"},

]
let nav_bar = document.querySelectorAll(".nav");
let array_nav = Array.from(nav_bar);
import { render } from './main.js';
import { click_modal } from './main.js';
let main = document.querySelector(".main");
array_nav.forEach((e)=>{
    e.addEventListener("click",function(){
        array_nav.forEach((el)=>{
            el.classList.remove("active");
        })
        e.classList.add("active");
        if(document.startViewTransition)
            document.startViewTransition(function(){
                if(e.dataset.link=="Application"){ 
                addeven_input()
                }
                if(e.dataset.link=="Dashboard"){
                get_page("test.html",render)
                }
                if(e.dataset.link=="Funding"){
                get_page("funding.html",render)
                }
                if(e.dataset.link=="Documents"){
                document_page()
                }
                if(e.dataset.link=="Reports"){
                get_page("reports.html",render)
                }
                if(e.dataset.link=="Scholars"){
                get_page("scholars.html",render)
                }
                if(e.dataset.link=="Settings"){
                settings_page()
                }
    })
    })
});
async function get_page(url,call) {
                    main.innerHTML=""
                    let page = await fetch(url)
                    let data = await page.text()
                    main.innerHTML=data
                    if(call){call()}
}
function get_data(array, place , icon1, icon2){
            try{
                        place.innerHTML=""
                        let fragment = document.createDocumentFragment()
                        for(let i=0;i < array.length;i++){
                            let tr = document.createElement("tr");
                            let array_key = Object.keys(array[i])
                            for(let e=0;e<array_key.length;e++){
                                if(array_key[e]){
                                let td = document.createElement("td");
                                let txt = document.createTextNode(array[i][`${array_key[e]}`]);
                                if(array_key[e]=="file_type"){
                                    let span = document.createElement("span")
                                    let span2 = document.createElement("span")
                                    span.className="fa-regular fa-newspaper mr-2 text-blue-400";
                                    span.appendChild(txt)
                                    td.appendChild(span)
                                    td.appendChild(span2)
                                    tr.appendChild(td)
                                }
                                if(array_key[e]=="admin_name"){
                                    let span = document.createElement("span");
                                    let span2 = document.createElement("span");
                                    span.className="image w-9 h-9 inline-block";
                                    let img = document.createElement("img");
                                    img.src="/assests/photo/admin-photo.webp"
                                    img.loading="lazy"
                                    img.className="w-full h-full rounded-full"
                                    span.appendChild(img)
                                    span2.appendChild(txt)
                                    td.appendChild(span)
                                    td.appendChild(span2)
                                    td.className="flex items-center gap-2"
                                    tr.appendChild(td)
                                }
                                if(array_key[e]=="statue"){
                                    let div1 = document.createElement("div")
                                    let div2 = document.createElement("div")
                                    div1.appendChild(document.createTextNode("raawrfwaa"))
                                    div2.appendChild(txt)
                                    div1.classList.add("none")
                                    if(div2.innerHTML=="Reviewing"){div2.classList.add("Reviewing")}
                                    if(div2.innerHTML=="Need Document" || div2.innerHTML=="Adle"){div2.classList.add("Need")}
                                    if(div2.innerHTML=="Pending Document"){div2.classList.add("Pending-Document")}
                                    if(div2.innerHTML=="Interview Scheduled" || div2.innerHTML=="Approved" || div2.innerHTML=="Active" ){div2.classList.add("Scheduled")}
                                    if(div2.innerHTML=="Missing"){div2.classList.add("Missing")}
                                    td.appendChild(div1)
                                    td.appendChild(div2)
                                    tr.appendChild(td)
                                }else{
                                    td.appendChild(txt);
                                    tr.appendChild(td)
                                }   
                                }
                            }
                            let td = document.createElement("td");
                            let eyeBtn = document.createElement("button");
                            let pencilBtn = document.createElement("button");
                            if(array==data_admin){
                                eyeBtn.className = `fa-solid fa-${icon1} mr-2 text-red-400`;
                                if(icon1 =="trash-can"){ eyeBtn.classList.add("delete")}
                                pencilBtn.className = `fa-solid fa-${icon2} mr-2 text-green-600`;
                            }else{
                                eyeBtn.className = `fa-regular fa-${icon1}  mr-2 text-blue-500/80`;
                                if(icon1 =="trash-can"){ eyeBtn.classList.add("delete")}
                                pencilBtn.className = `fa-solid fa-${icon2} mr-2 text-blue-500/80`;
                            }
                            td.appendChild(eyeBtn);
                            td.appendChild(pencilBtn);
                            tr.appendChild(td);
                            fragment.appendChild(tr)
                        }
                        place.appendChild(fragment)
                    }
            catch(e)
                    {
                        alert("erorr in get data")
                        console.log(e)
            }
}
async function add() {
                    await get_page("application.html",render);
                    await get_data(data_person,document.querySelector(".body_table"),"eye","pencil")
}
async function filter(input) {
                    let body_table = document.querySelector(".body_table");
                    body_table.innerHTML=""
                    let prop = input.dataset.category;
                    let sorted_array = data_person.slice().sort((a, b) => {
                    let aMatch = a[prop].toLowerCase().startsWith(input.value.toLowerCase());
                    let bMatch = b[prop].toLowerCase().startsWith(input.value.toLowerCase());
                    return bMatch - aMatch;
                });
                    get_data(sorted_array,document.querySelector(".body_table"),"eye","pencil")
}
async function addeven_input() {
    await add()
    document.querySelectorAll(".input").forEach((e)=>{ 
        e.addEventListener("input",function(){
            filter(e)
        })
    })
    click_modal(get_data,data_person,delete_input)

}
async function document_page() {
    await get_page("documents.html",render)
    get_data(data_admin, document.querySelector(".body_table_d"),"trash-can","upload")
    click_select()
    remove_items()
}
function click_select() {
    let selects  = document.querySelectorAll(".select");
    selects.forEach((e , index)=>{
        e.addEventListener("click",function(){
            let dropdown = document.querySelector(`#s_${index+1}`);
                dropdown.classList.toggle("opacity-0");
                dropdown.classList.toggle("pointer-events-none");
                dropdown.classList.toggle("h-[133px]")
                if(index==2){
                    dropdown.classList.toggle("h-[89px]");
                }
            e.children[0].children[1].classList.toggle("rotate")
            let array_option =Array.from(e.parentElement.children[1].children);
            array_option.forEach((e)=>{
                e.addEventListener("click",function(){
                    array_option.forEach((el)=>{
                    el.classList.remove("active")
                })
                e.classList.add("active")
                })
            })
        })
    })
}

function remove_items(){
    let btns_delete = document.querySelectorAll(".delete");
    btns_delete.forEach((e)=>{
        e.addEventListener("click",function(){
            e.parentElement.parentElement.remove();
        })
    })
}
function delete_input(){
    document.querySelector(".input_Major").value=""
    document.querySelector(".input_name").value=""
}
async function settings_page() {
    await get_page("setting.html",render)
    get_data(admin_setting, document.querySelector(".body_table_d"),"trash-can","pencil")
    remove_items()
}