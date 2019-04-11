/*
 * Botton change
 */
var abajo = "images//abajo.png";
var derecha = "images//derecha.png";
var months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
var days = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDEY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
var motnhModifier = 0;
var today = new Date();

main();

function main() {
    remaining();
    loadCalendar(today);
    var btnDelete = document.querySelectorAll(".delete");

    for (var i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", removeEmail);
    }

    document.querySelector("#imgIzquierdaCal").addEventListener("click", function () {
        monthChange(new Date(today.getFullYear(), today.getMonth() + --motnhModifier));
    });

    document.querySelector("#imgDerechaCal").addEventListener("click", function () {
        monthChange(new Date(today.getFullYear(), today.getMonth() + ++motnhModifier));
    });
}

$(document).ready(
    function () {

        $(".date > img").click(function () {
            if ($(this).attr("src") === abajo) {
                $(this).attr("src", derecha);
                $(this).parent().parent().siblings().hide()
            } else {
                $(this).attr("src", abajo);
                $(this).parent().parent().siblings().show()
            }
        });
    }
);

/*
 * Delete
 */
function removeEmail() {
    document.querySelector(".email[meta-email='" + this.getAttribute("meta-email") + "']").remove();

    remaining();
}

function remaining() {
    var msn = document.querySelectorAll(".delete").length;
    document.querySelector("#remain").innerText = msn;
}

/*
 * Calendar
 */
function loadCalendar(fecha) {
    document.querySelector("#date").innerText = fecha.getDate() + " / " + months[fecha.getMonth()] + " / " + days[fecha.getDay()];
    monthChange(fecha);
}

function monthChange(fecha) {
    document.querySelector("#calDate").innerText = months[fecha.getMonth()] + " " + fecha.getFullYear();
    setCalDays();
}

function setCalDays() {
    // *daysInMonth - https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d
    var daysInMonth = 32 - new Date(today.getFullYear(), today.getMonth() + motnhModifier, 32).getDate();

    var daysMonth = document.querySelectorAll(".calCol > span");
    var dayModifier = new Date(today.getFullYear(), today.getMonth() + motnhModifier, 1).getDay();

    for (var i = 0; i < daysMonth.length; i++) {
        daysMonth[i].innerText = "";
    }

    for (var i = 0; i < daysInMonth; i++) {
        daysMonth[i + dayModifier].innerText = i + 1;
    }
}

/*
 * WEB API
 */

var uri = "api/mywebapi/";

/*
 * Submen�
 */
$.post(uri + "GetCurrentUser")
    .done(function (data) {
        document.querySelector("#current_user_name").innerHTML = data.UserRS.Name + " " + data.UserRS.Surnames;
        document.querySelector("#current_user_img").src = data.UserRS.Avatar;
    });


// Puntuaci�
$.post(uri + "GetPoints")
    .done(function (data) {
        // Li passem la informaci� dels punts del usuari dins la seva posici� del html
        document.querySelector("#user_points").innerHTML = "Total Points " + data.PointsRS.Points;
    });


// Recordatoris del calendari
$(document).ready(
    function () {
        // Recordatoris del calendari
        $.post(uri + "GetReminders")
            .done(function (data) {

                // Amagam els blocks de la secci� del event
                $("#calInfoCliente, #calInfoZone, #calcInfoInfo").css("display", "none");

                // Si cliquem damunt un dia...
                $(".calCol").on("click", function () {

                    $(this).css({ "color": "white", "background-color": "#FF5B33", "border-radius": "800px" });

                    // Llevarem el display de tot el contingut del recordatori per poder ser visible
                    $("#calInfoCliente, #calInfoZone, #calcInfoInfo").css("display", "");

                    if (today == data.Memory.ReminderDate) {
                        // Passarem la informaci� que hi ha emmagatzemada a la base de dades, dins cada una de les seves posicions del html
                        document.querySelector("#description").innerHTML = data.Memory.Description;
                        document.querySelector("#reminder-date").innerHTML = data.Memory.ReminderDate;
                        document.querySelector("#title").innerHTML = data.Memory.Title;
                        document.querySelector("#address").innerHTML = data.Memory.Address;
                        document.querySelector("#phone-number").innerHTML = data.Memory.PhoneNumber;
                    }

                    // En clicar damunt la creu del recordatori, aquest es tancar�
                    $("#img-cruz").on("click", function () {
                        $("#calInfoZone, #calcInfoInfo").css("display", "none");
                    });
            });

        // Li canviem el color quan passem per damunt el dia 
        $(".calCol").hover(
            function () { $(this).css({ "color": "#33BBFF", "background-color": "#FF3374", "border-radius": "800px" }) },
            function () { $(this).css({ "color": "", "background-color": "" }) }
        );
    });
    });