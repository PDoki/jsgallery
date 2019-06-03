//vars to approach to the document
var $sn = document.getElementById('seach-name');
var $filterBtn = document.getElementsByClassName('filter-by-category');
var $sort = document.getElementById('sort');
var $preloader = document.getElementById('preloader');

//vars we need to create the lazy loading
var totalDisplayed = 0;
var done = false;

//if these 3 var-s are located inside the document.onscroll = function () local scope - there is a mistake in the console; but when they are declared in the global scope, Lazy Loading works only once. I failed solving this problem or getting the reason.
var sc = Math.ceil(window.scrollY);
var wh = window.innerHeight;
var dh = document.documentElement.scrollHeight;

//button 'scroll to the top'
var scrBtn = document.getElementById('upBtn');

//to make a button appear only when a user starts scrolling; the document.body I had to add so it works with Safari as well
window.onscroll = function () {
    if (document.documentElement.scrollTop > 20 || document.body.scrollTop > 20) {
        scrBtn.style.display = 'block';

    } else {
        scrBtn.style.display = 'none';
    }
}
//user clicks on the button
scrBtn.addEventListener('click', function () {
    //alert('it is here');
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

});

displayPics(pics, 9, true);
//Lazy loading
document.onscroll = function () {

    if (sc + wh == dh) {
        if (pics.length > totalDisplayed) {
            totalDisplayed += 9;
        } else if (pics.length == totalDisplayed) {
            done = true;
        } else {
            totalDisplayed = pics.length - totalDisplayed;
        }
        if (!done) {
            $preloader.style.display = 'block';
            setTimeout(function () {
                displayPics(pics, totalDisplayed, true);
                $preloader.style.display = 'none';
            }, 800);
        }
    }
};


//Sort by a - z and z - a
$sort.addEventListener('change', function (e) {
    var uChoice = e.target.value;
    done = true;
    if (uChoice.length == '') {
        displayPics(pics, totalDisplayed);
    } else {
        var picsCashe = Object.assign([], pics);
        picsCashe.sort(compare);
        if (uChoice === 'desc') picsCashe.reverse(compare);
        displayPics(picsCashe, picsCashe.length);
    }
});
//js compares the letters
function compare(z, y) {
    if (z.name < y.name) return -1;
    if (z.name > y.name) return 1;
    return 0;
}

//user chooses one of the categories on the main page
for (var i = 0; i < $filterBtn.length; i++) {
    $filterBtn[i].addEventListener('click', function (e) {
        e.preventDefault();
        done = true;
        var uCategory = e.target.text.toLowerCase();
        if (uCategory == 'all') {
            displayPics(pics, pics.length);
        } else {
            var filteredPics = pics.filter(function (pic) {
                return pic.category === uCategory;
            });
        }
        displayPics(filteredPics, filteredPics.length);
    });
}

//user search via input
$sn.addEventListener('keyup', function (e) {
    var uSearch = e.target.value.trim();

    if (uSearch.length > 0) {
        var picsFiltered = pics.filter(function (a) {
            return a.name.toLowerCase().indexOf(uSearch.toLowerCase()) == 0;
        });
        displayPics(picsFiltered, picsFiltered.length);
    } else {
        displayPics(pics, totalDisplayed);
    }
});

//display pictures in the html page
function displayPics(picsArray, len, mem) {
    var markup = '';

    if (typeof mem == 'boolean') totalDisplayed = len;

    for (var x = 0; x < len; x++) {
        var pic = picsArray[x];

        markup += '<div class="col-md-4 mt-5">' +
            '<div class="card">' +
            '<img class="card-img-top" src="images/' + pic.image + '" "alt="' + pic.name + ' photo">' +
            '<div class="card-body">' +
            '<h5 class="card-title text-center">' + pic.name + '</h5>' +
            '<p class="card-text">' + pic.description + '</p>' +
            '</div></div></div>';

    }

    document.getElementById('representationContainer').innerHTML = markup;
}


