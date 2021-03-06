/**
 * @file initLayer.js
 * @author mengke01
 * @date 
 * @description
 * Editor的layer初始化
 */


define(
    function(require) {
        
        /**
         * 初始化层
         */
        function initLayer() {

            this.coverLayer = this.render.addLayer('cover', {
                level: 30,
                fill: false,
                strokeColor: 'green',
                fillColor: 'white'
            });

            this.fontLayer = this.render.addLayer('font', {
                level: 20,
                lineWidth: 1,
                strokeColor: 'red',
                strokeSeparate: false
            });

            this.axisLayer = this.render.addLayer('axis', {
                level: 10,
                fill: false
            });

            this.render.addLayer('graduation', {
                level: 40,
                fill: false,
                disabled: true
            });
        }

        return initLayer;
    }
);
