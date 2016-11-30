define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event"
], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("ADPSelectorHelper.widget.ADPSelectorHelper", [_WidgetBase], {

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _objHandler: null,
        el: null,

        // modeler
        _className: "",
        _referenceEntity: "",
        _referenceName: "",

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            //Polyfill so we can use element.closest in IE
            // matches polyfill
            window.Element && function(ElementPrototype) {
                ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.matchesSelector || ElementPrototype.webkitMatchesSelector || ElementPrototype.msMatchesSelector || function(selector) {
                    var node = this,
                        nodes = (node.parentNode || node.document).querySelectorAll(selector),
                        i = -1;
                    while (nodes[++i] && nodes[i] != node)
                    ;
                    return !!nodes[i];
                }
            }(Element.prototype);

            // closest polyfill
            window.Element && function(ElementPrototype) {
                ElementPrototype.closest = ElementPrototype.closest || function(selector) {
                    var el = this;
                    while (el.matches && !el.matches(selector))
                        el = el.parentNode;
                    return el.matches
                        ? el
                        : null;
                }
            }(Element.prototype);

            //End polyfill
            logger.debug(this.id + ".postCreate");
            if (this._referenceEntity) {
                this._referenceName = this._referenceEntity.split("/")[0];
            }

            // listview item
            this.el = this.domNode.closest(".mx-listview-item");
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            if (obj) {
                this._attachListeners();
                this._updateRendering();
            }
            callback();
            // this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _attachListeners: function() {
            // subscription for object refresh
            this.objHandler = this.subscribe({
                guid: this._contextObj.getGuid(),
                callback: dojoLang.hitch(this, function() {
                    this._updateRendering();
                })
            });
        },

        _updateRendering: function() {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            // when the context exists...

            mx.data.get({
                guid: this.mxform._context.trackId,
                callback: function(obj) {
                    // console.log(obj);
                    if (obj.get(this._referenceName) === this._contextObj.getGuid()) {
                        // apply class
                        dojoClass.add(this.el, this._className)
                    } else {
                        //remove class
                        dojoClass.remove(this.el, this._className)
                    }
                }
            }, this)
            // mx.data.get( { guid: this.mxform._context.trackId, callback: function(obj) { console.log(obj); }  } )

            // if the relationship from the top-level context object matches the guid of this widget's context object, apply a class

            // mendix.lang.nullExec(callback);
        }
    });
});

require(["ADPSelectorHelper/widget/ADPSelectorHelper"]);
