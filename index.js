// function objectifyForm(formArray) {
//     //serialize data function
//     var returnArray = {};
//     for (var i = 0; i < formArray.length; i++) {
//         if( formArray[i]['value'] ) {
//             returnArray[formArray[i]['name']] = formArray[i]['value'];
//         }
//     }
//     return returnArray;
// }
let docNumber = 1;
function getElementArray(name, isSelect=false) {
    var names = [];
    $(isSelect ? `select[name='${name}[]']` : `input[name='${name}[]']`).each(function() {
        $(this).val() && names.push($(this).val());
    });
    return names;
}

function generateJson() {
    // create the json data
    var ids = getElementArray('id');
    var texts = getElementArray('text');
    var uuids = getElementArray('uuid');
    
    return { ids, texts, uuids };
}

function generateChildJson() {
    var lines = getElementArray('line');
    var names = getElementArray('name');
    var types = getElementArray('type', true);
    var childrenUuids = getElementArray('childrenUuid');
    var titles = getElementArray('title');
    return { lines, names, childrenUuids, titles, types };

}
let tempJson;
let finalJson = [];
let children = [];

function makeObject(dataArray) {
    if( typeof dataArray !== 'object' || dataArray == null ) {
        return alert('Invalid Data');
    }
    // make an object
    let arrayLength = dataArray.ids.length;
    if( dataArray.ids.length == arrayLength && dataArray.texts.length == arrayLength && dataArray.uuids.length == arrayLength ) {
        // finalJson = [];
        dataArray.ids.forEach( (id, index) => {
            let documentObj = {
                id,
                text: dataArray.texts[index],
                uuid: dataArray.uuids[index],
                children
            }
            finalJson.push( documentObj );
            console.log(finalJson)
            // update the input value
            $('#finalJsonInput').val(JSON.stringify(finalJson));
            $('#textarea').val(JSON.stringify(finalJson));
        });
        children = [];
        return true
    } else {
        alert('Please Complete All The Fields');
        return false;
    }
    
}

const addNewDoc = () => {
    const documentRow = $('.documentRow');
    if( !documentRow[0].checkValidity() ) {
        documentRow[0].reportValidity();
        return;
    }
    tempJson = generateJson()
    let lineArray = getElementArray('line');
    let newVal = ++lineArray[lineArray.length - 1];
    makeChildren() && makeObject(tempJson) && documentRow.empty();
    documentRow.append(`
        <p>Document Count - ${ ++docNumber }</p>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">ID</label>
            <input readonly type="text" required class="form-control" name="id[]" id="exampleInputEmail1" aria-describedby="emailHelp" onfocus="this.value = rnd(10)" />
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">text</label>
            <input type="text" required class="form-control" name="text[]" id="exampleInputPassword1" />
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">UUID</label>
            <input readonly type="text" required class="form-control" onfocus="this.value = uuidv4()" name="uuid[]" id="exampleInputPassword1" />
        </div>
        <div class="mb-3">
            <label class="form-label">Children</label>
            <i class="fa-solid fa-plus btn btn-success" onclick="addNewChildren(this)"></i>
            <div class="row childrenRow mt-3">
                <div class="col-md-2">
                    <input type="text" required class="form-control" name="line[]" placeholder="Enter Line" readonly value="${ newVal }" />
                </div>
                <div class="col-md-3">
                    <input type="text" required class="form-control" name="name[]" placeholder="Enter Name" />
                </div>
                <div class="col-md-2">
                    <select name="type[]" required class="manualSelect2 form-control">
                        <option>number_type2</option>
                        <option>passfail</option>
                        <option>passfail_decline</option>
                        <option>text_type2</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="text" required class="form-control" readonly name="childrenUuid[]" placeholder="Enter UUID" onfocus="this.value = uuidv4()" />
                </div>
                <div class="col-md-2">
                    <input type="text" required class="form-control" name="title[]" placeholder="Enter Title" onchange="makeChildren()" />
                </div>
                
            </div>
        </div>
    `);
    $(".manualSelect2").select2({
        tags: true,
        theme: "bootstrap4"
    });
    
}

function makeChildren() {
    children = [];
    let allCurrentChildren = generateChildJson();
    let arrayLength = allCurrentChildren.lines.length;
    if( allCurrentChildren.lines.length == arrayLength && allCurrentChildren.childrenUuids.length == arrayLength && allCurrentChildren.names.length == arrayLength && allCurrentChildren.titles.length == arrayLength && allCurrentChildren.types.length == arrayLength ) {
        allCurrentChildren.lines.forEach( (line, index) => {
            let childrenObj = {  
                line: line,
                uuid: allCurrentChildren.childrenUuids[index],
                name: allCurrentChildren.names[index],
                title: `<p>${ allCurrentChildren.titles[index] }</p>`,
                type: allCurrentChildren.types[index],
                expanded: true
            }
            children.push(childrenObj);
        });
        // console.log(children)
        return true
    } else {
        alert('Please Complete All The Fields');
        return false;
    }
}

const addNewChildren = (element) => {
    let lineArray = getElementArray('line');
    let newVal = ++lineArray[lineArray.length - 1];
    makeChildren() &&
    $(element).next('.childrenRow').append(`
        <div class="col-md-2 mt-2">
            <input type="text" required class="form-control" name="line[]" placeholder="Enter Line" readonly value="${ newVal }" />
        </div>
        <div class="col-md-3 mt-2">
            <input type="text" required class="form-control" name="name[]" placeholder="Enter Name" />
        </div>
        <div class="col-md-2 mt-2">
            <select name="type[]" required class="manualSelect2 form-control">
                <option>number_type2</option>
                <option>passfail</option>
                <option>text_type2</option>
            </select>
        </div>
        <div class="col-md-3 mt-2">
            <input type="text" readonly required class="form-control" name="childrenUuid[]" placeholder="Enter UUID" onfocus="this.value = uuidv4()" />
        </div>
        <div class="col-md-2 mt-2">
            <input type="text" required class="form-control" name="title[]" placeholder="Enter Title" onchange="makeChildren()" />
        </div>
    `);
    $(".manualSelect2").select2({
        tags: true,
        theme: "bootstrap4"
    });
    
}

const rnd = (() => {
    const gen = (min, max) => max++ && [...Array(max-min)].map((s, i) => String.fromCharCode(min+i));

    const sets = {
        num: gen(48,57),
        alphaLower: gen(97,122),
        alphaUpper: gen(65,90)
    };

    function* iter(len, set) {
        if (set.length < 1) set = Object.values(sets).flat(); 
        for (let i = 0; i < len; i++) yield set[Math.random() * set.length|0]
    }

    return Object.assign(((len, ...set) => [...iter(len, set.flat())].join('')), sets);
})();
$(".manualSelect2").select2({
    tags: true,
    theme: "bootstrap4"
});

function showModal() {
    if( $('#finalJsonInput').val() != '' ) {
        $('.modal').modal('show');
    } else {
        alert('No Data Available')
    }
}
