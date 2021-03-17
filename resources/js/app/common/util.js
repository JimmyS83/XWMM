/* global Ext: false, WIMM: false */
/*
 * Copyright 2011 slash2009.
 * Copyright 2013 Zernable.
 * Copyright 2013 uNiversal.
 * Copyright 2013, 2014 Andrew Fyfe.
 *
 * This file is part of Web interface Media Manager (WIMM) for kodi.
 *
 * WIMM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * WIMM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with WIMM.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.ns('WIMM.util');

/**
 * Convert a string to title case.
 * @param {string} str The string to convert.
 * @return {string} The string converted to title case.
 */
WIMM.util.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};


/**
 * Converts an array to a string list.
 * @param {array} value The array to convert.
 * @return {string} The list.
 */
WIMM.util.convertArrayToList = function(value, delim) {
    if (value === undefined || value.length === 0) {
        return '';
    }
    else {
        if (delim === undefined || typeof(delim) === 'object') {
            delim = ' / ';
        }

        return value.join(delim);
    }
};

/**
 * Convert a string list into an array.
 * @param {string} stringList The string to split.
 * @param {(string|RegExp)} sep The separator to split the list on.
 * @returns {Array} The string list as an array.
 */
WIMM.util.convertListToArray = function(stringList, sep) {
    var inList = stringList.split(sep);
    var outList = [];
    for (var i = 0, len = inList.length; i < len; i++) {
        listItem = inList[i].trim();
        if (listItem.length > 0) {
            outList.push(listItem);
        }
    }
    return outList;
}

/**
 * Strip the image:// prefix from artwork urls.
 * @param {string} value The artwork url to convert.
 * @return {string} The converted url.
 */
WIMM.util.convertArtworkURL = function(value) {
    if (value === undefined || value === '') {
        return '';
    }
    else {
        //return '/image/' + value.substr(8, value.length - 9);
		return value.substr(8, value.length - 9);
    }
};

/**
 * Converts a file path to a VFS url
 * @param {string} value The file path to convert.
 * @return {string} The converted url.
 */
WIMM.util.convertVFSURL = function(value) {
    if (value === undefined || value === '') {
        return '';
    }
    else {
        return '/vfs/' + encodeURI(value);
    }
};

/**
 * Convert a rating to 1 decimal place
 * @param {string} value The rating to convert.
 * @return {string} The converted rating.
 */
WIMM.util.convertRating = function(value) {
	var desetiny
	if(Math.floor(value) === value) desetiny = 0;
	else desetiny = value.toString().split(".")[1].length || 0;
	
    if (desetiny != 1) {
		return value.toFixed(1);
	}
	else {
		return value
	}
};

/**
 * Return the file name part of a path
 * @param {string} value The path.
 * @return {string} The file name.
 */
WIMM.util.convertPathToFileName = function(value) {
    var fileName = /([^\\\/]+)$/.exec(value);

    return fileName === null ?
        value :
        fileName[1];
};

/**
 * Return the directory part of a path
 * @param {string} value The path.
 * @return {string} The directory.
 */
WIMM.util.convertPathToDirectory = function(value, record) {
    var dirPath = value.replace(/([^\\\/]+)$/, '');
    return dirPath === null ?
        value :
        dirPath;
};

/**
 * Merge 2 objects.
 * @param {string} object1 The first object to merge.
 * @param {string} object2 The second object to merge.
 */
WIMM.util.merge2Objects = function(object1, object2) {
    for (var prop in object2) {
        object1[prop] = object2[prop];
    }
};

WIMM.util.findResolution = function(width) {
    var resolution;

    if (width === 0) {
        resolution = 'defaultscreen';
    }
    else if (width < 721) {
        resolution = '480';
    }
    else if (width < 961) { // 960x540
        resolution = '540';
    }
    else if (width < 1281) { // 1280x720
        resolution = '720';
    }
    else { // 1920x1080
        resolution = '1080';
    }

    return resolution;
};

WIMM.util.findAspect = function(aspect) {
    var ratio;

    if (aspect === 0) {
        ratio = 'default';
    }
    else if (aspect < 1.4) {
        ratio = '1.33';
    }
    else if (aspect < 1.7) {
        ratio = '1.66';
    }
    else if (aspect < 1.8) {
        ratio = '1.78';
    }
    else if (aspect < 1.9) {
        ratio = '1.85';
    }
    else if (aspect < 2.3) {
        ratio = '2.20';
    }
    else {
        ratio = '2.35';
    }

    return ratio;
};
