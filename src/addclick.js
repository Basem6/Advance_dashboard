let data_person=[];
let data_admin=[];
let admin_setting=[];
fetch("./public/assests/main.json").then((response)=>{
    return response.json()
    .then((data)=>{
        let data_person1 = data.person;
        let data_admin1 = data.admin;
        data_person=data_person.concat(data_person1);
        data_admin=data_admin.concat(data_admin1);
        let admin_setting1 = data.setting;
        admin_setting = admin_setting.concat(admin_setting1);
    })
}).catch((e)=>{
    alert("erorr in fetch data")
    console.log(e)})
let nav_bar = document.querySelectorAll(".nav");
let array_nav = Array.from(nav_bar);
import { render } from './main.js';
import { click_modal } from './main.js';
let main = document.querySelector(".content_dy");
array_nav.forEach((e)=>{
    e.addEventListener("click",function(){
        array_nav.forEach((el)=>{
            el.classList.remove("active");
        })
        e.classList.add("active");
        if(document.startViewTransition)
            document.startViewTransition(function(){
                if(e.dataset.link=="Application"){ 
                application_page()
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
                            if(icon1=="trash-can" && icon2=="upload"){
                                eyeBtn.className="fa-solid fa-trash-can mr-2 text-red-400 delete"
                                pencilBtn.className="fa-solid fa-upload mr-2 text-green-600"
                            }
                            if(icon1=="eye" && icon2=="pencil"){
                                eyeBtn.className="fa-solid fa-eye mr-2 text-blue-500/80"
                                pencilBtn.className="fa-solid fa-pencil mr-2 text-blue-500/80"
                            }
                            if(icon1=="trash-can" && icon2=="pencil"){
                                eyeBtn.className="fa-solid fa-trash-can mr-2 text-blue-500/80 delete"
                                pencilBtn.className="fa-solid fa-pencil mr-2 text-blue-500/80"
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
function filter(target, array ,place , icon1, icon2){
                    place.innerHTML=""
                    let prop = target.dataset.category;
                    let sorted_array = array.slice().sort((a, b) => {
                    if(!target.dataset.type){
                        let aMatch = a[prop].toLowerCase().startsWith(target.value.toLowerCase());
                        let bMatch = b[prop].toLowerCase().startsWith(target.value.toLowerCase());
                        return bMatch - aMatch;
                    }else{
                    if(prop == "Deadline"){
                        if(target.innerHTML=="The Newest"){
                            return new Date(b[prop]) - new Date(a[prop]);
                        }else
                            return new Date(a[prop]) - new Date(b[prop]);
                    }
                    else{
                    let aMatch = a[prop].toLowerCase().startsWith(target.innerHTML.toLowerCase());
                    let bMatch = b[prop].toLowerCase().startsWith(target.innerHTML.toLowerCase());
                    return bMatch - aMatch;
                    }
                }
                    });
                    get_data(sorted_array,place, icon1, icon2)
}
async function application_page() {
    await get_page("application.html",render);
    await get_data(data_person,document.querySelector(".body_table"),"eye","pencil")
    document.querySelectorAll(".input").forEach((e)=>{ 
        e.addEventListener("input",function(){
            filter(e,data_person,document.querySelector(".body_table"),"eye","pencil")
        })
    })
    click_modal(get_data,data_person,delete_input)
}
async function document_page() {
    await get_page("documents.html",render)
    get_data(data_admin, document.querySelector(".body_table_d"),"trash-can","upload")
    click_select()
    remove_items()
    let btns_filter = document.querySelectorAll(".btn_filter");
    btns_filter.forEach((e)=>{
        e.addEventListener("click",function(el){
            filter(e,data_admin,document.querySelector(".body_table_d"), "trash-can" ,"upload")
            
        })
    })
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