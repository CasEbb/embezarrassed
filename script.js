// TODO - doesn't work on Chrome on Android
// todo - add the SQL stuff
// todo - make the ascii pam scroll up in the background at some point
// todo - typing "guest" ought to do something

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
var spinner = "_/|\\";

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

function add_transfer() {
    var account = "USD " + digits.random(4) + "-" + alphabet.concat(digits).random(6)
        + " - CHF " + alphabet.concat(digits).random(10);
    var transaction_id = "TRANSACTION ID: " + digits.random(4) + "-" + alphabet.concat(digits).random(9);

    var transfer = $("div.transfer.template").clone().removeClass("template");
    transfer.find("div.account").text(account);
    transfer.find("div.transaction").text(transaction_id);
    transfer.find('div.progressbar div.fill').data('width', 0);
    transfer.css("top", Math.floor(Math.random() * (window.innerHeight - $(".transfer.template").height() - parseInt($(".transfer.template").css('padding-right').slice(0, -2))*2)));
    transfer.css("left", Math.floor(Math.random() * (window.innerWidth - $(".transfer.template").width() - parseInt($(".transfer.template").css('padding-top').slice(0, -2))*2)));
    $("body").append( transfer );

    var wait = $.Deferred();

    var increment = function() {
        // increment the percentage by some amount
        var percent = parseInt(transfer.find("div.progressbar div.fill").data('width'));
        var increase = Math.floor(Math.random() * 10);
        percent = percent + increase;

        transfer.find("div.progressbar div.fill").data('width', percent)
        transfer.find("div.progressbar div.fill").animate( { width: percent + "%" }, 100 );
        transfer.find("div.transferring span.percent").text(percent + "%");

        // increment password guess
        var current = transfer.find("div.password span.password").text();
        transfer.find("div.password span.password").text( current + "*" );

        if (percent >= 100) {
            wait.resolve();
        } else {
            setTimeout( increment, Math.random() * 1000 );
        }
    }

    var spin = setInterval( function() {
        // flip the indicator
        var current = transfer.find("span.rotate").text();
        var next = spinner[ (spinner.indexOf( current ) + 1) % spinner.length ];
        transfer.find("span.rotate").text( next );
    }, Math.floor(Math.random() * 300) );


    var blink = setInterval( function() {
        // blink the password toggle
        transfer.find(".blink").toggle();
    }, 500);

    $("body").on('keydown', function(e) {
        if (e.keyCode == 27) {
            console.log("Transfer detected escape");
            wait.reject();
            clearInterval(spin);
            clearInterval(blink);
        }
    });

    increment();

    wait.done( function() {
        clearInterval(spin);
        transfer.fadeOut(100, function() {
            transfer.remove();
            clearInterval(blink);
        });
    }).fail( function() {
        console.log("Wait detected failure");
    });

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

    var scroll_transfers = setInterval( function() {
        // if there are more than 10 transfer windows, do nothing.
        // otherwise, set a new time in the future to create a new transfer window.

        if ($(".transfer").length <= 10) {
            setTimeout( add_transfer, Math.floor(Math.random() * 3000) );
        }

    }, 500);



    $("body").on('keydown', function(e) {
        if (e.keyCode == 27) {
            clearInterval(scroll_accounts);
            clearInterval(scroll_transfers);
        }
    });

});

