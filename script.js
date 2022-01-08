const inps = document.getElementsByClassName("inp")
const spamCheck = document.getElementById("spam")
const submit = document.getElementById("submit")
const display = document.getElementById("display")
const prevDisplay = document.getElementsByClassName("panel hidden")[0]
const prevFloodsDisplay = document.getElementsByClassName("prev-floods")[0]
const max = 10;
let attack = inps[0], link = inps[1], botCount = inps[2], phrase = "", spam = false, prm, result = false, prevFloods = [],clicked=false;
if (localStorage.getItem("prevFloods") !== null) {
    prevFloods = JSON.parse(localStorage.getItem("prevFloods"))
}

submit.addEventListener("click", function () {
    if (link.value.trim().length > 0 && botCount.value.trim().length > 0) {
        if(spam!==false){
            if(isCuss(phrase)){
                let temp="";
                for(let i=0;i<phrase.value.length;i++){
                    temp+="*";
                }
                phrase=temp;
            }
        }
        if (botCount.value > max) {
            botCount.value = max;
        }
        if (link.value.includes("?")) {
            prm = "&botting"
        }
        else {
            prm = "?botting"
        }
        flood(attack, link.value, botCount, phrase, spam, dateTime())
    }
    else {
        convey("Please fill in all values!", "red")
    }
})

function isCuss(phrase){
    let result = false;
    let backUp = [];
    if(typeof phrase !== "string"){
        phrase = phrase.value;
    }
    let usable = phrase.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g," ").toLowerCase().split(" ");
    for(let i=0;i<cusses.length;i++){
        for(let j=0;j<usable.length;j++){
            if(cusses[i].word == usable[j]||usable[j]==cusses[i].word){
                backUp.push(usable);
                result = true;
            }
        }
    }
    if(backUp.length>0){
        result=true;
    }
    return result;
}

spamCheck.addEventListener("change", function () {
    if(!clicked){
        clicked=true;
        if (spamCheck.checked) {
            spamCheck.parentElement.classList.add("checked")
            phrase = inps[3]
            spam = true
            smoothDisplay(phrase,"hidden",2);
        }
        else {
            smoothDisplay(phrase,"hidden",1);
            phrase = ""
            spam = false
            spamCheck.parentElement.classList.remove("checked")
        }
        clicked=false;
    }
})

function convey(msg, color) {
    display.style = "opacity:0;transition:.5s;"
    setTimeout(function () {
        display.innerText = msg;
        display.style.color = "black";
        display.style = `color:${color};opacity:100;transition:.5s;`
    }, 500)
    setTimeout(function(){
        display.style = "opacity:0;transition:.5s;"
    },2500)
}

function smoothDisplay(elem,thing,state){
    elem.style.opacity="0%";
    setTimeout(()=>{
        if(state==1){
            elem.classList.add(thing)
        }
        else if(state==2){
            elem.classList.remove(thing)
        }
    },200)
    setTimeout(()=>{
        elem.style.opacity="100%";
    },750)
}

function flood(attack, link, bots, phrase, spam, date) {
    result = false
    if(typeof phrase !== "string"){
        phrase = phrase.value;
    }
    let object = { "attack": attack.value, "link": link, "bots": bots.value, "phrase": phrase, "spam": spam, "when": date }
    if (spam) {
        if (phrase.trim().length > 0) {
            result = `${link}${prm}=true&spam=${spam}&phrase=${phrase}`
        }
        else {
            convey("Please fill in phrase to spammed...", "red")
        }
    }
    else {
        result = `${link}${prm}=true&spam=false&phrase=none`
    }
    if (result) {
        convey("Flooding in session 🤪", "blue")
        save_check(object, prevFloods)
        for (let i = 0; i < bots.value; i++) {
            window.open(result + `&#BOT_${i + 1}`)
        }
    }
}


if (prevFloods.length > 0) {
    prevDisplay.classList.remove("hidden");
    let reset = document.getElementById("reset");
    for (let i = 0; i < prevFloods.length; i++) {
        let miniPanel = document.createElement("div");
        miniPanel.className = "miniPanel"
        miniPanel.innerHTML = `<span class="wrapper"><span class="link">${prevFloods[i].attack}</span><button closed=true class="view-btn">View</button></span><div class="details"></div>
        <div class="controls">
            <button class="removeBtn" style="background:red">Remove</button>
            <button class="use">Use</button>
        </div>`;
        prevFloodsDisplay.append(miniPanel)
    }
    let viewBtns = document.getElementsByClassName("view-btn");
    let miniPanel = document.getElementsByClassName("miniPanel")
    let details = document.getElementsByClassName("details")
    let controls = document.getElementsByClassName("controls")
    for (let i = 0; i < viewBtns.length; i++) {
        viewBtns[i].addEventListener("click", function () {
            if (this.getAttribute("closed") == "true") {
                controls[i].style="opacity:100%;margin:15px;width:90%;height:25px;"
                this.setAttribute("closed", false)
                viewBtns[i].style = "background:transparent;color:black;border:1px solid grey;";
                viewBtns[i].innerText = "Close"
                details[i].innerHTML = `
                    <ul>
                        <li><b>Link:</b><span style="overflow:hidden;text-overflow:ellipsis;width:300px;display:-webkit-box;word-break:break-all;-webkit-line-clamp: 3;-webkit-box-orient: vertical;"> ${prevFloods[i].link}</span></li><br>
                        <li><b>Last Used:</b> ${prevFloods[i].when}</li><br>
                        <li><b>Bot Count:</b> ${prevFloods[i].bots}</li><br>
                        <li><b>Spam Chat:</b> ${prevFloods[i].spam}</li><br>
                        <li><b>Spam Phrase:</b><span style="display:-webkit-box;overflow:hidden;text-overflow: ellipsis; -webkit-line-clamp: 3;-webkit-box-orient: vertical; width:300px;height:fit-content; line-break:normal;word-break:break-all;">${prevFloods[i].phrase}</span></li><br>
                    </ul><br>
                `;
                details[i].style.display = "block"
                details[i].style.height = "fit-content"
                let remove = document.getElementsByClassName("removeBtn")
                let use = document.getElementsByClassName("use")
                for (let i = 0; i < remove.length; i++) {
                    remove[i].addEventListener("click", function () {
                        prevFloods.splice(prevFloods.indexOf(i), 1);
                        miniPanel[i].remove();
                        localStorage.setItem("prevFloods", JSON.stringify(prevFloods));
                        if (prevFloods.length < 1) {
                            prevDisplay.remove();
                        }
                    })
                }
                for (let i = 0; i < use.length; i++) {
                    use[i].addEventListener("click", function () {
                        attack.value = prevFloods[i].attack
                        link.value = prevFloods[i].link
                        botCount.value = prevFloods[i].bots
                        if (prevFloods[i].spam) {
                            spamCheck.parentElement.classList.add("checked")
                            phrase = inps[3]
                            spam = true
                            phrase.classList.remove("hidden")
                            spamCheck.checked = true;
                            phrase.value = prevFloods[i].phrase
                        }
                    })
                }
            }
            else {
                viewBtns[i].style = "";
                this.setAttribute("closed", true)
                viewBtns[i].innerText = "view"
                details[i].style.display = "none";
                controls[i].style="opacity:0%;margin:0px;width:0px;height:0px;"
            }
        })
    }
    reset.addEventListener("click", function () {
        let check = confirm("This will remove all saved attacks, basically a factory reset. Click ok to continue...");
        if (check) {
            localStorage.removeItem("prevFloods");
            prevDisplay.remove()
        }
    })
}





function dateTime() {
    return new Date().toLocaleString();
}

function save_check(obj, arr) {
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].attack.toLowerCase() == obj.attack.toLowerCase()) {
                arr[i] = obj
                localStorage.setItem("prevFloods", JSON.stringify(prevFloods));
            }
            else {
                if (arr.length - 1 == i) {
                    arr.push(obj)
                    localStorage.setItem("prevFloods", JSON.stringify(prevFloods));
                }
            }
        }
    }
    else {
        arr.push(obj)
        localStorage.setItem("prevFloods", JSON.stringify(prevFloods));
    }
}

