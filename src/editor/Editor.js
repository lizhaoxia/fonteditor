/**
 * @file Editor.js
 * @author mengke01
 * @date 
 * @description
 * 字体编辑控制器
 */


define(
    function(require) {
        var lang = require('common/lang');
        var modeSupport = require('./mode/support');
        var ContextMenu = require('./menu/ContextMenu');
        var commandSupport = require('./command/support');
        var History = require('./util/History');

        // editor 的控制器
        var initLayer = require('./controller/initLayer');
        var initRender = require('./controller/initRender');
        var initBinder = require('./controller/initBinder');

        /**
         * Render控制器
         * @param {Object} options 参数
         * @constructor
         */
        function Editor(main, options) {
            this.options = lang.extend({
                unitsPerEm: 512,
                // 字体测量规格
                metrics: {
                    WinAscent: 480,
                    WinDecent: -33,
                    'x-Height': 256,
                    'CapHeight': 358
                },
                contextMenu: {}
            }, options);

            this.contextMenu = new ContextMenu(main, this.options.contextMenu);
            this.history = new History();
        }

        /**
         * 设置渲染器
         */
        Editor.prototype.setRender = function(render) {
            this.render = render;
            initRender.call(this);
            initLayer.call(this);
            initBinder.call(this);
            return this;
        };

        /**
         * 切换编辑模式
         * 
         * @param {string} modeName 模式名称
         * @return {Editor} 本对象
         */
        Editor.prototype.setMode = function(modeName) {
            console.log(modeName);
            if (this.mode) {
                this.mode.end.call(this);
            }

            this.mode = modeSupport[modeName] || modeSupport['default'];
            var args = Array.prototype.slice.call(arguments, 1);
            this.mode.begin.apply(this, args);
        };

        /**
         * 刷新编辑器组件
         */
        Editor.prototype.refresh = function() {
            this.render.refresh();
            return this;
        };


        /**
         * 执行指定命令
         * 
         * @param {string...} command 指令名，后续为命令参数集合
         * @return {boolean} 是否执行成功
         */
        Editor.prototype.execCommand = function(command) {

            var args = Array.prototype.slice.call(arguments, 1);
            var event = {
                command: command,
                args: args
            };
            this.fire('command', event);

            if(event.returnValue === false) {
                return false;
            }

            if (commandSupport[command]) {
                commandSupport[command].apply(this, args);
                return true;
            }

            return false;
        };

        /**
         * 是否支持指令
         * 
         * @param {string} command 指令名
         * @return {boolean} 是否
         */
        Editor.prototype.supportCommand = function(command) {
            return !!commandSupport[command];
        };

        /**
         * 添加指令
         * 
         * @param {string} command 指令名
         * @param {Function} worker 执行函数
         * @return {boolean} 是否成功
         */
        Editor.prototype.addCommand = function(command, worker) {
            if(commandSupport[command]) {
                return false;
            }
            commandSupport[command] = worker;
            return true;
        };

        /**
         * 添加到剪切板
         * 
         * @param {Array} 形状集合
         * @return {this}
         */
        Editor.prototype.setClipBoard = function(shapes) {
            Editor.ClipBoardData = null;
            Editor.ClipBoardData = shapes;
            return this;
        };

        /**
         * 从剪切板中获取
         * 
         * @param {Array} 形状集合
         * @return {this}
         */
        Editor.prototype.getClipBoard = function() {
            return Editor.ClipBoardData ? lang.clone(Editor.ClipBoardData) : null;
        };

        /**
         * 注销
         */
        Editor.prototype.dispose = function() {
            this.un();
            this.contextMenu.dispose();
            this.render && this.render.dispose();
            this.options = this.contextMenu = this.render = null;
            this.fontLayer = this.coverLayer = this.axisLayer = null;
            this.axis = this.rightSideBearing = this.font = null;
            this.mode = null;
            this.history.reset();
            this.history = null;
        };

        lang.extend(Editor.prototype, require('./controller/font'));
        require('common/observable').mixin(Editor.prototype);

        return Editor;
    }
);
