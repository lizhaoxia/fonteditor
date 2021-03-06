/**
 * @file addshape.js
 * @author mengke01
 * @date 
 * @description
 * 添加shape模式
 */


define(
    function(require) {

        var addshape = {

            /**
             * 点击
             */
            click: function(e) {

                var coverLayer = this.coverLayer;
                var result = coverLayer.getShapeIn(e);

                // 闭合路径
                if (result[0] && this.points.length > 1 && result[0] === this.points[0]) {

                    var points = this.points.map(function(p) {
                        return {
                            x: p.x,
                            y: p.y,
                            onCurve: true
                        };
                    });

                    var shape = this.fontLayer.addShape('path', {
                        points: points
                    });
                    this.fontLayer.refresh();
                    this.fire('change');
                    this.setMode('shapes', [shape]);
                }
                // 添加控制点
                else {
                    var point = coverLayer.addShape({
                        type: 'point',
                        x: e.x,
                        y: e.y
                    });

                    if(this.points.length === 0) {
                        point.style = {
                            strokeColor: 'red'
                        };
                    }
                    else {
                        var p0 = this.points[this.points.length - 1];
                        coverLayer.addShape({
                            type: 'line',
                            p0 : {
                                x: p0.x,
                                y: p0.y
                            },
                            p1: {
                                x: point.x,
                                y: point.y
                            }
                        });
                    }

                    this.dashedLine.p0.x = point.x;
                    this.dashedLine.p0.y = point.y;
                    this.points.push(point);
                    coverLayer.refresh();
                }
            },

            /**
             * 移动
             */
            move: function(e) {

                // 检查起始点, 用手型标注
                var point = this.coverLayer.getShapeIn(e);
                if(point[0] && point[0] === this.points[0]) {
                    this.render.setCursor('pointer');
                }
                else {
                    this.render.setCursor('crosshair');
                }

                // 更新dashLine
                this.dashedLine.p1.x = e.x;
                this.dashedLine.p1.y = e.y;
                this.dashedLine.disabled = false;

                this.coverLayer.refresh();
            },

            /**
             * 开始
             */
            begin: function() {
                this.coverLayer.clearShapes();
                this.points = [];
                this.dashedLine = this.coverLayer.addShape({
                    type: 'line',
                    dashed: true,
                    disabled: true,
                    selectable: false,
                    p0: {},
                    p1: {}
                });
                this.render.setCursor('crosshair');
            },

            /**
             * 结束
             */
            end: function() {
                this.points = this.dashedLine = null;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return addshape;
    }
);
