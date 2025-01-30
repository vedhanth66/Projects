const base_url = "https://v6.exchangerate-api.com/v6/c5ee6f98661e87384d2d77f5/pair";
const drop_down = document.querySelectorAll(".select_drop select");
const btn = document.querySelector("#btn");
let result = document.querySelector(".result");
let from_curr = document.querySelector(".choose_from");
let to_curr = document.querySelector(".choose_to");
let price = document.querySelector(".price");

for(let select of drop_down){
    for(let currCode in countryList){
        let op = document.createElement("option");
        op.innerText = `${currCode} - ${countryList[currCode].name}`;
        op.value = currCode
        if(select.name == "from" && currCode == "USD")
            op.selected = "selected";
        if(select.name == "to" && currCode == "INR")
            op.selected = "selected";
        select.append(op);
    }
    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    })
}

const updateFlag = (ele) => {
    let currCode = ele.value;
    let countryCode = countryList[currCode].code;
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    if (ele.name === "from") {
        let img = ele.closest(".from").querySelector("img");
        img.src = newSrc;
    }

    if (ele.name === "to") {
        let img = ele.closest(".to").querySelector("img");
        img.src = newSrc;
    }
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amt = document.querySelector(".input");
    let amtval = amt.value;
    if(amtval < 0 || amtval == "" || amtval == " "){
        amt.value = 0;
        amtval = amt.value;
    }

    const url = `${base_url}/${from_curr.value}/${to_curr.value}`;

    let response = await fetch(url);
    let data = await response.json();
    let rate = data["conversion_rate"];
    let final = amtval * rate;
    result.innerText = `${amtval} ${from_curr.value} = ${final} ${to_curr.value}`
    price.innerText = `(1 ${from_curr.value} = ${rate} ${to_curr.value})`
})
