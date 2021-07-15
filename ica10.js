let manuArray = ['Honda','Toyota','BMW','Suzuki','Yamaha']
let typeArray = ['car','truck','motorcycle','mpv']
let selectedMake;
let selectedYear;
let selectedType;

$(document).ready(() =>{

    for(let i = 0; i<manuArray.length;i++)
    $('#selectBrand').append(`<option value = "${manuArray[i]}">${manuArray[i]}</option>`);

    for(let i = 1990; i <=2017;i++ )
    $('#selectYear').append(`<option value = "${i}">${i}</option>`);

    for(let i = 0; i < typeArray.length;i++)
    $('#selectType').append(`<option value = "${typeArray[i]}">${typeArray[i]}</option>`);

    $('#invokeButton').click(() =>
    {
        RequestModels();
    })    
})

function RequestModels()
{
    let sendData = {};
    selectedMake = $('#selectBrand option:selected').val();
    selectedYear = $('#selectYear option:selected').val();
    selectedType = $('#selectType option:selected').val();    
    
    let url = `//vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${selectedMake}/modelyear/${selectedYear}/vehicletype/${selectedType}`;    
        
    sendData['format'] = 'json';
    ajaxRequest(url,'GET',sendData,'json',PopulateModels,errorHandler);
    $('#OutputStatus').html(`Request for ${url} issued,Please Wait`);
}

function ajaxRequest(urlin,typein,datain,dataTypein,successFunction,errorFunction)
{
    let ajaxOptions = {};

        ajaxOptions['url'] = urlin;
        ajaxOptions['type'] = typein;
        ajaxOptions['data'] = datain;
        ajaxOptions['dataType'] = dataTypein;
        ajaxOptions['success'] = successFunction;
        ajaxOptions['error'] = errorFunction;

        $.ajax(ajaxOptions);
}

function PopulateModels( aD, responseStatus)
{
    $('#OutputStatus').html(`${aD['Message']} <br> for search:${aD['SearchCriteria']}<br> ${aD['Count']} records returned`);
    console.log(responseStatus)
    let result = aD['Results'];
    let target = $('#grid4');
    target.html("");
    for(let i = 0; i< result.length;i++)
    {
        let newCell = document.createElement('div');
        let newLabel = document.createElement('label');
        let newradio = document.createElement('input');
        newradio.setAttribute('type','radio');
        newradio.setAttribute('id',i);
        newradio.setAttribute('name','vehicle');
        newradio.setAttribute('value',result[i].Model_ID);
        newLabel.appendChild(newradio);
        newLabel.appendChild(document.createTextNode(result[i].Model_Name));
        newCell.append(newLabel);
        target.append(newCell);
    }

    $("input:radio").click(() =>
    {
        let selected = $('input[type = radio]:checked');
        $('#OutputStatus').html(`Model_Id of ${selected.val()} and Model name is ${selected.parent().text()}`)
    })

}

function errorHandler( aD, responseStatus,errorThrown)
{
    console.log('jsonError: ' + textStatus + ' : threw : ' + errorThrown);
    $('#OutputStatus').html('jsonError: ' + textStatus + ' : threw : ' + errorThrown);
}