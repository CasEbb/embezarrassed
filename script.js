String.prototype.random = function(count) {
    if (typeof(count) == "undefined") {
        count = 1;
    }
    var value = "";
    while(count--) {
        value += this[ Math.floor( Math.random() * this.length ) ];
    }
    return value;
}

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var digits = "0123456789";
var printable = "";
for(var i = 33; i <= 64; i++) {
    printable = printable + String.fromCharCode(i);
}

function add_account_row() {
    // three digits only
    var pk = digits.random(3);
    // \d{6}[:ascii-33-64:]\d{6}[A-Z]
    var acct_num = digits.random(6) + printable.random() + digits.random(6) + alphabet.random();
    var tp = alphabet.random() + digits.random(2) + printable.random() + digits.random(1);
    var rrcl = alphabet.concat(digits).random(6);
    var to_pk = alphabet.concat(digits).random(6);

    var row = $("table.accounts tr.template").clone().removeClass("template").addClass("account");
    row.find("td.pk").text(pk);
    row.find("td.acct_num").text(acct_num);
    row.find("td.tp").text(tp);
    row.find("td.rrcl").text(rrcl);
    row.find("td.to_pk").text(to_pk);
    $("table.accounts").append(row);
}


$(document).ready( function() {
    var scroll_accounts = setInterval( function() {

        while ($(window).height() <= window.innerHeight) {
            // on start, fill screen with accounts
            // after that, add one at a time.
            add_account_row();
        }

        while ($(window).height() > window.innerHeight) {
            $("tr.template + tr").remove();
        }

        if (Math.random() * 100 < 30) {
            // highlight a new row
            $("tr.highlight").removeClass('highlight');

            $("tr.account").eq( Math.floor(Math.random() * $("tr.account").length) ).addClass("highlight");
        }

    }, 200 );

    $("body").on('keydown', function(e) {
        if (e.keyCode == 27) {
            clearInterval(scroll_accounts);
        }
    });

});
