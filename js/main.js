//NameSpace
var robsonscm = {};
//Variables
robsonscm.lottoAux = [];
//
robsonscm.genLottoNumbers = function () {
    //
    let lottoRange = robsonscm.lottoAux;
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
        method: 'POST',
        mode: 'CORS',
        body: formData
    };
    let req = new Request(url, params);
    //
    fetch(req).then(function(response){
                //
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
                    // alert(lottoRange.length + " -- " + this.numDigits);
                    if (lottoRange.length < objValidation.digits){
                        robsonscm.genLottoNumbers();
                    }else{
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
    let minNumDigits = Number(document.getElementById("digits").min);
    let maxNumDigits = Number(document.getElementById("digits").max);
    let minNumRange = Number(document.getElementById("max").min);
    let maxNumRange = Number(document.getElementById("max").max);
    //
    // alert(obj.digits + "---" + minNumDigits + "---" + maxNumDigits);
    //
    if ((obj.digits == null) || (obj.digits < minNumDigits) || (obj.digits > maxNumDigits)) {
        alert("Number of digits must be between "+ minNumDigits + " and " + maxNumDigits + "!");
        return false;
    };
    if ((obj.max == null)  || (obj.max < minNumRange) || (obj.max > maxNumRange)) {
        alert("Final range number must be between "+ minNumRange + " and " + maxNumRange + "!");
        return false;
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
        li.innerHTML = robsonscm.applyPad(item,"0");
        ul.appendChild(li);
    });
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
// document.addEventListener("DOMContentLoaded", robsonscm.genLottoNumbers);
document.getElementById("btnSend").addEventListener("click",robsonscm.genLottoNumbers);
document.getElementById("btnBack").addEventListener("click", function () {
    window.location.reload(true);
});
