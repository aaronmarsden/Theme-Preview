$(document).ready(function () {
    //basic variables for slide information
    var currentIndex = 0, //first slide
        slides = $('.slide'),
        slidesLength = slides.length; //how many slides
    $('.btn__prev').hide(); //hide previous button
    createDots(slidesLength); //funtion for creating pagination dots
    function cycleSlides(current) { //function which handles slide traversing
        var slide = $('.slide').eq(current);
        slides.hide();
        slide.show();
    }

    function markDots(position) { //function to add active class to active dot
        $('.paginationDot').removeClass('paginationDot--active');
        $('.paginationDot:nth-child(' + position + ')').addClass('paginationDot--active');
    }
    markDots(1); //add active class to the first dot
    cycleSlides(currentIndex);
    $('.btn__next').on('click', function () { //function for 'next' button
        $('.btn__prev').show(); //show the previous button
        currentIndex += 1 //increment the value of current slide
        cycleSlides(currentIndex); //call slide handle function
        if (currentIndex > slidesLength - 2) { //if it second to last slide show 'done' instead of 'next'
            // $('.btn__next').html('Done');
            $(".projectNextButton").css("display", "none");
            $(".projectCreateButton").css("display", "block");
            $('.btn__next').attr("disabled", true);
        } else {
            $('.btn__next').attr("disabled", false);
        }
        cycleSlides(currentIndex);
        markDots(currentIndex + 1);
    });
    $('.btn__prev').on('click', function () { //function for previous slide
        $('.btn__next').attr("disabled", false);
        $(".projectNextButton").css("display", "block");
        $(".projectCreateButton").css("display", "none");
        currentIndex -= 1;
        if (currentIndex <= 0) {
            $('.btn__prev').hide();
        } else if (currentIndex >= slidesLength - 2) {
            $('.btn__next').html('Next');
        }
        cycleSlides(currentIndex);
        markDots(currentIndex + 1);
    })
});

function createDots(length) { //function to create pagination dots
    for (i = 0; i <= length - 1; i++) {
        $('.pagination').append('<div class="paginationDot"></div>');
    }
}

var modal = document.getElementById("slideContainer");
var modalContainer = document.getElementById("modalContainer");

// Get the button that opens the modal
var btn = document.getElementById("createProjectButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    $(".modal").css("display", "block");
    modal.style.display = "block";
    $(".pagination").css("display", "flex");
}

// When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//     modal.style.display = "none";
// }


window.onclick = function (event) {
    if (event.target == modalContainer) {
        console.log("hello");
        modalContainer.style.display = "none";
    }
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            logoImage.src = e.target.result;
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imageUpload").change(function() {
    readURL(this);
});

//project slides
