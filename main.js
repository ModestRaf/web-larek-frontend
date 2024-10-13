/*! For license information please see main.js.LICENSE.txt */
(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function _toPrimitive(e,t){if("object"!==_typeof(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==_typeof(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(o,"string"),"symbol"===_typeof(a)?a:String(a)),n)}var o,a}e.d({},{c:()=>s});var t=function(){function Api(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Api),this.baseUrl=e,this.options={headers:Object.assign({"Content-Type":"application/json"},null!==(t=r.headers)&&void 0!==t?t:{})}}return function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}(Api,[{key:"handleResponse",value:function handleResponse(e){return e.ok?e.json():e.json().then((function(t){var r;return console.error("Server response error:",t),Promise.reject(null!==(r=t.error)&&void 0!==r?r:e.statusText)}))}},{key:"get",value:function get(e){return fetch(this.baseUrl+e,Object.assign(Object.assign({},this.options),{method:"GET"})).then(this.handleResponse)}},{key:"post",value:function post(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"POST";return fetch(this.baseUrl+e,Object.assign(Object.assign({},this.options),{method:r,body:JSON.stringify(t)})).then(this.handleResponse)}}]),Api}(),r="https://larek-api.nomoreparties.co/api/weblarek";function cards_typeof(e){return cards_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},cards_typeof(e)}function _toConsumableArray(e){return function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function _unsupportedIterableToArray(e,t){if(!e)return;if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return _arrayLikeToArray(e,t)}(e)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function cards_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function cards_toPrimitive(e,t){if("object"!==cards_typeof(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==cards_typeof(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(o,"string"),"symbol"===cards_typeof(a)?a:String(a)),n)}var o,a}var n=function(){function Cards(e){!function cards_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Cards),this.cardTemplate=document.getElementById(e)}return function cards_createClass(e,t,r){return t&&cards_defineProperties(e.prototype,t),r&&cards_defineProperties(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}(Cards,[{key:"createProductCard",value:function createProductCard(e){var t=document.importNode(this.cardTemplate.content,!0).querySelector(".gallery__item");return this.updateCardContent(t,e),t}},{key:"updateCardContent",value:function updateCardContent(e,t){var r=e.querySelector(".card__image"),n=e.querySelector(".card__title"),o=e.querySelector(".card__price"),a=e.querySelector(".card__category"),i=e.querySelector(".card__button");r&&(r.src="https://larek-api.nomoreparties.co/content/weblarek"+t.image,r.alt=t.title),n&&(n.textContent=t.title),o&&(o.textContent=null!==t.price?"".concat(t.price," синапсов"):"Бесценно"),a&&(a.textContent=t.category,this.setCategoryClass(a,t.category)),i&&(i.textContent=t.selected?"Убрать":"Добавить в корзину")}},{key:"setCategoryClass",value:function setCategoryClass(e,t){var r,n={"софт-скил":"card__category_soft","хард-скил":"card__category_hard",другое:"card__category_other",дополнительное:"card__category_additional",кнопка:"card__category_button"};(r=e.classList).remove.apply(r,_toConsumableArray(Object.values(n)));var o=n[t];o&&e.classList.add(o)}},{key:"openPopup",value:function openPopup(e,t){var r=this,n=document.querySelector(".modal"),o=n.querySelector(".modal__content"),a=document.getElementById("card-preview"),i=document.importNode(a.content,!0),c=i.querySelector(".card");this.updateCardContent(c,e);var s=c.querySelector(".card__button");s&&(s.textContent=e.selected?"Убрать":"Добавить в корзину",s.addEventListener("click",(function(){t(e),r.updateCardContent(c,e)}))),o.innerHTML="",o.appendChild(i),n.classList.add("modal_active");var l=n.querySelector(".modal__close");l&&l.addEventListener("click",(function(){return n.classList.remove("modal_active")}))}}]),Cards}();function order_typeof(e){return order_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},order_typeof(e)}function order_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function order_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function order_toPrimitive(e,t){if("object"!==order_typeof(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==order_typeof(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(o,"string"),"symbol"===order_typeof(a)?a:String(a)),n)}var o,a}function order_createClass(e,t,r){return t&&order_defineProperties(e.prototype,t),r&&order_defineProperties(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}var o=function(){function OrderModal(e,t){var r,n=this;order_classCallCheck(this,OrderModal),this.modal=document.getElementById(e),this.contentTemplate=document.getElementById(t),null===(r=this.modal.querySelector(".modal__close"))||void 0===r||r.addEventListener("click",(function(){return n.close()}))}return order_createClass(OrderModal,[{key:"open",value:function open(e){var t=document.querySelector(".modal"),r=t.querySelector(".modal__content"),n=document.getElementById("order"),o=document.importNode(n.content,!0);r.innerHTML="",r.appendChild(o),t.classList.add("modal_active"),this.setupPaymentButtons(),this.setupAddressField(),this.modal.querySelector('button[name="card"]').classList.add("button_alt-active"),this.setupNextButton(e)}},{key:"close",value:function close(){this.modal.classList.remove("modal_active")}},{key:"setupPaymentButtons",value:function setupPaymentButtons(){var e=this.modal.querySelectorAll(".order__buttons .button_alt");e.forEach((function(t){t.addEventListener("click",(function(){e.forEach((function(e){return e.classList.remove("button_alt-active")})),t.classList.add("button_alt-active")}))}))}},{key:"setupAddressField",value:function setupAddressField(){var e=this.modal.querySelector('input[name="address"]'),t=this.modal.querySelector(".order__button"),r=this.modal.querySelector(".form__errors");e.addEventListener("input",(function(){""===e.value.trim()?(r.textContent="Необходимо указать адрес доставки",r.style.display="block",t.disabled=!0):(r.style.display="none",t.disabled=!1)}))}},{key:"setupNextButton",value:function setupNextButton(e){var t=this,r=this.modal.querySelector(".order__button"),n=this.modal.querySelector('input[name="address"]'),o=this.modal.querySelector(".form__errors");r.addEventListener("click",(function(){""===n.value.trim()?(o.textContent="Необходимо указать адрес доставки",o.style.display="block",r.disabled=!0):(o.style.display="none",r.disabled=!1,t.close(),new a("modal-container","contacts").open(e))}))}}]),OrderModal}(),a=function(){function ContactsModal(e,t){var r,n=this;order_classCallCheck(this,ContactsModal),this.modal=document.getElementById(e),this.contentTemplate=document.getElementById(t),null===(r=this.modal.querySelector(".modal__close"))||void 0===r||r.addEventListener("click",(function(){return n.close()}))}return order_createClass(ContactsModal,[{key:"open",value:function open(e){var t=document.querySelector(".modal"),r=t.querySelector(".modal__content"),n=document.getElementById("contacts"),o=document.importNode(n.content,!0);r.innerHTML="",r.appendChild(o),t.classList.add("modal_active"),this.setupContactFields(),this.setupPayButton(e)}},{key:"close",value:function close(){this.modal.classList.remove("modal_active")}},{key:"setupContactFields",value:function setupContactFields(){var e=this.modal.querySelector('input[name="email"]'),t=this.modal.querySelector('input[name="phone"]'),r=this.modal.querySelector(".button"),n=this.modal.querySelector(".form__errors"),o=function checkFields(){""===e.value.trim()&&""===t.value.trim()?(n.textContent="Необходимо ввести email и номер телефона",n.style.display="block",r.disabled=!0):""===e.value.trim()?(n.textContent="Необходимо ввести email",n.style.display="block",r.disabled=!0):""===t.value.trim()?(n.textContent="Необходимо ввести номер телефона",n.style.display="block",r.disabled=!0):(n.style.display="none",r.disabled=!1)};e.addEventListener("input",o),t.addEventListener("input",o)}},{key:"setupPayButton",value:function setupPayButton(e){var t=this;this.modal.querySelector(".button").addEventListener("click",(function(){t.close(),new i("modal-container","success",e).open()}))}}]),ContactsModal}(),i=function(){function SuccessModal(e,t,r){var n,o=this;order_classCallCheck(this,SuccessModal),this.modal=document.getElementById(e),this.contentTemplate=document.getElementById(t),this.totalPrice=r,null===(n=this.modal.querySelector(".modal__close"))||void 0===n||n.addEventListener("click",(function(){return o.close()}))}return order_createClass(SuccessModal,[{key:"open",value:function open(){var e=this,t=document.querySelector(".modal"),r=t.querySelector(".modal__content"),n=document.getElementById("success"),o=document.importNode(n.content,!0);r.innerHTML="",r.appendChild(o),t.classList.add("modal_active"),t.querySelector(".order-success__description").textContent="Списано ".concat(this.totalPrice," синапсов"),t.querySelector(".order-success__close").addEventListener("click",(function(){e.close(),e.clearBasket()}))}},{key:"close",value:function close(){this.modal.classList.remove("modal_active")}},{key:"clearBasket",value:function clearBasket(){var e=new s(new t(r),"gallery","card-catalog",new c("modal-container","basket"));e.products.forEach((function(e){e.selected=!1})),e.updateBasketCounter(),e.saveSelectedToStorage(),e.renderBasketItems()}}]),SuccessModal}();function cart_typeof(e){return cart_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},cart_typeof(e)}function cart_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function cart_toPrimitive(e,t){if("object"!==cart_typeof(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==cart_typeof(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(o,"string"),"symbol"===cart_typeof(a)?a:String(a)),n)}var o,a}var c=function(){function Modal(e,t){var r,n=this;!function cart_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Modal),this.items=[],this.productList=null,this.modal=document.getElementById(e),this.contentTemplate=document.getElementById(t),this.orderModal=new o("modal-container","order"),null===(r=this.modal.querySelector(".modal__close"))||void 0===r||r.addEventListener("click",(function(){return n.close()}))}return function cart_createClass(e,t,r){return t&&cart_defineProperties(e.prototype,t),r&&cart_defineProperties(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}(Modal,[{key:"setProductList",value:function setProductList(e){this.productList=e}},{key:"open",value:function open(){var e=this,t=document.querySelector(".modal"),r=t.querySelector(".modal__content"),n=document.getElementById("basket"),o=document.importNode(n.content,!0);r.innerHTML="",r.appendChild(o),t.classList.add("modal_active"),this.renderBasketItems(),t.querySelector(".basket__button").addEventListener("click",(function(){return e.orderModal.open(e.getTotalPrice())}))}},{key:"close",value:function close(){this.modal.classList.remove("modal_active")}},{key:"renderBasketItems",value:function renderBasketItems(){var e=this,t=this.modal.querySelector(".basket__list"),r=this.modal.querySelector(".basket__price"),n=this.modal.querySelector(".basket__button");if(t&&r&&n){t.innerHTML="";var o=0;if(0===this.items.length){var a=document.createElement("p");a.textContent="Корзина пуста",t.appendChild(a),n.disabled=!0}else this.items.forEach((function(r,n){var a=e.createBasketItem(r,n+1);t.appendChild(a),o+=r.price})),n.disabled=!1;r.textContent="".concat(o," синапсов")}else console.error("Элементы корзины не найдены")}},{key:"createBasketItem",value:function createBasketItem(e,t){var r=this,n=document.getElementById("card-basket").content.cloneNode(!0),o=n.querySelector(".basket__item-index"),a=n.querySelector(".card__title"),i=n.querySelector(".card__price"),c=n.querySelector(".basket__item-delete");return o.textContent=t.toString(),a.textContent=e.title,i.textContent=null===e.price?"Бесценно":"".concat(e.price," синапсов"),c.addEventListener("click",(function(){r.removeBasketItem(e.id)})),n}},{key:"removeBasketItem",value:function removeBasketItem(e){this.items=this.items.filter((function(t){return t.id!==e})),this.renderBasketItems(),this.productList&&this.productList.removeProductFromCart(e)}},{key:"getTotalPrice",value:function getTotalPrice(){return this.items.reduce((function(e,t){return e+t.price}),0)}}]),Modal}();function src_typeof(e){return src_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},src_typeof(e)}function _regeneratorRuntime(){_regeneratorRuntime=function _regeneratorRuntime(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n=Object.defineProperty||function(e,t,r){e[t]=r.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function define(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{define({},"")}catch(e){define=function define(e,t,r){return e[t]=r}}function wrap(e,t,r,o){var a=t&&t.prototype instanceof Generator?t:Generator,i=Object.create(a.prototype),c=new Context(o||[]);return n(i,"_invoke",{value:makeInvokeMethod(e,r,c)}),i}function tryCatch(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=wrap;var s={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var l={};define(l,a,(function(){return this}));var u=Object.getPrototypeOf,d=u&&u(u(values([])));d&&d!==t&&r.call(d,a)&&(l=d);var f=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(l);function defineIteratorMethods(e){["next","throw","return"].forEach((function(t){define(e,t,(function(e){return this._invoke(t,e)}))}))}function AsyncIterator(e,t){function invoke(n,o,a,i){var c=tryCatch(e[n],e,o);if("throw"!==c.type){var s=c.arg,l=s.value;return l&&"object"==src_typeof(l)&&r.call(l,"__await")?t.resolve(l.__await).then((function(e){invoke("next",e,a,i)}),(function(e){invoke("throw",e,a,i)})):t.resolve(l).then((function(e){s.value=e,a(s)}),(function(e){return invoke("throw",e,a,i)}))}i(c.arg)}var o;n(this,"_invoke",{value:function value(e,r){function callInvokeWithMethodAndArg(){return new t((function(t,n){invoke(e,r,t,n)}))}return o=o?o.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}})}function makeInvokeMethod(e,t,r){var n="suspendedStart";return function(o,a){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw a;return doneResult()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var c=maybeInvokeDelegate(i,r);if(c){if(c===s)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var l=tryCatch(e,t,r);if("normal"===l.type){if(n=r.done?"completed":"suspendedYield",l.arg===s)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(n="completed",r.method="throw",r.arg=l.arg)}}}function maybeInvokeDelegate(e,t){var r=t.method,n=e.iterator[r];if(void 0===n)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=void 0,maybeInvokeDelegate(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),s;var o=tryCatch(n,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,s;var a=o.arg;return a?a.done?(t[e.resultName]=a.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,s):a:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,s)}function pushTryEntry(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function resetTryEntry(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function Context(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(pushTryEntry,this),this.reset(!0)}function values(e){if(e){var t=e[a];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,o=function next(){for(;++n<e.length;)if(r.call(e,n))return next.value=e[n],next.done=!1,next;return next.value=void 0,next.done=!0,next};return o.next=o}}return{next:doneResult}}function doneResult(){return{value:void 0,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,n(f,"constructor",{value:GeneratorFunctionPrototype,configurable:!0}),n(GeneratorFunctionPrototype,"constructor",{value:GeneratorFunction,configurable:!0}),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,c,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===GeneratorFunction||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,GeneratorFunctionPrototype):(e.__proto__=GeneratorFunctionPrototype,define(e,c,"GeneratorFunction")),e.prototype=Object.create(f),e},e.awrap=function(e){return{__await:e}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,i,(function(){return this})),e.AsyncIterator=AsyncIterator,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new AsyncIterator(wrap(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},defineIteratorMethods(f),define(f,c,"Generator"),define(f,a,(function(){return this})),define(f,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function next(){for(;r.length;){var e=r.pop();if(e in t)return next.value=e,next.done=!1,next}return next.done=!0,next}},e.values=values,Context.prototype={constructor:Context,reset:function reset(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(resetTryEntry),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function stop(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function dispatchException(e){if(this.done)throw e;var t=this;function handle(r,n){return a.type="throw",a.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n],a=o.completion;if("root"===o.tryLoc)return handle("end");if(o.tryLoc<=this.prev){var i=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(i&&c){if(this.prev<o.catchLoc)return handle(o.catchLoc,!0);if(this.prev<o.finallyLoc)return handle(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return handle(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return handle(o.finallyLoc)}}}},abrupt:function abrupt(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,s):this.complete(i)},complete:function complete(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),s},finish:function finish(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),resetTryEntry(r),s}},catch:function _catch(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;resetTryEntry(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(e,t,r){return this.delegate={iterator:values(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),s}},e}function asyncGeneratorStep(e,t,r,n,o,a,i){try{var c=e[a](i),s=c.value}catch(e){return void r(e)}c.done?t(s):Promise.resolve(s).then(n,o)}function src_defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,(o=n.key,a=void 0,a=function src_toPrimitive(e,t){if("object"!==src_typeof(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==src_typeof(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(o,"string"),"symbol"===src_typeof(a)?a:String(a)),n)}var o,a}var s=function(){function ProductList(e,t,r,o){!function src_classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,ProductList),this.products=[],this.api=e,this.container=document.getElementById(t),this.cards=new n(r),this.basketCounter=document.querySelector(".header__basket-counter"),this.basketModal=o,this.basketModal.setProductList(this)}var e;return function src_createClass(e,t,r){return t&&src_defineProperties(e.prototype,t),r&&src_defineProperties(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}(ProductList,[{key:"loadProducts",value:(e=function _asyncToGenerator(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var a=e.apply(t,r);function _next(e){asyncGeneratorStep(a,n,o,_next,_throw,"next",e)}function _throw(e){asyncGeneratorStep(a,n,o,_next,_throw,"throw",e)}_next(void 0)}))}}(_regeneratorRuntime().mark((function _callee(){var e,t;return _regeneratorRuntime().wrap((function _callee$(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,this.api.get("/product");case 3:e=r.sent,t=e,this.products=this.loadSelectedFromStorage(t.items),this.renderProducts(this.products),this.updateBasketCounter(),this.renderBasketItems(),r.next=14;break;case 11:r.prev=11,r.t0=r.catch(0),console.error(r.t0);case 14:case"end":return r.stop()}}),_callee,this,[[0,11]])}))),function loadProducts(){return e.apply(this,arguments)})},{key:"renderProducts",value:function renderProducts(e){var t=this;this.container.innerHTML="",e.forEach((function(e){var r=t.cards.createProductCard(e);t.container.appendChild(r),r.addEventListener("click",(function(){return t.cards.openPopup(e,t.toggleProductInCart.bind(t))}))}))}},{key:"updateBasketCounter",value:function updateBasketCounter(){var e=this.products.filter((function(e){return e.selected})).length;this.basketCounter.textContent=e.toString(),this.saveSelectedToStorage()}},{key:"saveSelectedToStorage",value:function saveSelectedToStorage(){var e=this.products.map((function(e){return{id:e.id,selected:e.selected}}));localStorage.setItem("selectedProducts",JSON.stringify(e))}},{key:"loadSelectedFromStorage",value:function loadSelectedFromStorage(e){var t=localStorage.getItem("selectedProducts");if(t){var r=JSON.parse(t);return e.map((function(e){var t=r.find((function(t){return t.id===e.id}));return t&&(e.selected=t.selected),e}))}return e}},{key:"renderBasketItems",value:function renderBasketItems(){var e=this.products.filter((function(e){return e.selected}));this.basketModal.items=e.map((function(e){return{id:e.id,title:e.title,price:e.price}})),this.basketModal.renderBasketItems()}},{key:"toggleProductInCart",value:function toggleProductInCart(e){var t=this.products.find((function(t){return t.id===e.id}));t&&(t.selected=!t.selected),this.updateBasketCounter(),this.saveSelectedToStorage(),this.renderBasketItems()}},{key:"removeProductFromCart",value:function removeProductFromCart(e){var t=this.products.find((function(t){return t.id===e}));t&&(t.selected=!1,this.updateBasketCounter(),this.saveSelectedToStorage(),this.renderBasketItems())}}]),ProductList}();document.addEventListener("DOMContentLoaded",(function(){var e=new t(r),n=new c("modal-container","basket");new s(e,"gallery","card-catalog",n).loadProducts(),document.querySelector(".header__basket").addEventListener("click",(function(){return n.open()}))}))})();
//# sourceMappingURL=main.js.map