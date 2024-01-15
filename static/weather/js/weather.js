function showDetailedForecast(e){
    console.log(e);
    details = document.getElementById(e);
    shown_details = document.getElementsByClassName('detailedCard');
    for (var i = 0; i < shown_details.length; i++) {
        shown_details[i].classList.remove('dc-show');
    }
    details.classList.add('dc-show');
}

function toggleSearchType() {
    var searchType = document.querySelector('input[name="searchType"]:checked').value;
    var searchZip = document.getElementById('searchZip');
    var searchAddress = document.getElementById('searchAddress');
    
    if (searchType === 'zip') {
        searchZip.style.display = '';
        searchAddress.style.display = 'none';
    } else {
        searchZip.style.display = 'none';
        searchAddress.style.display = '';
    }
}