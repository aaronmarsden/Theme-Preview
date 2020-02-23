// Append template

$(document).ready(function() {
    var parsedBody = $.parseHTML(project.body);
    $("#mainContainer").append(parsedBody);
    $('#imagePreview').css('background-image', 'url('+ $(".mainNavbarImage").first().attr("src") +')');
    $("#background-imagePreview").css("background-image", $(".mainHeader").first().css("background-image"))
    $("#topHeadlineInput").val($("#mainHeadline").text());
    $("#subHeadlineInput").val($("#mainSubheadline").text());
    $("#buttonTextInput").val($("#mainButton").text());
});


// Sidebar Functions

function openNav() {
    // $("#sideNav").width("300px");
    $("#sideNav").toggleClass("collapsed");
    // $("#main").css("margin-left", "300px");
}

function closeNav() {
    // $("#sideNav").width("0px");
    $("#sideNav").toggleClass("collapsed");
    // $("#main").css("margin-left", "0px");
}

$("#sideNavSwitcherInput").change(function() {
    if (this.checked) {
        openNav();
        $("#openPanelIcon").css("display", "none");
        $("#closePanelIcon").css("display", "block");
    } else {
        closeNav();
        $("#closePanelIcon").css("display", "none");
        $("#openPanelIcon").css("display", "block");
    }
});

// On change input updates

$("#topHeadlineInput").on('input', function() {
    $("#mainHeadline").text($(this).val());
});

// +++++++++++++++++++++++++++++++
//  NEED TO CHANGE THIS GLOBAL VARIABLE? MAYBE
// +++++++++++++++++++++++++++++++

var logoImage = {};

function saveToDatabase(template, user, project, htmlToSave) {
    $.ajax({
        method: "POST",
        data: {template: template, user: user, project: project, htmlToSave: htmlToSave},
        url: "/saveproject?_method=PUT"
    })
    .fail(function(err){
        console.log(err);
    });
}


$('#inputForm').submit(function() {
    if (!$("#imageUpload").val() && !$("#background-imageUpload").val()) {
        $("#mainHeadline").text($("#topHeadlineInput").val());
        $("#mainSubheadline").text($("#subHeadlineInput").val());
        $("#mainButton").text($("#buttonTextInput").val());
        var htmlToSave = $("#mainContainer").prop("innerHTML");
        saveToDatabase(template, user, project, htmlToSave);
    } else {
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                $("#mainHeadline").text($("#topHeadlineInput").val());
                $("#mainSubheadline").text($("#subHeadlineInput").val());
                $("#mainButton").text($("#buttonTextInput").val());
                response.files.logoImage ? $(".mainNavbarImage").attr("src", response.files.logoImage[0].path) : null;
                response.files.backgroundImage ? $(".mainHeader").css("background-image", 'url(' + response.files.backgroundImage[0].path + ')') : null;
                var htmlToSave = $("#mainContainer").prop("innerHTML");
                saveToDatabase(template, user, project, htmlToSave);
                $("#imageUpload").val("");
                $("#background-imageUpload").val("");
            }
        });
    }
    //Disable the page refresh.
    return false;
});   

// $("#inputSubmit").click(function() {;
//     $(".mainNavbarImage").attr("src", logoImage.src);
//     $(".mainHeader").css("background-image", 'url('+ logoImage.background +')')
//     var htmlToSave = $("#mainContainer").prop("innerHTML");
//     saveToDatabase(template, user, project, htmlToSave);
//     // Save the project
// });

// Logo Image Upload 

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

// Background Image Upload

function backgroundReadURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#background-imagePreview').css('background-image', 'url('+e.target.result +')');
            logoImage.background = e.target.result;
            $('#background-imagePreview').hide();
            $('#background-imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#background-imageUpload").change(function() {
    backgroundReadURL(this);
});
