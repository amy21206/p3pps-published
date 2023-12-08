(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_dragndrop_js_timeddnd_js"],{

/***/ 83458:
/*!************************************************!*\
  !*** ./runestone/dragndrop/css/dragndrop.less ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 33426:
/*!*************************************************!*\
  !*** ./runestone/dragndrop/js/DragDropTouch.js ***!
  \*************************************************/
/***/ (() => {

var DragDropTouch;
(function (DragDropTouch_1) {
    'use strict';
    /**
     * Object used to hold the data that is being dragged during drag and drop operations.
     *
     * It may hold one or more data items of different types. For more information about
     * drag and drop operations and data transfer objects, see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer">HTML Drag and Drop API</a>.
     *
     * This object is created automatically by the @see:DragDropTouch singleton and is
     * accessible through the @see:dataTransfer property of all drag events.
     */
    var DataTransfer = (function () {
        function DataTransfer() {
            this._dropEffect = 'move';
            this._effectAllowed = 'all';
            this._data = {};
        }
        Object.defineProperty(DataTransfer.prototype, "dropEffect", {
            /**
             * Gets or sets the type of drag-and-drop operation currently selected.
             * The value must be 'none',  'copy',  'link', or 'move'.
             */
            get: function () {
                return this._dropEffect;
            },
            set: function (value) {
                this._dropEffect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
            /**
             * Gets or sets the types of operations that are possible.
             * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
             * 'linkMove', 'move', 'all' or 'uninitialized'.
             */
            get: function () {
                return this._effectAllowed;
            },
            set: function (value) {
                this._effectAllowed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "types", {
            /**
             * Gets an array of strings giving the formats that were set in the @see:dragstart event.
             */
            get: function () {
                return Object.keys(this._data);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Removes the data associated with a given type.
         *
         * The type argument is optional. If the type is empty or not specified, the data
         * associated with all types is removed. If data for the specified type does not exist,
         * or the data transfer contains no data, this method will have no effect.
         *
         * @param type Type of data to remove.
         */
        DataTransfer.prototype.clearData = function (type) {
            if (type != null) {
                delete this._data[type.toLowerCase()];
            }
            else {
                this._data = {};
            }
        };
        /**
         * Retrieves the data for a given type, or an empty string if data for that type does
         * not exist or the data transfer contains no data.
         *
         * @param type Type of data to retrieve.
         */
        DataTransfer.prototype.getData = function (type) {
            return this._data[type.toLowerCase()] || '';
        };
        /**
         * Set the data for a given type.
         *
         * For a list of recommended drag types, please see
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
         *
         * @param type Type of data to add.
         * @param value Data to add.
         */
        DataTransfer.prototype.setData = function (type, value) {
            this._data[type.toLowerCase()] = value;
        };
        /**
         * Set the image to be used for dragging if a custom one is desired.
         *
         * @param img An image element to use as the drag feedback image.
         * @param offsetX The horizontal offset within the image.
         * @param offsetY The vertical offset within the image.
         */
        DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
            var ddt = DragDropTouch._instance;
            ddt._imgCustom = img;
            ddt._imgOffset = { x: offsetX, y: offsetY };
        };
        return DataTransfer;
    }());
    DragDropTouch_1.DataTransfer = DataTransfer;
    /**
     * Defines a class that adds support for touch-based HTML5 drag/drop operations.
     *
     * The @see:DragDropTouch class listens to touch events and raises the
     * appropriate HTML5 drag/drop events as if the events had been caused
     * by mouse actions.
     *
     * The purpose of this class is to enable using existing, standard HTML5
     * drag/drop code on mobile devices running IOS or Android.
     *
     * To use, include the DragDropTouch.js file on the page. The class will
     * automatically start monitoring touch events and will raise the HTML5
     * drag drop events (dragstart, dragenter, dragleave, drop, dragend) which
     * should be handled by the application.
     *
     * For details and examples on HTML drag and drop, see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
     */
    var DragDropTouch = (function () {
        /**
         * Initializes the single instance of the @see:DragDropTouch class.
         */
        function DragDropTouch() {
            this._lastClick = 0;
            // enforce singleton pattern
            if (DragDropTouch._instance) {
                throw 'DragDropTouch instance already created.';
            }
            // detect passive event support
            // https://github.com/Modernizr/Modernizr/issues/1894
            var supportsPassive = false;
            document.addEventListener('test', function () { }, {
                get passive() {
                    supportsPassive = true;
                    return true;
                }
            });
            // listen to touch events
            if (navigator.maxTouchPoints) {
                var d = document, 
                    ts = this._touchstart.bind(this), 
                    tm = this._touchmove.bind(this), 
                    te = this._touchend.bind(this), 
                    opt = supportsPassive ? { passive: false, capture: false } : false;
                d.addEventListener('touchstart', ts, opt);
                d.addEventListener('touchmove', tm, opt);
                d.addEventListener('touchend', te);
                d.addEventListener('touchcancel', te);
            }
        }
        /**
         * Gets a reference to the @see:DragDropTouch singleton.
         */
        DragDropTouch.getInstance = function () {
            return DragDropTouch._instance;
        };
        // ** event handlers
        DragDropTouch.prototype._touchstart = function (e) {
            var _this = this;
            if (this._shouldHandle(e)) {
                // raise double-click and prevent zooming
                if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        e.preventDefault();
                        this._reset();
                        return;
                    }
                }
                // clear all variables
                this._reset();
                // get nearest draggable element
                var src = this._closestDraggable(e.target);
                if (src) {
                    // give caller a chance to handle the hover/move events
                    if (!this._dispatchEvent(e, 'mousemove', e.target) &&
                        !this._dispatchEvent(e, 'mousedown', e.target)) {
                        // get ready to start dragging
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastTouch = e;
                        e.preventDefault();
                        // show context menu if the user hasn't started dragging after a while
                        setTimeout(function () {
                            if (_this._dragSource == src && _this._img == null) {
                                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                    _this._reset();
                                }
                            }
                        }, DragDropTouch._CTXMENU);
                        if (DragDropTouch._ISPRESSHOLDMODE) {
                            this._pressHoldInterval = setTimeout(function () {
                                _this._isDragEnabled = true;
                                _this._touchmove(e);
                            }, DragDropTouch._PRESSHOLDAWAIT);
                        }
                    }
                }
            }
        };
        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldCancelPressHoldMove(e)) {
              this._reset();
              return;
            }
            if (this._shouldHandleMove(e) || this._shouldHandlePressHoldMove(e)) {
                // see if target wants to handle move
                var target = this._getTarget(e);
                if (this._dispatchEvent(e, 'mousemove', target)) {
                    this._lastTouch = e;
                    e.preventDefault();
                    return;
                }
                // start dragging
                if (this._dragSource && !this._img && this._shouldStartDragging(e)) {
                    this._dispatchEvent(e, 'dragstart', this._dragSource);
                    this._createImage(e);
                    this._dispatchEvent(e, 'dragenter', target);
                }
                // continue dragging
                if (this._img) {
                    this._lastTouch = e;
                    e.preventDefault(); // prevent scrolling
                    this._dispatchEvent(e, 'drag', this._dragSource);
                    if (target != this._lastTarget) {
                        this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                        this._dispatchEvent(e, 'dragenter', target);
                        this._lastTarget = target;
                    }
                    this._moveImage(e);
                    this._isDropZone = this._dispatchEvent(e, 'dragover', target);
                }
            }
        };
        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                // see if target wants to handle up
                if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
                    e.preventDefault();
                    return;
                }
                // user clicked the element but didn't drag, so clear the source and simulate a click
                if (!this._img) {
                    this._dragSource = null;
                    this._dispatchEvent(this._lastTouch, 'click', e.target);
                    this._lastClick = Date.now();
                }
                // finish dragging
                this._destroyImage();
                if (this._dragSource) {
                    if (e.type.indexOf('cancel') < 0 && this._isDropZone) {
                        this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                    }
                    this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                    this._reset();
                }
            }
        };
        // ** utilities
        // ignore events that have been handled or that involve more than one touch
        DragDropTouch.prototype._shouldHandle = function (e) {
            return e &&
                !e.defaultPrevented &&
                e.touches && e.touches.length < 2;
        };

        // use regular condition outside of press & hold mode
        DragDropTouch.prototype._shouldHandleMove = function (e) {
          return !DragDropTouch._ISPRESSHOLDMODE && this._shouldHandle(e);
        };

        // allow to handle moves that involve many touches for press & hold
        DragDropTouch.prototype._shouldHandlePressHoldMove = function (e) {
          return DragDropTouch._ISPRESSHOLDMODE &&
              this._isDragEnabled && e && e.touches && e.touches.length;
        };

        // reset data if user drags without pressing & holding
        DragDropTouch.prototype._shouldCancelPressHoldMove = function (e) {
          return DragDropTouch._ISPRESSHOLDMODE && !this._isDragEnabled &&
              this._getDelta(e) > DragDropTouch._PRESSHOLDMARGIN;
        };

        // start dragging when specified delta is detected
        DragDropTouch.prototype._shouldStartDragging = function (e) {
            var delta = this._getDelta(e);
            return delta > DragDropTouch._THRESHOLD ||
                (DragDropTouch._ISPRESSHOLDMODE && delta >= DragDropTouch._PRESSHOLDTHRESHOLD);
        }

        // clear all members
        DragDropTouch.prototype._reset = function () {
            this._destroyImage();
            this._dragSource = null;
            this._lastTouch = null;
            this._lastTarget = null;
            this._ptDown = null;
            this._isDragEnabled = false;
            this._isDropZone = false;
            this._dataTransfer = new DataTransfer();
            clearInterval(this._pressHoldInterval);
        };
        // get point for a touch event
        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches) {
                e = e.touches[0];
            }
            return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
        };
        // get distance between the current touch event and the first one
        DragDropTouch.prototype._getDelta = function (e) {
            if (DragDropTouch._ISPRESSHOLDMODE && !this._ptDown) { return 0; }
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };
        // get the element at a given touch event
        DragDropTouch.prototype._getTarget = function (e) {
            var pt = this._getPoint(e), el = document.elementFromPoint(pt.x, pt.y);
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        };
        // create drag image from source element
        DragDropTouch.prototype._createImage = function (e) {
            // just in case...
            if (this._img) {
                this._destroyImage();
            }
            // create drag image from custom element or drag source
            var src = this._imgCustom || this._dragSource;
            this._img = src.cloneNode(true);
            this._copyStyle(src, this._img);
            this._img.style.top = this._img.style.left = '-9999px';
            // if creating from drag source, apply offset and opacity
            if (!this._imgCustom) {
                var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                this._img.style.opacity = DragDropTouch._OPACITY.toString();
            }
            // add image to document
            this._moveImage(e);
            document.body.appendChild(this._img);
        };
        // dispose of drag image element
        DragDropTouch.prototype._destroyImage = function () {
            if (this._img && this._img.parentElement) {
                this._img.parentElement.removeChild(this._img);
            }
            this._img = null;
            this._imgCustom = null;
        };
        // move the drag image element
        DragDropTouch.prototype._moveImage = function (e) {
            var _this = this;
            requestAnimationFrame(function () {
                if (_this._img) {
                    var pt = _this._getPoint(e, true), s = _this._img.style;
                    s.position = 'absolute';
                    s.pointerEvents = 'none';
                    s.zIndex = '999999';
                    s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                    s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
                }
            });
        };
        // copy properties from an object to another
        DragDropTouch.prototype._copyProps = function (dst, src, props) {
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                dst[p] = src[p];
            }
        };
        DragDropTouch.prototype._copyStyle = function (src, dst) {
            // remove potentially troublesome attributes
            DragDropTouch._rmvAtts.forEach(function (att) {
                dst.removeAttribute(att);
            });
            // copy canvas content
            if (src instanceof HTMLCanvasElement) {
                var cSrc = src, cDst = dst;
                cDst.width = cSrc.width;
                cDst.height = cSrc.height;
                cDst.getContext('2d').drawImage(cSrc, 0, 0);
            }
            // copy style (without transitions)
            var cs = getComputedStyle(src);
            for (var i = 0; i < cs.length; i++) {
                var key = cs[i];
                if (key.indexOf('transition') < 0) {
                    dst.style[key] = cs[key];
                }
            }
            dst.style.pointerEvents = 'none';
            // and repeat for all children
            for (var i = 0; i < src.children.length; i++) {
                this._copyStyle(src.children[i], dst.children[i]);
            }
        };
        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                this._copyProps(evt, e, DragDropTouch._kbdProps);
                this._copyProps(evt, t, DragDropTouch._ptProps);
                evt.dataTransfer = this._dataTransfer;
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };
        // gets an element's closest draggable ancestor
        DragDropTouch.prototype._closestDraggable = function (e) {
            for (; e; e = e.parentElement) {
                if (e.hasAttribute('draggable') && e.draggable) {
                    return e;
                }
            }
            return null;
        };
        return DragDropTouch;
    }());
    /*private*/ DragDropTouch._instance = new DragDropTouch(); // singleton
    // constants
    DragDropTouch._THRESHOLD = 5; // pixels to move before drag starts
    DragDropTouch._OPACITY = 0.5; // drag image opacity
    DragDropTouch._DBLCLICK = 500; // max ms between clicks in a double click
    DragDropTouch._CTXMENU = 900; // ms to hold before raising 'contextmenu' event
    DragDropTouch._ISPRESSHOLDMODE = false; // decides of press & hold mode presence
    DragDropTouch._PRESSHOLDAWAIT = 400; // ms to wait before press & hold is detected
    DragDropTouch._PRESSHOLDMARGIN = 25; // pixels that finger might shiver while pressing
    DragDropTouch._PRESSHOLDTHRESHOLD = 0; // pixels to move before drag starts
    // copy styles/attributes from drag source to drag image element
    DragDropTouch._rmvAtts = 'id,class,style,draggable'.split(',');
    // synthesize and dispatch an event
    // returns true if the event has been handled (e.preventDefault == true)
    DragDropTouch._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
    DragDropTouch._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY,offsetX,offsetY'.split(',');
    DragDropTouch_1.DragDropTouch = DragDropTouch;
})(DragDropTouch || (DragDropTouch = {}));


/***/ }),

/***/ 78273:
/*!*****************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.en.js ***!
  \*****************************************************/
/***/ (() => {

$.i18n().load({
    en: {
        msg_dragndrop_correct_answer: "You are correct!",
        msg_dragndrop_incorrect_answer:
            "Incorret. You got $1 correct and $2 incorrect out of $3. You left $4 blank.",
        msg_dragndrop_check_me: "Check me",
        msg_dragndrop_reset: "Reset",
    },
});


/***/ }),

/***/ 26254:
/*!********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.pt-br.js ***!
  \********************************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_dragndrop_correct_answer: "Correto!",
        msg_dragndrop_incorrect_answer:
            "Incorreto. Você teve $1 correto(s) e $2 incorreto(s) de $3. Você deixou $4 em branco.",
        msg_dragndrop_check_me: "Verificar",
        msg_dragndrop_reset: "Resetar",
    },
});


/***/ }),

/***/ 70225:
/*!*********************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragNDrop)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _css_dragndrop_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/dragndrop.less */ 83458);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dragndrop-i18n.en.js */ 78273);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dragndrop-i18n.pt-br.js */ 26254);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _DragDropTouch_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DragDropTouch.js */ 33426);
/* harmony import */ var _DragDropTouch_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_DragDropTouch_js__WEBPACK_IMPORTED_MODULE_4__);
/*==========================================
=======     Master dragndrop.js     ========
============================================
===     This file contains the JS for    ===
=== the Runestone Drag n drop component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/6/15                ===
===              Brad MIller             ===
===                2/7/19                ===
==========================================*/








class DragNDrop extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <ul> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.random = false;
        if ($(this.origElem).is("[data-random]")) {
            this.random = true;
        }
        this.feedback = "";
        this.dragPairArray = [];
        this.question = "";
        this.populate(); // Populates this.dragPairArray, this.feedback and this.question
        this.createNewElements();
        this.caption = "Drag-N-Drop";
        this.addCaption("runestone");
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }
    /*======================
    === Update variables ===
    ======================*/
    populate() {
        for (var i = 0; i < this.origElem.childNodes.length; i++) {
            if (
                $(this.origElem.childNodes[i]).data("subcomponent") ===
                "dropzone"
            ) {
                var tmp = $(this.origElem).find(
                    `#${$(this.origElem.childNodes[i]).attr("for")}`
                )[0];
                var replaceSpan = document.createElement("span");
                replaceSpan.innerHTML = tmp.innerHTML;
                replaceSpan.id = this.divid + tmp.id;
                $(replaceSpan).attr("draggable", "true");
                $(replaceSpan).addClass("draggable-drag");
                var otherReplaceSpan = document.createElement("span");
                otherReplaceSpan.innerHTML =
                    this.origElem.childNodes[i].innerHTML;
                $(otherReplaceSpan).addClass("draggable-drop");
                this.setEventListeners(replaceSpan, otherReplaceSpan);
                var tmpArr = [];
                tmpArr.push(replaceSpan);
                tmpArr.push(otherReplaceSpan);
                this.dragPairArray.push(tmpArr);
            } else if (
                $(this.origElem.childNodes[i]).data("subcomponent") ===
                "question"
            ) {
                this.question = this.origElem.childNodes[i].innerHTML;
            } else if (
                $(this.origElem.childNodes[i]).data("subcomponent") ===
                "feedback"
            ) {
                this.feedback = this.origElem.childNodes[i].innerHTML;
            }
        }
    }
    /*========================================
    == Create new HTML elements and replace ==
    ==      original element with them      ==
    ========================================*/
    createNewElements() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        $(this.containerDiv).addClass("draggable-container");
        $(this.containerDiv).html(this.question);
        this.containerDiv.appendChild(document.createElement("br"));
        this.dragDropWrapDiv = document.createElement("div"); // Holds the draggables/dropzones, prevents feedback from bleeding in
        $(this.dragDropWrapDiv).css("display", "block");
        this.containerDiv.appendChild(this.dragDropWrapDiv);
        this.draggableDiv = document.createElement("div");
        $(this.draggableDiv).addClass("rsdraggable dragzone");
        this.addDragDivListeners();
        this.dropZoneDiv = document.createElement("div");
        $(this.dropZoneDiv).addClass("rsdraggable");
        this.dragDropWrapDiv.appendChild(this.draggableDiv);
        this.dragDropWrapDiv.appendChild(this.dropZoneDiv);
        this.createButtons();
        this.checkServer("dragNdrop", true);
        self = this;
        self.queueMathJax(self.containerDiv);

    }
    finishSettingUp() {
        this.appendReplacementSpans();
        this.renderFeedbackDiv();
        $(this.origElem).replaceWith(this.containerDiv);
        if (!this.hasStoredDropzones) {
            this.minheight = $(this.draggableDiv).height();
        }
        this.draggableDiv.style.minHeight = this.minheight.toString() + "px";
        if ($(this.dropZoneDiv).height() > this.minheight) {
            this.dragDropWrapDiv.style.minHeight =
                $(this.dropZoneDiv).height().toString() + "px";
        } else {
            this.dragDropWrapDiv.style.minHeight =
                this.minheight.toString() + "px";
        }
    }
    addDragDivListeners() {
        let self = this;
        this.draggableDiv.addEventListener(
            "dragover",
            function (ev) {
                ev.preventDefault();
                if ($(this.draggableDiv).hasClass("possibleDrop")) {
                    return;
                }
                $(this.draggableDiv).addClass("possibleDrop");
            }.bind(this)
        );
        this.draggableDiv.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if ($(this.draggableDiv).hasClass("possibleDrop")) {
                    $(this.draggableDiv).removeClass("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    !$(this.draggableDiv).has(draggedSpan).length &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                }
            }.bind(this)
        );
        this.draggableDiv.addEventListener(
            "dragleave",
            function (e) {
                if (!$(this.draggableDiv).hasClass("possibleDrop")) {
                    return;
                }
                $(this.draggableDiv).removeClass("possibleDrop");
            }.bind(this)
        );
    }
    createButtons() {
        this.buttonDiv = document.createElement("div");
        this.submitButton = document.createElement("button"); // Check me button
        this.submitButton.textContent = $.i18n("msg_dragndrop_check_me");
        $(this.submitButton).attr({
            class: "btn btn-success drag-button",
            name: "do answer",
            type: "button",
        });
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            this.renderFeedback();
            this.logCurrentAnswer();
        }.bind(this);
        this.resetButton = document.createElement("button"); // Check me button
        this.resetButton.textContent = $.i18n("msg_dragndrop_reset");
        $(this.resetButton).attr({
            class: "btn btn-default drag-button drag-reset",
            name: "do answer",
        });
        this.resetButton.onclick = function () {
            this.resetDraggables();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);
        this.buttonDiv.appendChild(this.resetButton);
        this.containerDiv.appendChild(this.buttonDiv);
    }
    appendReplacementSpans() {
        this.createIndexArray();
        this.randomizeIndexArray();
        for (let i = 0; i < this.dragPairArray.length; i++) {
            if (this.hasStoredDropzones) {
                if (
                    $.inArray(this.indexArray[i][0], this.pregnantIndexArray) <
                    0
                ) {
                    this.draggableDiv.appendChild(
                        this.dragPairArray[this.indexArray[i]][0]
                    );
                }
            } else {
                this.draggableDiv.appendChild(
                    this.dragPairArray[this.indexArray[i]][0]
                );
            }
        }
        if (this.random) {
            this.randomizeIndexArray(); // shuffle index again
        } else {
            this.createIndexArray(); // reset default index
        }
        for (let i = 0; i < this.dragPairArray.length; i++) {
            if (this.hasStoredDropzones) {
                if (this.pregnantIndexArray[this.indexArray[i]] !== "-1") {
                    this.dragPairArray[this.indexArray[i]][1].appendChild(
                        this.dragPairArray[
                            this.pregnantIndexArray[this.indexArray[i]]
                        ][0]
                    );
                }
            }
            this.dropZoneDiv.appendChild(
                this.dragPairArray[this.indexArray[i]][1]
            );
        }
    }
    setEventListeners(dgSpan, dpSpan) {
        // Adds HTML5 "drag and drop" UI functionality
        let self = this;
        dgSpan.addEventListener("dragstart", function (ev) {
            ev.dataTransfer.setData("draggableID", ev.target.id);
        });
        dgSpan.addEventListener("dragover", function (ev) {
            ev.preventDefault();
        });
        dgSpan.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    this.hasNoDragChild(ev.target) &&
                    draggedSpan != ev.target &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                }
            }.bind(this)
        );
        dpSpan.addEventListener(
            "dragover",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if ($(ev.target).hasClass("possibleDrop")) {
                    return;
                }
                if (
                    $(ev.target).hasClass("draggable-drop") &&
                    this.hasNoDragChild(ev.target)
                ) {
                    $(ev.target).addClass("possibleDrop");
                }
            }.bind(this)
        );
        dpSpan.addEventListener("dragleave", function (ev) {
            self.isAnswered = true;
            ev.preventDefault();
            if (!$(ev.target).hasClass("possibleDrop")) {
                return;
            }
            $(ev.target).removeClass("possibleDrop");
        });
        dpSpan.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if ($(ev.target).hasClass("possibleDrop")) {
                    $(ev.target).removeClass("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    $(ev.target).hasClass("draggable-drop") &&
                    this.hasNoDragChild(ev.target) &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    ev.target.appendChild(draggedSpan);
                }
            }.bind(this)
        );
    }
    renderFeedbackDiv() {
        if (!this.feedBackDiv) {
            this.feedBackDiv = document.createElement("div");
            this.feedBackDiv.id = this.divid + "_feedback";
            this.containerDiv.appendChild(document.createElement("br"));
            this.containerDiv.appendChild(this.feedBackDiv);
        }
    }
    /*=======================
    == Auxiliary functions ==
    =======================*/
    strangerDanger(testSpan) {
        // Returns true if the test span doesn't belong to this instance of DragNDrop
        var strangerDanger = true;
        for (var i = 0; i < this.dragPairArray.length; i++) {
            if (testSpan === this.dragPairArray[i][0]) {
                strangerDanger = false;
            }
        }
        return strangerDanger;
    }
    hasNoDragChild(parent) {
        // Ensures that each dropZoneDiv can have only one draggable child
        var counter = 0;
        for (var i = 0; i < parent.childNodes.length; i++) {
            if ($(parent.childNodes[i]).attr("draggable") === "true") {
                counter++;
            }
        }
        if (counter >= 1) {
            return false;
        } else {
            return true;
        }
    }
    createIndexArray() {
        this.indexArray = [];
        for (var i = 0; i < this.dragPairArray.length; i++) {
            this.indexArray.push(i);
        }
    }
    randomizeIndexArray() {
        // Shuffles around indices so the matchable elements aren't in a predictable order
        var currentIndex = this.indexArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.indexArray[currentIndex];
            this.indexArray[currentIndex] = this.indexArray[randomIndex];
            this.indexArray[randomIndex] = temporaryValue;
        }
    }
    /*==============================
    == Reset button functionality ==
    ==============================*/
    resetDraggables() {
        for (var i = 0; i < this.dragPairArray.length; i++) {
            for (
                var j = 0;
                j < this.dragPairArray[i][1].childNodes.length;
                j++
            ) {
                if (
                    $(this.dragPairArray[i][1].childNodes[j]).attr(
                        "draggable"
                    ) === "true"
                ) {
                    this.draggableDiv.appendChild(
                        this.dragPairArray[i][1].childNodes[j]
                    );
                }
            }
        }
        this.feedBackDiv.style.display = "none";
    }
    /*===========================
    == Evaluation and feedback ==
    ===========================*/

    checkCurrentAnswer() {
        this.correct = true;
        this.unansweredNum = 0;
        this.incorrectNum = 0;
        this.dragNum = this.dragPairArray.length;
        for (var i = 0; i < this.dragPairArray.length; i++) {
            if (
                !$(this.dragPairArray[i][1]).has(this.dragPairArray[i][0])
                    .length
            ) {
                this.correct = false;
                this.incorrectNum++;
            }
            if (this.hasNoDragChild(this.dragPairArray[i][1])) {
                this.unansweredNum++;
                this.incorrectNum -= 1;
            }
        }
        this.correctNum = this.dragNum - this.incorrectNum - this.unansweredNum;
        this.percent = this.correctNum / this.dragPairArray.length;
        this.setLocalStorage({ correct: this.correct ? "T" : "F" });
    }

    async logCurrentAnswer(sid) {
        let answer = this.pregnantIndexArray.join(";");
        let data = {
            event: "dragNdrop",
            act: answer,
            answer: answer,
            min_height: Math.round(this.minheight),
            div_id: this.divid,
            correct: this.correct,
            correctNum: this.correctNum,
            dragNum: this.dragNum,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }
    renderFeedback() {
        for (var i = 0; i < this.dragPairArray.length; i++) {
            if (
                !$(this.dragPairArray[i][1]).has(this.dragPairArray[i][0])
                    .length
            ) {
                $(this.dragPairArray[i][1]).addClass("drop-incorrect");
            } else {
                $(this.dragPairArray[i][1]).removeClass("drop-incorrect");
            }
        }

        if (!this.feedBackDiv) {
            this.renderFeedbackDiv();
        }
        this.feedBackDiv.style.display = "block";
        if (this.correct) {
            var msgCorrect = $.i18n("msg_dragndrop_correct_answer");
            $(this.feedBackDiv).html(msgCorrect);
            $(this.feedBackDiv).attr(
                "class",
                "alert alert-info draggable-feedback"
            );
        } else {
            var msgIncorrect = $.i18n(
                $.i18n("msg_dragndrop_incorrect_answer"),
                this.correctNum,
                this.incorrectNum,
                this.dragNum,
                this.unansweredNum
            );
            $(this.feedBackDiv).html(msgIncorrect + " " + this.feedback);
            $(this.feedBackDiv).attr(
                "class",
                "alert alert-danger draggable-feedback"
            );
        }
    }
    /*===================================
    === Checking/restoring from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        this.hasStoredDropzones = true;
        this.minheight = data.min_height;
        this.pregnantIndexArray = data.answer.split(";");
        this.finishSettingUp();
    }
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        var storedObj;
        this.hasStoredDropzones = false;
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                this.hasStoredDropzones = true;
                try {
                    storedObj = JSON.parse(ex);
                    this.minheight = storedObj.min_height;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(err.message);
                    localStorage.removeItem(this.localStorageKey());
                    this.hasStoredDropzones = false;
                    this.finishSettingUp();
                    return;
                }
                this.pregnantIndexArray = storedObj.answer.split(";");
                if (this.useRunestoneServices) {
                    // store answer in database
                    var answer = this.pregnantIndexArray.join(";");
                    this.logBookEvent({
                        event: "dragNdrop",
                        act: answer,
                        answer: answer,
                        min_height: Math.round(this.minheight),
                        div_id: this.divid,
                        correct: storedObj.correct,
                    });
                }
            }
        }
        this.finishSettingUp();
    }

    setLocalStorage(data) {
        if (data.answer === undefined) {
            // If we didn't load from the server, we must generate the data
            this.pregnantIndexArray = [];
            for (var i = 0; i < this.dragPairArray.length; i++) {
                if (!this.hasNoDragChild(this.dragPairArray[i][1])) {
                    for (var j = 0; j < this.dragPairArray.length; j++) {
                        if (
                            $(this.dragPairArray[i][1]).has(
                                this.dragPairArray[j][0]
                            ).length
                        ) {
                            this.pregnantIndexArray.push(j);
                        }
                    }
                } else {
                    this.pregnantIndexArray.push(-1);
                }
            }
        }
        var timeStamp = new Date();
        var correct = data.correct;
        var storageObj = {
            answer: this.pregnantIndexArray.join(";"),
            min_height: this.minheight,
            timestamp: timeStamp,
            correct: correct,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }

    disableInteraction() {
        $(this.resetButton).hide();
        for (var i = 0; i < this.dragPairArray.length; i++) {
            // No more dragging
            $(this.dragPairArray[i][0]).attr("draggable", "false");
            $(this.dragPairArray[i][0]).css("cursor", "initial");
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=dragndrop]").each(function (index) {
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            try {
                window.componentMap[this.id] = new DragNDrop(opts);
            } catch (err) {
                console.log(`Error rendering DragNDrop Problem ${this.id}`);
            }
        }
    });
});


/***/ }),

/***/ 47496:
/*!********************************************!*\
  !*** ./runestone/dragndrop/js/timeddnd.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedDragNDrop)
/* harmony export */ });
/* harmony import */ var _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dragndrop.js */ 70225);




class TimedDragNDrop extends _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.finishSettingUp();
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
    }
    hideButtons() {
        $(this.submitButton).hide();
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
        // Returns if the question was correct.    Used for timed assessment grading.
        if (this.unansweredNum === this.dragPairArray.length) {
            this.correct = null;
        }
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
        $(this.feedBackDiv).hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["dragndrop"] = function (opts) {
    if (opts.timed) {
        return new TimedDragNDrop(opts);
    }
    return new _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZV9kcmFnbmRyb3BfanNfdGltZWRkbmRfanMuYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxpQ0FBaUM7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBUztBQUN4QiIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2Nzcy9kcmFnbmRyb3AubGVzcz9iODVjIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL0RyYWdEcm9wVG91Y2guanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsInZhciBEcmFnRHJvcFRvdWNoO1xyXG4oZnVuY3Rpb24gKERyYWdEcm9wVG91Y2hfMSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBPYmplY3QgdXNlZCB0byBob2xkIHRoZSBkYXRhIHRoYXQgaXMgYmVpbmcgZHJhZ2dlZCBkdXJpbmcgZHJhZyBhbmQgZHJvcCBvcGVyYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEl0IG1heSBob2xkIG9uZSBvciBtb3JlIGRhdGEgaXRlbXMgb2YgZGlmZmVyZW50IHR5cGVzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dFxyXG4gICAgICogZHJhZyBhbmQgZHJvcCBvcGVyYXRpb25zIGFuZCBkYXRhIHRyYW5zZmVyIG9iamVjdHMsIHNlZVxyXG4gICAgICogPGEgaHJlZj1cImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9EYXRhVHJhbnNmZXJcIj5IVE1MIERyYWcgYW5kIERyb3AgQVBJPC9hPi5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIG9iamVjdCBpcyBjcmVhdGVkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIEBzZWU6RHJhZ0Ryb3BUb3VjaCBzaW5nbGV0b24gYW5kIGlzXHJcbiAgICAgKiBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIEBzZWU6ZGF0YVRyYW5zZmVyIHByb3BlcnR5IG9mIGFsbCBkcmFnIGV2ZW50cy5cclxuICAgICAqL1xyXG4gICAgdmFyIERhdGFUcmFuc2ZlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gRGF0YVRyYW5zZmVyKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kcm9wRWZmZWN0ID0gJ21vdmUnO1xyXG4gICAgICAgICAgICB0aGlzLl9lZmZlY3RBbGxvd2VkID0gJ2FsbCc7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERhdGFUcmFuc2Zlci5wcm90b3R5cGUsIFwiZHJvcEVmZmVjdFwiLCB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHR5cGUgb2YgZHJhZy1hbmQtZHJvcCBvcGVyYXRpb24gY3VycmVudGx5IHNlbGVjdGVkLlxyXG4gICAgICAgICAgICAgKiBUaGUgdmFsdWUgbXVzdCBiZSAnbm9uZScsICAnY29weScsICAnbGluaycsIG9yICdtb3ZlJy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Ryb3BFZmZlY3Q7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kcm9wRWZmZWN0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEYXRhVHJhbnNmZXIucHJvdG90eXBlLCBcImVmZmVjdEFsbG93ZWRcIiwge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogR2V0cyBvciBzZXRzIHRoZSB0eXBlcyBvZiBvcGVyYXRpb25zIHRoYXQgYXJlIHBvc3NpYmxlLlxyXG4gICAgICAgICAgICAgKiBNdXN0IGJlIG9uZSBvZiAnbm9uZScsICdjb3B5JywgJ2NvcHlMaW5rJywgJ2NvcHlNb3ZlJywgJ2xpbmsnLFxyXG4gICAgICAgICAgICAgKiAnbGlua01vdmUnLCAnbW92ZScsICdhbGwnIG9yICd1bmluaXRpYWxpemVkJy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdEFsbG93ZWQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lZmZlY3RBbGxvd2VkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEYXRhVHJhbnNmZXIucHJvdG90eXBlLCBcInR5cGVzXCIsIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEdldHMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBnaXZpbmcgdGhlIGZvcm1hdHMgdGhhdCB3ZXJlIHNldCBpbiB0aGUgQHNlZTpkcmFnc3RhcnQgZXZlbnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiB0eXBlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogVGhlIHR5cGUgYXJndW1lbnQgaXMgb3B0aW9uYWwuIElmIHRoZSB0eXBlIGlzIGVtcHR5IG9yIG5vdCBzcGVjaWZpZWQsIHRoZSBkYXRhXHJcbiAgICAgICAgICogYXNzb2NpYXRlZCB3aXRoIGFsbCB0eXBlcyBpcyByZW1vdmVkLiBJZiBkYXRhIGZvciB0aGUgc3BlY2lmaWVkIHR5cGUgZG9lcyBub3QgZXhpc3QsXHJcbiAgICAgICAgICogb3IgdGhlIGRhdGEgdHJhbnNmZXIgY29udGFpbnMgbm8gZGF0YSwgdGhpcyBtZXRob2Qgd2lsbCBoYXZlIG5vIGVmZmVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgZGF0YSB0byByZW1vdmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRGF0YVRyYW5zZmVyLnByb3RvdHlwZS5jbGVhckRhdGEgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVt0eXBlLnRvTG93ZXJDYXNlKCldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEgZm9yIGEgZ2l2ZW4gdHlwZSwgb3IgYW4gZW1wdHkgc3RyaW5nIGlmIGRhdGEgZm9yIHRoYXQgdHlwZSBkb2VzXHJcbiAgICAgICAgICogbm90IGV4aXN0IG9yIHRoZSBkYXRhIHRyYW5zZmVyIGNvbnRhaW5zIG5vIGRhdGEuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSBUeXBlIG9mIGRhdGEgdG8gcmV0cmlldmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRGF0YVRyYW5zZmVyLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbdHlwZS50b0xvd2VyQ2FzZSgpXSB8fCAnJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCB0aGUgZGF0YSBmb3IgYSBnaXZlbiB0eXBlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogRm9yIGEgbGlzdCBvZiByZWNvbW1lbmRlZCBkcmFnIHR5cGVzLCBwbGVhc2Ugc2VlXHJcbiAgICAgICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvR3VpZGUvSFRNTC9SZWNvbW1lbmRlZF9EcmFnX1R5cGVzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHR5cGUgVHlwZSBvZiBkYXRhIHRvIGFkZC5cclxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUgRGF0YSB0byBhZGQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRGF0YVRyYW5zZmVyLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24gKHR5cGUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFbdHlwZS50b0xvd2VyQ2FzZSgpXSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2V0IHRoZSBpbWFnZSB0byBiZSB1c2VkIGZvciBkcmFnZ2luZyBpZiBhIGN1c3RvbSBvbmUgaXMgZGVzaXJlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpbWcgQW4gaW1hZ2UgZWxlbWVudCB0byB1c2UgYXMgdGhlIGRyYWcgZmVlZGJhY2sgaW1hZ2UuXHJcbiAgICAgICAgICogQHBhcmFtIG9mZnNldFggVGhlIGhvcml6b250YWwgb2Zmc2V0IHdpdGhpbiB0aGUgaW1hZ2UuXHJcbiAgICAgICAgICogQHBhcmFtIG9mZnNldFkgVGhlIHZlcnRpY2FsIG9mZnNldCB3aXRoaW4gdGhlIGltYWdlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIERhdGFUcmFuc2Zlci5wcm90b3R5cGUuc2V0RHJhZ0ltYWdlID0gZnVuY3Rpb24gKGltZywgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgICAgICAgICB2YXIgZGR0ID0gRHJhZ0Ryb3BUb3VjaC5faW5zdGFuY2U7XHJcbiAgICAgICAgICAgIGRkdC5faW1nQ3VzdG9tID0gaW1nO1xyXG4gICAgICAgICAgICBkZHQuX2ltZ09mZnNldCA9IHsgeDogb2Zmc2V0WCwgeTogb2Zmc2V0WSB9O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIERhdGFUcmFuc2ZlcjtcclxuICAgIH0oKSk7XHJcbiAgICBEcmFnRHJvcFRvdWNoXzEuRGF0YVRyYW5zZmVyID0gRGF0YVRyYW5zZmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmVzIGEgY2xhc3MgdGhhdCBhZGRzIHN1cHBvcnQgZm9yIHRvdWNoLWJhc2VkIEhUTUw1IGRyYWcvZHJvcCBvcGVyYXRpb25zLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBAc2VlOkRyYWdEcm9wVG91Y2ggY2xhc3MgbGlzdGVucyB0byB0b3VjaCBldmVudHMgYW5kIHJhaXNlcyB0aGVcclxuICAgICAqIGFwcHJvcHJpYXRlIEhUTUw1IGRyYWcvZHJvcCBldmVudHMgYXMgaWYgdGhlIGV2ZW50cyBoYWQgYmVlbiBjYXVzZWRcclxuICAgICAqIGJ5IG1vdXNlIGFjdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIHB1cnBvc2Ugb2YgdGhpcyBjbGFzcyBpcyB0byBlbmFibGUgdXNpbmcgZXhpc3RpbmcsIHN0YW5kYXJkIEhUTUw1XHJcbiAgICAgKiBkcmFnL2Ryb3AgY29kZSBvbiBtb2JpbGUgZGV2aWNlcyBydW5uaW5nIElPUyBvciBBbmRyb2lkLlxyXG4gICAgICpcclxuICAgICAqIFRvIHVzZSwgaW5jbHVkZSB0aGUgRHJhZ0Ryb3BUb3VjaC5qcyBmaWxlIG9uIHRoZSBwYWdlLiBUaGUgY2xhc3Mgd2lsbFxyXG4gICAgICogYXV0b21hdGljYWxseSBzdGFydCBtb25pdG9yaW5nIHRvdWNoIGV2ZW50cyBhbmQgd2lsbCByYWlzZSB0aGUgSFRNTDVcclxuICAgICAqIGRyYWcgZHJvcCBldmVudHMgKGRyYWdzdGFydCwgZHJhZ2VudGVyLCBkcmFnbGVhdmUsIGRyb3AsIGRyYWdlbmQpIHdoaWNoXHJcbiAgICAgKiBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgYXBwbGljYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogRm9yIGRldGFpbHMgYW5kIGV4YW1wbGVzIG9uIEhUTUwgZHJhZyBhbmQgZHJvcCwgc2VlXHJcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9HdWlkZS9IVE1ML0RyYWdfb3BlcmF0aW9ucy5cclxuICAgICAqL1xyXG4gICAgdmFyIERyYWdEcm9wVG91Y2ggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluaXRpYWxpemVzIHRoZSBzaW5nbGUgaW5zdGFuY2Ugb2YgdGhlIEBzZWU6RHJhZ0Ryb3BUb3VjaCBjbGFzcy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBEcmFnRHJvcFRvdWNoKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0Q2xpY2sgPSAwO1xyXG4gICAgICAgICAgICAvLyBlbmZvcmNlIHNpbmdsZXRvbiBwYXR0ZXJuXHJcbiAgICAgICAgICAgIGlmIChEcmFnRHJvcFRvdWNoLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ0RyYWdEcm9wVG91Y2ggaW5zdGFuY2UgYWxyZWFkeSBjcmVhdGVkLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZGV0ZWN0IHBhc3NpdmUgZXZlbnQgc3VwcG9ydFxyXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMTg5NFxyXG4gICAgICAgICAgICB2YXIgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBmdW5jdGlvbiAoKSB7IH0sIHtcclxuICAgICAgICAgICAgICAgIGdldCBwYXNzaXZlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBsaXN0ZW4gdG8gdG91Y2ggZXZlbnRzXHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gZG9jdW1lbnQsIFxyXG4gICAgICAgICAgICAgICAgICAgIHRzID0gdGhpcy5fdG91Y2hzdGFydC5iaW5kKHRoaXMpLCBcclxuICAgICAgICAgICAgICAgICAgICB0bSA9IHRoaXMuX3RvdWNobW92ZS5iaW5kKHRoaXMpLCBcclxuICAgICAgICAgICAgICAgICAgICB0ZSA9IHRoaXMuX3RvdWNoZW5kLmJpbmQodGhpcyksIFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdCA9IHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogZmFsc2UsIGNhcHR1cmU6IGZhbHNlIH0gOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRzLCBvcHQpO1xyXG4gICAgICAgICAgICAgICAgZC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0bSwgb3B0KTtcclxuICAgICAgICAgICAgICAgIGQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0ZSk7XHJcbiAgICAgICAgICAgICAgICBkLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIEBzZWU6RHJhZ0Ryb3BUb3VjaCBzaW5nbGV0b24uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIERyYWdEcm9wVG91Y2guX2luc3RhbmNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gKiogZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fdG91Y2hzdGFydCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaG91bGRIYW5kbGUoZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJhaXNlIGRvdWJsZS1jbGljayBhbmQgcHJldmVudCB6b29taW5nXHJcbiAgICAgICAgICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHRoaXMuX2xhc3RDbGljayA8IERyYWdEcm9wVG91Y2guX0RCTENMSUNLKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc3BhdGNoRXZlbnQoZSwgJ2RibGNsaWNrJywgZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGNsZWFyIGFsbCB2YXJpYWJsZXNcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBnZXQgbmVhcmVzdCBkcmFnZ2FibGUgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMuX2Nsb3Nlc3REcmFnZ2FibGUoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNyYykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdpdmUgY2FsbGVyIGEgY2hhbmNlIHRvIGhhbmRsZSB0aGUgaG92ZXIvbW92ZSBldmVudHNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2Rpc3BhdGNoRXZlbnQoZSwgJ21vdXNlbW92ZScsIGUudGFyZ2V0KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnbW91c2Vkb3duJywgZS50YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCByZWFkeSB0byBzdGFydCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcmFnU291cmNlID0gc3JjO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wdERvd24gPSB0aGlzLl9nZXRQb2ludChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdFRvdWNoID0gZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBpZiB0aGUgdXNlciBoYXNuJ3Qgc3RhcnRlZCBkcmFnZ2luZyBhZnRlciBhIHdoaWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLl9kcmFnU291cmNlID09IHNyYyAmJiBfdGhpcy5faW1nID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX2Rpc3BhdGNoRXZlbnQoZSwgJ2NvbnRleHRtZW51Jywgc3JjKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIERyYWdEcm9wVG91Y2guX0NUWE1FTlUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHJhZ0Ryb3BUb3VjaC5fSVNQUkVTU0hPTERNT0RFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmVzc0hvbGRJbnRlcnZhbCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9pc0RyYWdFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fdG91Y2htb3ZlKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgRHJhZ0Ryb3BUb3VjaC5fUFJFU1NIT0xEQVdBSVQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fdG91Y2htb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Nob3VsZENhbmNlbFByZXNzSG9sZE1vdmUoZSkpIHtcclxuICAgICAgICAgICAgICB0aGlzLl9yZXNldCgpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2hvdWxkSGFuZGxlTW92ZShlKSB8fCB0aGlzLl9zaG91bGRIYW5kbGVQcmVzc0hvbGRNb3ZlKGUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzZWUgaWYgdGFyZ2V0IHdhbnRzIHRvIGhhbmRsZSBtb3ZlXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5fZ2V0VGFyZ2V0KGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Rpc3BhdGNoRXZlbnQoZSwgJ21vdXNlbW92ZScsIHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VG91Y2ggPSBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RyYWdTb3VyY2UgJiYgIXRoaXMuX2ltZyAmJiB0aGlzLl9zaG91bGRTdGFydERyYWdnaW5nKGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnZHJhZ3N0YXJ0JywgdGhpcy5fZHJhZ1NvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlSW1hZ2UoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnZHJhZ2VudGVyJywgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlIGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW1nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGFzdFRvdWNoID0gZTtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgc2Nyb2xsaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChlLCAnZHJhZycsIHRoaXMuX2RyYWdTb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgIT0gdGhpcy5fbGFzdFRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KHRoaXMuX2xhc3RUb3VjaCwgJ2RyYWdsZWF2ZScsIHRoaXMuX2xhc3RUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KGUsICdkcmFnZW50ZXInLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXN0VGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3ZlSW1hZ2UoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNEcm9wWm9uZSA9IHRoaXMuX2Rpc3BhdGNoRXZlbnQoZSwgJ2RyYWdvdmVyJywgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX3RvdWNoZW5kID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Nob3VsZEhhbmRsZShlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2VlIGlmIHRhcmdldCB3YW50cyB0byBoYW5kbGUgdXBcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwYXRjaEV2ZW50KHRoaXMuX2xhc3RUb3VjaCwgJ21vdXNldXAnLCBlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gdXNlciBjbGlja2VkIHRoZSBlbGVtZW50IGJ1dCBkaWRuJ3QgZHJhZywgc28gY2xlYXIgdGhlIHNvdXJjZSBhbmQgc2ltdWxhdGUgYSBjbGlja1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kcmFnU291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KHRoaXMuX2xhc3RUb3VjaCwgJ2NsaWNrJywgZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RDbGljayA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBmaW5pc2ggZHJhZ2dpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RyYWdTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS50eXBlLmluZGV4T2YoJ2NhbmNlbCcpIDwgMCAmJiB0aGlzLl9pc0Ryb3Bab25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQodGhpcy5fbGFzdFRvdWNoLCAnZHJvcCcsIHRoaXMuX2xhc3RUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KHRoaXMuX2xhc3RUb3VjaCwgJ2RyYWdlbmQnLCB0aGlzLl9kcmFnU291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyAqKiB1dGlsaXRpZXNcclxuICAgICAgICAvLyBpZ25vcmUgZXZlbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQgb3IgdGhhdCBpbnZvbHZlIG1vcmUgdGhhbiBvbmUgdG91Y2hcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fc2hvdWxkSGFuZGxlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGUgJiZcclxuICAgICAgICAgICAgICAgICFlLmRlZmF1bHRQcmV2ZW50ZWQgJiZcclxuICAgICAgICAgICAgICAgIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoIDwgMjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyB1c2UgcmVndWxhciBjb25kaXRpb24gb3V0c2lkZSBvZiBwcmVzcyAmIGhvbGQgbW9kZVxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9zaG91bGRIYW5kbGVNb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHJldHVybiAhRHJhZ0Ryb3BUb3VjaC5fSVNQUkVTU0hPTERNT0RFICYmIHRoaXMuX3Nob3VsZEhhbmRsZShlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBhbGxvdyB0byBoYW5kbGUgbW92ZXMgdGhhdCBpbnZvbHZlIG1hbnkgdG91Y2hlcyBmb3IgcHJlc3MgJiBob2xkXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX3Nob3VsZEhhbmRsZVByZXNzSG9sZE1vdmUgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgcmV0dXJuIERyYWdEcm9wVG91Y2guX0lTUFJFU1NIT0xETU9ERSAmJlxyXG4gICAgICAgICAgICAgIHRoaXMuX2lzRHJhZ0VuYWJsZWQgJiYgZSAmJiBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyByZXNldCBkYXRhIGlmIHVzZXIgZHJhZ3Mgd2l0aG91dCBwcmVzc2luZyAmIGhvbGRpbmdcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fc2hvdWxkQ2FuY2VsUHJlc3NIb2xkTW92ZSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICByZXR1cm4gRHJhZ0Ryb3BUb3VjaC5fSVNQUkVTU0hPTERNT0RFICYmICF0aGlzLl9pc0RyYWdFbmFibGVkICYmXHJcbiAgICAgICAgICAgICAgdGhpcy5fZ2V0RGVsdGEoZSkgPiBEcmFnRHJvcFRvdWNoLl9QUkVTU0hPTERNQVJHSU47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gc3RhcnQgZHJhZ2dpbmcgd2hlbiBzcGVjaWZpZWQgZGVsdGEgaXMgZGV0ZWN0ZWRcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fc2hvdWxkU3RhcnREcmFnZ2luZyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IHRoaXMuX2dldERlbHRhKGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVsdGEgPiBEcmFnRHJvcFRvdWNoLl9USFJFU0hPTEQgfHxcclxuICAgICAgICAgICAgICAgIChEcmFnRHJvcFRvdWNoLl9JU1BSRVNTSE9MRE1PREUgJiYgZGVsdGEgPj0gRHJhZ0Ryb3BUb3VjaC5fUFJFU1NIT0xEVEhSRVNIT0xEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNsZWFyIGFsbCBtZW1iZXJzXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX3Jlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95SW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhZ1NvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RUb3VjaCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RUYXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9wdERvd24gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9pc0RyYWdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzRHJvcFpvbmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVRyYW5zZmVyID0gbmV3IERhdGFUcmFuc2ZlcigpO1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3ByZXNzSG9sZEludGVydmFsKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGdldCBwb2ludCBmb3IgYSB0b3VjaCBldmVudFxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9nZXRQb2ludCA9IGZ1bmN0aW9uIChlLCBwYWdlKSB7XHJcbiAgICAgICAgICAgIGlmIChlICYmIGUudG91Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgZSA9IGUudG91Y2hlc1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4geyB4OiBwYWdlID8gZS5wYWdlWCA6IGUuY2xpZW50WCwgeTogcGFnZSA/IGUucGFnZVkgOiBlLmNsaWVudFkgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGdldCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBjdXJyZW50IHRvdWNoIGV2ZW50IGFuZCB0aGUgZmlyc3Qgb25lXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2dldERlbHRhID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKERyYWdEcm9wVG91Y2guX0lTUFJFU1NIT0xETU9ERSAmJiAhdGhpcy5fcHREb3duKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5fZ2V0UG9pbnQoZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhwLnggLSB0aGlzLl9wdERvd24ueCkgKyBNYXRoLmFicyhwLnkgLSB0aGlzLl9wdERvd24ueSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBnZXQgdGhlIGVsZW1lbnQgYXQgYSBnaXZlbiB0b3VjaCBldmVudFxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9nZXRUYXJnZXQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgcHQgPSB0aGlzLl9nZXRQb2ludChlKSwgZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHB0LngsIHB0LnkpO1xyXG4gICAgICAgICAgICB3aGlsZSAoZWwgJiYgZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9pbnRlckV2ZW50cyA9PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBjcmVhdGUgZHJhZyBpbWFnZSBmcm9tIHNvdXJjZSBlbGVtZW50XHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2NyZWF0ZUltYWdlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgLy8ganVzdCBpbiBjYXNlLi4uXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbWcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lJbWFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBkcmFnIGltYWdlIGZyb20gY3VzdG9tIGVsZW1lbnQgb3IgZHJhZyBzb3VyY2VcclxuICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMuX2ltZ0N1c3RvbSB8fCB0aGlzLl9kcmFnU291cmNlO1xyXG4gICAgICAgICAgICB0aGlzLl9pbWcgPSBzcmMuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb3B5U3R5bGUoc3JjLCB0aGlzLl9pbWcpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbWcuc3R5bGUudG9wID0gdGhpcy5faW1nLnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XHJcbiAgICAgICAgICAgIC8vIGlmIGNyZWF0aW5nIGZyb20gZHJhZyBzb3VyY2UsIGFwcGx5IG9mZnNldCBhbmQgb3BhY2l0eVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2ltZ0N1c3RvbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJjID0gc3JjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBwdCA9IHRoaXMuX2dldFBvaW50KGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1nT2Zmc2V0ID0geyB4OiBwdC54IC0gcmMubGVmdCwgeTogcHQueSAtIHJjLnRvcCB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1nLnN0eWxlLm9wYWNpdHkgPSBEcmFnRHJvcFRvdWNoLl9PUEFDSVRZLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYWRkIGltYWdlIHRvIGRvY3VtZW50XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVJbWFnZShlKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9pbWcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gZGlzcG9zZSBvZiBkcmFnIGltYWdlIGVsZW1lbnRcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fZGVzdHJveUltYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faW1nICYmIHRoaXMuX2ltZy5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbWcucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLl9pbWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ltZyA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltZ0N1c3RvbSA9IG51bGw7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBtb3ZlIHRoZSBkcmFnIGltYWdlIGVsZW1lbnRcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fbW92ZUltYWdlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5faW1nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB0ID0gX3RoaXMuX2dldFBvaW50KGUsIHRydWUpLCBzID0gX3RoaXMuX2ltZy5zdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICBzLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICAgICAgICAgICAgICBzLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgcy56SW5kZXggPSAnOTk5OTk5JztcclxuICAgICAgICAgICAgICAgICAgICBzLmxlZnQgPSBNYXRoLnJvdW5kKHB0LnggLSBfdGhpcy5faW1nT2Zmc2V0LngpICsgJ3B4JztcclxuICAgICAgICAgICAgICAgICAgICBzLnRvcCA9IE1hdGgucm91bmQocHQueSAtIF90aGlzLl9pbWdPZmZzZXQueSkgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIGNvcHkgcHJvcGVydGllcyBmcm9tIGFuIG9iamVjdCB0byBhbm90aGVyXHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2NvcHlQcm9wcyA9IGZ1bmN0aW9uIChkc3QsIHNyYywgcHJvcHMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwcm9wc1tpXTtcclxuICAgICAgICAgICAgICAgIGRzdFtwXSA9IHNyY1twXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgRHJhZ0Ryb3BUb3VjaC5wcm90b3R5cGUuX2NvcHlTdHlsZSA9IGZ1bmN0aW9uIChzcmMsIGRzdCkge1xyXG4gICAgICAgICAgICAvLyByZW1vdmUgcG90ZW50aWFsbHkgdHJvdWJsZXNvbWUgYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBEcmFnRHJvcFRvdWNoLl9ybXZBdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xyXG4gICAgICAgICAgICAgICAgZHN0LnJlbW92ZUF0dHJpYnV0ZShhdHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gY29weSBjYW52YXMgY29udGVudFxyXG4gICAgICAgICAgICBpZiAoc3JjIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjU3JjID0gc3JjLCBjRHN0ID0gZHN0O1xyXG4gICAgICAgICAgICAgICAgY0RzdC53aWR0aCA9IGNTcmMud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBjRHN0LmhlaWdodCA9IGNTcmMuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgY0RzdC5nZXRDb250ZXh0KCcyZCcpLmRyYXdJbWFnZShjU3JjLCAwLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb3B5IHN0eWxlICh3aXRob3V0IHRyYW5zaXRpb25zKVxyXG4gICAgICAgICAgICB2YXIgY3MgPSBnZXRDb21wdXRlZFN0eWxlKHNyYyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBjc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZigndHJhbnNpdGlvbicpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRzdC5zdHlsZVtrZXldID0gY3Nba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkc3Quc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICAgICAgLy8gYW5kIHJlcGVhdCBmb3IgYWxsIGNoaWxkcmVuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3JjLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3B5U3R5bGUoc3JjLmNoaWxkcmVuW2ldLCBkc3QuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBEcmFnRHJvcFRvdWNoLnByb3RvdHlwZS5fZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIChlLCB0eXBlLCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgaWYgKGUgJiYgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50JyksIHQgPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0gOiBlO1xyXG4gICAgICAgICAgICAgICAgZXZ0LmluaXRFdmVudCh0eXBlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5idXR0b24gPSAwO1xyXG4gICAgICAgICAgICAgICAgZXZ0LndoaWNoID0gZXZ0LmJ1dHRvbnMgPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29weVByb3BzKGV2dCwgZSwgRHJhZ0Ryb3BUb3VjaC5fa2JkUHJvcHMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29weVByb3BzKGV2dCwgdCwgRHJhZ0Ryb3BUb3VjaC5fcHRQcm9wcyk7XHJcbiAgICAgICAgICAgICAgICBldnQuZGF0YVRyYW5zZmVyID0gdGhpcy5fZGF0YVRyYW5zZmVyO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBldnQuZGVmYXVsdFByZXZlbnRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyBnZXRzIGFuIGVsZW1lbnQncyBjbG9zZXN0IGRyYWdnYWJsZSBhbmNlc3RvclxyXG4gICAgICAgIERyYWdEcm9wVG91Y2gucHJvdG90eXBlLl9jbG9zZXN0RHJhZ2dhYmxlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZm9yICg7IGU7IGUgPSBlLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmhhc0F0dHJpYnV0ZSgnZHJhZ2dhYmxlJykgJiYgZS5kcmFnZ2FibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBEcmFnRHJvcFRvdWNoO1xyXG4gICAgfSgpKTtcclxuICAgIC8qcHJpdmF0ZSovIERyYWdEcm9wVG91Y2guX2luc3RhbmNlID0gbmV3IERyYWdEcm9wVG91Y2goKTsgLy8gc2luZ2xldG9uXHJcbiAgICAvLyBjb25zdGFudHNcclxuICAgIERyYWdEcm9wVG91Y2guX1RIUkVTSE9MRCA9IDU7IC8vIHBpeGVscyB0byBtb3ZlIGJlZm9yZSBkcmFnIHN0YXJ0c1xyXG4gICAgRHJhZ0Ryb3BUb3VjaC5fT1BBQ0lUWSA9IDAuNTsgLy8gZHJhZyBpbWFnZSBvcGFjaXR5XHJcbiAgICBEcmFnRHJvcFRvdWNoLl9EQkxDTElDSyA9IDUwMDsgLy8gbWF4IG1zIGJldHdlZW4gY2xpY2tzIGluIGEgZG91YmxlIGNsaWNrXHJcbiAgICBEcmFnRHJvcFRvdWNoLl9DVFhNRU5VID0gOTAwOyAvLyBtcyB0byBob2xkIGJlZm9yZSByYWlzaW5nICdjb250ZXh0bWVudScgZXZlbnRcclxuICAgIERyYWdEcm9wVG91Y2guX0lTUFJFU1NIT0xETU9ERSA9IGZhbHNlOyAvLyBkZWNpZGVzIG9mIHByZXNzICYgaG9sZCBtb2RlIHByZXNlbmNlXHJcbiAgICBEcmFnRHJvcFRvdWNoLl9QUkVTU0hPTERBV0FJVCA9IDQwMDsgLy8gbXMgdG8gd2FpdCBiZWZvcmUgcHJlc3MgJiBob2xkIGlzIGRldGVjdGVkXHJcbiAgICBEcmFnRHJvcFRvdWNoLl9QUkVTU0hPTERNQVJHSU4gPSAyNTsgLy8gcGl4ZWxzIHRoYXQgZmluZ2VyIG1pZ2h0IHNoaXZlciB3aGlsZSBwcmVzc2luZ1xyXG4gICAgRHJhZ0Ryb3BUb3VjaC5fUFJFU1NIT0xEVEhSRVNIT0xEID0gMDsgLy8gcGl4ZWxzIHRvIG1vdmUgYmVmb3JlIGRyYWcgc3RhcnRzXHJcbiAgICAvLyBjb3B5IHN0eWxlcy9hdHRyaWJ1dGVzIGZyb20gZHJhZyBzb3VyY2UgdG8gZHJhZyBpbWFnZSBlbGVtZW50XHJcbiAgICBEcmFnRHJvcFRvdWNoLl9ybXZBdHRzID0gJ2lkLGNsYXNzLHN0eWxlLGRyYWdnYWJsZScuc3BsaXQoJywnKTtcclxuICAgIC8vIHN5bnRoZXNpemUgYW5kIGRpc3BhdGNoIGFuIGV2ZW50XHJcbiAgICAvLyByZXR1cm5zIHRydWUgaWYgdGhlIGV2ZW50IGhhcyBiZWVuIGhhbmRsZWQgKGUucHJldmVudERlZmF1bHQgPT0gdHJ1ZSlcclxuICAgIERyYWdEcm9wVG91Y2guX2tiZFByb3BzID0gJ2FsdEtleSxjdHJsS2V5LG1ldGFLZXksc2hpZnRLZXknLnNwbGl0KCcsJyk7XHJcbiAgICBEcmFnRHJvcFRvdWNoLl9wdFByb3BzID0gJ3BhZ2VYLHBhZ2VZLGNsaWVudFgsY2xpZW50WSxzY3JlZW5YLHNjcmVlblksb2Zmc2V0WCxvZmZzZXRZJy5zcGxpdCgnLCcpO1xyXG4gICAgRHJhZ0Ryb3BUb3VjaF8xLkRyYWdEcm9wVG91Y2ggPSBEcmFnRHJvcFRvdWNoO1xyXG59KShEcmFnRHJvcFRvdWNoIHx8IChEcmFnRHJvcFRvdWNoID0ge30pKTtcclxuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlcjogXCJZb3UgYXJlIGNvcnJlY3QhXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlcjpcbiAgICAgICAgICAgIFwiSW5jb3JyZXQuIFlvdSBnb3QgJDEgY29ycmVjdCBhbmQgJDIgaW5jb3JyZWN0IG91dCBvZiAkMy4gWW91IGxlZnQgJDQgYmxhbmsuXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9yZXNldDogXCJSZXNldFwiLFxuICAgIH0sXG59KTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfZHJhZ25kcm9wX2NvcnJlY3RfYW5zd2VyOiBcIkNvcnJldG8hXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlcjpcbiAgICAgICAgICAgIFwiSW5jb3JyZXRvLiBWb2PDqiB0ZXZlICQxIGNvcnJldG8ocykgZSAkMiBpbmNvcnJldG8ocykgZGUgJDMuIFZvY8OqIGRlaXhvdSAkNCBlbSBicmFuY28uXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcmVzZXQ6IFwiUmVzZXRhclwiLFxuICAgIH0sXG59KTtcbiIsIi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09ICAgICBNYXN0ZXIgZHJhZ25kcm9wLmpzICAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gdGhlIFJ1bmVzdG9uZSBEcmFnIG4gZHJvcCBjb21wb25lbnQuID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDcvNi8xNSAgICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgQnJhZCBNSWxsZXIgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgMi83LzE5ICAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9kcmFnbmRyb3AubGVzc1wiO1xuaW1wb3J0IFwiLi9kcmFnbmRyb3AtaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9kcmFnbmRyb3AtaTE4bi5wdC1ici5qc1wiO1xuaW1wb3J0IFwiLi9EcmFnRHJvcFRvdWNoLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYWdORHJvcCBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHVsPiBlbGVtZW50IHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieSBuZXcgSFRNTFxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLnJhbmRvbSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzLm9yaWdFbGVtKS5pcyhcIltkYXRhLXJhbmRvbV1cIikpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRiYWNrID0gXCJcIjtcbiAgICAgICAgdGhpcy5kcmFnUGFpckFycmF5ID0gW107XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCk7IC8vIFBvcHVsYXRlcyB0aGlzLmRyYWdQYWlyQXJyYXksIHRoaXMuZmVlZGJhY2sgYW5kIHRoaXMucXVlc3Rpb25cbiAgICAgICAgdGhpcy5jcmVhdGVOZXdFbGVtZW50cygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIkRyYWctTi1Ecm9wXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBVcGRhdGUgdmFyaWFibGVzID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICQodGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldKS5kYXRhKFwic3ViY29tcG9uZW50XCIpID09PVxuICAgICAgICAgICAgICAgIFwiZHJvcHpvbmVcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9ICQodGhpcy5vcmlnRWxlbSkuZmluZChcbiAgICAgICAgICAgICAgICAgICAgYCMkeyQodGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldKS5hdHRyKFwiZm9yXCIpfWBcbiAgICAgICAgICAgICAgICApWzBdO1xuICAgICAgICAgICAgICAgIHZhciByZXBsYWNlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIHJlcGxhY2VTcGFuLmlubmVySFRNTCA9IHRtcC5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgcmVwbGFjZVNwYW4uaWQgPSB0aGlzLmRpdmlkICsgdG1wLmlkO1xuICAgICAgICAgICAgICAgICQocmVwbGFjZVNwYW4pLmF0dHIoXCJkcmFnZ2FibGVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgICAgICQocmVwbGFjZVNwYW4pLmFkZENsYXNzKFwiZHJhZ2dhYmxlLWRyYWdcIik7XG4gICAgICAgICAgICAgICAgdmFyIG90aGVyUmVwbGFjZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBvdGhlclJlcGxhY2VTcGFuLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgJChvdGhlclJlcGxhY2VTcGFuKS5hZGRDbGFzcyhcImRyYWdnYWJsZS1kcm9wXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RXZlbnRMaXN0ZW5lcnMocmVwbGFjZVNwYW4sIG90aGVyUmVwbGFjZVNwYW4pO1xuICAgICAgICAgICAgICAgIHZhciB0bXBBcnIgPSBbXTtcbiAgICAgICAgICAgICAgICB0bXBBcnIucHVzaChyZXBsYWNlU3Bhbik7XG4gICAgICAgICAgICAgICAgdG1wQXJyLnB1c2gob3RoZXJSZXBsYWNlU3Bhbik7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnUGFpckFycmF5LnB1c2godG1wQXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgJCh0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0pLmRhdGEoXCJzdWJjb21wb25lbnRcIikgPT09XG4gICAgICAgICAgICAgICAgXCJxdWVzdGlvblwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldLmlubmVySFRNTDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgJCh0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXNbaV0pLmRhdGEoXCJzdWJjb21wb25lbnRcIikgPT09XG4gICAgICAgICAgICAgICAgXCJmZWVkYmFja1wiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRiYWNrID0gdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzW2ldLmlubmVySFRNTDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBDcmVhdGUgbmV3IEhUTUwgZWxlbWVudHMgYW5kIHJlcGxhY2UgPT1cbiAgICA9PSAgICAgIG9yaWdpbmFsIGVsZW1lbnQgd2l0aCB0aGVtICAgICAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVOZXdFbGVtZW50cygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICQodGhpcy5jb250YWluZXJEaXYpLmFkZENsYXNzKFwiZHJhZ2dhYmxlLWNvbnRhaW5lclwiKTtcbiAgICAgICAgJCh0aGlzLmNvbnRhaW5lckRpdikuaHRtbCh0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyAvLyBIb2xkcyB0aGUgZHJhZ2dhYmxlcy9kcm9wem9uZXMsIHByZXZlbnRzIGZlZWRiYWNrIGZyb20gYmxlZWRpbmcgaW5cbiAgICAgICAgJCh0aGlzLmRyYWdEcm9wV3JhcERpdikuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmRyYWdEcm9wV3JhcERpdik7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmRyYWdnYWJsZURpdikuYWRkQ2xhc3MoXCJyc2RyYWdnYWJsZSBkcmFnem9uZVwiKTtcbiAgICAgICAgdGhpcy5hZGREcmFnRGl2TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuZHJvcFpvbmVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuZHJvcFpvbmVEaXYpLmFkZENsYXNzKFwicnNkcmFnZ2FibGVcIik7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LmFwcGVuZENoaWxkKHRoaXMuZHJhZ2dhYmxlRGl2KTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuYXBwZW5kQ2hpbGQodGhpcy5kcm9wWm9uZURpdik7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZHJhZ05kcm9wXCIsIHRydWUpO1xuICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5xdWV1ZU1hdGhKYXgoc2VsZi5jb250YWluZXJEaXYpO1xuXG4gICAgfVxuICAgIGZpbmlzaFNldHRpbmdVcCgpIHtcbiAgICAgICAgdGhpcy5hcHBlbmRSZXBsYWNlbWVudFNwYW5zKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIGlmICghdGhpcy5oYXNTdG9yZWREcm9wem9uZXMpIHtcbiAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0ID0gJCh0aGlzLmRyYWdnYWJsZURpdikuaGVpZ2h0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgaWYgKCQodGhpcy5kcm9wWm9uZURpdikuaGVpZ2h0KCkgPiB0aGlzLm1pbmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc3R5bGUubWluSGVpZ2h0ID1cbiAgICAgICAgICAgICAgICAkKHRoaXMuZHJvcFpvbmVEaXYpLmhlaWdodCgpLnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zdHlsZS5taW5IZWlnaHQgPVxuICAgICAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkRHJhZ0Rpdkxpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcmFnb3ZlclwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzLmRyYWdnYWJsZURpdikuaGFzQ2xhc3MoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKHRoaXMuZHJhZ2dhYmxlRGl2KS5hZGRDbGFzcyhcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcm9wXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcy5kcmFnZ2FibGVEaXYpLmhhc0NsYXNzKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5kcmFnZ2FibGVEaXYpLnJlbW92ZUNsYXNzKFwicG9zc2libGVEcm9wXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiZHJhZ2dhYmxlSURcIik7XG4gICAgICAgICAgICAgICAgdmFyIGRyYWdnZWRTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhJCh0aGlzLmRyYWdnYWJsZURpdikuaGFzKGRyYWdnZWRTcGFuKS5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuc3RyYW5nZXJEYW5nZXIoZHJhZ2dlZFNwYW4pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBlbGVtZW50IGlzbid0IGFscmVhZHkgdGhlcmUtLXByZXZlbnRzIGVycm9zIHcvYXBwZW5kaW5nIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ2xlYXZlXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzLmRyYWdnYWJsZURpdikuaGFzQ2xhc3MoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKHRoaXMuZHJhZ2dhYmxlRGl2KS5yZW1vdmVDbGFzcyhcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cbiAgICBjcmVhdGVCdXR0b25zKCkge1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTsgLy8gQ2hlY2sgbWUgYnV0dG9uXG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2RyYWduZHJvcF9jaGVja19tZVwiKTtcbiAgICAgICAgJCh0aGlzLnN1Ym1pdEJ1dHRvbikuYXR0cih7XG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLXN1Y2Nlc3MgZHJhZy1idXR0b25cIixcbiAgICAgICAgICAgIG5hbWU6IFwiZG8gYW5zd2VyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTsgLy8gQ2hlY2sgbWUgYnV0dG9uXG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZHJhZ25kcm9wX3Jlc2V0XCIpO1xuICAgICAgICAkKHRoaXMucmVzZXRCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IGRyYWctYnV0dG9uIGRyYWctcmVzZXRcIixcbiAgICAgICAgICAgIG5hbWU6IFwiZG8gYW5zd2VyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0RHJhZ2dhYmxlcygpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcbiAgICAgICAgdGhpcy5idXR0b25EaXYuYXBwZW5kQ2hpbGQodGhpcy5yZXNldEJ1dHRvbik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRGl2KTtcbiAgICB9XG4gICAgYXBwZW5kUmVwbGFjZW1lbnRTcGFucygpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVJbmRleEFycmF5KCk7XG4gICAgICAgIHRoaXMucmFuZG9taXplSW5kZXhBcnJheSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAkLmluQXJyYXkodGhpcy5pbmRleEFycmF5W2ldWzBdLCB0aGlzLnByZWduYW50SW5kZXhBcnJheSkgPFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnUGFpckFycmF5W3RoaXMuaW5kZXhBcnJheVtpXV1bMF1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbdGhpcy5pbmRleEFycmF5W2ldXVswXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUluZGV4QXJyYXkoKTsgLy8gc2h1ZmZsZSBpbmRleCBhZ2FpblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVJbmRleEFycmF5KCk7IC8vIHJlc2V0IGRlZmF1bHQgaW5kZXhcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJlZ25hbnRJbmRleEFycmF5W3RoaXMuaW5kZXhBcnJheVtpXV0gIT09IFwiLTFcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbdGhpcy5pbmRleEFycmF5W2ldXVsxXS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1BhaXJBcnJheVtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWduYW50SW5kZXhBcnJheVt0aGlzLmluZGV4QXJyYXlbaV1dXG4gICAgICAgICAgICAgICAgICAgICAgICBdWzBdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbdGhpcy5pbmRleEFycmF5W2ldXVsxXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXRFdmVudExpc3RlbmVycyhkZ1NwYW4sIGRwU3Bhbikge1xuICAgICAgICAvLyBBZGRzIEhUTUw1IFwiZHJhZyBhbmQgZHJvcFwiIFVJIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiZHJhZ2dhYmxlSURcIiwgZXYudGFyZ2V0LmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRnU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiZHJhZ2dhYmxlSURcIik7XG4gICAgICAgICAgICAgICAgdmFyIGRyYWdnZWRTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc05vRHJhZ0NoaWxkKGV2LnRhcmdldCkgJiZcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dlZFNwYW4gIT0gZXYudGFyZ2V0ICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnN0cmFuZ2VyRGFuZ2VyKGRyYWdnZWRTcGFuKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgZWxlbWVudCBpc24ndCBhbHJlYWR5IHRoZXJlLS1wcmV2ZW50cyBlcnJvcyB3L2FwcGVuZGluZyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcmFnb3ZlclwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICgkKGV2LnRhcmdldCkuaGFzQ2xhc3MoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcImRyYWdnYWJsZS1kcm9wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzTm9EcmFnQ2hpbGQoZXYudGFyZ2V0KVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAkKGV2LnRhcmdldCkuYWRkQ2xhc3MoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoISQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoZXYudGFyZ2V0KS5yZW1vdmVDbGFzcyhcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcm9wXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAkKGV2LnRhcmdldCkucmVtb3ZlQ2xhc3MoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJkcmFnZ2FibGVJRFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhZ2dlZFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICQoZXYudGFyZ2V0KS5oYXNDbGFzcyhcImRyYWdnYWJsZS1kcm9wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzTm9EcmFnQ2hpbGQoZXYudGFyZ2V0KSAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zdHJhbmdlckRhbmdlcihkcmFnZ2VkU3BhbilcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGVsZW1lbnQgaXNuJ3QgYWxyZWFkeSB0aGVyZS0tcHJldmVudHMgZXJyb3Mgdy9hcHBlbmRpbmcgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LmFwcGVuZENoaWxkKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG4gICAgcmVuZGVyRmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIGlmICghdGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IEF1eGlsaWFyeSBmdW5jdGlvbnMgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgc3RyYW5nZXJEYW5nZXIodGVzdFNwYW4pIHtcbiAgICAgICAgLy8gUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXN0IHNwYW4gZG9lc24ndCBiZWxvbmcgdG8gdGhpcyBpbnN0YW5jZSBvZiBEcmFnTkRyb3BcbiAgICAgICAgdmFyIHN0cmFuZ2VyRGFuZ2VyID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0ZXN0U3BhbiA9PT0gdGhpcy5kcmFnUGFpckFycmF5W2ldWzBdKSB7XG4gICAgICAgICAgICAgICAgc3RyYW5nZXJEYW5nZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyYW5nZXJEYW5nZXI7XG4gICAgfVxuICAgIGhhc05vRHJhZ0NoaWxkKHBhcmVudCkge1xuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgZWFjaCBkcm9wWm9uZURpdiBjYW4gaGF2ZSBvbmx5IG9uZSBkcmFnZ2FibGUgY2hpbGRcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChwYXJlbnQuY2hpbGROb2Rlc1tpXSkuYXR0cihcImRyYWdnYWJsZVwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ZXIgPj0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY3JlYXRlSW5kZXhBcnJheSgpIHtcbiAgICAgICAgdGhpcy5pbmRleEFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXkucHVzaChpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByYW5kb21pemVJbmRleEFycmF5KCkge1xuICAgICAgICAvLyBTaHVmZmxlcyBhcm91bmQgaW5kaWNlcyBzbyB0aGUgbWF0Y2hhYmxlIGVsZW1lbnRzIGFyZW4ndCBpbiBhIHByZWRpY3RhYmxlIG9yZGVyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmluZGV4QXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsXG4gICAgICAgICAgICByYW5kb21JbmRleDtcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gdGhpcy5pbmRleEFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXlbY3VycmVudEluZGV4XSA9IHRoaXMuaW5kZXhBcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICB0aGlzLmluZGV4QXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBSZXNldCBidXR0b24gZnVuY3Rpb25hbGl0eSA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzZXREcmFnZ2FibGVzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMuZHJhZ1BhaXJBcnJheVtpXVsxXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0uY2hpbGROb2Rlc1tqXSkuYXR0cihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZHJhZ2dhYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgKSA9PT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0uY2hpbGROb2Rlc1tqXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBFdmFsdWF0aW9uIGFuZCBmZWVkYmFjayA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMudW5hbnN3ZXJlZE51bSA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtID0gMDtcbiAgICAgICAgdGhpcy5kcmFnTnVtID0gdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pLmhhcyh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMF0pXG4gICAgICAgICAgICAgICAgICAgIC5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNOb0RyYWdDaGlsZCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmFuc3dlcmVkTnVtKys7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvcnJlY3ROdW0gPSB0aGlzLmRyYWdOdW0gLSB0aGlzLmluY29ycmVjdE51bSAtIHRoaXMudW5hbnN3ZXJlZE51bTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jb3JyZWN0TnVtIC8gdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoeyBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCBhbnN3ZXIgPSB0aGlzLnByZWduYW50SW5kZXhBcnJheS5qb2luKFwiO1wiKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJkcmFnTmRyb3BcIixcbiAgICAgICAgICAgIGFjdDogYW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBtaW5faGVpZ2h0OiBNYXRoLnJvdW5kKHRoaXMubWluaGVpZ2h0KSxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAgIGNvcnJlY3ROdW06IHRoaXMuY29ycmVjdE51bSxcbiAgICAgICAgICAgIGRyYWdOdW06IHRoaXMuZHJhZ051bSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pLmhhcyh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMF0pXG4gICAgICAgICAgICAgICAgICAgIC5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5kcmFnUGFpckFycmF5W2ldWzFdKS5hZGRDbGFzcyhcImRyb3AtaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZHJhZ1BhaXJBcnJheVtpXVsxXSkucmVtb3ZlQ2xhc3MoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFja0RpdigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdmFyIG1zZ0NvcnJlY3QgPSAkLmkxOG4oXCJtc2dfZHJhZ25kcm9wX2NvcnJlY3RfYW5zd2VyXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5odG1sKG1zZ0NvcnJlY3QpO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LWluZm8gZHJhZ2dhYmxlLWZlZWRiYWNrXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbXNnSW5jb3JyZWN0ID0gJC5pMThuKFxuICAgICAgICAgICAgICAgICQuaTE4bihcIm1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlclwiKSxcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0sXG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0sXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnTnVtLFxuICAgICAgICAgICAgICAgIHRoaXMudW5hbnN3ZXJlZE51bVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICQodGhpcy5mZWVkQmFja0RpdikuaHRtbChtc2dJbmNvcnJlY3QgKyBcIiBcIiArIHRoaXMuZmVlZGJhY2spO1xuICAgICAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5hdHRyKFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LWRhbmdlciBkcmFnZ2FibGUtZmVlZGJhY2tcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL3Jlc3RvcmluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5taW5oZWlnaHQgPSBkYXRhLm1pbl9oZWlnaHQ7XG4gICAgICAgIHRoaXMucHJlZ25hbnRJbmRleEFycmF5ID0gZGF0YS5hbnN3ZXIuc3BsaXQoXCI7XCIpO1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0b3JlZE9iajtcbiAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSBmYWxzZTtcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWRPYmogPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQgPSBzdG9yZWRPYmoubWluX2hlaWdodDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5pc2hTZXR0aW5nVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByZWduYW50SW5kZXhBcnJheSA9IHN0b3JlZE9iai5hbnN3ZXIuc3BsaXQoXCI7XCIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIGFuc3dlciBpbiBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyID0gdGhpcy5wcmVnbmFudEluZGV4QXJyYXkuam9pbihcIjtcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiBhbnN3ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9oZWlnaHQ6IE1hdGgucm91bmQodGhpcy5taW5oZWlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdDogc3RvcmVkT2JqLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLmFuc3dlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBkaWRuJ3QgbG9hZCBmcm9tIHRoZSBzZXJ2ZXIsIHdlIG11c3QgZ2VuZXJhdGUgdGhlIGRhdGFcbiAgICAgICAgICAgIHRoaXMucHJlZ25hbnRJbmRleEFycmF5ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5oYXNOb0RyYWdDaGlsZCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5kcmFnUGFpckFycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMV0pLmhhcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnUGFpckFycmF5W2pdWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZ25hbnRJbmRleEFycmF5LnB1c2goaik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWduYW50SW5kZXhBcnJheS5wdXNoKC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBjb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5wcmVnbmFudEluZGV4QXJyYXkuam9pbihcIjtcIiksXG4gICAgICAgICAgICBtaW5faGVpZ2h0OiB0aGlzLm1pbmhlaWdodCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgICQodGhpcy5yZXNldEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ1BhaXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gTm8gbW9yZSBkcmFnZ2luZ1xuICAgICAgICAgICAgJCh0aGlzLmRyYWdQYWlyQXJyYXlbaV1bMF0pLmF0dHIoXCJkcmFnZ2FibGVcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICQodGhpcy5kcmFnUGFpckFycmF5W2ldWzBdKS5jc3MoXCJjdXJzb3JcIiwgXCJpbml0aWFsXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9ZHJhZ25kcm9wXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmICgkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbdGhpcy5pZF0gPSBuZXcgRHJhZ05Ecm9wKG9wdHMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBEcmFnTkRyb3AgUHJvYmxlbSAke3RoaXMuaWR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBEcmFnTkRyb3AgZnJvbSBcIi4vZHJhZ25kcm9wLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRHJhZ05Ecm9wIGV4dGVuZHMgRHJhZ05Ecm9wIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdC4gICAgVXNlZCBmb3IgdGltZWQgYXNzZXNzbWVudCBncmFkaW5nLlxuICAgICAgICBpZiAodGhpcy51bmFuc3dlcmVkTnVtID09PSB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5oaWRlKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wiZHJhZ25kcm9wXCJdID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRHJhZ05Ecm9wKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERyYWdORHJvcChvcHRzKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=