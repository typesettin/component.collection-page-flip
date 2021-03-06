/**
 * @title component.navigation-header
 * @{@link https://github.com/typesettin/component.navigation-header}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 */
'use strict';

var classie = require('classie'),
	extend = require('util-extend'),
	events = require('events'),
	util = require('util');

/**
 * recalculate the window dimensions.
 * @method getEventTarget
 * @param {object} e event object
 * @returns {object} dom element event target
 */
var getEventTarget = function (e) {
	// e = e || window.event;
	return e.target || e.srcElement;
};

/**
 * A module that a fixed navigation header.
 * @{@link https://github.com/typesettin/component.navigation-header}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @constructor navigationHeader
 * @requires module:classie
 * @requires module:util-extent
 * @requires module:util
 * @requires module:events
 */
var navigationHeader = function (config) {
	/** call event emitter */
	events.EventEmitter.call(this);

	/** navigation style options array */
	this.navStyles = ['ha-header-large', 'ha-header-small', 'ha-header-hide', 'ha-header-show', 'ha-header-subshow', 'ha-header-shrink', 'ha-header-rotate', 'ha-header-rotateBack', 'ha-header-color', 'ha-header-box', 'ha-header-fullscreen', 'ha-header-subfullscreen'];
	this.emit('navigationInitialized');
	/** sub navigation style object mapper to navigation style, this allows for quick assignmnent of a navigation style and a sub navigaiton style */
	this.subNavStyles = {
		0: 4,
		1: 4,
		2: 4,
		5: 6,
		7: 6,
		8: 11,
		9: 11,
		10: 11
	};

	this.init = function (options) {
		return this._init(options);
	};
	/** set the navigation style
	 * @param {number} style index of style in @this.navStyles
	 */
	this.showNav = function (style) {
		return this._showNav(style);
	};
	/** show the sub navigation style
	 *	@inner showSubNav
	 * @param {number} style index of style in @this.navStyles
	 */
	this.showSubNav = function (subnavToShow) {
		return this._showSubNav(subnavToShow);
	};
	this.hideSubNav = function () {
		return this._hideSubNav();
	};

	this.init(config);
};

util.inherits(navigationHeader, events.EventEmitter);

/**
 * Sets up a new navigation header component.
 * @param {object} options - configuration options
 * @emits - navigationInitialized
 * @private
 */
navigationHeader.prototype._init = function (options) {
	var defaults = {
		idSelector: 'ha-header',
		navStyle: 7,
		subNavStyle: 6
	};
	options = options || {};
	this.options = extend(defaults, options);
	this.options.element = this.options.idSelector;
	this.$el = document.getElementById(this.options.element);
	this._initEvents();
	this.emit('navigationInitialized');
};
/**
 * Returns current navigation header config object.
 * @return {object} - navigation header instance configuration object
 */
navigationHeader.prototype.getOptions = function () {
	return this.options;
};
/**
 * updates the state of the navigation element
 * @private
 */
navigationHeader.prototype._config = function () {
	// the list of items
	this.$list = this.$el.getElementsByTagName('ul')[0];
	this.$items = this.$list.getElementsByTagName('li');
	this.current = 0;
	this.old = 0;
};
/**
 * initializes navigation element events
 * @private
 */
navigationHeader.prototype._initEvents = function () {
	var self = this;
	/**
	 * recalculate the window dimensions.
	 * @event openSubNav
	 * @param {object} event event object
	 */
	var openSubNav = function (event) {
		// console.log('moving on nav');
		var target = getEventTarget(event);
		if (classie.hasClass(target, 'has-sub-nav')) {
			self.showSubNav(target.getAttribute('data-navitr'));
			self.$navbar.removeEventListener('mousemove', openSubNav);
		}
	};
	this.$navbar = document.getElementById(this.options.element + '-nav-id');
	this.$subnavbar = document.getElementById(this.options.element + '-subnav-id');
	this.$navbar.addEventListener('mousemove', openSubNav);
	this.$subnavbar.addEventListener('mouseleave', function () {
		self.hideSubNav();
		self.$navbar.addEventListener('mousemove', openSubNav);
	});
};
/**
 * set the navigation element style, by looking up the style in the navstyle array.
 * @private
 * @param {number} style style option
 * @fires - navigationShowEvent
 */
navigationHeader.prototype._showNav = function (style) {
	if (typeof style === 'number') {
		this.$el.setAttribute('class', 'ha-header ' + this.navStyles[style]);
		this.options.navStyle = style;
		this.emit('navigationShowEvent');
	}
};
/**
 * show the mapped subnav style by looking up the mapping in the style mapping object.
 * @private
 * @param {number} subnavToShow style option
 * @fires - navigationSubNavShowEvent
 */
navigationHeader.prototype._showSubNav = function (subnavToShow) {
	var subNavItems = this.$subnavbar.getElementsByTagName('nav');
	for (var x in subNavItems) {
		if (subNavItems[x].style) {
			subNavItems[x].style.display = 'none';
			if (subNavItems[x].getAttribute('data-itr') === subnavToShow) {
				subNavItems[x].style.display = 'block';
			}
		}
	}
	var subnavid = this.subNavStyles[this.options.navStyle.toString()];
	this.$el.setAttribute('class', 'ha-header ' + this.navStyles[subnavid]);
	this.options.subNavStyle = subnavid;
	this.emit('navigationSubNavShowEvent');
};
/**
 * hides the subnav.
 * @private
 * @fires - navigationHideNavShowEvent
 */
navigationHeader.prototype._hideSubNav = function () {
	var navid = this.options.navStyle;
	this.$el.setAttribute('class', 'ha-header ' + this.navStyles[navid]);
	this.options.navStyle = navid;
	this.emit('navigationHideNavShowEvent');
};
module.exports = navigationHeader;
