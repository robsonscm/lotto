//NameSpace
var robsonscm = {};
//Variables
robsonscm.fetchCount = 0;
robsonscm.lottoAux = [];
//
robsonscm.genLottoNumbers = function (incremental) {
    //
    let lottoRange = robsonscm.lottoAux;
    // let lottoRange = [];
    let objValidation = {};
    objValidation["digits"] = Number(document.getElementById("digits").value);
    objValidation["max"] = Number(document.getElementById("max").value);
    objValidation["errMsg"] = null;
    objValidation["errCod"] = null;
    //
    if (!(robsonscm.formValidation(objValidation))){
        return false;
    };
    //
    let url = "https://griffis.edumedia.ca/mad9014/lotto/nums.php";
    let formData = new FormData();
    //
    formData.append("digits", objValidation.digits);
    formData.append("max"   , objValidation.max);
    //
    let params = {
        method: 'post',
        mode: 'cors',
        body: formData
    };
    let req = new Request(url, params);
    //
    fetch(req).then(function(response){
                //
                robsonscm.fetchCount += 1;
                return response.json();
                //
            }).then(function(jsonData){
                //
                if(jsonData.code == 0){
                    jsonData.numbers.forEach(function (item) {
                        if (((lottoRange.length == 0 ) || (lottoRange.length < objValidation.digits)) &&
                             (lottoRange.indexOf(item) == -1) ) {
                            lottoRange.push(item);
                        };
                    });
                    console.log(lottoRange);
                    // alert(lottoRange.length + " -- " + this.numDigits);
                    if (lottoRange.length < objValidation.digits){
                        robsonscm.genLottoNumbers();
                    }else{
                        console.log(robsonscm.fetchCount);
                        robsonscm.fetchCount = 0;
                        robsonscm.lottoAux = [];
                        robsonscm.displayResults(lottoRange.sort(robsonscm.sortCompare));
                    };
                }else{
                    throw Error(jsonData.message);
                };
                // alert(lottoRange);
            }).catch(function(err){
                //
                alert(err.message)
            });
    //
    // alert(lottoRange);
    //
};
//
robsonscm.formValidation = function (obj) {
    //
    // alert(obj.digits + "---" + obj.max + "---" + "");
    //
    if (obj.digits == null || obj.digits == 0){
        obj["digits"] = Number(document.getElementById("digits").placeholder);
    }else{
        if ((obj.digits < Number(document.getElementById("digits").min)) || (obj.digits > Number(document.getElementById("digits").max))){
            alert("Number of digits must be between "+ Number(document.getElementById("digits").min) + " and " + Number(document.getElementById("digits").max) + "!");
            return false;
        }
    };
    if (obj.max == null || obj.max == 0){
        obj["max"] = Number(document.getElementById("max").placeholder);
    }else{
        if ((obj.max < Number(document.getElementById("max").min)) || (obj.max > Number(document.getElementById("max").max))) {
            alert("Final range number must be between "+ Number(document.getElementById("max").min) + " and " + Number(document.getElementById("max").max) + "!");
            return false;
        }
    };
    if (obj.max < obj.digits) {
        alert("Number of digits must be less or equal than final range number!");
        return false;
    };
    //
    return true;
};
//
robsonscm.displayResults = function (lottoNumbers) {
    let ul = document.querySelector(".num_list");
    ul.innerHTML = "";  //clear out the old list
    lottoNumbers.forEach(function(item){
        let li = document.createElement("li");
        let box = document.createElement("div");
        box.className = "numFrame";
        li.appendChild(box);
        //
        box.innerHTML = robsonscm.applyPad(item,"0");
        ul.appendChild(li);
    });
    document.getElementById("list").classList.add("active");
    document.getElementById("home").classList.remove("active");
};
//
robsonscm.sortCompare = function (a,b) {
    return a-b;
};
//
robsonscm.applyPad = function (target, pad, sizePad, position) {
    //
    let addPad = "";
    let pSize = 2;
    let tSize = target.toString().length;
    //
    if ((sizePad != null || sizePad != undefined) && sizePad+1 > pSize) {
        pSize = sizePad;
    };
    //
    if ((target == null || target == undefined) && pSize <= tSize) {
        return target;
    };
    //
    for (var i=1; i<=(pSize-tSize); i++) {
        addPad += pad;
    };
    if ((position != null || position != undefined) && position.toUpperCase() == "R") {
        return (target + addPad);
    }else{
        return (addPad + target);
    };
};
//
document.addEventListener("DOMContentLoaded", function () {
    //
    document.getElementById("digits").focus();
    document.getElementById("btnSend").addEventListener("click",robsonscm.genLottoNumbers);
    document.getElementById("btnBack").addEventListener("click", function () {
        //window.location.reload(true);
        document.getElementById("digits").value = null;
        document.getElementById("max").value = null;
        document.getElementById("list").classList.remove("active");
        document.getElementById("home").classList.add("active");
        document.getElementById("digits").focus();
    });
    //
});
