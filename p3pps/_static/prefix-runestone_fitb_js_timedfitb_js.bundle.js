(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_timedfitb_js"],{

/***/ 68007:
/*!*************************************!*\
  !*** ./runestone/fitb/css/fitb.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 86151:
/*!*******************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.en.js ***!
  \*******************************************/
/***/ (() => {

$.i18n().load({
    en: {
        msg_no_answer: "No answer provided.",
        msg_fitb_check_me: "Check me",
        msg_fitb_compare_me: "Compare me",
    },
});


/***/ }),

/***/ 61353:
/*!**********************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.pt-br.js ***!
  \**********************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_no_answer: "Nenhuma resposta dada.",
        msg_fitb_check_me: "Verificar",
        msg_fitb_compare_me: "Comparar"
    },
});


/***/ }),

/***/ 99184:
/*!***********************************!*\
  !*** ./runestone/fitb/js/fitb.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FITB)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fitb-i18n.en.js */ 86151);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fitb-i18n.pt-br.js */ 61353);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _css_fitb_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../css/fitb.css */ 68007);
// *********
// |docname|
// *********
// This file contains the JS for the Runestone fillintheblank component. It was created By Isaiah Mayerchak and Kirby Olson, 6/4/15 then revised by Brad Miller, 2/7/20.







// FITB constructor
class FITB extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <p> element
        this.useRunestoneServices = opts.useRunestoneServices;
        this.origElem = orig;
        this.divid = orig.id;
        this.correct = null;
        // See comments in fitb.py for the format of ``feedbackArray`` (which is identical in both files).
        //
        // Find the script tag containing JSON and parse it. See `SO <https://stackoverflow.com/questions/9320427/best-practice-for-embedding-arbitrary-json-in-the-dom>`_. If this parses to ``false``, then no feedback is available; server-side grading will be performed.
        this.feedbackArray = JSON.parse(
            this.scriptSelector(this.origElem).html()
        );
        this.createFITBElement();
        this.caption = "Fill in the Blank";
        this.addCaption("runestone");
        this.checkServer("fillb", true);
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }
    // Find the script tag containing JSON in a given root DOM node.
    scriptSelector(root_node) {
        return $(root_node).find(`script[type="application/json"]`);
    }
    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    createFITBElement() {
        this.renderFITBInput();
        this.renderFITBButtons();
        this.renderFITBFeedbackDiv();
        // replaces the intermediate HTML for this component with the rendered HTML of this component
        $(this.origElem).replaceWith(this.containerDiv);
    }
    renderFITBInput() {
        // The text [input] elements are created by the template.
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        // Copy the original elements to the container holding what the user will see.
        $(this.origElem).children().clone().appendTo(this.containerDiv);
        // Remove the script tag.
        this.scriptSelector(this.containerDiv).remove();
        // Set the class for the text inputs, then store references to them.
        let ba = $(this.containerDiv).find(":input");
        ba.attr("class", "form form-control selectwidthauto");
        ba.attr("aria-label", "input area");
        this.blankArray = ba.toArray();
        // When a blank is changed mark this component as interacted with.
        // And set a class on the component in case we want to render components that have been used
        // differently
        for (let blank of this.blankArray) {
            $(blank).change(this.recordAnswered.bind(this));
        }
    }

    recordAnswered() {
        this.isAnswered = true;
        //let rcontainer = this.containerDiv.closest(".runestone");
        //rcontainer.addClass("answered");
    }

    renderFITBButtons() {
        // "submit" button and "compare me" button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = $.i18n("msg_fitb_check_me");
        $(this.submitButton).attr({
            class: "btn btn-success",
            name: "do answer",
            type: "button",
        });
        this.submitButton.addEventListener(
            "click",
            function () {
                this.checkCurrentAnswer();
                this.logCurrentAnswer();
            }.bind(this),
            false
        );
        this.containerDiv.appendChild(document.createElement("br"));
        this.containerDiv.appendChild(document.createElement("br"));
        this.containerDiv.appendChild(this.submitButton);
        if (this.useRunestoneServices) {
            this.compareButton = document.createElement("button");
            $(this.compareButton).attr({
                class: "btn btn-default",
                id: this.origElem.id + "_bcomp",
                disabled: "",
                name: "compare",
            });
            this.compareButton.textContent = $.i18n("msg_fitb_compare_me");
            this.compareButton.addEventListener(
                "click",
                function () {
                    this.compareFITBAnswers();
                }.bind(this),
                false
            );
            this.containerDiv.appendChild(this.compareButton);
        }
        this.containerDiv.appendChild(document.createElement("div"));
    }
    renderFITBFeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        this.feedBackDiv.id = this.divid + "_feedback";
        this.containerDiv.appendChild(document.createElement("br"));
        this.containerDiv.appendChild(this.feedBackDiv);
    }
    /*===================================
    === Checking/loading from storage ===
    ===================================*/
    restoreAnswers(data) {
        var arr;
        // Restore answers from storage retrieval done in RunestoneBase.
        try {
            // The newer format encodes data as a JSON object.
            arr = JSON.parse(data.answer);
            // The result should be an array. If not, try comma parsing instead.
            if (!Array.isArray(arr)) {
                throw new Error();
            }
        } catch (err) {
            // The old format didn't.
            arr = data.answer.split(",");
        }
        for (var i = 0; i < this.blankArray.length; i++) {
            $(this.blankArray[i]).attr("value", arr[i]);
        }
        // Use the feedback from the server, or recompute it locally.
        if (!this.feedbackArray) {
            this.displayFeed = data.displayFeed;
            this.correct = data.correct;
            this.isCorrectArray = data.isCorrectArray;
            // Only render if all the data is present; local storage might have old data missing some of these items.
            if (
                typeof this.displayFeed !== "undefined" &&
                typeof this.correct !== "undefined" &&
                typeof this.isCorrectArray !== "undefined"
            ) {
                this.renderFeedback();
            }
        } else {
            this.checkCurrentAnswer();
        }
    }
    checkLocalStorage() {
        // Loads previous answers from local storage if they exist
        var storedData;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                try {
                    storedData = JSON.parse(ex);
                    var arr = storedData.answer;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(err.message);
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                this.restoreAnswers(storedData);
            }
        }
    }
    setLocalStorage(data) {
        let key = this.localStorageKey();
        localStorage.setItem(key, JSON.stringify(data));
    }

    checkCurrentAnswer() {
        // Start of the evaluation chain
        this.isCorrectArray = [];
        this.displayFeed = [];
        this.given_arr = [];
        for (var i = 0; i < this.blankArray.length; i++)
            this.given_arr.push(this.blankArray[i].value);
        if (this.useRunestoneServices) {
            if (eBookConfig.enableCompareMe) {
                this.enableCompareButton();
            }
        }
        // Grade locally if we can't ask the server to grade.
        if (this.feedbackArray) {
            this.evaluateAnswers();
            if (!this.isTimed) {
                this.renderFeedback();
            }
        }
    }

    async logCurrentAnswer(sid) {
        let answer = JSON.stringify(this.given_arr);
        // Save the answer locally.
        let feedback = true;
        this.setLocalStorage({
            answer: answer,
            timestamp: new Date(),
        });
        let data = {
            event: "fillb",
            act: answer || "",
            answer: answer || "",
            correct: this.correct ? "T" : "F",
            div_id: this.divid,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
            feedback = false;
        }
        // Per `logBookEvent <logBookEvent>`, the result is undefined if there's no server. Otherwise, the server provides the endpoint-specific results in ``data.details``; see `make_json_response`.
        data = await this.logBookEvent(data);
        let detail = data && data.detail;
        if (!feedback) return;
        if (!this.feedbackArray) {
            // On success, update the feedback from the server's grade.
            this.setLocalStorage({
                answer: answer,
                timestamp: detail.timestamp,
            });
            this.correct = detail.correct;
            this.displayFeed = detail.displayFeed;
            this.isCorrectArray = detail.isCorrectArray;
            if (!this.isTimed) {
                this.renderFeedback();
            }
        }
        return detail;
    }

    /*==============================
    === Evaluation of answer and ===
    ===     display feedback     ===
    ==============================*/
    // Inputs:
    //
    // - Strings entered by the student in ``this.blankArray[i].value``.
    // - Feedback in ``this.feedbackArray``.
    //
    // Outputs:
    //
    // - ``this.displayFeed`` is an array of HTML feedback.
    // - ``this.isCorrectArray`` is an array of true, false, or null (the question wasn't answered).
    // - ``this.correct`` is true, false, or null (the question wasn't answered).
    evaluateAnswers() {
        // Keep track if all answers are correct or not.
        this.correct = true;
        for (var i = 0; i < this.blankArray.length; i++) {
            var given = this.blankArray[i].value;
            // If this blank is empty, provide no feedback for it.
            if (given === "") {
                this.isCorrectArray.push(null);
                this.displayFeed.push($.i18n("msg_no_answer"));
                this.correct = false;
            } else {
                // Look through all feedback for this blank. The last element in the array always matches. If no feedback for this blank exists, use an empty list.
                var fbl = this.feedbackArray[i] || [];
                for (var j = 0; j < fbl.length; j++) {
                    // The last item of feedback always matches.
                    if (j === fbl.length - 1) {
                        this.displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                    // If this is a regexp...
                    if ("regex" in fbl[j]) {
                        var patt = RegExp(
                            fbl[j]["regex"],
                            fbl[j]["regexFlags"]
                        );
                        if (patt.test(given)) {
                            this.displayFeed.push(fbl[j]["feedback"]);
                            break;
                        }
                    } else {
                        // This is a number.
                        console.assert("number" in fbl[j]);
                        var [min, max] = fbl[j]["number"];
                        // Convert the given string to a number. While there are `lots of ways <https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls>`_ to do this; this version supports other bases (hex/binary/octal) as well as floats.
                        var actual = +given;
                        if (actual >= min && actual <= max) {
                            this.displayFeed.push(fbl[j]["feedback"]);
                            break;
                        }
                    }
                }
                // The answer is correct if it matched the first element in the array. A special case: if only one answer is provided, count it wrong; this is a misformed problem.
                let is_correct = j === 0 && fbl.length > 1;
                this.isCorrectArray.push(is_correct);
                if (!is_correct) {
                    this.correct = false;
                }
            }
        }
        this.percent =
            this.isCorrectArray.filter(Boolean).length / this.blankArray.length;
    }

    renderFeedback() {
        if (this.correct) {
            $(this.feedBackDiv).attr("class", "alert alert-info");
            for (let j = 0; j < this.blankArray.length; j++) {
                $(this.blankArray[j]).removeClass("input-validation-error");
            }
        } else {
            if (this.displayFeed === null) {
                this.displayFeed = "";
            }
            for (let j = 0; j < this.blankArray.length; j++) {
                if (this.isCorrectArray[j] !== true) {
                    $(this.blankArray[j]).addClass("input-validation-error");
                } else {
                    $(this.blankArray[j]).removeClass("input-validation-error");
                }
            }
            $(this.feedBackDiv).attr("class", "alert alert-danger");
        }
        var feedback_html = "<ul>";
        for (var i = 0; i < this.displayFeed.length; i++) {
            feedback_html += "<li>" + this.displayFeed[i] + "</li>";
        }
        feedback_html += "</ul>";
        // Remove the list if it's just one element.
        if (this.displayFeed.length == 1) {
            feedback_html = feedback_html.slice(
                "<ul><li>".length,
                -"</li></ul>".length
            );
        }
        this.feedBackDiv.innerHTML = feedback_html;
        if (typeof MathJax !== "undefined") {
            this.queueMathJax(document.body);
        }
    }

    /*==================================
    === Functions for compare button ===
    ==================================*/
    enableCompareButton() {
        this.compareButton.disabled = false;
    }
    // _`compareFITBAnswers`
    compareFITBAnswers() {
        var data = {};
        data.div_id = this.divid;
        data.course = eBookConfig.course;
        jQuery.get(
            `${eBookConfig.new_server_prefix}/assessment/gettop10Answers`,
            data,
            this.compareFITB
        );
    }
    compareFITB(data, status, whatever) {
        var answers = data.detail.res;
        var misc = data.detail.miscdata;
        var body = "<table>";
        body += "<tr><th>Answer</th><th>Count</th></tr>";
        for (var row in answers) {
            body +=
                "<tr><td>" +
                answers[row].answer +
                "</td><td>" +
                answers[row].count +
                " times</td></tr>";
        }
        body += "</table>";
        var html =
            "<div class='modal fade'>" +
            "    <div class='modal-dialog compare-modal'>" +
            "        <div class='modal-content'>" +
            "            <div class='modal-header'>" +
            "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
            "                <h4 class='modal-title'>Top Answers</h4>" +
            "            </div>" +
            "            <div class='modal-body'>" +
            body +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>";
        var el = $(html);
        el.modal();
    }

    disableInteraction() {
        for (var i = 0; i < this.blankArray.length; i++) {
            this.blankArray[i].disabled = true;
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=fillintheblank]").each(function (index) {
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            try {
                window.componentMap[this.id] = new FITB(opts);
            } catch (err) {
                console.log(
                    `Error rendering Fill in the Blank Problem ${this.id}
                     Details: ${err}`
                );
            }
        }
    });
});


/***/ }),

/***/ 74309:
/*!****************************************!*\
  !*** ./runestone/fitb/js/timedfitb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedFITB)
/* harmony export */ });
/* harmony import */ var _fitb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fitb.js */ 99184);

class TimedFITB extends _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.inputDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }
    hideButtons() {
        $(this.submitButton).hide();
        $(this.compareButton).hide();
    }
    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        $(timeIcon).attr({
            src: "../_static/clock.png",
            style: "width:15px;height:15px",
        });
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        $(component).prepend(timeIconDiv);
    }
    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.blankArray.length; i++) {
            $(this.blankArray[i]).removeClass("input-validation-error");
        }
        this.feedBackDiv.style.display = "none";
    }

    reinitializeListeners() {
        for (let blank of this.blankArray) {
            $(blank).change(this.recordAnswered.bind(this));
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.fillintheblank = function (opts) {
    if (opts.timed) {
        return new TimedFITB(opts);
    }
    return new _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9maXRiX2pzX3RpbWVkZml0Yl9qcy5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7QUNORDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNORDtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUVnRDtBQUNsQztBQUNHO0FBQ0w7O0FBRXpCO0FBQ2UsbUJBQW1CLG1FQUFhO0FBQy9DO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd09BQXdPO0FBQ3hPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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M0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxnREFBSTtBQUNuQiIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9jc3MvZml0Yi5jc3M/OWViZCIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi1pMThuLmVuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgfSxcbn0pO1xuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTmVuaHVtYSByZXNwb3N0YSBkYWRhLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJhclwiXG4gICAgfSxcbn0pO1xuIiwiLy8gKioqKioqKioqXG4vLyB8ZG9jbmFtZXxcbi8vICoqKioqKioqKlxuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgdGhlIFJ1bmVzdG9uZSBmaWxsaW50aGVibGFuayBjb21wb25lbnQuIEl0IHdhcyBjcmVhdGVkIEJ5IElzYWlhaCBNYXllcmNoYWsgYW5kIEtpcmJ5IE9sc29uLCA2LzQvMTUgdGhlbiByZXZpc2VkIGJ5IEJyYWQgTWlsbGVyLCAyLzcvMjAuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBGSVRCIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGSVRCIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudFxuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAvLyBTZWUgY29tbWVudHMgaW4gZml0Yi5weSBmb3IgdGhlIGZvcm1hdCBvZiBgYGZlZWRiYWNrQXJyYXlgYCAod2hpY2ggaXMgaWRlbnRpY2FsIGluIGJvdGggZmlsZXMpLlxuICAgICAgICAvL1xuICAgICAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF8uIElmIHRoaXMgcGFyc2VzIHRvIGBgZmFsc2VgYCwgdGhlbiBubyBmZWVkYmFjayBpcyBhdmFpbGFibGU7IHNlcnZlci1zaWRlIGdyYWRpbmcgd2lsbCBiZSBwZXJmb3JtZWQuXG4gICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICB0aGlzLnNjcmlwdFNlbGVjdG9yKHRoaXMub3JpZ0VsZW0pLmh0bWwoKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNyZWF0ZUZJVEJFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiRmlsbCBpbiB0aGUgQmxhbmtcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZmlsbGJcIiwgdHJ1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gICAgc2NyaXB0U2VsZWN0b3Iocm9vdF9ub2RlKSB7XG4gICAgICAgIHJldHVybiAkKHJvb3Rfbm9kZSkuZmluZChgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZUZJVEJFbGVtZW50KCkge1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJJbnB1dCgpO1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJCdXR0b25zKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQkZlZWRiYWNrRGl2KCk7XG4gICAgICAgIC8vIHJlcGxhY2VzIHRoZSBpbnRlcm1lZGlhdGUgSFRNTCBmb3IgdGhpcyBjb21wb25lbnQgd2l0aCB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGlzIGNvbXBvbmVudFxuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgcmVuZGVyRklUQklucHV0KCkge1xuICAgICAgICAvLyBUaGUgdGV4dCBbaW5wdXRdIGVsZW1lbnRzIGFyZSBjcmVhdGVkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIC8vIENvcHkgdGhlIG9yaWdpbmFsIGVsZW1lbnRzIHRvIHRoZSBjb250YWluZXIgaG9sZGluZyB3aGF0IHRoZSB1c2VyIHdpbGwgc2VlLlxuICAgICAgICAkKHRoaXMub3JpZ0VsZW0pLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgc2NyaXB0IHRhZy5cbiAgICAgICAgdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLmNvbnRhaW5lckRpdikucmVtb3ZlKCk7XG4gICAgICAgIC8vIFNldCB0aGUgY2xhc3MgZm9yIHRoZSB0ZXh0IGlucHV0cywgdGhlbiBzdG9yZSByZWZlcmVuY2VzIHRvIHRoZW0uXG4gICAgICAgIGxldCBiYSA9ICQodGhpcy5jb250YWluZXJEaXYpLmZpbmQoXCI6aW5wdXRcIik7XG4gICAgICAgIGJhLmF0dHIoXCJjbGFzc1wiLCBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiKTtcbiAgICAgICAgYmEuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJpbnB1dCBhcmVhXCIpO1xuICAgICAgICB0aGlzLmJsYW5rQXJyYXkgPSBiYS50b0FycmF5KCk7XG4gICAgICAgIC8vIFdoZW4gYSBibGFuayBpcyBjaGFuZ2VkIG1hcmsgdGhpcyBjb21wb25lbnQgYXMgaW50ZXJhY3RlZCB3aXRoLlxuICAgICAgICAvLyBBbmQgc2V0IGEgY2xhc3Mgb24gdGhlIGNvbXBvbmVudCBpbiBjYXNlIHdlIHdhbnQgdG8gcmVuZGVyIGNvbXBvbmVudHMgdGhhdCBoYXZlIGJlZW4gdXNlZFxuICAgICAgICAvLyBkaWZmZXJlbnRseVxuICAgICAgICBmb3IgKGxldCBibGFuayBvZiB0aGlzLmJsYW5rQXJyYXkpIHtcbiAgICAgICAgICAgICQoYmxhbmspLmNoYW5nZSh0aGlzLnJlY29yZEFuc3dlcmVkLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIC8vbGV0IHJjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckRpdi5jbG9zZXN0KFwiLnJ1bmVzdG9uZVwiKTtcbiAgICAgICAgLy9yY29udGFpbmVyLmFkZENsYXNzKFwiYW5zd2VyZWRcIik7XG4gICAgfVxuXG4gICAgcmVuZGVyRklUQkJ1dHRvbnMoKSB7XG4gICAgICAgIC8vIFwic3VibWl0XCIgYnV0dG9uIGFuZCBcImNvbXBhcmUgbWVcIiBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9ICQuaTE4bihcIm1zZ19maXRiX2NoZWNrX21lXCIpO1xuICAgICAgICAkKHRoaXMuc3VibWl0QnV0dG9uKS5hdHRyKHtcbiAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tc3VjY2Vzc1wiLFxuICAgICAgICAgICAgbmFtZTogXCJkbyBhbnN3ZXJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogXCJcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImNvbXBhcmVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY29tcGFyZV9tZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyZUZJVEJBbnN3ZXJzKCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jb21wYXJlQnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICB9XG4gICAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICB2YXIgYXJyO1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2UuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBUaGUgbmV3ZXIgZm9ybWF0IGVuY29kZXMgZGF0YSBhcyBhIEpTT04gb2JqZWN0LlxuICAgICAgICAgICAgYXJyID0gSlNPTi5wYXJzZShkYXRhLmFuc3dlcik7XG4gICAgICAgICAgICAvLyBUaGUgcmVzdWx0IHNob3VsZCBiZSBhbiBhcnJheS4gSWYgbm90LCB0cnkgY29tbWEgcGFyc2luZyBpbnN0ZWFkLlxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBUaGUgb2xkIGZvcm1hdCBkaWRuJ3QuXG4gICAgICAgICAgICBhcnIgPSBkYXRhLmFuc3dlci5zcGxpdChcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2ldKS5hdHRyKFwidmFsdWVcIiwgYXJyW2ldKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBVc2UgdGhlIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlciwgb3IgcmVjb21wdXRlIGl0IGxvY2FsbHkuXG4gICAgICAgIGlmICghdGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gZGF0YS5kaXNwbGF5RmVlZDtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBkYXRhLmlzQ29ycmVjdEFycmF5O1xuICAgICAgICAgICAgLy8gT25seSByZW5kZXIgaWYgYWxsIHRoZSBkYXRhIGlzIHByZXNlbnQ7IGxvY2FsIHN0b3JhZ2UgbWlnaHQgaGF2ZSBvbGQgZGF0YSBtaXNzaW5nIHNvbWUgb2YgdGhlc2UgaXRlbXMuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuZGlzcGxheUZlZWQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5jb3JyZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuaXNDb3JyZWN0QXJyYXkgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIC8vIExvYWRzIHByZXZpb3VzIGFuc3dlcnMgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBzdG9yZWREYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIC8vIFN0YXJ0IG9mIHRoZSBldmFsdWF0aW9uIGNoYWluXG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFtdO1xuICAgICAgICB0aGlzLmdpdmVuX2FyciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHRoaXMuZ2l2ZW5fYXJyLnB1c2godGhpcy5ibGFua0FycmF5W2ldLnZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy5lbmFibGVDb21wYXJlTWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZUNvbXBhcmVCdXR0b24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBHcmFkZSBsb2NhbGx5IGlmIHdlIGNhbid0IGFzayB0aGUgc2VydmVyIHRvIGdyYWRlLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICB0aGlzLmV2YWx1YXRlQW5zd2VycygpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVGltZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpO1xuICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgbG9jYWxseS5cbiAgICAgICAgbGV0IGZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICAgICAgICBhY3Q6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgICAgIGZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUGVyIGBsb2dCb29rRXZlbnQgPGxvZ0Jvb2tFdmVudD5gLCB0aGUgcmVzdWx0IGlzIHVuZGVmaW5lZCBpZiB0aGVyZSdzIG5vIHNlcnZlci4gT3RoZXJ3aXNlLCB0aGUgc2VydmVyIHByb3ZpZGVzIHRoZSBlbmRwb2ludC1zcGVjaWZpYyByZXN1bHRzIGluIGBgZGF0YS5kZXRhaWxzYGA7IHNlZSBgbWFrZV9qc29uX3Jlc3BvbnNlYC5cbiAgICAgICAgZGF0YSA9IGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgICAgICBsZXQgZGV0YWlsID0gZGF0YSAmJiBkYXRhLmRldGFpbDtcbiAgICAgICAgaWYgKCFmZWVkYmFjaykgcmV0dXJuO1xuICAgICAgICBpZiAoIXRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gT24gc3VjY2VzcywgdXBkYXRlIHRoZSBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIncyBncmFkZS5cbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IGRldGFpbC50aW1lc3RhbXAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGRldGFpbC5jb3JyZWN0O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IGRldGFpbC5kaXNwbGF5RmVlZDtcbiAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBkZXRhaWwuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV0YWlsO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEV2YWx1YXRpb24gb2YgYW5zd2VyIGFuZCA9PT1cbiAgICA9PT0gICAgIGRpc3BsYXkgZmVlZGJhY2sgICAgID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLy8gSW5wdXRzOlxuICAgIC8vXG4gICAgLy8gLSBTdHJpbmdzIGVudGVyZWQgYnkgdGhlIHN0dWRlbnQgaW4gYGB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWVgYC5cbiAgICAvLyAtIEZlZWRiYWNrIGluIGBgdGhpcy5mZWVkYmFja0FycmF5YGAuXG4gICAgLy9cbiAgICAvLyBPdXRwdXRzOlxuICAgIC8vXG4gICAgLy8gLSBgYHRoaXMuZGlzcGxheUZlZWRgYCBpcyBhbiBhcnJheSBvZiBIVE1MIGZlZWRiYWNrLlxuICAgIC8vIC0gYGB0aGlzLmlzQ29ycmVjdEFycmF5YGAgaXMgYW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgIC8vIC0gYGB0aGlzLmNvcnJlY3RgYCBpcyB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgZXZhbHVhdGVBbnN3ZXJzKCkge1xuICAgICAgICAvLyBLZWVwIHRyYWNrIGlmIGFsbCBhbnN3ZXJzIGFyZSBjb3JyZWN0IG9yIG5vdC5cbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBnaXZlbiA9IHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZTtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgYmxhbmsgaXMgZW1wdHksIHByb3ZpZGUgbm8gZmVlZGJhY2sgZm9yIGl0LlxuICAgICAgICAgICAgaWYgKGdpdmVuID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQucHVzaCgkLmkxOG4oXCJtc2dfbm9fYW5zd2VyXCIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTG9vayB0aHJvdWdoIGFsbCBmZWVkYmFjayBmb3IgdGhpcyBibGFuay4gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkgYWx3YXlzIG1hdGNoZXMuIElmIG5vIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rIGV4aXN0cywgdXNlIGFuIGVtcHR5IGxpc3QuXG4gICAgICAgICAgICAgICAgdmFyIGZibCA9IHRoaXMuZmVlZGJhY2tBcnJheVtpXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZibC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbGFzdCBpdGVtIG9mIGZlZWRiYWNrIGFsd2F5cyBtYXRjaGVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gZmJsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgcmVnZXhwLi4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChcInJlZ2V4XCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGF0dCA9IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleEZsYWdzXCJdXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG51bWJlci5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFwibnVtYmVyXCIgaW4gZmJsW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBbbWluLCBtYXhdID0gZmJsW2pdW1wibnVtYmVyXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIGEgbnVtYmVyLiBXaGlsZSB0aGVyZSBhcmUgYGxvdHMgb2Ygd2F5cyA8aHR0cHM6Ly9jb2RlcndhbGwuY29tL3AvNXRsaG13L2NvbnZlcnRpbmctc3RyaW5ncy10by1udW1iZXItaW4tamF2YXNjcmlwdC1waXRmYWxscz5gXyB0byBkbyB0aGlzOyB0aGlzIHZlcnNpb24gc3VwcG9ydHMgb3RoZXIgYmFzZXMgKGhleC9iaW5hcnkvb2N0YWwpIGFzIHdlbGwgYXMgZmxvYXRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFjdHVhbCA9ICtnaXZlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPj0gbWluICYmIGFjdHVhbCA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFRoZSBhbnN3ZXIgaXMgY29ycmVjdCBpZiBpdCBtYXRjaGVkIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBhcnJheS4gQSBzcGVjaWFsIGNhc2U6IGlmIG9ubHkgb25lIGFuc3dlciBpcyBwcm92aWRlZCwgY291bnQgaXQgd3Jvbmc7IHRoaXMgaXMgYSBtaXNmb3JtZWQgcHJvYmxlbS5cbiAgICAgICAgICAgICAgICBsZXQgaXNfY29ycmVjdCA9IGogPT09IDAgJiYgZmJsLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheS5wdXNoKGlzX2NvcnJlY3QpO1xuICAgICAgICAgICAgICAgIGlmICghaXNfY29ycmVjdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZXJjZW50ID1cbiAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aCAvIHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuYXR0cihcImNsYXNzXCIsIFwiYWxlcnQgYWxlcnQtaW5mb1wiKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdEFycmF5W2pdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2pdKS5hZGRDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmVlZGJhY2tfaHRtbCA9IFwiPHVsPlwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZlZWRiYWNrX2h0bWwgKz0gXCI8bGk+XCIgKyB0aGlzLmRpc3BsYXlGZWVkW2ldICsgXCI8L2xpPlwiO1xuICAgICAgICB9XG4gICAgICAgIGZlZWRiYWNrX2h0bWwgKz0gXCI8L3VsPlwiO1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaWYgaXQncyBqdXN0IG9uZSBlbGVtZW50LlxuICAgICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZmVlZGJhY2tfaHRtbCA9IGZlZWRiYWNrX2h0bWwuc2xpY2UoXG4gICAgICAgICAgICAgICAgXCI8dWw+PGxpPlwiLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAtXCI8L2xpPjwvdWw+XCIubGVuZ3RoXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gZmVlZGJhY2tfaHRtbDtcbiAgICAgICAgaWYgKHR5cGVvZiBNYXRoSmF4ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheChkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBGdW5jdGlvbnMgZm9yIGNvbXBhcmUgYnV0dG9uID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGVuYWJsZUNvbXBhcmVCdXR0b24oKSB7XG4gICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBfYGNvbXBhcmVGSVRCQW5zd2Vyc2BcbiAgICBjb21wYXJlRklUQkFuc3dlcnMoKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgIGpRdWVyeS5nZXQoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXR0b3AxMEFuc3dlcnNgLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUZJVEJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgY29tcGFyZUZJVEIoZGF0YSwgc3RhdHVzLCB3aGF0ZXZlcikge1xuICAgICAgICB2YXIgYW5zd2VycyA9IGRhdGEuZGV0YWlsLnJlcztcbiAgICAgICAgdmFyIG1pc2MgPSBkYXRhLmRldGFpbC5taXNjZGF0YTtcbiAgICAgICAgdmFyIGJvZHkgPSBcIjx0YWJsZT5cIjtcbiAgICAgICAgYm9keSArPSBcIjx0cj48dGg+QW5zd2VyPC90aD48dGg+Q291bnQ8L3RoPjwvdHI+XCI7XG4gICAgICAgIGZvciAodmFyIHJvdyBpbiBhbnN3ZXJzKSB7XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCI8dHI+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzW3Jvd10uYW5zd2VyICtcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzW3Jvd10uY291bnQgK1xuICAgICAgICAgICAgICAgIFwiIHRpbWVzPC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgICAgICB2YXIgaHRtbCA9XG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J21vZGFsIGZhZGUnPlwiICtcbiAgICAgICAgICAgIFwiICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBjb21wYXJlLW1vZGFsJz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nY2xvc2UnIGRhdGEtZGlzbWlzcz0nbW9kYWwnIGFyaWEtaGlkZGVuPSd0cnVlJz4mdGltZXM7PC9idXR0b24+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGg0IGNsYXNzPSdtb2RhbC10aXRsZSc+VG9wIEFuc3dlcnM8L2g0PlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cIiArXG4gICAgICAgICAgICBib2R5ICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiPC9kaXY+XCI7XG4gICAgICAgIHZhciBlbCA9ICQoaHRtbCk7XG4gICAgICAgIGVsLm1vZGFsKCk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ibGFua0FycmF5W2ldLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PWZpbGxpbnRoZWJsYW5rXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbdGhpcy5pZF0gPSBuZXcgRklUQihvcHRzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBgRXJyb3IgcmVuZGVyaW5nIEZpbGwgaW4gdGhlIEJsYW5rIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiaW1wb3J0IEZJVEIgZnJvbSBcIi4vZml0Yi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRGSVRCIGV4dGVuZHMgRklUQiB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5pbnB1dERpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5uZWVkc1JlaW5pdGlhbGl6YXRpb24gPSB0cnVlO1xuICAgIH1cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICQodGltZUljb24pLmF0dHIoe1xuICAgICAgICAgICAgc3JjOiBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCIsXG4gICAgICAgICAgICBzdHlsZTogXCJ3aWR0aDoxNXB4O2hlaWdodDoxNXB4XCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgICQoY29tcG9uZW50KS5wcmVwZW5kKHRpbWVJY29uRGl2KTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIC8vIFJldHVybnMgaWYgdGhlIHF1ZXN0aW9uIHdhcyBjb3JyZWN0LCBpbmNvcnJlY3QsIG9yIHNraXBwZWQgKHJldHVybiBudWxsIGluIHRoZSBsYXN0IGNhc2UpXG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5ibGFua0FycmF5W2ldKS5yZW1vdmVDbGFzcyhcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICBmb3IgKGxldCBibGFuayBvZiB0aGlzLmJsYW5rQXJyYXkpIHtcbiAgICAgICAgICAgICQoYmxhbmspLmNoYW5nZSh0aGlzLnJlY29yZEFuc3dlcmVkLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LmZpbGxpbnRoZWJsYW5rID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRklUQihvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGSVRCKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==