// ==UserScript==
// @name         ICPC Japan Standings Colorizer
// @namespace    https://github.com/riantkb/icpc_standing_colorizer
// @version      0.2.0
// @description  ICPC Japan Standings Colorizer
// @author       riantkb
// @match        http://www.yamagula.ic.i.u-tokyo.ac.jp/icpc2021/standings.html
// @match        https://icpcsec.firebaseapp.com/*
// @grant        none
// @updateURL    https://github.com/riantkb/icpc_standing_colorizer/raw/master/ICPC-Standings-Colorizer.user.js
// ==/UserScript==


function convertFromRatingToSpan(rating) {
    if (rating <= 0) {
        return `<span class="user-unrated">${rating}</span>`;
    }
    else if (rating < 400) {
        return `<span class="user-gray">${rating}</span>`;
    }
    else if (rating < 800) {
        return `<span class="user-brown">${rating}</span>`;
    }
    else if (rating < 1200) {
        return `<span class="user-green">${rating}</span>`;
    }
    else if (rating < 1600) {
        return `<span class="user-cyan">${rating}</span>`;
    }
    else if (rating < 2000) {
        return `<span class="user-blue">${rating}</span>`;
    }
    else if (rating < 2400) {
        return `<span class="user-yellow">${rating}</span>`;
    }
    else if (rating < 2800) {
        return `<span class="user-orange">${rating}</span>`;
    }
    else {
        return `<span class="user-red">${rating}</span>`;
    }
}


function domestic() {
    // console.log("domestic");
    var lines = document.querySelectorAll("td.main > div > table > tbody > tr");
    if (lines.length == 0) {
        setTimeout(domestic, 500);
        return;
    }
    fetch("https://raw.githubusercontent.com/riantkb/icpc_standing_colorizer/master/teams.json", { cache: "no-store" }).then(res => {
        res.json().then(team_dic => {
            var first = true;
            for (const e of lines) {
                if (first) {
                    first = false;
                    continue;
                }
                if (e == null) continue;
                var a = e.querySelector('td:nth-child(3)');
                if (a == null) continue;
                var tname = a.innerText.split("\n")[0];
                if (tname in team_dic) {
                    var team_rating = convertFromRatingToSpan(team_dic[tname]['team_rating'])
                    a.innerHTML += ` (${team_rating})<br>${team_dic[tname]['members'].join(', ')}`;
                }
            }
            var univ_count = [];
            first = true;
            for (const e of lines) {
                if (first) {
                    first = false;
                    continue;
                }
                if (e == null) continue;
                var a = e.querySelector('td:nth-child(4)');
                if (a == null) continue;
                var uname = a.innerText.split("\n")[0];
                if (uname in univ_count) {
                    univ_count[uname] += 1;
                } else {
                    univ_count[uname] = 1;
                }
            }
            var univ_rank = [];
            var pass_count = 0;
            var host = "Keio University";
            first = true;
            for (const e of lines) {
                if (first) {
                    first = false;
                    continue
                }
                if (e == null) continue;
                var a = e.querySelector('td:nth-child(4)');
                if (a == null) continue;
                var uname = a.innerText.split("\n")[0];
                var urank;
                if (uname in univ_rank) {
                    urank = univ_rank[uname] + 1;
                } else {
                    urank = 1;
                }
                univ_rank[uname] = urank;
                a.innerHTML += ` (${urank}/${univ_count[uname]})`;

                var pass = 0;
                if (pass_count < 10) {
                    pass = 1;
                } else if (pass_count < 20) {
                    if (urank <= 3) pass = 1;
                } else if (pass_count < 30) {
                    if (urank <= 2) pass = 1;
                } else if (pass_count < 39) {
                    if (urank <= 1) pass = 1;
                }
                if (pass == 0 && uname == host) {
                    pass = 2;
                    host = "";
                }
                if (pass > 0) {
                    var b = e.querySelector('td:nth-child(1)');
                    b.setAttribute('bgcolor', '#AAE0AA');
                    if (pass == 1) {
                        pass_count++;
                    }
                    else {
                        b.innerHTML += '*';
                    }
                }
            }
            for (let e of document.getElementsByClassName('user-red')) { e.style.color = "#FF0000" };
            for (let e of document.getElementsByClassName('user-orange')) { e.style.color = "#FF8000" };
            for (let e of document.getElementsByClassName('user-yellow')) { e.style.color = "#C0C000" };
            for (let e of document.getElementsByClassName('user-blue')) { e.style.color = "#0000FF" };
            for (let e of document.getElementsByClassName('user-cyan')) { e.style.color = "#00C0C0" };
            for (let e of document.getElementsByClassName('user-green')) { e.style.color = "#008000" };
            for (let e of document.getElementsByClassName('user-brown')) { e.style.color = "#804000" };
            for (let e of document.getElementsByClassName('user-gray')) { e.style.color = "#808080" };
            for (let e of document.getElementsByClassName('user-unrated')) { e.style.color = "#000000" };
            for (let e of document.getElementsByClassName('user-admin')) { e.style.color = "#C000C0" };
        }).catch(_e => {
            setTimeout(domestic, 3000);
        }).catch(_e => {
            setTimeout(domestic, 3000);
        })
    })
}


function regional() {
    // console.log("regional");
    var lines = document.querySelectorAll("div.team-col.team-name > span");
    // if (lines.length == 0) {
    //     setTimeout(regional, 500);
    //     return;
    // }
    fetch("https://raw.githubusercontent.com/riantkb/icpc_standing_colorizer/master/teams.json", { cache: "no-store" }).then(res => {
        res.json().then(team_dic => {
            for (const e of lines) {
                if (e == null) continue;
                var tname = e.innerText.split("\n")[0];
                if (tname in team_dic) {
                    var h = e.innerHTML
                    var team_rating = convertFromRatingToSpan(team_dic[tname]['team_rating'])
                    h = h.replace(tname, `${tname} (${team_rating})<br><small><span>${team_dic[tname]['members'].join(', ')}</span></small>`)
                    e.innerHTML = h
                }
            }
            for (let e of document.getElementsByClassName('user-red')) { e.style.color = "#FF0000" };
            for (let e of document.getElementsByClassName('user-orange')) { e.style.color = "#FF8000" };
            for (let e of document.getElementsByClassName('user-yellow')) { e.style.color = "#C0C000" };
            for (let e of document.getElementsByClassName('user-blue')) { e.style.color = "#0000FF" };
            for (let e of document.getElementsByClassName('user-cyan')) { e.style.color = "#00C0C0" };
            for (let e of document.getElementsByClassName('user-green')) { e.style.color = "#008000" };
            for (let e of document.getElementsByClassName('user-brown')) { e.style.color = "#804000" };
            for (let e of document.getElementsByClassName('user-gray')) { e.style.color = "#808080" };
            for (let e of document.getElementsByClassName('user-unrated')) { e.style.color = "#000000" };
            for (let e of document.getElementsByClassName('user-admin')) { e.style.color = "#C000C0" };
        }).catch(_e => {
            // setTimeout(regional, 3000);
        }).catch(_e => {
            // setTimeout(regional, 3000);
        })
    })
    setTimeout(main, 1000);
}

function main() {
    // console.log("main");
    var url = window.location.href;

    if (url.match(new RegExp(/www.yamagula.ic.i.u-tokyo.ac.jp/)) != null) {
        domestic();
    }
    else if (url.match(new RegExp(/icpcsec.firebaseapp.com\/standings/)) != null) {
        regional();
    }
    else {
        // console.log("no match url");
        setTimeout(main, 1000);
    }
}

(function () {
    'use strict';
    main();
})();

