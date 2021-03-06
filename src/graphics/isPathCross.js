/**
 * @file isPathCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断路径的包含关系
 */

define(
    function(require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isSegmentCross = require('./isSegmentCross');
        var isBezierCross = require('./isBezierCross');
        var isBezierSegmentCross = require('./isBezierSegmentCross');
        var isInsidePath = require('./isInsidePath');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var pathIterator = require('./pathIterator');

        /**
         * 求路径和曲线段的交点集合
         * @param {Array} path 路径
         * @param {string} command 命令
         * @param {Object} p0 
         * @param {Object} p1 
         * @param {Object} p2 
         * 
         * @return {Array} 交点数组
         */
        function getJoint(path, command, p0, p1, p2) {

            var joint = [];
            var result;
            pathIterator(path, function (c, t0, t1, t2) {
                if (c === 'L') {
                    if (command === 'L') {
                        result = isSegmentCross(p0, p1, t0, t1);
                    }
                    else if (command === 'Q') {
                        result = isBezierSegmentCross(p0, p1, p2, t0, t1, t2);
                    }
                }
                else if(c === 'Q') {
                    if (command === 'L') {
                        result = isBezierSegmentCross(
                                t0, t1, t2, p0, p1);
                    }
                    else if (command === 'Q') {
                        result = isBezierCross(t0, t1, t2, p0, p1, p2);
                    }
                }

                if (result) {
                    joint = joint.concat(result);
                }
            });

            return joint.length ? joint : false;
        }

        /**
         * 求两个路径的交点集合 
         * @param {Array} path0 路径0
         * @param {Array} path1 路径1
         * 
         * @return {Array} 交点数组
         */
        function getPathJoint(path0, path1) {

            var joint = [];
            var result;
            pathIterator(path0, function (c, p0, p1, p2) {
                if (c === 'L') {
                    result = getJoint(path1, 'L', p0, p1);
                }
                else if(c === 'Q') {
                    result = getJoint(path1, 'Q', p0, p1, p2);
                }

                if (result) {
                    joint = joint.concat(result);
                }
            });

            return joint.length ? joint : false;
        }

        /**
         * 判断x轴射线是否穿过线段
         * 
         * @param {Array} path0 路径0
         * @param {Array} path1 路径1
         * @return {Array|number} 交点数组或者包含关系
         * 
         * 2: path0 包含 path1
         * 3: path1 包含 path0
         */
        function isPathCross(path0, path1, bound0, bound1) {
            bound0 = bound0 || computeBoundingBox.computePath(path0);
            bound1 = bound1 || computeBoundingBox.computePath(path1);

            var boundCross = isBoundingBoxCross(bound0, bound1);

            if (boundCross) {
                var result = getPathJoint(path0, path1);
                if (!result) {
                    // 0 包含 1
                    if (isInsidePath(path1, path0[0])) {
                        return 2;
                    }
                    // 1 包含 0
                    else if(isInsidePath(path0, path1[0])) {
                        return 3;
                    }
                }
                else {
                    return result;
                }
            }

            return false;
        }

        return isPathCross;
    }
);
