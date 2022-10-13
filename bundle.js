/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  font-family: open-sans, sans-serif;\n}\n\n.login-section {\n  margin-top: 100px;\n  text-align: center;\n}\n\nh1,\nh2 {\n  color: #005f73;\n}\n\n.large {\n  font-size: 35px;\n}\n\nform {\n  margin: 7.5px;\n}\n\n.hidden {\n  display: none;\n}\n\n.error-message {\n  color: #ae2012;\n  display: block;\n  font-size: 14px;\n  margin: 2px;\n}\n\nbutton {\n  background-color: #005f73;\n  border: 1px solid #005f73;\n  border-radius: 12px;\n  color: white;\n  font-size: 16px;\n  margin: 7.5px;\n  padding: 5px 15px;\n}\n\nbutton:hover {\n  background-color: #0a9396;\n  border: 1px solid #0a9396;\n  opacity: 0.75;\n  cursor: pointer;\n}\n\n.toggle-password-btn {\n  background-color: #005f73;\n  border: 1px solid #005f73;\n  border-radius: 12px;\n  color: white;\n  font-size: 10px;\n  padding: 2px;\n  margin: 1px;\n  margin-left: -40px;\n  width: 35px;\n}\n\n.toggle-password-btn:disabled {\n  background-color: #0a9396;\n  border: 1px solid #0a9396;\n  opacity: 0.75;\n  cursor: default;\n}\n\nmain {\n  background-color: #e9d8a6;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n  padding: 10px;\n  text-align: center;\n}\n\nmain section {\n  background-color: white;\n  border-radius: 10px;\n}\n\n.traveler-info-section {\n  font-size: 18px;\n  grid-column: span 3;\n}\n\n.greeting-container,\n.post-response-message {\n  color: #9b2226;\n  font-size: 27px;\n  font-weight: 300;\n  margin-bottom: 0px;\n}\n\n.total-container {\n  margin-bottom: 0px;\n}\n\n.total-explanation {\n  margin-top: 0px;\n  padding: 0px;\n}\n\n.astericks {\n  font-size: 20px;\n  color: #9b2226;\n}\n\n.astericks-message {\n  font-size: 14px;\n}\n\n.trips {\n  display: flex row;\n  max-height: 300px;\n}\n\n.trips div {\n  max-height: 75%;\n  overflow: scroll;\n}\n\n.trip-card {\n  padding: 5px;\n}\n\n.trip-card-date {\n  color: #001219;\n  font-weight: bold;\n}\n\n.trip-card img {\n  border-radius: 10px;\n  width: 85%;\n  height: 85%;\n  object-fit: cover;\n  overflow: hidden;\n}\n\n.trip-request-section {\n  display: flex row;\n  grid-column: span 3;\n}\n\n.est-total {\n  color: #9b2226;\n  font-weight: bold;\n}\n", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"AAAA;EACE,kCAAkC;AACpC;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;;EAEE,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,cAAc;EACd,cAAc;EACd,eAAe;EACf,WAAW;AACb;;AAEA;EACE,yBAAyB;EACzB,yBAAyB;EACzB,mBAAmB;EACnB,YAAY;EACZ,eAAe;EACf,aAAa;EACb,iBAAiB;AACnB;;AAEA;EACE,yBAAyB;EACzB,yBAAyB;EACzB,aAAa;EACb,eAAe;AACjB;;AAEA;EACE,yBAAyB;EACzB,yBAAyB;EACzB,mBAAmB;EACnB,YAAY;EACZ,eAAe;EACf,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,WAAW;AACb;;AAEA;EACE,yBAAyB;EACzB,yBAAyB;EACzB,aAAa;EACb,eAAe;AACjB;;AAEA;EACE,yBAAyB;EACzB,aAAa;EACb,qCAAqC;EACrC,cAAc;EACd,aAAa;EACb,kBAAkB;AACpB;;AAEA;EACE,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,eAAe;EACf,mBAAmB;AACrB;;AAEA;;EAEE,cAAc;EACd,eAAe;EACf,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,eAAe;EACf,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,eAAe;EACf,gBAAgB;AAClB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,cAAc;EACd,iBAAiB;AACnB;;AAEA;EACE,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,iBAAiB;EACjB,gBAAgB;AAClB;;AAEA;EACE,iBAAiB;EACjB,mBAAmB;AACrB;;AAEA;EACE,cAAc;EACd,iBAAiB;AACnB","sourcesContent":["* {\n  font-family: open-sans, sans-serif;\n}\n\n.login-section {\n  margin-top: 100px;\n  text-align: center;\n}\n\nh1,\nh2 {\n  color: #005f73;\n}\n\n.large {\n  font-size: 35px;\n}\n\nform {\n  margin: 7.5px;\n}\n\n.hidden {\n  display: none;\n}\n\n.error-message {\n  color: #ae2012;\n  display: block;\n  font-size: 14px;\n  margin: 2px;\n}\n\nbutton {\n  background-color: #005f73;\n  border: 1px solid #005f73;\n  border-radius: 12px;\n  color: white;\n  font-size: 16px;\n  margin: 7.5px;\n  padding: 5px 15px;\n}\n\nbutton:hover {\n  background-color: #0a9396;\n  border: 1px solid #0a9396;\n  opacity: 0.75;\n  cursor: pointer;\n}\n\n.toggle-password-btn {\n  background-color: #005f73;\n  border: 1px solid #005f73;\n  border-radius: 12px;\n  color: white;\n  font-size: 10px;\n  padding: 2px;\n  margin: 1px;\n  margin-left: -40px;\n  width: 35px;\n}\n\n.toggle-password-btn:disabled {\n  background-color: #0a9396;\n  border: 1px solid #0a9396;\n  opacity: 0.75;\n  cursor: default;\n}\n\nmain {\n  background-color: #e9d8a6;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n  padding: 10px;\n  text-align: center;\n}\n\nmain section {\n  background-color: white;\n  border-radius: 10px;\n}\n\n.traveler-info-section {\n  font-size: 18px;\n  grid-column: span 3;\n}\n\n.greeting-container,\n.post-response-message {\n  color: #9b2226;\n  font-size: 27px;\n  font-weight: 300;\n  margin-bottom: 0px;\n}\n\n.total-container {\n  margin-bottom: 0px;\n}\n\n.total-explanation {\n  margin-top: 0px;\n  padding: 0px;\n}\n\n.astericks {\n  font-size: 20px;\n  color: #9b2226;\n}\n\n.astericks-message {\n  font-size: 14px;\n}\n\n.trips {\n  display: flex row;\n  max-height: 300px;\n}\n\n.trips div {\n  max-height: 75%;\n  overflow: scroll;\n}\n\n.trip-card {\n  padding: 5px;\n}\n\n.trip-card-date {\n  color: #001219;\n  font-weight: bold;\n}\n\n.trip-card img {\n  border-radius: 10px;\n  width: 85%;\n  height: 85%;\n  object-fit: cover;\n  overflow: hidden;\n}\n\n.trip-request-section {\n  display: flex row;\n  grid-column: span 3;\n}\n\n.est-total {\n  color: #9b2226;\n  font-weight: bold;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkUsername": () => (/* binding */ checkUsername),
/* harmony export */   "checkPassword": () => (/* binding */ checkPassword),
/* harmony export */   "isRequired": () => (/* binding */ isRequired),
/* harmony export */   "isDateInFuture": () => (/* binding */ isDateInFuture),
/* harmony export */   "isGreaterThanZero": () => (/* binding */ isGreaterThanZero)
/* harmony export */ });
function checkUsername(input) {
  let valid = false;
  const id = parseInt(input.value.slice(8));
  if (input.value.slice(0, 8) === 'traveler' && id > 0 && id < 51) {
    valid = true;
  }
  return valid;
}

function checkPassword(input) {
  let valid = false;
  if (input.value === 'travel') {
    valid = true;
  }
  return valid;
}

function isRequired(value) {
  return value === '' ? false : true;
}

function isDateInFuture(date) {
  const today = new Date().toISOString().slice(0, 10);
  return date > today ? true : false;
}

function isGreaterThanZero(value) {
  const number = parseInt(value);
  return number > 0 ? true : false;
}




/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchData": () => (/* binding */ fetchData),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
function fetchData(dataset) {
  return fetch(`http://localhost:3001/api/v1/${dataset}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return response.json();
    });
}

function postData(dataset, userData) {
  const requestData = {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    };

  return fetch(`http://localhost:3001/api/v1/${dataset}`, requestData)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return response.json();
    });
}




/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Traveler {
  constructor(travelerData) {
    this.id = travelerData.id;
    this.name = travelerData.name;
    this.travelerType = travelerData.travelerType;
    this.pastTrips = [];
    this.pendingTrips = [];
    this.upcomingTrips = [];
  }

  findFirstName() {
    return this.name.split(' ', 1)[0];
  }

  setTravelerTrips(dataset, property) {
    this.trips = dataset.findTravelerTrips(this.id, property);
    this.trips.sort((a, b) => b.date.split('/').join('') - a.date.split('/').join(''))

    const today = new Date().toISOString().slice(0, 10).split('-').join('/');
    this.trips.forEach(trip => {
      if (trip.status === 'pending') {
        this.pendingTrips.push(trip);
      }
      else if (trip.date < today) {
        this.pastTrips.push(trip);
      }
      else {
        this.upcomingTrips.push(trip);
      }
    });
  }

  setTravelerDestinations(dataset) {
    this.destinations = dataset.findTravelerDestinations(this.trips);
  }

  addTrip(trip, tripList) {
    this.trips.unshift(trip);
    this[tripList].unshift(trip);
  }

  calcTotalSpent() {
    const pastDestinationIDs = this.pastTrips.map(trip => trip.destinationID);

    const total = this.destinations
      .reduce((acc, destination) => {
        if (pastDestinationIDs.includes(destination.id)) {
          const pastTrip = this.trips.find(trip => trip.destinationID === destination.id);
          const flightCosts = pastTrip.travelers * destination.estimatedFlightCostPerPerson;
          const lodgingCosts = pastTrip.duration * destination.estimatedLodgingCostPerDay;
          const destinationCost = flightCosts + lodgingCosts;
          acc += destinationCost;
        }
        return acc;
      }, 0);

    const totalWithFee = total * 1.10;

    return (Math.round(totalWithFee * 100) / 100).toFixed(2);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Traveler);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Dataset {
  constructor(data) {
    this.data = data;
  }

  findTravelerTrips(id, property) {
    return this.data.filter(trip => trip[property] === id);
  }

  findTravelerDestinations(travelersTrips) {
    const tripDestinationIDs = travelersTrips
      .map(trip => trip.destinationID);

    return this.data.reduce((acc, destination) => {
      if (tripDestinationIDs.includes(destination.id)) {
        acc.push(destination)
      }
      return acc;
    }, []);
  }

  findSelectedDestination(selection) {
    return this.data
      .find(destination => destination.destination === selection);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dataset);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _formValidation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _Traveler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _Dataset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
// DEPENDENCIES **************************************************






// GLOBAL DATA ****************************************************
let tripDataset;
let destinationDataset;
let currentTraveler;

// DOM ELEMENTS ***************************************************
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const togglePasswordBtn = document.querySelector('.toggle-password-btn');
const allLoginInputs = Array.from(document.querySelectorAll('.login'));
const loginSection = document.querySelector('.login-section');
const loginBtn = document.querySelector('.login-btn');
const loginErrorDisplay = document.querySelector('.login-error-display');
const loginTryAgainBtn = document.querySelector('.login-try-again-btn');
const mainSection = document.querySelector('main');
const travelerFirstName = document.querySelector('.traveler-first-name');
const todaysDate = document.querySelector('.todays-date');
const travelerTotalSpent = document.querySelector('.total-spent');
const pastTripsSection = document.querySelector('.past-trips-container');
const pendingTripsSection = document.querySelector('.pending-trips-container');
const upcomingTripsSection = document.querySelector('.upcoming-trips-container');
const tripRequestForm = document.querySelector('.trip-request-form');
const tripDate = document.querySelector('#tripDate');
const tripDuration = document.querySelector('#tripDuration');
const numOfTravelers = document.querySelector('#numOfTravelers');
const destinationChoices = document.querySelector('#destinationChoices');
const allTripRequestInputs = Array.from(document.querySelectorAll('.trip-request-input'));
const tripEstimateDisplay = document.querySelector('.trip-estimate-display');
const tripEstimate = document.querySelector('.trip-estimate');
const requestTripBtn = document.querySelector('.request-trip-btn');
const postResponseDisplay = document.querySelector('.post-response-display');
const postResponseMessage = document.querySelector('.post-response-message');
const resetRequestFormBtn = document.querySelector('.reset-request-form-btn');
const reloadBtn = document.querySelector('.reload-page');

// EVENT LISTENERS ************************************************
togglePasswordBtn.addEventListener('click', togglePassword);
loginBtn.addEventListener('click', attemptLogin);
loginTryAgainBtn.addEventListener('click', resetLogin);
tripDate.addEventListener('input', handleDateErrors);
tripDuration.addEventListener('input', handleNumberErrors);
numOfTravelers.addEventListener('input', handleNumberErrors);
tripRequestForm.addEventListener('input', displayEstimate);
requestTripBtn.addEventListener('click', requestTrip);
resetRequestFormBtn.addEventListener('click', resetTripRequest);
reloadBtn.addEventListener('click', () => location.reload());

// FUNCTIONS ******************************************************
function togglePassword() {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    if (this.innerText === 'Show') {
      this.innerText = 'Hide';
    }
    else {
      this.innerText = 'Show';
    }
}

function attemptLogin() {
  if ((0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.checkUsername)(username) && (0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.checkPassword)(password)) {
    Promise.all([(0,_apiCalls__WEBPACK_IMPORTED_MODULE_2__.fetchData)(`travelers/${username.value.slice(8)}`), (0,_apiCalls__WEBPACK_IMPORTED_MODULE_2__.fetchData)('trips'), (0,_apiCalls__WEBPACK_IMPORTED_MODULE_2__.fetchData)('destinations')])
      .then(datasets => {
        setData(datasets);
      })
      .catch(error => {
        displayGETError(error);
      });
  }
  else {
    disableForm(allLoginInputs);
    togglePasswordBtn.disabled = true;
    loginErrorDisplay.classList.remove('hidden');
    loginBtn.classList.add('hidden');
  }
}

function setData(datasets) {
  currentTraveler = new _Traveler_js__WEBPACK_IMPORTED_MODULE_3__.default(datasets[0]);
  tripDataset = new _Dataset_js__WEBPACK_IMPORTED_MODULE_4__.default(datasets[1].trips);
  destinationDataset = new _Dataset_js__WEBPACK_IMPORTED_MODULE_4__.default(datasets[2].destinations);
  currentTraveler.setTravelerTrips(tripDataset, 'userID');
  currentTraveler.setTravelerDestinations(destinationDataset);
  displayData();
};

function displayData() {
  displayMain();
  displayTravelerInfo();
  displayTravelerTrips();
  displayDestinationChoices();
}

function displayMain() {
  loginSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
}

function displayTravelerInfo() {
  travelerFirstName.innerText = currentTraveler.findFirstName();
  todaysDate.innerText = new Date().toLocaleDateString();
  travelerTotalSpent.innerText = currentTraveler.calcTotalSpent();
}

function displayTravelerTrips() {
  displayTripsByStatus('pastTrips', pastTripsSection, 'past');
  displayTripsByStatus('pendingTrips', pendingTripsSection, 'pending');
  displayTripsByStatus('upcomingTrips', upcomingTripsSection, 'upcoming');
}

function displayTripsByStatus(tripList, section, status) {
  section.innerHTML = '';
  if (currentTraveler[tripList].length > 0) {
    currentTraveler[tripList].forEach(trip => {
      const destination = currentTraveler.destinations.find(destination => trip.destinationID === destination.id);
      createTripCard(section, destination, trip);
    });
  }
  else {
    section.innerHTML += `
      <p>You don't have any ${status} trips, yet!</p>
    `
  }
}

function createTripCard(section, destination, trip) {
  const date = [trip.date.split('/')[1], trip.date.split('/')[2], trip.date.split('/')[0]].join('/');
  let amount = 'days';
  if (trip.duration === 1) {
    amount = 'day';
  }
  section.innerHTML += `
  <article class="trip-card" tabindex="0">
    <p><span class="trip-card-date">${date}</span>: ${trip.duration} ${amount} in ${destination.destination}</p>
    <img src="${destination.image}" alt="${destination.alt}">
  </article>
  `
}

function displayDestinationChoices() {
  destinationDataset.data
    .reduce((acc, destination) => {
      acc.push(destination.destination);
      return acc;
    }, [])
    .sort()
    .forEach(destination => {
      const option = document.createElement('option');
      option.value = destination;
      option.text = destination;
      destinationChoices.appendChild(option);
    });
}

function displayGETError(error) {
  loginSection.innerHTML = ``;
  loginSection.innerHTML += `
    <h1>Oops! Something went wrong. Please try again later!</h1>
  `;
}

function disableForm(formInputs) {
  formInputs.forEach(input => {
    input.disabled = true;
  })
}

function resetLogin() {
  loginErrorDisplay.classList.add('hidden');
  loginBtn.classList.remove('hidden');
  allLoginInputs.forEach(input => {
    input.disabled = false;
    input.value = '';
  })
  togglePasswordBtn.disabled = false;
  togglePasswordBtn.innerText = 'Show';
  password.setAttribute('type', 'password');
}

function handleDateErrors() {
  if (!(0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.isDateInFuture)(this.value)) {
    displayInputError(this, 'Please pick a date in the future!');
  }
  else {
    removeInputError(this);
  }
}

function displayInputError(input, message) {
  const formField = input.parentElement;
  formField.querySelector('.error-message').textContent = message;
  const releventInputs = allTripRequestInputs.filter(requestInput => requestInput !== input);
  disableForm(releventInputs);
}

function removeInputError(input) {
  const formField = input.parentElement;
  formField.querySelector('.error-message').textContent = '';
  allTripRequestInputs.forEach(input => {
    input.disabled = false;
  })
}

function handleNumberErrors() {
  if (!(0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.isGreaterThanZero)(this.value)) {
    displayInputError(this, 'Please pick a number greater than zero.');
  }
  else {
    removeInputError(this);
  }
}

function displayEstimate() {
  if ((0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.isDateInFuture)(tripDate.value) && (0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.isGreaterThanZero)(tripDuration.value) && (0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.isGreaterThanZero)(numOfTravelers.value) && (0,_formValidation_js__WEBPACK_IMPORTED_MODULE_1__.isRequired)(destinationChoices.value)) {
    tripEstimate.innerText = calculateEstimatedTotal();
    tripEstimateDisplay.classList.remove('hidden');
  }
  else {
    tripEstimateDisplay.classList.add('hidden');
  }
}

function calculateEstimatedTotal() {
  const userSelection = destinationChoices.options[destinationChoices.selectedIndex].value;
  const userDestination = destinationDataset.findSelectedDestination(userSelection);
  const flightCosts = numOfTravelers.value * userDestination.estimatedFlightCostPerPerson;
  const lodgingCosts = tripDuration.value * userDestination.estimatedLodgingCostPerDay;
  const total = flightCosts + lodgingCosts;
  const totalWithFee = total * 1.10;
  return (Math.round(totalWithFee * 100) / 100).toFixed(2);
}

function requestTrip() {
  const userSelection = destinationChoices.options[destinationChoices.selectedIndex].value;
  const userDestination = destinationDataset.findSelectedDestination(userSelection);

  const userInputData = {
    id: Date.now(),
    userID: currentTraveler.id,
    destinationID: userDestination.id,
    travelers: parseInt(numOfTravelers.value),
    date: tripDate.value.split('-').join('/'),
    duration: parseInt(tripDuration.value),
    status: 'pending',
    suggestedActivities: []
  };

  (0,_apiCalls__WEBPACK_IMPORTED_MODULE_2__.postData)('trips', userInputData)
    .then(responseJSON => {
      displayPOSTSuccess();
      currentTraveler.addTrip(responseJSON.newTrip, 'pendingTrips');
      currentTraveler.destinations.push(userDestination);
      displayTripsByStatus('pendingTrips', pendingTripsSection, 'pending');
      disableForm(allTripRequestInputs);
    })
    .catch(error => {
      displayPOSTError(error)
      disableForm(allTripRequestInputs);
    });
}

function displayPOSTSuccess() {
  postResponseDisplay.classList.remove('hidden');
  tripEstimateDisplay.classList.add('hidden');
}

function displayPOSTError(error) {
  postResponseDisplay.classList.remove('hidden');
  resetRequestFormBtn.classList.add('hidden');
  tripEstimateDisplay.classList.add('hidden');
  if (error.message[0] === '5') {
    postResponseMessage.innerText = 'Oops! Something is wrong with the server. Please try submitting this form again later!';
  }
  else {
    postResponseMessage.innerText = `Something isn't right. Please try submitting this form again later!`;
  }
  reloadBtn.classList.remove('hidden');
}

function resetTripRequest() {
  postResponseDisplay.classList.add('hidden');
  allTripRequestInputs.forEach(input => {
    input.disabled = false;
    input.value = '';
  })
}

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map