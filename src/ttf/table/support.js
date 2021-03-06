/**
 * @file support.js
 * @author mengke01
 * @date 
 * @description
 * 列举支持的表
 */


define(
    function(require) {

        var support = {
            'head': require('./head'),
            'maxp': require('./maxp'),
            'loca': require('./loca'),
            'glyf': require('./glyf'),
            'cmap': require('./cmap'),
            'name': require('./name'),
            'gasp': require('./gasp'),
            'hhea': require('./hhea'),
            'hmtx': require('./hmtx'),
            'post': require('./post'),
            'DSIG': require('./DSIG'),
            'GDEF': require('./GDEF'),
            'GPOS': require('./GPOS'),
            'GSUB': require('./GSUB'),
            'OS/2': require('./OS2')
        };

        return support;
    }
);
