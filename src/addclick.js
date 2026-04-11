import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import { render } from './main.js';
import '/index.css'
import { datePartMatcher } from '@syncfusion/ej2-base/src/intl/date-formatter.js';
let data_person=[];
let data_admin=[];
let admin_setting=[];
fetch("/data.json").then((response)=>{
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
    console.log(e)
})
let nav_bar = document.querySelectorAll(".nav");
let mobile_nav_bar = document.querySelectorAll(".mobile-bottom-nav .nav-item");
let array_nav = Array.from(nav_bar);
let array_mobile_nav = Array.from(mobile_nav_bar);
let main = document.querySelector(".content_dy");
function updateActiveNav(dataLink) {
    array_nav.forEach((el) => {
        el.classList.remove("active");
    });
    array_mobile_nav.forEach((el) => {
        el.classList.remove("active");
    });
    
    const activeDesktop = array_nav.find(el => el.dataset.link === dataLink);
    const activeMobile = array_mobile_nav.find(el => el.dataset.link === dataLink);
    
    if (activeDesktop) activeDesktop.classList.add("active");
    if (activeMobile) activeMobile.classList.add("active");
}
function handleNavigation(e) {
    updateActiveNav(e.dataset.link);
    
    if (document.startViewTransition) {
        document.startViewTransition(function () {
            if (e.dataset.link == "Application") {
                application_page()
            }
            if (e.dataset.link == "Dashboard") {
                get_page("test.html", render)
            }
            if (e.dataset.link == "Funding") {
                get_page("funding.html", render)
            }
            if (e.dataset.link == "Documents") {
                document_page()
            }
            if (e.dataset.link == "Reports") {
                get_page("reports.html", render)
            }
            if (e.dataset.link == "Scholars") {
                get_page("scholars.html", render)
            }
            if (e.dataset.link == "Settings") {
                settings_page()
            }
        });
    }
}

array_nav.forEach((e) => {
    e.addEventListener("click", function () {
        handleNavigation(e);
    });
});

array_mobile_nav.forEach((e) => {
    e.addEventListener("click", function (event) {
        event.preventDefault();
        handleNavigation(e);
    });
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
                                if(array_key[e]=="status" || array_key[e]=="Scholar" || array_key[e]=="Date" || array_key[e]=="file_name"|| array_key[e]=="Deadline"|| array_key[e]=="Role"){
                                    td.classList.add("col-doc")
                                }
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
                                    td.className="flex items-center gap-2 relative top-[0.5px]"
                                    tr.appendChild(td)
                                }
                                if(array_key[e]=="status"){
                                    let div1 = document.createElement("div")
                                    let div2 = document.createElement("div")
                                    div1.appendChild(document.createTextNode("raawrfwaa"))
                                    div2.appendChild(txt)
                                    div1.classList.add("none")
                                    if(div2.innerHTML=="Reviewing"){div2.classList.add("Reviewing")}
                                    if(div2.innerHTML=="Need Document" || div2.innerHTML=="Idle"){div2.classList.add("Need")}
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
                            td.classList.add("col-doc");
                            let eyeBtn = document.createElement("button");
                            let pencilBtn = document.createElement("button");
                            if(icon1=="trash-can" && icon2=="upload"){
                                eyeBtn.className="fa-solid fa-trash-can mr-2 text-red-400 delete"
                                pencilBtn.className="fa-solid fa-upload mr-2 text-green-600 btn_upload"
                            }
                            if(icon1=="eye" && icon2=="pencil"){
                                eyeBtn.className="fa-solid fa-eye mr-2 text-blue-500/80 btn_upload"
                                pencilBtn.className="fa-solid fa-pencil mr-2 text-blue-500/80 edit"
                            }
                            if(icon1=="trash-can" && icon2=="pencil"){
                                eyeBtn.className="fa-solid fa-trash-can mr-2 text-blue-500/80 delete"
                                pencilBtn.className="fa-solid fa-pencil mr-2 text-blue-500/80 btn_upload"
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
                        alert("erorr in   get data")
                        console.log(e)
            }
}
function filter(target, array ,place , icon1, icon2){
                    place.innerHTML=""
                    let prop = target.dataset.category;
                    if(prop){
                    let sorted_array = array.sort((a, b) => {
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
            }});
                    get_data(sorted_array,place, icon1, icon2)
                    }
}
let so;
async function application_page() {
    await get_page("application.html",render);
    await get_data(data_person,document.querySelector(".body_table"),"eye","pencil")
    const element = document.getElementById('statue');
    let choices1 = new Choices(element, {
    searchEnabled: false,   // الغاء البحث
    removeItemButton: false,
    placeholder: true,
    placeholderValue:"Select Statue"
    });
    const element2 = document.getElementById('statue2');
    const choices2 = new Choices(element2, {
    searchEnabled: false,   // الغاء البحث
    removeItemButton: false,
    placeholder: true,
    placeholderValue:"Select Document Type"
    });
    document.querySelectorAll(".input").forEach((e)=>{ 
        e.addEventListener("input",function(){
            filter(e,data_person,document.querySelector(".body_table"),"eye","pencil")
            edit_information(choices1,choices2)
        })
    })
    edit_information(choices1,choices2)
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
    document.querySelector(".input_doc").addEventListener("input",function(e){
        filter(e.target,data_admin,document.querySelector(".body_table_d"), "trash-can" ,"upload")
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
async function settings_page() {
    await get_page("setting.html",render)
    get_data(admin_setting, document.querySelector(".body_table_d"),"trash-can","pencil")
    remove_items()
}
function change_theme(){
    let html = document.querySelector("html");
    let btn_theme = document.querySelector(".theme");
    btn_theme.addEventListener("click",function(){
        document.documentElement.classList.add("dark")
    })
}
change_theme()
function edit_information(cho1 , cho2 ){
            let modal = document.querySelector(".modal");
            let btns = document.querySelectorAll(".edit");
            let btn_click = document.querySelector(".add-application");
            let closeModal = document.querySelector("#closeModal");
            let index_data;
            btns.forEach((e,index)=>{
                e.addEventListener("click",function(){
                modal.style.cssText="opacity:1;transform: scale(1) translateX(-50%);"
                console.log("done")
                document.querySelector("#create").classList.add("hidden");
                document.querySelector("#btn_edit").classList.remove("hidden")
                let im = e.parentElement.parentElement.children[0].innerHTML;
                let after;
                data_person.find((e,ind)=>{
                    if(e.id==+im){
                        after=ind
                        return e
                    }
                })
                index_data=after;
                let name = data_person[after].person;
                let major = data_person[after].Major;
                let Doc =  data_person[after].Scholar;
                let type =  data_person[after].status;
                cho2.setChoiceByValue(Doc)
                cho1.setChoiceByValue(type)
                document.querySelector(".input_name").value=name;
                document.querySelector(".input_Major").value=major;
                closeModal.addEventListener("click",function(){
                modal.style.cssText="opacity:0;transform: scale(0) translateX(-50%);"
                setTimeout(() => {
                    delete_input(cho1,cho2)
                }, 400);
            })
            
                })
            })
            document.querySelector("#btn_edit").addEventListener("click",function(){
                        let name_up=document.querySelector(".input_name").value
                        let major_up=document.querySelector(".input_Major").value;
                        let Doc_up=document.querySelector("#statue2").value;
                        let type_up=document.querySelector("#statue").value;
                        data_person[index_data]={...data_person[index_data],"person":`${name_up}`,"Major":`${major_up}`,"Scholar":`${Doc_up}`,"status":`${type_up}`}
                        modal.style.cssText="opacity: 0;transform: scale(0) translateX(-50%);"                      
                        get_data(data_person,document.querySelector(".body_table"),"eye","pencil")
                        setTimeout(() => {
                            delete_input(cho1,cho2)
                            edit_information(cho1,cho2)
                            index_data=null
                        }, 400);
                        
            })
            btn_click.addEventListener("click",function(){
            document.querySelector("#create").classList.remove("hidden");
            document.querySelector("#btn_edit").classList.add("hidden")
            modal.style.cssText="opacity:1;transform: scale(1) translateX(-50%);"
            })
            let create_btn = document.querySelector("#create");
            closeModal.addEventListener("click",function(){
                modal.style.cssText="opacity:0;transform: scale(0) translateX(-50%);"
                setTimeout(() => {
                        delete_input(cho1,cho2)
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
                        delete_input(cho1,cho2)
                        modal.style.cssText="opacity: 0;transform: scale(0) translateX(-50%);"
                        data_person.push({id:data_person[(data_person.length-1)].id +1,person:inner_input_Name,Major:inner_input_Major,Scholar:choice_document,Date:current_date,status:choice_statue});
                        document.querySelector(".meesage").style.cssText="opacity:1;display:block;"
                        setTimeout(() => {
                            document.querySelector(".meesage").style.cssText="opacity:0;display:none;"
                        }, 1400);
                        get_data(data_person,document.querySelector(".body_table"),"eye","pencil")
                        edit_information(cho1,cho2)
                        
                    }
                    // else{
                    //     document.querySelector(".meesage2").style.cssText="opacity:1;display:block;"
                    //     setTimeout(() => {
                    //         document.querySelector(".meesage2").style.cssText="opacity:0;display:none;"
                    //     }, 2000);
                    // }
            })
}
function delete_input(cho1,cho2){
        document.querySelector(".input_Major").value=""
        document.querySelector(".input_name").value=""
        cho1.removeActiveItems()
        cho2.removeActiveItems()
} 
