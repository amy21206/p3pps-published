"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_webwork_js_webwork_js"],{

/***/ 66142:
/*!*****************************************!*\
  !*** ./runestone/webwork/js/webwork.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 2568);


window.wwList = {}; // Multiple Choice dictionary

class WebWork extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.useRunestoneServices = true;
        this.multipleanswers = false;
        this.divid = opts.orig.id;
        this.correct = null;
        this.optional = false;
        this.answerList = [];
        this.correctList = [];
        this.question = null;
        this.caption = "WebWork";
        this.containerDiv = opts.orig;
        //this.addCaption("runestone");
        if (this.divid !== "fakeww-ww-rs") {
            this.checkServer("webwork", true);
        }
    }

    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        // data.answers comes from postgresql as a JSON column type so no need to parse it.
        this.answers = data.answer;
        this.correct = data.correct;
        this.percent = data.percent;
        console.log(
            `about to decorate the status of WW ${this.divid} ${this.correct}`
        );
        this.decorateStatus();
    }

    checkLocalStorage() {
        // Repopulates MCMA questions with a user's previous answers,
        // which were stored into local storage.
        var storedData;
        var answers;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        var ex = localStorage.getItem(this.localStorageKey());

        if (ex !== null) {
            try {
                storedData = JSON.parse(ex);
                // Save the answers so that when the question is activated we can restore.
                this.answers = storedData.answer;
                this.correct = storedData.correct;
                this.percent = storedData.percent;
                // We still decorate the webwork question even if it is not active.
                this.decorateStatus();
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(err.message);
                localStorage.removeItem(this.localStorageKey());
                return;
            }
        }
    }

    setLocalStorage(data) {
        var timeStamp = new Date();
        var storageObj = {
            answer: data.answer,
            timestamp: timeStamp,
            correct: data.correct,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }

    // This is called when the runestone_ww_check event is triggered by the webwork problem
    // Note the webwork problem is in an iframe so we rely on this event and the data
    // compiled and passed along with the event to "grade" the answer.
    processCurrentAnswers(data) {
        let correctCount = 0;
        let qCount = 0;
        let actString = "check:";
        this.answerObj = {};
        this.lastAnswerRaw = data;
        this.answerObj.answers = {};
        this.answerObj.mqAnswers = {};
        // data.inputs_
        for (let k of Object.keys(data.rh_result.answers)) {
            qCount += 1;
            if (data.rh_result.answers[k].score == 1) {
                correctCount += 1;
            }
            // mostly grab original_student_ans, but grab student_value for MC exercises
            let student_ans = ['Value (parserRadioButtons)', 'Value (PopUp)', 'Value (CheckboxList)'].includes(data.rh_result.answers[k].type)
                ? data.rh_result.answers[k].student_value
                : data.rh_result.answers[k].original_student_ans;
            this.answerObj.answers[
                k
            ] = `${student_ans}`;
            let mqKey = `MaThQuIlL_${k}`;
            this.answerObj.mqAnswers[mqKey] = data.inputs_ref[mqKey];
            actString += `actual:${student_ans}:expected:${data.rh_result.answers[k].correct_value}:`;
        }
        let pct = correctCount / qCount;
        // If this.percent is set, then runestonebase will transmit it as part of
        // the logBookEvent API.
        this.percent = pct;
        this.actString =
            actString + `correct:${correctCount}:count:${qCount}:pct:${pct}`;
        if (pct == 1.0) {
            this.correct = true;
        } else {
            this.correct = false;
        }
        let ls = {};
        ls.answer = this.answerObj;
        ls.correct = this.correct;
        ls.percent = this.percent;
        this.setLocalStorage(ls);
        this.decorateStatus();
    }

    async logCurrentAnswer(sid) {
        this.logBookEvent({
            event: "webwork",
            div_id: this.divid, //todo unmangle problemid
            act: this.actString,
            correct: this.correct,
            answer: JSON.stringify(this.answerObj),
        });
    }

    checkCurrentAnswer() {}
}

//
// These are functions that get called in response to webwork generated events.
// submitting the work, or showing an answer.
function logWebWork(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.processCurrentAnswers(data);
            wwObj.logCurrentAnswer();
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`
            );
        }
    }
}

function logShowCorrect(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.logBookEvent({
                event: "webwork",
                div_id: data.inputs_ref.problemUUID,
                act: "show",
            });
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`
            );
        }
    }
}

async function getScores(sid, wwId) {}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.webwork = function (opts) {
    return new WebWork();
};

$(function () {
    $("body").on("runestone_ww_check", logWebWork);
    $("body").on("runestone_show_correct", logShowCorrect);
});

$(document).on("runestone:login-complete", function () {
    $("[data-component=webwork]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            window.wwList[this.id] = new WebWork(opts);
        }
    });
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV93ZWJ3b3JrX2pzX3dlYndvcmtfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQTBEOztBQUUxRCxvQkFBb0I7O0FBRXBCLHNCQUFzQixnRUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsWUFBWSxFQUFFLGFBQWE7QUFDN0U7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0IscUNBQXFDLEVBQUU7QUFDdkM7QUFDQSxtQ0FBbUMsWUFBWSxZQUFZLHdDQUF3QztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsYUFBYSxTQUFTLE9BQU8sT0FBTyxJQUFJO0FBQzNFO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0Esd0RBQXdELDRCQUE0QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBLHdEQUF3RCw0QkFBNEI7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvd2Vid29yay9qcy93ZWJ3b3JrLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZVwiO1xuXG53aW5kb3cud3dMaXN0ID0ge307IC8vIE11bHRpcGxlIENob2ljZSBkaWN0aW9uYXJ5XG5cbmNsYXNzIFdlYldvcmsgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdWx0aXBsZWFuc3dlcnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9wdHMub3JpZy5pZDtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFuc3dlckxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGlzdCA9IFtdO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJXZWJXb3JrXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gb3B0cy5vcmlnO1xuICAgICAgICAvL3RoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHRoaXMuZGl2aWQgIT09IFwiZmFrZXd3LXd3LXJzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJ3ZWJ3b3JrXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2VcbiAgICAgICAgLy8gc29tZXRpbWVzIGRhdGEuYW5zd2VyIGNhbiBiZSBudWxsXG4gICAgICAgIGlmICghZGF0YS5hbnN3ZXIpIHtcbiAgICAgICAgICAgIGRhdGEuYW5zd2VyID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBkYXRhLmFuc3dlcnMgY29tZXMgZnJvbSBwb3N0Z3Jlc3FsIGFzIGEgSlNPTiBjb2x1bW4gdHlwZSBzbyBubyBuZWVkIHRvIHBhcnNlIGl0LlxuICAgICAgICB0aGlzLmFuc3dlcnMgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSBkYXRhLnBlcmNlbnQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgYGFib3V0IHRvIGRlY29yYXRlIHRoZSBzdGF0dXMgb2YgV1cgJHt0aGlzLmRpdmlkfSAke3RoaXMuY29ycmVjdH1gXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gUmVwb3B1bGF0ZXMgTUNNQSBxdWVzdGlvbnMgd2l0aCBhIHVzZXIncyBwcmV2aW91cyBhbnN3ZXJzLFxuICAgICAgICAvLyB3aGljaCB3ZXJlIHN0b3JlZCBpbnRvIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgIHZhciBzdG9yZWREYXRhO1xuICAgICAgICB2YXIgYW5zd2VycztcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuXG4gICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgLy8gU2F2ZSB0aGUgYW5zd2VycyBzbyB0aGF0IHdoZW4gdGhlIHF1ZXN0aW9uIGlzIGFjdGl2YXRlZCB3ZSBjYW4gcmVzdG9yZS5cbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlcnMgPSBzdG9yZWREYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBzdG9yZWREYXRhLmNvcnJlY3Q7XG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gc3RvcmVkRGF0YS5wZXJjZW50O1xuICAgICAgICAgICAgICAgIC8vIFdlIHN0aWxsIGRlY29yYXRlIHRoZSB3ZWJ3b3JrIHF1ZXN0aW9uIGV2ZW4gaWYgaXQgaXMgbm90IGFjdGl2ZS5cbiAgICAgICAgICAgICAgICB0aGlzLmRlY29yYXRlU3RhdHVzKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IGRhdGEuYW5zd2VyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgICAgICBjb3JyZWN0OiBkYXRhLmNvcnJlY3QsXG4gICAgICAgIH07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgcnVuZXN0b25lX3d3X2NoZWNrIGV2ZW50IGlzIHRyaWdnZXJlZCBieSB0aGUgd2Vid29yayBwcm9ibGVtXG4gICAgLy8gTm90ZSB0aGUgd2Vid29yayBwcm9ibGVtIGlzIGluIGFuIGlmcmFtZSBzbyB3ZSByZWx5IG9uIHRoaXMgZXZlbnQgYW5kIHRoZSBkYXRhXG4gICAgLy8gY29tcGlsZWQgYW5kIHBhc3NlZCBhbG9uZyB3aXRoIHRoZSBldmVudCB0byBcImdyYWRlXCIgdGhlIGFuc3dlci5cbiAgICBwcm9jZXNzQ3VycmVudEFuc3dlcnMoZGF0YSkge1xuICAgICAgICBsZXQgY29ycmVjdENvdW50ID0gMDtcbiAgICAgICAgbGV0IHFDb3VudCA9IDA7XG4gICAgICAgIGxldCBhY3RTdHJpbmcgPSBcImNoZWNrOlwiO1xuICAgICAgICB0aGlzLmFuc3dlck9iaiA9IHt9O1xuICAgICAgICB0aGlzLmxhc3RBbnN3ZXJSYXcgPSBkYXRhO1xuICAgICAgICB0aGlzLmFuc3dlck9iai5hbnN3ZXJzID0ge307XG4gICAgICAgIHRoaXMuYW5zd2VyT2JqLm1xQW5zd2VycyA9IHt9O1xuICAgICAgICAvLyBkYXRhLmlucHV0c19cbiAgICAgICAgZm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyhkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzKSkge1xuICAgICAgICAgICAgcUNvdW50ICs9IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS5zY29yZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdENvdW50ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtb3N0bHkgZ3JhYiBvcmlnaW5hbF9zdHVkZW50X2FucywgYnV0IGdyYWIgc3R1ZGVudF92YWx1ZSBmb3IgTUMgZXhlcmNpc2VzXG4gICAgICAgICAgICBsZXQgc3R1ZGVudF9hbnMgPSBbJ1ZhbHVlIChwYXJzZXJSYWRpb0J1dHRvbnMpJywgJ1ZhbHVlIChQb3BVcCknLCAnVmFsdWUgKENoZWNrYm94TGlzdCknXS5pbmNsdWRlcyhkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzW2tdLnR5cGUpXG4gICAgICAgICAgICAgICAgPyBkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzW2tdLnN0dWRlbnRfdmFsdWVcbiAgICAgICAgICAgICAgICA6IGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10ub3JpZ2luYWxfc3R1ZGVudF9hbnM7XG4gICAgICAgICAgICB0aGlzLmFuc3dlck9iai5hbnN3ZXJzW1xuICAgICAgICAgICAgICAgIGtcbiAgICAgICAgICAgIF0gPSBgJHtzdHVkZW50X2Fuc31gO1xuICAgICAgICAgICAgbGV0IG1xS2V5ID0gYE1hVGhRdUlsTF8ke2t9YDtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyT2JqLm1xQW5zd2Vyc1ttcUtleV0gPSBkYXRhLmlucHV0c19yZWZbbXFLZXldO1xuICAgICAgICAgICAgYWN0U3RyaW5nICs9IGBhY3R1YWw6JHtzdHVkZW50X2Fuc306ZXhwZWN0ZWQ6JHtkYXRhLnJoX3Jlc3VsdC5hbnN3ZXJzW2tdLmNvcnJlY3RfdmFsdWV9OmA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBjdCA9IGNvcnJlY3RDb3VudCAvIHFDb3VudDtcbiAgICAgICAgLy8gSWYgdGhpcy5wZXJjZW50IGlzIHNldCwgdGhlbiBydW5lc3RvbmViYXNlIHdpbGwgdHJhbnNtaXQgaXQgYXMgcGFydCBvZlxuICAgICAgICAvLyB0aGUgbG9nQm9va0V2ZW50IEFQSS5cbiAgICAgICAgdGhpcy5wZXJjZW50ID0gcGN0O1xuICAgICAgICB0aGlzLmFjdFN0cmluZyA9XG4gICAgICAgICAgICBhY3RTdHJpbmcgKyBgY29ycmVjdDoke2NvcnJlY3RDb3VudH06Y291bnQ6JHtxQ291bnR9OnBjdDoke3BjdH1gO1xuICAgICAgICBpZiAocGN0ID09IDEuMCkge1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBscyA9IHt9O1xuICAgICAgICBscy5hbnN3ZXIgPSB0aGlzLmFuc3dlck9iajtcbiAgICAgICAgbHMuY29ycmVjdCA9IHRoaXMuY29ycmVjdDtcbiAgICAgICAgbHMucGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UobHMpO1xuICAgICAgICB0aGlzLmRlY29yYXRlU3RhdHVzKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwid2Vid29ya1wiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLCAvL3RvZG8gdW5tYW5nbGUgcHJvYmxlbWlkXG4gICAgICAgICAgICBhY3Q6IHRoaXMuYWN0U3RyaW5nLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeSh0aGlzLmFuc3dlck9iaiksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHt9XG59XG5cbi8vXG4vLyBUaGVzZSBhcmUgZnVuY3Rpb25zIHRoYXQgZ2V0IGNhbGxlZCBpbiByZXNwb25zZSB0byB3ZWJ3b3JrIGdlbmVyYXRlZCBldmVudHMuXG4vLyBzdWJtaXR0aW5nIHRoZSB3b3JrLCBvciBzaG93aW5nIGFuIGFuc3dlci5cbmZ1bmN0aW9uIGxvZ1dlYldvcmsoZSwgZGF0YSkge1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBsZXQgd3dPYmogPSB3d0xpc3RbZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlELnJlcGxhY2UoXCItd3ctcnNcIiwgXCJcIildO1xuICAgICAgICBpZiAod3dPYmopIHtcbiAgICAgICAgICAgIHd3T2JqLnByb2Nlc3NDdXJyZW50QW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHd3T2JqLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBFcnJvcjogQ291bGQgbm90IGZpbmQgd2Vid29yayBvYmplY3QgJHtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUR9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9nU2hvd0NvcnJlY3QoZSwgZGF0YSkge1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBsZXQgd3dPYmogPSB3d0xpc3RbZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlELnJlcGxhY2UoXCItd3ctcnNcIiwgXCJcIildO1xuICAgICAgICBpZiAod3dPYmopIHtcbiAgICAgICAgICAgIHd3T2JqLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IFwid2Vid29ya1wiLFxuICAgICAgICAgICAgICAgIGRpdl9pZDogZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlELFxuICAgICAgICAgICAgICAgIGFjdDogXCJzaG93XCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBFcnJvcjogQ291bGQgbm90IGZpbmQgd2Vid29yayBvYmplY3QgJHtkYXRhLmlucHV0c19yZWYucHJvYmxlbVVVSUR9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2NvcmVzKHNpZCwgd3dJZCkge31cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cblxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LndlYndvcmsgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgV2ViV29yaygpO1xufTtcblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJChcImJvZHlcIikub24oXCJydW5lc3RvbmVfd3dfY2hlY2tcIiwgbG9nV2ViV29yayk7XG4gICAgJChcImJvZHlcIikub24oXCJydW5lc3RvbmVfc2hvd19jb3JyZWN0XCIsIGxvZ1Nob3dDb3JyZWN0KTtcbn0pO1xuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD13ZWJ3b3JrXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAvLyBNQ1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB3aW5kb3cud3dMaXN0W3RoaXMuaWRdID0gbmV3IFdlYldvcmsob3B0cyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9