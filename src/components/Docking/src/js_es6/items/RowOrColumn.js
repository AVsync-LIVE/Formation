function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import AbstractContentItem from './AbstractContentItem';
import Stack from './Stack';
import Splitter from '../controls/Splitter';
import { fnBind, animFrame, indexOf } from '../utils/utils';
import $ from 'jquery';

var RowOrColumn = /*#__PURE__*/function (_AbstractContentItem) {
  _inherits(RowOrColumn, _AbstractContentItem);

  var _super = _createSuper(RowOrColumn);

  function RowOrColumn(isColumn, layoutManager, config, parent) {
    var _this;

    _classCallCheck(this, RowOrColumn);

    _this = _super.call(this, layoutManager, config, parent);
    _this.isRow = !isColumn;
    _this.isColumn = isColumn;
    _this.element = $('<div class="lm_item lm_' + (isColumn ? 'column' : 'row') + '"></div>');
    _this.childElementContainer = _this.element;
    _this._splitterSize = layoutManager.config.dimensions.borderWidth;
    _this._splitterGrabSize = layoutManager.config.dimensions.borderGrabWidth;
    _this._isColumn = isColumn;
    _this._dimension = isColumn ? 'height' : 'width';
    _this._splitter = [];
    _this._splitterPosition = null;
    _this._splitterMinPosition = null;
    _this._splitterMaxPosition = null;
    return _this;
  }
  /**
   * Add a new contentItem to the Row or Column
   *
   * @param {AbstractContentItem} contentItem
   * @param {[int]} index The position of the new item within the Row or Column.
   *                      If no index is provided the item will be added to the end
   * @param {[bool]} _$suspendResize If true the items won't be resized. This will leave the item in
   *                                 an inconsistent state and is only intended to be used if multiple
   *                                 children need to be added in one go and resize is called afterwards
   *
   * @returns {void}
   */


  _createClass(RowOrColumn, [{
    key: "addChild",
    value: function addChild(contentItem, index, _$suspendResize) {
      var newItemSize, itemSize, i, splitterElement;
      contentItem = this.layoutManager._$normalizeContentItem(contentItem, this);

      if (index === undefined) {
        index = this.contentItems.length;
      }

      if (this.contentItems.length > 0) {
        splitterElement = this._createSplitter(Math.max(0, index - 1)).element;

        if (index > 0) {
          this.contentItems[index - 1].element.after(splitterElement);
          splitterElement.after(contentItem.element);

          if (this._isDocked(index - 1)) {
            this._splitter[index - 1].element.hide();

            this._splitter[index].element.show();
          }
        } else {
          this.contentItems[0].element.before(splitterElement);
          splitterElement.before(contentItem.element);
        }
      } else {
        this.childElementContainer.append(contentItem.element);
      }

      AbstractContentItem.prototype.addChild.call(this, contentItem, index);
      newItemSize = 1 / this.contentItems.length * 100;

      if (_$suspendResize === true) {
        this.emitBubblingEvent('stateChanged');
        return;
      }

      for (i = 0; i < this.contentItems.length; i++) {
        if (this.contentItems[i] === contentItem) {
          contentItem.config[this._dimension] = newItemSize;
        } else {
          itemSize = this.contentItems[i].config[this._dimension] *= (100 - newItemSize) / 100;
          this.contentItems[i].config[this._dimension] = itemSize;
        }
      }

      this.callDownwards('setSize');
      this.emitBubblingEvent('stateChanged');

      this._validateDocking();
    }
    /**
     * Undisplays a child of this element
     *
     * @param   {AbstractContentItem} contentItem
     *
     * @returns {void}
     */

  }, {
    key: "undisplayChild",
    value: function undisplayChild(contentItem) {
      var undisplayedItemSize = contentItem.config[this._dimension],
          index = indexOf(contentItem, this.contentItems),
          splitterIndex = Math.max(index - 1, 0),
          i,
          childItem;

      if (index === -1) {
        throw new Error('Can\'t undisplay child. ContentItem is not child of this Row or Column');
      }
      /**
       * Hide the splitter before the item or after if the item happens
       * to be the first in the row/column
       */


      if (this._splitter[splitterIndex]) {
        this._splitter[splitterIndex].element.hide();
      }

      if (splitterIndex < this._splitter.length) {
        if (this._isDocked(splitterIndex)) this._splitter[splitterIndex].element.hide();
      }
      /**
       * Allocate the space that the hidden item occupied to the remaining items
       */


      var docked = this._isDocked();

      for (i = 0; i < this.contentItems.length; i++) {
        if (this.contentItems[i] !== contentItem) {
          if (!this._isDocked(i)) this.contentItems[i].config[this._dimension] += undisplayedItemSize / (this.contentItems.length - 1 - docked);
        } else {
          this.contentItems[i].config[this._dimension] = 0;
        }
      }

      if (this.contentItems.length === 1) {
        AbstractContentItem.prototype.undisplayChild.call(this, contentItem);
      }

      this.callDownwards('setSize');
      this.emitBubblingEvent('stateChanged');
    }
    /**
     * Removes a child of this element
     *
     * @param   {AbstractContentItem} contentItem
     * @param   {boolean} keepChild   If true the child will be removed, but not destroyed
     *
     * @returns {void}
     */

  }, {
    key: "removeChild",
    value: function removeChild(contentItem, keepChild) {
      var removedItemSize = contentItem.config[this._dimension],
          index = indexOf(contentItem, this.contentItems),
          splitterIndex = Math.max(index - 1, 0),
          i,
          childItem;

      if (index === -1) {
        throw new Error('Can\'t remove child. ContentItem is not child of this Row or Column');
      }
      /**
       * Remove the splitter before the item or after if the item happens
       * to be the first in the row/column
       */


      if (this._splitter[splitterIndex]) {
        this._splitter[splitterIndex]._$destroy();

        this._splitter.splice(splitterIndex, 1);
      }

      if (splitterIndex < this._splitter.length) {
        if (this._isDocked(splitterIndex)) this._splitter[splitterIndex].element.hide();
      }
      /**
       * Allocate the space that the removed item occupied to the remaining items
       */


      var docked = this._isDocked();

      for (i = 0; i < this.contentItems.length; i++) {
        if (this.contentItems[i] !== contentItem) {
          if (!this._isDocked(i)) this.contentItems[i].config[this._dimension] += removedItemSize / (this.contentItems.length - 1 - docked);
        }
      }

      AbstractContentItem.prototype.removeChild.call(this, contentItem, keepChild);

      if (this.contentItems.length === 1 && this.config.isClosable === true) {
        childItem = this.contentItems[0];
        this.contentItems = [];
        this.parent.replaceChild(this, childItem, true);

        this._validateDocking(this.parent);
      } else {
        this.callDownwards('setSize');
        this.emitBubblingEvent('stateChanged');

        this._validateDocking();
      }
    }
    /**
     * Replaces a child of this Row or Column with another contentItem
     *
     * @param   {AbstractContentItem} oldChild
     * @param   {AbstractContentItem} newChild
     *
     * @returns {void}
     */

  }, {
    key: "replaceChild",
    value: function replaceChild(oldChild, newChild) {
      var size = oldChild.config[this._dimension];
      AbstractContentItem.prototype.replaceChild.call(this, oldChild, newChild);
      newChild.config[this._dimension] = size;
      this.callDownwards('setSize');
      this.emitBubblingEvent('stateChanged');
    }
    /**
     * Called whenever the dimensions of this item or one of its parents change
     *
     * @returns {void}
     */

  }, {
    key: "setSize",
    value: function setSize() {
      if (this.contentItems.length > 0) {
        this._calculateRelativeSizes();

        this._setAbsoluteSizes();
      }

      this.emitBubblingEvent('stateChanged');
      this.emit('resize');
    }
    /**
     * Dock or undock a child if it posiible
     *
     * @param   {AbstractContentItem} contentItem
     * @param   {Boolean} mode or toggle if undefined
     * @param   {Boolean} collapsed after docking
     *
     * @returns {void}
     */

  }, {
    key: "dock",
    value: function dock(contentItem, mode, collapsed) {
      if (this.contentItems.length === 1) throw new Error('Can\'t dock child when it single');
      var removedItemSize = contentItem.config[this._dimension],
          headerSize = this.layoutManager.config.dimensions.headerHeight,
          index = indexOf(contentItem, this.contentItems),
          splitterIndex = Math.max(index - 1, 0);

      if (index === -1) {
        throw new Error('Can\'t dock child. ContentItem is not child of this Row or Column');
      }

      var isDocked = contentItem._docker && contentItem._docker.docked;
      var i;
      if (typeof mode != 'undefined') if (mode == isDocked) return;

      if (isDocked) {
        // undock it
        this._splitter[splitterIndex].element.show();

        for (i = 0; i < this.contentItems.length; i++) {
          var newItemSize = contentItem._docker.size;

          if (this.contentItems[i] === contentItem) {
            contentItem.config[this._dimension] = newItemSize;
          } else {
            itemSize = this.contentItems[i].config[this._dimension] *= (100 - newItemSize) / 100;
            this.contentItems[i].config[this._dimension] = itemSize;
          }
        }

        contentItem._docker = {
          docked: false
        };
      } else {
        // dock
        if (this.contentItems.length - this._isDocked() < 2) throw new Error('Can\'t dock child when it is last in ' + this.config.type);
        var autoside = {
          column: {
            first: 'top',
            last: 'bottom'
          },
          row: {
            first: 'left',
            last: 'right'
          }
        };
        var required = autoside[this.config.type][index ? 'last' : 'first'];
        if (contentItem.header.position() != required) contentItem.header.position(required);

        if (this._splitter[splitterIndex]) {
          this._splitter[splitterIndex].element.hide();
        }

        var docked = this._isDocked();

        for (i = 0; i < this.contentItems.length; i++) {
          if (this.contentItems[i] !== contentItem) {
            if (!this._isDocked(i)) this.contentItems[i].config[this._dimension] += removedItemSize / (this.contentItems.length - 1 - docked);
          } else this.contentItems[i].config[this._dimension] = 0;
        }

        contentItem._docker = {
          dimension: this._dimension,
          size: removedItemSize,
          realSize: contentItem.element[this._dimension]() - headerSize,
          docked: true
        };
        if (collapsed) contentItem.childElementContainer[this._dimension](0);
      }

      contentItem.element.toggleClass('lm_docked', contentItem._docker.docked);
      this.callDownwards('setSize');
      this.emitBubblingEvent('stateChanged');

      this._validateDocking();
    }
    /**
     * Invoked recursively by the layout manager. AbstractContentItem.init appends
     * the contentItem's DOM elements to the container, RowOrColumn init adds splitters
     * in between them
     *
     * @package private
     * @override AbstractContentItem._$init
     * @returns {void}
     */

  }, {
    key: "_$init",
    value: function _$init() {
      if (this.isInitialised === true) return;
      var i;

      AbstractContentItem.prototype._$init.call(this);

      for (i = 0; i < this.contentItems.length - 1; i++) {
        this.contentItems[i].element.after(this._createSplitter(i).element);
      }

      for (i = 0; i < this.contentItems.length; i++) {
        if (this.contentItems[i]._header && this.contentItems[i]._header.docked) this.dock(this.contentItems[i], true, true);
      }
    }
    /**
     * Turns the relative sizes calculated by _calculateRelativeSizes into
     * absolute pixel values and applies them to the children's DOM elements
     *
     * Assigns additional pixels to counteract Math.floor
     *
     * @private
     * @returns {void}
     */

  }, {
    key: "_setAbsoluteSizes",
    value: function _setAbsoluteSizes() {
      var i,
          sizeData = this._calculateAbsoluteSizes();

      for (i = 0; i < this.contentItems.length; i++) {
        if (sizeData.additionalPixel - i > 0) {
          sizeData.itemSizes[i]++;
        }

        if (this._isColumn) {
          this.contentItems[i].element.width(sizeData.totalWidth);
          this.contentItems[i].element.height(sizeData.itemSizes[i]);
        } else {
          this.contentItems[i].element.width(sizeData.itemSizes[i]);
          this.contentItems[i].element.height(sizeData.totalHeight);
        }
      }
    }
    /**
     * Calculates the absolute sizes of all of the children of this Item.
     * @returns {object} - Set with absolute sizes and additional pixels.
     */

  }, {
    key: "_calculateAbsoluteSizes",
    value: function _calculateAbsoluteSizes() {
      var i,
          totalSplitterSize = (this.contentItems.length - 1) * this._splitterSize,
          headerSize = this.layoutManager.config.dimensions.headerHeight,
          totalWidth = this.element.width(),
          totalHeight = this.element.height(),
          totalAssigned = 0,
          additionalPixel,
          itemSize,
          itemSizes = [];

      if (this._isColumn) {
        totalHeight -= totalSplitterSize;
      } else {
        totalWidth -= totalSplitterSize;
      }

      for (i = 0; i < this.contentItems.length; i++) {
        if (this._isDocked(i)) if (this._isColumn) {
          totalHeight -= headerSize - this._splitterSize;
        } else {
          totalWidth -= headerSize - this._splitterSize;
        }
      }

      for (i = 0; i < this.contentItems.length; i++) {
        if (this._isColumn) {
          itemSize = Math.floor(totalHeight * (this.contentItems[i].config.height / 100));
        } else {
          itemSize = Math.floor(totalWidth * (this.contentItems[i].config.width / 100));
        }

        if (this._isDocked(i)) itemSize = headerSize;
        totalAssigned += itemSize;
        itemSizes.push(itemSize);
      }

      additionalPixel = Math.floor((this._isColumn ? totalHeight : totalWidth) - totalAssigned);
      return {
        itemSizes: itemSizes,
        additionalPixel: additionalPixel,
        totalWidth: totalWidth,
        totalHeight: totalHeight
      };
    }
    /**
     * Calculates the relative sizes of all children of this Item. The logic
     * is as follows:
     *
     * - Add up the total size of all items that have a configured size
     *
     * - If the total == 100 (check for floating point errors)
     *        Excellent, job done
     *
     * - If the total is > 100,
     *        set the size of items without set dimensions to 1/3 and add this to the total
     *        set the size off all items so that the total is hundred relative to their original size
     *
     * - If the total is < 100
     *        If there are items without set dimensions, distribute the remainder to 100 evenly between them
     *        If there are no items without set dimensions, increase all items sizes relative to
     *        their original size so that they add up to 100
     *
     * @private
     * @returns {void}
     */

  }, {
    key: "_calculateRelativeSizes",
    value: function _calculateRelativeSizes() {
      var i,
          total = 0,
          itemsWithoutSetDimension = [],
          dimension = this._isColumn ? 'height' : 'width';

      for (i = 0; i < this.contentItems.length; i++) {
        if (this.contentItems[i].config[dimension] !== undefined) {
          total += this.contentItems[i].config[dimension];
        } else {
          itemsWithoutSetDimension.push(this.contentItems[i]);
        }
      }
      /**
       * Everything adds up to hundred, all good :-)
       */


      if (Math.round(total) === 100) {
        this._respectMinItemWidth();

        return;
      }
      /**
       * Allocate the remaining size to the items without a set dimension
       */


      if (Math.round(total) < 100 && itemsWithoutSetDimension.length > 0) {
        for (i = 0; i < itemsWithoutSetDimension.length; i++) {
          itemsWithoutSetDimension[i].config[dimension] = (100 - total) / itemsWithoutSetDimension.length;
        }

        this._respectMinItemWidth();

        return;
      }
      /**
       * If the total is > 100, but there are also items without a set dimension left, assing 50
       * as their dimension and add it to the total
       *
       * This will be reset in the next step
       */


      if (Math.round(total) > 100) {
        for (i = 0; i < itemsWithoutSetDimension.length; i++) {
          itemsWithoutSetDimension[i].config[dimension] = 50;
          total += 50;
        }
      }
      /**
       * Set every items size relative to 100 relative to its size to total
       */


      for (i = 0; i < this.contentItems.length; i++) {
        this.contentItems[i].config[dimension] = this.contentItems[i].config[dimension] / total * 100;
      }

      this._respectMinItemWidth();
    }
    /**
     * Adjusts the column widths to respect the dimensions minItemWidth if set.
     * @returns {}
     */

  }, {
    key: "_respectMinItemWidth",
    value: function _respectMinItemWidth() {
      var minItemWidth = this.layoutManager.config.dimensions ? this.layoutManager.config.dimensions.minItemWidth || 0 : 0,
          sizeData = null,
          entriesOverMin = [],
          totalOverMin = 0,
          totalUnderMin = 0,
          remainingWidth = 0,
          itemSize = 0,
          contentItem = null,
          reducePercent,
          reducedWidth,
          allEntries = [],
          entry;

      if (this._isColumn || !minItemWidth || this.contentItems.length <= 1) {
        return;
      }

      sizeData = this._calculateAbsoluteSizes();
      /**
       * Figure out how much we are under the min item size total and how much room we have to use.
       */

      for (var i = 0; i < this.contentItems.length; i++) {
        contentItem = this.contentItems[i];
        itemSize = sizeData.itemSizes[i];

        if (itemSize < minItemWidth) {
          totalUnderMin += minItemWidth - itemSize;
          entry = {
            width: minItemWidth
          };
        } else {
          totalOverMin += itemSize - minItemWidth;
          entry = {
            width: itemSize
          };
          entriesOverMin.push(entry);
        }

        allEntries.push(entry);
      }
      /**
       * If there is nothing under min, or there is not enough over to make up the difference, do nothing.
       */


      if (totalUnderMin === 0 || totalUnderMin > totalOverMin) {
        return;
      }
      /**
       * Evenly reduce all columns that are over the min item width to make up the difference.
       */


      reducePercent = totalUnderMin / totalOverMin;
      remainingWidth = totalUnderMin;

      for (i = 0; i < entriesOverMin.length; i++) {
        entry = entriesOverMin[i];
        reducedWidth = Math.round((entry.width - minItemWidth) * reducePercent);
        remainingWidth -= reducedWidth;
        entry.width -= reducedWidth;
      }
      /**
       * Take anything remaining from the last item.
       */


      if (remainingWidth !== 0) {
        allEntries[allEntries.length - 1].width -= remainingWidth;
      }
      /**
       * Set every items size relative to 100 relative to its size to total
       */


      for (i = 0; i < this.contentItems.length; i++) {
        this.contentItems[i].config.width = allEntries[i].width / sizeData.totalWidth * 100;
      }
    }
    /**
     * Instantiates a new Splitter, binds events to it and adds
     * it to the array of splitters at the position specified as the index argument
     *
     * What it doesn't do though is append the splitter to the DOM
     *
     * @param   {Int} index The position of the splitter
     *
     * @returns {Splitter}
     */

  }, {
    key: "_createSplitter",
    value: function _createSplitter(index) {
      var splitter;
      splitter = new Splitter(this._isColumn, this._splitterSize, this._splitterGrabSize);
      splitter.on('drag', fnBind(this._onSplitterDrag, this, [splitter]), this);
      splitter.on('dragStop', fnBind(this._onSplitterDragStop, this, [splitter]), this);
      splitter.on('dragStart', fnBind(this._onSplitterDragStart, this, [splitter]), this);

      this._splitter.splice(index, 0, splitter);

      return splitter;
    }
    /**
     * Locates the instance of Splitter in the array of
     * registered splitters and returns a map containing the contentItem
     * before and after the splitters, both of which are affected if the
     * splitter is moved
     *
     * @param   {Splitter} splitter
     *
     * @returns {Object} A map of contentItems that the splitter affects
     */

  }, {
    key: "_getItemsForSplitter",
    value: function _getItemsForSplitter(splitter) {
      var index = indexOf(splitter, this._splitter);
      return {
        before: this.contentItems[index],
        after: this.contentItems[index + 1]
      };
    }
    /**
     * Gets docking information
     * @private
     */

  }, {
    key: "_isDocked",
    value: function _isDocked(index) {
      if (typeof index == 'undefined') {
        var count = 0;

        for (var i = 0; i < this.contentItems.length; ++i) {
          if (this._isDocked(i)) count++;
        }

        return count;
      }

      if (index < this.contentItems.length) return this.contentItems[index]._docker && this.contentItems[index]._docker.docked;
    }
    /**
     * Validate if row or column has ability to dock
     * @private
     */

  }, {
    key: "_validateDocking",
    value: function _validateDocking(that) {
      that = that || this;
      var can = that.contentItems.length - that._isDocked() > 1;

      for (var i = 0; i < that.contentItems.length; ++i) {
        if (that.contentItems[i] instanceof Stack) {
          that.contentItems[i].header._setDockable(that._isDocked(i) || can);

          that.contentItems[i].header._$setClosable(can);
        }
      }
    }
    /**
     * Gets the minimum dimensions for the given item configuration array
     * @param item
     * @private
     */

  }, {
    key: "_getMinimumDimensions",
    value: function _getMinimumDimensions(arr) {
      var minWidth = 0,
          minHeight = 0;

      for (var i = 0; i < arr.length; ++i) {
        minWidth = Math.max(arr[i].minWidth || 0, minWidth);
        minHeight = Math.max(arr[i].minHeight || 0, minHeight);
      }

      return {
        horizontal: minWidth,
        vertical: minHeight
      };
    }
    /**
     * Invoked when a splitter's dragListener fires dragStart. Calculates the splitters
     * movement area once (so that it doesn't need calculating on every mousemove event)
     *
     * @param   {Splitter} splitter
     *
     * @returns {void}
     */

  }, {
    key: "_onSplitterDragStart",
    value: function _onSplitterDragStart(splitter) {
      var items = this._getItemsForSplitter(splitter),
          minSize = this.layoutManager.config.dimensions[this._isColumn ? 'minItemHeight' : 'minItemWidth'];

      var beforeMinDim = this._getMinimumDimensions(items.before.config.content);

      var beforeMinSize = this._isColumn ? beforeMinDim.vertical : beforeMinDim.horizontal;

      var afterMinDim = this._getMinimumDimensions(items.after.config.content);

      var afterMinSize = this._isColumn ? afterMinDim.vertical : afterMinDim.horizontal;
      this._splitterPosition = 0;
      this._splitterMinPosition = -1 * (items.before.element[this._dimension]() - (beforeMinSize || minSize));
      this._splitterMaxPosition = items.after.element[this._dimension]() - (afterMinSize || minSize);
    }
    /**
     * Invoked when a splitter's DragListener fires drag. Updates the splitters DOM position,
     * but not the sizes of the elements the splitter controls in order to minimize resize events
     *
     * @param   {Splitter} splitter
     * @param   {Int} offsetX  Relative pixel values to the splitters original position. Can be negative
     * @param   {Int} offsetY  Relative pixel values to the splitters original position. Can be negative
     *
     * @returns {void}
     */

  }, {
    key: "_onSplitterDrag",
    value: function _onSplitterDrag(splitter, offsetX, offsetY) {
      var offset = this._isColumn ? offsetY : offsetX;

      if (offset > this._splitterMinPosition && offset < this._splitterMaxPosition) {
        this._splitterPosition = offset;
        splitter.element.css(this._isColumn ? 'top' : 'left', offset);
      }
    }
    /**
     * Invoked when a splitter's DragListener fires dragStop. Resets the splitters DOM position,
     * and applies the new sizes to the elements before and after the splitter and their children
     * on the next animation frame
     *
     * @param   {Splitter} splitter
     *
     * @returns {void}
     */

  }, {
    key: "_onSplitterDragStop",
    value: function _onSplitterDragStop(splitter) {
      var items = this._getItemsForSplitter(splitter),
          sizeBefore = items.before.element[this._dimension](),
          sizeAfter = items.after.element[this._dimension](),
          splitterPositionInRange = (this._splitterPosition + sizeBefore) / (sizeBefore + sizeAfter),
          totalRelativeSize = items.before.config[this._dimension] + items.after.config[this._dimension];

      items.before.config[this._dimension] = splitterPositionInRange * totalRelativeSize;
      items.after.config[this._dimension] = (1 - splitterPositionInRange) * totalRelativeSize;
      splitter.element.css({
        'top': 0,
        'left': 0
      });
      animFrame(fnBind(this.callDownwards, this, ['setSize']));
    }
  }]);

  return RowOrColumn;
}(AbstractContentItem);

export { RowOrColumn as default };