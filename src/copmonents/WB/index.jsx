import React, { Component } from "react";
import io from "socket.io-client";
import { saveBoardNametoLocalStorage } from "./helper.js";
// import { ReactComponent as CircleIcon } from "../../assets/icons/circle.svg";
import { translations } from "./translations";
import { configuration } from "./configuration";

import WbLoaderIcon from "../../assets/images/wb/wbLoader.svg";
import zoomOutIcon from "../../assets/images/wb/zoomOut.svg";
import zoomInIcon from "../../assets/images/wb/zoomIn.svg";
import chevronRightIcon from "../../assets/images/wb/chevronRight.svg";
import sizeIcon from "../../assets/images/wb/sizeIcon.svg";

export default class WB extends Component {
  componentDidMount() {


  
      function dist(x1, y1, x2, y2) {
          //Returns the distance between (x1,y1) and (x2,y2)
          return Math.hypot(x2 - x1, y2 - y1);
      }
  
      /**
       * Represents a single operation in an SVG path
       * @param {string} type 
       * @param {number[]} values 
       */
      function PathDataPoint(type, values) {
          this.type = type;
          this.values = values;
      }
  
      /**
       * Given the existing points in a path, add a new point to get a smoothly interpolated path
       * @param {PathDataPoint[]} pts 
       * @param {number} x 
       * @param {number} y 
       */
      function wboPencilPoint(pts, x, y) {
          // pts represents the points that are already in the line as a PathData
          var nbr = pts.length; //The number of points already in the line
          var npoint;
          switch (nbr) {
              case 0: //The first point in the line
                  //If there is no point, we have to start the line with a moveTo statement
                  pts.push(new PathDataPoint("M", [x, y]));
                  //Temporary first point so that clicks are shown and can be erased
                  npoint = new PathDataPoint("L", [x, y]);
                  break;
              case 1: //This should never happen
                  // First point will be the move. Add Line of zero length ensure there are two points and fall through
                  pts.push(new PathDataPoint("L", [pts[0].values[0], pts[0].values[1]]));
              // noinspection FallThroughInSwitchStatementJS
              case 2: //There are two points. The initial move and a line of zero length to make it visible
                  //Draw a curve that is segment between the old point and the new one
                  npoint = new PathDataPoint("C", [
                      pts[0].values[0], pts[0].values[1],
                      x, y,
                      x, y,
                  ]);
                  break;
              default: //There are at least two points in the line
                  npoint = pencilExtrapolatePoints(pts, x, y);
          }
          if (npoint) pts.push(npoint);
          return pts;
      }
  
      function pencilExtrapolatePoints(pts, x, y) {
          //We add the new point, and smoothen the line
          var ANGULARITY = 3; //The lower this number, the smoother the line
          var prev_values = pts[pts.length - 1].values; // Previous point
          var ante_values = pts[pts.length - 2].values; // Point before the previous one
          var prev_x = prev_values[prev_values.length - 2];
          var prev_y = prev_values[prev_values.length - 1];
          var ante_x = ante_values[ante_values.length - 2];
          var ante_y = ante_values[ante_values.length - 1];
  
  
          //We don't want to add the same point twice consecutively
          if ((prev_x === x && prev_y === y)
              || (ante_x === x && ante_y === y)) return;
  
          var vectx = x - ante_x,
              vecty = y - ante_y;
          var norm = Math.hypot(vectx, vecty);
          var dist1 = dist(ante_x, ante_y, prev_x, prev_y) / norm,
              dist2 = dist(x, y, prev_x, prev_y) / norm;
          vectx /= ANGULARITY;
          vecty /= ANGULARITY;
          //Create 2 control points around the last point
          var cx1 = prev_x - dist1 * vectx,
              cy1 = prev_y - dist1 * vecty, //First control point
              cx2 = prev_x + dist2 * vectx,
              cy2 = prev_y + dist2 * vecty; //Second control point
          prev_values[2] = cx1;
          prev_values[3] = cy1;
  
          return new PathDataPoint("C", [
              cx2, cy2,
              x, y,
              x, y,
          ]);
      }

// @info
//   Polyfill for SVG getPathData() and setPathData() methods. Based on:
//   - SVGPathSeg polyfill by Philip Rogers (MIT License)
//     https://github.com/progers/pathseg
//   - SVGPathNormalizer by Tadahisa Motooka (MIT License)
//     https://github.com/motooka/SVGPathNormalizer/tree/master/src
//   - arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
//     https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.core.js#L1837
// @author
//   Jarosław Foksa
// @license
//   MIT License
if (!SVGPathElement.prototype.getPathData || !SVGPathElement.prototype.setPathData) {
  (function () {
    var commandsMap = {
      "Z": "Z", "M": "M", "L": "L", "C": "C", "Q": "Q", "A": "A", "H": "H", "V": "V", "S": "S", "T": "T",
      "z": "Z", "m": "m", "l": "l", "c": "c", "q": "q", "a": "a", "h": "h", "v": "v", "s": "s", "t": "t"
    };

    var Source = function (string) {
      this._string = string;
      this._currentIndex = 0;
      this._endIndex = this._string.length;
      this._prevCommand = null;
      this._skipOptionalSpaces();
    };

    var isIE = window.navigator.userAgent.indexOf("MSIE ") !== -1;

    Source.prototype = {
      parseSegment: function () {
        var char = this._string[this._currentIndex];
        var command = commandsMap[char] ? commandsMap[char] : null;

        if (command === null) {
          // Possibly an implicit command. Not allowed if this is the first command.
          if (this._prevCommand === null) {
            return null;
          }

          // Check for remaining coordinates in the current command.
          if (
            (char === "+" || char === "-" || char === "." || (char >= "0" && char <= "9")) && this._prevCommand !== "Z"
          ) {
            if (this._prevCommand === "M") {
              command = "L";
            }
            else if (this._prevCommand === "m") {
              command = "l";
            }
            else {
              command = this._prevCommand;
            }
          }
          else {
            command = null;
          }

          if (command === null) {
            return null;
          }
        }
        else {
          this._currentIndex += 1;
        }

        this._prevCommand = command;

        var values = null;
        var cmd = command.toUpperCase();

        if (cmd === "H" || cmd === "V") {
          values = [this._parseNumber()];
        }
        else if (cmd === "M" || cmd === "L" || cmd === "T") {
          values = [this._parseNumber(), this._parseNumber()];
        }
        else if (cmd === "S" || cmd === "Q") {
          values = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()];
        }
        else if (cmd === "C") {
          values = [
            this._parseNumber(),
            this._parseNumber(),
            this._parseNumber(),
            this._parseNumber(),
            this._parseNumber(),
            this._parseNumber()
          ];
        }
        else if (cmd === "A") {
          values = [
            this._parseNumber(),
            this._parseNumber(),
            this._parseNumber(),
            this._parseArcFlag(),
            this._parseArcFlag(),
            this._parseNumber(),
            this._parseNumber()
          ];
        }
        else if (cmd === "Z") {
          this._skipOptionalSpaces();
          values = [];
        }

        if (values === null || values.indexOf(null) >= 0) {
          // Unknown command or known command with invalid values
          return null;
        }
        else {
          return { type: command, values: values };
        }
      },

      hasMoreData: function () {
        return this._currentIndex < this._endIndex;
      },

      peekSegmentType: function () {
        var char = this._string[this._currentIndex];
        return commandsMap[char] ? commandsMap[char] : null;
      },

      initialCommandIsMoveTo: function () {
        // If the path is empty it is still valid, so return true.
        if (!this.hasMoreData()) {
          return true;
        }

        var command = this.peekSegmentType();
        // Path must start with moveTo.
        return command === "M" || command === "m";
      },

      _isCurrentSpace: function () {
        var char = this._string[this._currentIndex];
        return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
      },

      _skipOptionalSpaces: function () {
        while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
          this._currentIndex += 1;
        }

        return this._currentIndex < this._endIndex;
      },

      _skipOptionalSpacesOrDelimiter: function () {
        if (
          this._currentIndex < this._endIndex &&
          !this._isCurrentSpace() &&
          this._string[this._currentIndex] !== ","
        ) {
          return false;
        }

        if (this._skipOptionalSpaces()) {
          if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ",") {
            this._currentIndex += 1;
            this._skipOptionalSpaces();
          }
        }
        return this._currentIndex < this._endIndex;
      },

      // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
      // Source/core/svg/SVGParserUtilities.cpp.
      // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
      _parseNumber: function () {
        var exponent = 0;
        var integer = 0;
        var frac = 1;
        var decimal = 0;
        var sign = 1;
        var expsign = 1;
        var startIndex = this._currentIndex;

        this._skipOptionalSpaces();

        // Read the sign.
        if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "+") {
          this._currentIndex += 1;
        }
        else if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "-") {
          this._currentIndex += 1;
          sign = -1;
        }

        if (
          this._currentIndex === this._endIndex ||
          (
            (this._string[this._currentIndex] < "0" || this._string[this._currentIndex] > "9") &&
            this._string[this._currentIndex] !== "."
          )
        ) {
          // The first character of a number must be one of [0-9+-.].
          return null;
        }

        // Read the integer part, build right-to-left.
        var startIntPartIndex = this._currentIndex;

        while (
          this._currentIndex < this._endIndex &&
          this._string[this._currentIndex] >= "0" &&
          this._string[this._currentIndex] <= "9"
        ) {
          this._currentIndex += 1; // Advance to first non-digit.
        }

        if (this._currentIndex !== startIntPartIndex) {
          var scanIntPartIndex = this._currentIndex - 1;
          var multiplier = 1;

          while (scanIntPartIndex >= startIntPartIndex) {
            integer += multiplier * (this._string[scanIntPartIndex] - "0");
            scanIntPartIndex -= 1;
            multiplier *= 10;
          }
        }

        // Read the decimals.
        if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ".") {
          this._currentIndex += 1;

          // There must be a least one digit following the .
          if (
            this._currentIndex >= this._endIndex ||
            this._string[this._currentIndex] < "0" ||
            this._string[this._currentIndex] > "9"
          ) {
            return null;
          }

          while (
            this._currentIndex < this._endIndex &&
            this._string[this._currentIndex] >= "0" &&
            this._string[this._currentIndex] <= "9"
          ) {
            frac *= 10;
            decimal += (this._string.charAt(this._currentIndex) - "0") / frac;
            this._currentIndex += 1;
          }
        }

        // Read the exponent part.
        if (
          this._currentIndex !== startIndex &&
          this._currentIndex + 1 < this._endIndex &&
          (this._string[this._currentIndex] === "e" || this._string[this._currentIndex] === "E") &&
          (this._string[this._currentIndex + 1] !== "x" && this._string[this._currentIndex + 1] !== "m")
        ) {
          this._currentIndex += 1;

          // Read the sign of the exponent.
          if (this._string[this._currentIndex] === "+") {
            this._currentIndex += 1;
          }
          else if (this._string[this._currentIndex] === "-") {
            this._currentIndex += 1;
            expsign = -1;
          }

          // There must be an exponent.
          if (
            this._currentIndex >= this._endIndex ||
            this._string[this._currentIndex] < "0" ||
            this._string[this._currentIndex] > "9"
          ) {
            return null;
          }

          while (
            this._currentIndex < this._endIndex &&
            this._string[this._currentIndex] >= "0" &&
            this._string[this._currentIndex] <= "9"
          ) {
            exponent *= 10;
            exponent += (this._string[this._currentIndex] - "0");
            this._currentIndex += 1;
          }
        }

        var number = integer + decimal;
        number *= sign;

        if (exponent) {
          number *= Math.pow(10, expsign * exponent);
        }

        if (startIndex === this._currentIndex) {
          return null;
        }

        this._skipOptionalSpacesOrDelimiter();

        return number;
      },

      _parseArcFlag: function () {
        if (this._currentIndex >= this._endIndex) {
          return null;
        }

        var flag = null;
        var flagChar = this._string[this._currentIndex];

        this._currentIndex += 1;

        if (flagChar === "0") {
          flag = 0;
        }
        else if (flagChar === "1") {
          flag = 1;
        }
        else {
          return null;
        }

        this._skipOptionalSpacesOrDelimiter();
        return flag;
      }
    };

    var parsePathDataString = function (string) {
      if (!string || string.length === 0) return [];

      var source = new Source(string);
      var pathData = [];

      if (source.initialCommandIsMoveTo()) {
        while (source.hasMoreData()) {
          var pathSeg = source.parseSegment();

          if (pathSeg === null) {
            break;
          }
          else {
            pathData.push(pathSeg);
          }
        }
      }

      return pathData;
    }

    var setAttribute = SVGPathElement.prototype.setAttribute;
    var removeAttribute = SVGPathElement.prototype.removeAttribute;

    var $cachedPathData = window.Symbol ? Symbol() : "__cachedPathData";
    var $cachedNormalizedPathData = window.Symbol ? Symbol() : "__cachedNormalizedPathData";

    // @info
    //   Get an array of corresponding cubic bezier curve parameters for given arc curve paramters.
    var arcToCubicCurves = function (x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, _recursive) {
      var degToRad = function (degrees) {
        return (Math.PI * degrees) / 180;
      };

      var rotate = function (x, y, angleRad) {
        var X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
        var Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
        return { x: X, y: Y };
      };

      var angleRad = degToRad(angle);
      var params = [];
      var f1, f2, cx, cy;

      if (_recursive) {
        f1 = _recursive[0];
        f2 = _recursive[1];
        cx = _recursive[2];
        cy = _recursive[3];
      }
      else {
        var p1 = rotate(x1, y1, -angleRad);
        x1 = p1.x;
        y1 = p1.y;

        var p2 = rotate(x2, y2, -angleRad);
        x2 = p2.x;
        y2 = p2.y;

        var x = (x1 - x2) / 2;
        var y = (y1 - y2) / 2;
        var h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);

        if (h > 1) {
          h = Math.sqrt(h);
          r1 = h * r1;
          r2 = h * r2;
        }

        var sign;

        if (largeArcFlag === sweepFlag) {
          sign = -1;
        }
        else {
          sign = 1;
        }

        var r1Pow = r1 * r1;
        var r2Pow = r2 * r2;

        var left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
        var right = r1Pow * y * y + r2Pow * x * x;

        var k = sign * Math.sqrt(Math.abs(left / right));

        cx = k * r1 * y / r2 + (x1 + x2) / 2;
        cy = k * -r2 * x / r1 + (y1 + y2) / 2;

        f1 = Math.asin(parseFloat(((y1 - cy) / r2).toFixed(9)));
        f2 = Math.asin(parseFloat(((y2 - cy) / r2).toFixed(9)));

        if (x1 < cx) {
          f1 = Math.PI - f1;
        }
        if (x2 < cx) {
          f2 = Math.PI - f2;
        }

        if (f1 < 0) {
          f1 = Math.PI * 2 + f1;
        }
        if (f2 < 0) {
          f2 = Math.PI * 2 + f2;
        }

        if (sweepFlag && f1 > f2) {
          f1 = f1 - Math.PI * 2;
        }
        if (!sweepFlag && f2 > f1) {
          f2 = f2 - Math.PI * 2;
        }
      }

      var df = f2 - f1;

      if (Math.abs(df) > (Math.PI * 120 / 180)) {
        var f2old = f2;
        var x2old = x2;
        var y2old = y2;

        if (sweepFlag && f2 > f1) {
          f2 = f1 + (Math.PI * 120 / 180) * (1);
        }
        else {
          f2 = f1 + (Math.PI * 120 / 180) * (-1);
        }

        x2 = cx + r1 * Math.cos(f2);
        y2 = cy + r2 * Math.sin(f2);
        params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
      }

      df = f2 - f1;

      var c1 = Math.cos(f1);
      var s1 = Math.sin(f1);
      var c2 = Math.cos(f2);
      var s2 = Math.sin(f2);
      var t = Math.tan(df / 4);
      var hx = 4 / 3 * r1 * t;
      var hy = 4 / 3 * r2 * t;

      var m1 = [x1, y1];
      var m2 = [x1 + hx * s1, y1 - hy * c1];
      var m3 = [x2 + hx * s2, y2 - hy * c2];
      var m4 = [x2, y2];

      m2[0] = 2 * m1[0] - m2[0];
      m2[1] = 2 * m1[1] - m2[1];

      if (_recursive) {
        return [m2, m3, m4].concat(params);
      }
      else {
        params = [m2, m3, m4].concat(params);

        var curves = [];

        for (var i = 0; i < params.length; i += 3) {
          var r1 = rotate(params[i][0], params[i][1], angleRad);
          var r2 = rotate(params[i + 1][0], params[i + 1][1], angleRad);
          var r3 = rotate(params[i + 2][0], params[i + 2][1], angleRad);
          curves.push([r1.x, r1.y, r2.x, r2.y, r3.x, r3.y]);
        }

        return curves;
      }
    };

    var clonePathData = function (pathData) {
      return pathData.map(function (seg) {
        return { type: seg.type, values: Array.prototype.slice.call(seg.values) }
      });
    };

    // @info
    //   Takes any path data, returns path data that consists only from absolute commands.
    var absolutizePathData = function (pathData) {
      var absolutizedPathData = [];

      var currentX = null;
      var currentY = null;

      var subpathX = null;
      var subpathY = null;

      pathData.forEach(function (seg) {
        var type = seg.type;

        if (type === "M") {
          var x = seg.values[0];
          var y = seg.values[1];

          absolutizedPathData.push({ type: "M", values: [x, y] });

          subpathX = x;
          subpathY = y;

          currentX = x;
          currentY = y;
        }

        else if (type === "m") {
          var x = currentX + seg.values[0];
          var y = currentY + seg.values[1];

          absolutizedPathData.push({ type: "M", values: [x, y] });

          subpathX = x;
          subpathY = y;

          currentX = x;
          currentY = y;
        }

        else if (type === "L") {
          var x = seg.values[0];
          var y = seg.values[1];

          absolutizedPathData.push({ type: "L", values: [x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "l") {
          var x = currentX + seg.values[0];
          var y = currentY + seg.values[1];

          absolutizedPathData.push({ type: "L", values: [x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "C") {
          var x1 = seg.values[0];
          var y1 = seg.values[1];
          var x2 = seg.values[2];
          var y2 = seg.values[3];
          var x = seg.values[4];
          var y = seg.values[5];

          absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "c") {
          var x1 = currentX + seg.values[0];
          var y1 = currentY + seg.values[1];
          var x2 = currentX + seg.values[2];
          var y2 = currentY + seg.values[3];
          var x = currentX + seg.values[4];
          var y = currentY + seg.values[5];

          absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "Q") {
          var x1 = seg.values[0];
          var y1 = seg.values[1];
          var x = seg.values[2];
          var y = seg.values[3];

          absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "q") {
          var x1 = currentX + seg.values[0];
          var y1 = currentY + seg.values[1];
          var x = currentX + seg.values[2];
          var y = currentY + seg.values[3];

          absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "A") {
          var x = seg.values[5];
          var y = seg.values[6];

          absolutizedPathData.push({
            type: "A",
            values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
          });

          currentX = x;
          currentY = y;
        }

        else if (type === "a") {
          var x = currentX + seg.values[5];
          var y = currentY + seg.values[6];

          absolutizedPathData.push({
            type: "A",
            values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
          });

          currentX = x;
          currentY = y;
        }

        else if (type === "H") {
          var x = seg.values[0];
          absolutizedPathData.push({ type: "H", values: [x] });
          currentX = x;
        }

        else if (type === "h") {
          var x = currentX + seg.values[0];
          absolutizedPathData.push({ type: "H", values: [x] });
          currentX = x;
        }

        else if (type === "V") {
          var y = seg.values[0];
          absolutizedPathData.push({ type: "V", values: [y] });
          currentY = y;
        }

        else if (type === "v") {
          var y = currentY + seg.values[0];
          absolutizedPathData.push({ type: "V", values: [y] });
          currentY = y;
        }

        else if (type === "S") {
          var x2 = seg.values[0];
          var y2 = seg.values[1];
          var x = seg.values[2];
          var y = seg.values[3];

          absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "s") {
          var x2 = currentX + seg.values[0];
          var y2 = currentY + seg.values[1];
          var x = currentX + seg.values[2];
          var y = currentY + seg.values[3];

          absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "T") {
          var x = seg.values[0];
          var y = seg.values[1]

          absolutizedPathData.push({ type: "T", values: [x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "t") {
          var x = currentX + seg.values[0];
          var y = currentY + seg.values[1]

          absolutizedPathData.push({ type: "T", values: [x, y] });

          currentX = x;
          currentY = y;
        }

        else if (type === "Z" || type === "z") {
          absolutizedPathData.push({ type: "Z", values: [] });

          currentX = subpathX;
          currentY = subpathY;
        }
      });

      return absolutizedPathData;
    };

    // @info
    //   Takes path data that consists only from absolute commands, returns path data that consists only from
    //   "M", "L", "C" and "Z" commands.
    var reducePathData = function (pathData) {
      var reducedPathData = [];
      var lastType = null;

      var lastControlX = null;
      var lastControlY = null;

      var currentX = null;
      var currentY = null;

      var subpathX = null;
      var subpathY = null;

      pathData.forEach(function (seg) {
        if (seg.type === "M") {
          var x = seg.values[0];
          var y = seg.values[1];

          reducedPathData.push({ type: "M", values: [x, y] });

          subpathX = x;
          subpathY = y;

          currentX = x;
          currentY = y;
        }

        else if (seg.type === "C") {
          var x1 = seg.values[0];
          var y1 = seg.values[1];
          var x2 = seg.values[2];
          var y2 = seg.values[3];
          var x = seg.values[4];
          var y = seg.values[5];

          reducedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });

          lastControlX = x2;
          lastControlY = y2;

          currentX = x;
          currentY = y;
        }

        else if (seg.type === "L") {
          var x = seg.values[0];
          var y = seg.values[1];

          reducedPathData.push({ type: "L", values: [x, y] });

          currentX = x;
          currentY = y;
        }

        else if (seg.type === "H") {
          var x = seg.values[0];

          reducedPathData.push({ type: "L", values: [x, currentY] });

          currentX = x;
        }

        else if (seg.type === "V") {
          var y = seg.values[0];

          reducedPathData.push({ type: "L", values: [currentX, y] });

          currentY = y;
        }

        else if (seg.type === "S") {
          var x2 = seg.values[0];
          var y2 = seg.values[1];
          var x = seg.values[2];
          var y = seg.values[3];

          var cx1, cy1;

          if (lastType === "C" || lastType === "S") {
            cx1 = currentX + (currentX - lastControlX);
            cy1 = currentY + (currentY - lastControlY);
          }
          else {
            cx1 = currentX;
            cy1 = currentY;
          }

          reducedPathData.push({ type: "C", values: [cx1, cy1, x2, y2, x, y] });

          lastControlX = x2;
          lastControlY = y2;

          currentX = x;
          currentY = y;
        }

        else if (seg.type === "T") {
          var x = seg.values[0];
          var y = seg.values[1];

          var x1, y1;

          if (lastType === "Q" || lastType === "T") {
            x1 = currentX + (currentX - lastControlX);
            y1 = currentY + (currentY - lastControlY);
          }
          else {
            x1 = currentX;
            y1 = currentY;
          }

          var cx1 = currentX + 2 * (x1 - currentX) / 3;
          var cy1 = currentY + 2 * (y1 - currentY) / 3;
          var cx2 = x + 2 * (x1 - x) / 3;
          var cy2 = y + 2 * (y1 - y) / 3;

          reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });

          lastControlX = x1;
          lastControlY = y1;

          currentX = x;
          currentY = y;
        }

        else if (seg.type === "Q") {
          var x1 = seg.values[0];
          var y1 = seg.values[1];
          var x = seg.values[2];
          var y = seg.values[3];

          var cx1 = currentX + 2 * (x1 - currentX) / 3;
          var cy1 = currentY + 2 * (y1 - currentY) / 3;
          var cx2 = x + 2 * (x1 - x) / 3;
          var cy2 = y + 2 * (y1 - y) / 3;

          reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });

          lastControlX = x1;
          lastControlY = y1;

          currentX = x;
          currentY = y;
        }

        else if (seg.type === "A") {
          var r1 = Math.abs(seg.values[0]);
          var r2 = Math.abs(seg.values[1]);
          var angle = seg.values[2];
          var largeArcFlag = seg.values[3];
          var sweepFlag = seg.values[4];
          var x = seg.values[5];
          var y = seg.values[6];

          if (r1 === 0 || r2 === 0) {
            reducedPathData.push({ type: "C", values: [currentX, currentY, x, y, x, y] });

            currentX = x;
            currentY = y;
          }
          else {
            if (currentX !== x || currentY !== y) {
              var curves = arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag);

              curves.forEach(function (curve) {
                reducedPathData.push({ type: "C", values: curve });
              });

              currentX = x;
              currentY = y;
            }
          }
        }

        else if (seg.type === "Z") {
          reducedPathData.push(seg);

          currentX = subpathX;
          currentY = subpathY;
        }

        lastType = seg.type;
      });

      return reducedPathData;
    };

    SVGPathElement.prototype.setAttribute = function (name, value) {
      if (name === "d") {
        this[$cachedPathData] = null;
        this[$cachedNormalizedPathData] = null;
      }

      setAttribute.call(this, name, value);
    };

    SVGPathElement.prototype.removeAttribute = function (name, value) {
      if (name === "d") {
        this[$cachedPathData] = null;
        this[$cachedNormalizedPathData] = null;
      }

      removeAttribute.call(this, name);
    };

    SVGPathElement.prototype.getPathData = function (options) {
      if (options && options.normalize) {
        if (this[$cachedNormalizedPathData]) {
          return clonePathData(this[$cachedNormalizedPathData]);
        }
        else {
          var pathData;

          if (this[$cachedPathData]) {
            pathData = clonePathData(this[$cachedPathData]);
          }
          else {
            pathData = parsePathDataString(this.getAttribute("d") || "");
            this[$cachedPathData] = clonePathData(pathData);
          }

          var normalizedPathData = reducePathData(absolutizePathData(pathData));
          this[$cachedNormalizedPathData] = clonePathData(normalizedPathData);
          return normalizedPathData;
        }
      }
      else {
        if (this[$cachedPathData]) {
          return clonePathData(this[$cachedPathData]);
        }
        else {
          var pathData = parsePathDataString(this.getAttribute("d") || "");
          this[$cachedPathData] = clonePathData(pathData);
          return pathData;
        }
      }
    };

    SVGPathElement.prototype.setPathData = function (pathData) {
      if (pathData.length === 0) {
        if (isIE) {
          // @bugfix https://github.com/mbostock/d3/issues/1737
          this.setAttribute("d", "");
        }
        else {
          this.removeAttribute("d");
        }
      }
      else {
        var d = "";

        for (var i = 0, l = pathData.length; i < l; i += 1) {
          var seg = pathData[i];

          if (i > 0) {
            d += " ";
          }

          d += seg.type;

          if (seg.values && seg.values.length > 0) {
            d += " " + seg.values.join(" ");
          }
        }

        this.setAttribute("d", d);
      }
    };

    SVGRectElement.prototype.getPathData = function (options) {
      var x = this.x.baseVal.value;
      var y = this.y.baseVal.value;
      var width = this.width.baseVal.value;
      var height = this.height.baseVal.value;
      var rx = this.hasAttribute("rx") ? this.rx.baseVal.value : this.ry.baseVal.value;
      var ry = this.hasAttribute("ry") ? this.ry.baseVal.value : this.rx.baseVal.value;

      if (rx > width / 2) {
        rx = width / 2;
      }

      if (ry > height / 2) {
        ry = height / 2;
      }

      var pathData = [
        { type: "M", values: [x + rx, y] },
        { type: "H", values: [x + width - rx] },
        { type: "A", values: [rx, ry, 0, 0, 1, x + width, y + ry] },
        { type: "V", values: [y + height - ry] },
        { type: "A", values: [rx, ry, 0, 0, 1, x + width - rx, y + height] },
        { type: "H", values: [x + rx] },
        { type: "A", values: [rx, ry, 0, 0, 1, x, y + height - ry] },
        { type: "V", values: [y + ry] },
        { type: "A", values: [rx, ry, 0, 0, 1, x + rx, y] },
        { type: "Z", values: [] }
      ];

      // Get rid of redundant "A" segs when either rx or ry is 0
      pathData = pathData.filter(function (s) {
        return s.type === "A" && (s.values[0] === 0 || s.values[1] === 0) ? false : true;
      });

      if (options && options.normalize === true) {
        pathData = reducePathData(pathData);
      }

      return pathData;
    };

    SVGCircleElement.prototype.getPathData = function (options) {
      var cx = this.cx.baseVal.value;
      var cy = this.cy.baseVal.value;
      var r = this.r.baseVal.value;

      var pathData = [
        { type: "M", values: [cx + r, cy] },
        { type: "A", values: [r, r, 0, 0, 1, cx, cy + r] },
        { type: "A", values: [r, r, 0, 0, 1, cx - r, cy] },
        { type: "A", values: [r, r, 0, 0, 1, cx, cy - r] },
        { type: "A", values: [r, r, 0, 0, 1, cx + r, cy] },
        { type: "Z", values: [] }
      ];

      if (options && options.normalize === true) {
        pathData = reducePathData(pathData);
      }

      return pathData;
    };

    SVGEllipseElement.prototype.getPathData = function (options) {
      var cx = this.cx.baseVal.value;
      var cy = this.cy.baseVal.value;
      var rx = this.rx.baseVal.value;
      var ry = this.ry.baseVal.value;

      var pathData = [
        { type: "M", values: [cx + rx, cy] },
        { type: "A", values: [rx, ry, 0, 0, 1, cx, cy + ry] },
        { type: "A", values: [rx, ry, 0, 0, 1, cx - rx, cy] },
        { type: "A", values: [rx, ry, 0, 0, 1, cx, cy - ry] },
        { type: "A", values: [rx, ry, 0, 0, 1, cx + rx, cy] },
        { type: "Z", values: [] }
      ];

      if (options && options.normalize === true) {
        pathData = reducePathData(pathData);
      }

      return pathData;
    };

    SVGLineElement.prototype.getPathData = function () {
      return [
        { type: "M", values: [this.x1.baseVal.value, this.y1.baseVal.value] },
        { type: "L", values: [this.x2.baseVal.value, this.y2.baseVal.value] }
      ];
    };

    SVGPolylineElement.prototype.getPathData = function () {
      var pathData = [];

      for (var i = 0; i < this.points.numberOfItems; i += 1) {
        var point = this.points.getItem(i);

        pathData.push({
          type: (i === 0 ? "M" : "L"),
          values: [point.x, point.y]
        });
      }

      return pathData;
    };

    SVGPolygonElement.prototype.getPathData = function () {
      var pathData = [];

      for (var i = 0; i < this.points.numberOfItems; i += 1) {
        var point = this.points.getItem(i);

        pathData.push({
          type: (i === 0 ? "M" : "L"),
          values: [point.x, point.y]
        });
      }

      pathData.push({
        type: "Z",
        values: []
      });

      return pathData;
    };
  })();
}

    //=====================================================================

    var Minitpl = (function () {
      function Minitpl(elem, data) {
        this.elem = (typeof (elem) === "string") ? document.querySelector(elem) : elem;
        if (!elem) {
          throw "Invalid element!";
        }
        this.parent = this.elem.parentNode;
        this.parent.removeChild(this.elem);
      }

      function transform(element, transformer) {
        if (typeof (transformer) === "function") {
          transformer(element);
        } else {
          element.textContent = transformer;
        }
      }

      Minitpl.prototype.add = function (data) {
        var newElem = this.elem.cloneNode(true);
        if (typeof (data) === "object") {
          for (var key in data) {
            var matches = newElem.querySelectorAll(key);
            for (var i = 0; i < matches.length; i++) {
              transform(matches[i], data[key]);
            }
          }
        } else {
          transform(newElem, data);
        }
        this.parent.appendChild(newElem);
        return newElem;
      };

      return Minitpl;
    })();

    //===========================================================
    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

    var Tools = {};
    var currentPage = 0,
      totalPage = 1;
    const prevPageElm = document.getElementById("prev-page");
    const nextPageElm = document.getElementById("next-page");
    const navigatorElm = document.getElementById("page-navigator");
    const totalPageElm = document.getElementById("totalPage");
    const currentPageElm = document.getElementById("currentPage");
    const pagesElm = document.getElementById("pages");
    const pageSelectorElm = document.getElementById("page-selector");
    const overlayElm = document.getElementById("overlay");
    const pathName = window.location.pathname;
    const boardName = pathName.split("/")[pathName.split("/").length - 1];
    const boardPrefix = boardName.substr(0, 2);
    const mode = boardPrefix === "f-" ? "filePresentMode" : "whiteboardMode";
    const bottomToolsElm = document.querySelector(".bottomTools");
    
    /**
    * Check for filepresent mobile size version
    */
    // Debounce function
    var _debounce = function (ms, fn) {
      var timer;
      return function () {
        clearTimeout(timer);
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this);
        timer = setTimeout(fn.bind.apply(fn, args), ms);
      };
    };
    
    // Watch for changes to the dimensions of given Element (here body element)
    const resizeObserver = new ResizeObserver(
      _debounce(500, (entries) => {
        const { width } = entries[0].contentRect;
        if (width <= 970 && !isAdmin) {
          bottomToolsElm.classList.add("mobile");
        } else {
          bottomToolsElm.classList.remove("mobile");
        }
      })
    );
    resizeObserver.observe(document.body);
    
    // Handle show color popup and resizer popup
    const settings = document.getElementById("settings");
    function showPopup(elm, child) {
      let coords = elm.getBoundingClientRect();
      child.style.display = "block";
      child.style.top = coords.top - 5 + "px";
    }
    function hidePopup(child) {
      child.style.display = "none";
    }
    Array.from(settings.children).forEach((li) => {
      let listArr = Array.from(li.children);
      let popupElem = listArr[listArr.length - 1];
      li.onmouseenter = () => showPopup(li, popupElem);
      li.onmouseleave = () => hidePopup(popupElem);
    });
    overlayElm.hidden = true;
    // Get queryparams from url - Hide menu based on role
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("r");
    let isAdmin = role === "admin";
    if (!isAdmin) {
      document.querySelector("#menu").className += " not-owner";
      prevPageElm.style.display = "none";
      nextPageElm.style.display = "none";
      document.getElementsByClassName("page-selector-container")[0].style.display =
        "none";
    }
    
    Tools.i18n = (function i18n() {
      // var translations = JSON.parse(document.getElementById("translations").text);
      return {
        t: function translate(s) {
          var key = s.toLowerCase().replace(/ /g, "_");
          return translations[key] || s;
        },
      };
    })();

    Tools.server_config = configuration;

    Tools.board = document.getElementById("board");
    Tools.svg = document.getElementById("canvas");
    Tools.drawingArea = Tools.svg.getElementById("drawingArea");

    //Initialization
    Tools.curTool = null;
    Tools.drawingEvent = true;
    Tools.showMarker = true;
    Tools.showOtherCursors = true;
    Tools.showMyCursor = true;

    Tools.isIE = /MSIE|Trident/.test(window.navigator.userAgent);

    Tools.socket = null;
    Tools.connect = function () {
      var self = this;

      // Destroy socket if one already exists
      if (self.socket) {
        self.socket.destroy();
        delete self.socket;
        self.socket = null;
      }

      this.socket = io.connect("", {
        path: "/socket.io/wb",
        reconnection: true,
        reconnectionDelay: 100, //Make the xhr connections as fast as possible
        timeout: 1000 * 60 * 20, // Timeout after 20 minutes
      });

      //Receive draw instructions from the server
      this.socket.on("broadcast", function (msg) {
        let maxPage = mode === "filePresentMode" ? msg.total - 1 : 24; // set max page limit in diffrent whiteboard mode
        // If the page is loaded with a file first draw image then other whiteboard drawings.
        if (msg?.total) {
          msg.total === 1 &&
            (currentPageElm.innerHTML = navigatorElm.innerHTML = 1);
          totalPage = msg.total;
          renderPageNavigator();
        }
        if (msg?.current || msg.current === 0) {
          currentPage = msg.current;
          currentPageElm.innerHTML = navigatorElm.innerHTML = currentPage + 1;
          if (currentPage === 0) {
            prevPageElm.disabled = true;
          }
          nextPageElm.disabled = currentPage >= maxPage ? true : false; // disable next-page button white reach to max page-limit
          if (prevPageElm.disabled || currentPage >= 0) {
            if (prevPageElm.disabled) {
              prevPageElm.disabled = false;
            }
            if (currentPage === 0) {
              prevPageElm.disabled = true;
            }
          } else {
            prevPageElm.disabled = true;
          }
        }
    
        if (msg?.status === "navigated") {
          // memory leak
          // document.getElementById("drawingArea").innerHTML=""
    
          removeAllChildNodes(Tools.drawingArea);
        }
        handleMessage(msg).finally(function afterload() {
          var loadingEl = document.getElementById("loadingMessage");
          loadingEl.classList.add("hidden");
        });
      });
    
      this.socket.on("reconnect", function onReconnection() {
        Tools.socket.emit("joinboard", Tools.boardName);
      });
      window.onbeforeunload = function () { //close sokcet before page is closed
        this.socket.onclose = function () {}; // disable onclose handler first
        this.socket.close();
        // Manually disconnects the socket. In that case, the socket will not try to reconnect.
        this.socket.disconnect("io client disconnect"); //io client disconnect :	The socket was manually disconnected using socket.disconnect()
      };
    };
    
    function removeAllChildNodes(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
    
    function triggerEvent(element, eventName) {
      var event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, false, true);
      element.dispatchEvent(event);
    }
    
    overlayElm.addEventListener("click", function () {
      this.hidden = true;
      pageSelectorElm.checked = !pageSelectorElm.checked;
      triggerEvent(pageSelectorElm, "change");
    });
    
    // pageSelectorElm.addEventListener("change", function (e) {
    //   const { checked } = e.target;
    //   checked
    //     ? (pagesElm.classList.add("show"), (overlayElm.hidden = false))
    //     : (pagesElm.classList.remove("show"), (overlayElm.hidden = true));
    // });
    
    Tools.connect();
    
    Tools.boardName = (function () {
      var path = window.location.pathname.split("/");
      return decodeURIComponent(path[path.length - 1]);
    })();
    
    //Get the board as soon as the page is loaded
    Tools.socket.emit("getboard", Tools.boardName);
    
    function saveBoardNametoLocalStorage() {
      var boardName = Tools.boardName;
      if (boardName.toLowerCase() === "anonymous") return;
      var recentBoards,
        key = "recent-boards";
      try {
        recentBoards = JSON.parse(localStorage.getItem(key));
        if (!Array.isArray(recentBoards)) throw new Error("Invalid type");
      } catch (e) {
        // On localstorage or json error, reset board list
        recentBoards = [];
        console.log("Board history loading error", e);
      }
      recentBoards = recentBoards.filter(function (name) {
        return name !== boardName;
      });
      recentBoards.unshift(boardName);
      recentBoards = recentBoards.slice(0, 20);
      localStorage.setItem(key, JSON.stringify(recentBoards));
    }
    // Refresh recent boards list on each page show
    window.addEventListener("pageshow", saveBoardNametoLocalStorage);
    
    Tools.HTML = {
      template: new Minitpl("#tools > .tool"),
      addShortcut: function addShortcut(key, callback) {
        window.addEventListener("keydown", function (e) {
          if (e.key === key && !e.target.matches("input[type=text], textarea")) {
            callback();
          }
        });
      },
      addTool: function (
        toolName,
        toolIcon,
        toolIconHTML,
        toolShortcut,
        oneTouch,
        fname
      ) {
        var callback = function () {
          Tools.change(toolName);
        };
        this.addShortcut(toolShortcut, function () {
          Tools.change(toolName);
          document.activeElement.blur && document.activeElement.blur();
        });
        return this.template.add(function (elem) {
          elem.addEventListener("click", callback);
          elem.id = "toolID-" + toolName;
          elem.getElementsByClassName("tool-name")[0].textContent =
            Tools.i18n.t(toolName);
          var toolIconElem = elem.getElementsByClassName("tool-icon")[0];
          toolIconElem.src = toolIcon;
          toolIconElem.alt = toolIcon;
          if (oneTouch) elem.classList.add("oneTouch");
          // elem.title = `${
          //   Tools.list[toolName].secondary ? " [برای تغییر وضعیت کلیک کنید]" : ""
          // } (${toolShortcut}: کلید میانبر) ${Tools.i18n.t(fname)}`;
          // elem.title = Tools.i18n.t(fname);
          if (Tools.list[toolName].secondary) {
            elem.classList.add("hasSecondary");
            var secondaryIcon = elem.getElementsByClassName("secondaryIcon")[0];
            secondaryIcon.src = Tools.list[toolName].secondary.icon;
            toolIconElem.classList.add("primaryIcon");
          }
        });
      },
      changeTool: function (oldToolName, newToolName) {
        var oldTool = document.getElementById("toolID-" + oldToolName);
        var newTool = document.getElementById("toolID-" + newToolName);
        if (oldTool) oldTool.classList.remove("curTool");
        if (newTool) newTool.classList.add("curTool");
      },
      toggle: function (toolName, name, icon) {
        var elem = document.getElementById("toolID-" + toolName);
    
        // Change secondary icon
        var primaryIcon = elem.getElementsByClassName("primaryIcon")[0];
        var secondaryIcon = elem.getElementsByClassName("secondaryIcon")[0];
        var primaryIconSrc = primaryIcon.src;
        var secondaryIconSrc = secondaryIcon.src;
        primaryIcon.src = secondaryIconSrc;
        secondaryIcon.src = primaryIconSrc;
    
        // Change primary icon
        elem.getElementsByClassName("tool-icon")[0].src = icon;
        elem.getElementsByClassName("tool-name")[0].textContent =
          Tools.i18n.t(name);
      },
      addStylesheet: function (href) {
        //Adds a css stylesheet to the html or svg document
        var link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        link.type = "text/css";
        document.head.appendChild(link);
      },
      colorPresetTemplate: new Minitpl("#colorPresetSel .colorPresetButton"),
      addColorButton: function (button) {
        var setColor = Tools.setColor.bind(Tools, button.color);
        if (button.key) this.addShortcut(button.key, setColor);
        return this.colorPresetTemplate.add(function (elem) {
          elem.addEventListener("click", setColor);
          elem.id = "color_" + button.color.replace(/^#/, "");
          elem.style.backgroundColor = button.color;
          if (button.key) {
            elem.title = Tools.i18n.t("keyboard shortcut") + ": " + button.key;
          }
        });
      },
    };
    
    Tools.list = {}; // An array of all known tools. {"toolName" : {toolObject}}
    
    Tools.isBlocked = function toolIsBanned(tool) {
      if (tool.name.includes(","))
        throw new Error("Tool Names must not contain a comma");
      return Tools.server_config.BLOCKED_TOOLS.includes(tool.name);
    };
    
    /**
    * Register a new tool, without touching the User Interface
    */
    Tools.register = function registerTool(newTool) {
      if (Tools.isBlocked(newTool)) return;
    
      if (newTool.name in Tools.list) {
        console.log(
          "Tools.add: The tool '" +
            newTool.name +
            "' is already" +
            "in the list. Updating it..."
        );
      }
    
      //Format the new tool correctly
      Tools.applyHooks(Tools.toolHooks, newTool);
    
      //Add the tool to the list
      Tools.list[newTool.name] = newTool;
    
      // Register the change handlers
      if (newTool.onSizeChange) Tools.sizeChangeHandlers.push(newTool.onSizeChange);
    
      //There may be pending messages for the tool
      var pending = Tools.pendingMessages[newTool.name];
      if (pending) {
        console.log("Drawing pending messages for '%s'.", newTool.name);
        var msg;
        while ((msg = pending.shift())) {
          //Transmit the message to the tool (precising that it comes from the network)
          newTool.draw(msg, false);
        }
      }
    };
    
    /**
    * Add a new tool to the user interface
    */
    Tools.add = function (newTool) {
      if (Tools.isBlocked(newTool)) return;
    
      Tools.register(newTool);
    
      if (newTool.stylesheet) {
        Tools.HTML.addStylesheet(newTool.stylesheet);
      }
    
      //Add the tool to the GUI
      Tools.HTML.addTool(
        newTool.name,
        newTool.icon,
        newTool.iconHTML,
        newTool.shortcut,
        newTool.oneTouch,
        newTool.fname
      );
    };
    
    Tools.change = function (toolName) {
      var newTool = Tools.list[toolName];
      var oldTool = Tools.curTool;
      if (!newTool)
        throw new Error("Trying to select a tool that has never been added!");
      if (newTool === oldTool) {
        if (newTool.secondary) {
          newTool.secondary.active = !newTool.secondary.active;
          var props = newTool.secondary.active ? newTool.secondary : newTool;
          Tools.HTML.toggle(newTool.name, props.name, props.icon);
          if (newTool.secondary.switch) newTool.secondary.switch();
        }
        return;
      }
      if (!newTool.oneTouch) {
        //Update the GUI
        var curToolName = Tools.curTool ? Tools.curTool.name : "";
        try {
          Tools.HTML.changeTool(curToolName, toolName);
        } catch (e) {
          console.error("Unable to update the GUI with the new tool. " + e);
        }
        Tools.svg.style.cursor = newTool.mouseCursor || "auto";
        Tools.board.title = Tools.i18n.t(newTool.helpText || "");
    
        //There is not necessarily already a curTool
        if (Tools.curTool !== null) {
          //It's useless to do anything if the new tool is already selected
          if (newTool === Tools.curTool) return;
    
          //Remove the old event listeners
          Tools.removeToolListeners(Tools.curTool);
    
          //Call the callbacks of the old tool
          Tools.curTool.onquit(newTool);
        }
    
        //Add the new event listeners
        Tools.addToolListeners(newTool);
        Tools.curTool = newTool;
      }
    
      //Call the start callback of the new tool
      newTool.onstart(oldTool);
    };
    
    Tools.addToolListeners = function addToolListeners(tool) {
      for (var event in tool.compiledListeners) {
        var listener = tool.compiledListeners[event];
        var target = listener.target || Tools.board;
        target.addEventListener(event, listener, { passive: false });
      }
    };
    
    Tools.removeToolListeners = function removeToolListeners(tool) {
      for (var event in tool.compiledListeners) {
        var listener = tool.compiledListeners[event];
        var target = listener.target || Tools.board;
        target.removeEventListener(event, listener);
        // also attempt to remove with capture = true in IE
        if (Tools.isIE) target.removeEventListener(event, listener, true);
      }
    };
    function navigateTo(page) {
      currentPageElm.innerHTML = navigatorElm.innerHTML = page + 1;
      if (prevPageElm.disabled || page >= 0) {
        Tools.navigatePage(page);
      }
    }
    (function () {
      // Handle secondary tool switch with shift (key code 16)
      function handleShift(active, evt) {
        if (
          evt.keyCode === 16 &&
          Tools.curTool.secondary &&
          Tools.curTool.secondary.active !== active
        ) {
          Tools.change(Tools.curTool.name);
        }
      }
      function handleNextPage() {
        currentPage++;
        if (currentPage === totalPage) {
          totalPage++;
          // renderPageNavigator();
        }
        navigateTo(currentPage);
      }
      function handlePrevPage() {
        navigateTo(--currentPage);
      }
      window.addEventListener("keydown", handleShift.bind(null, true));
      window.addEventListener("keyup", handleShift.bind(null, false));
      document
        .getElementById("next-page")
        .addEventListener("click", handleNextPage);
      document
        .getElementById("prev-page")
        .addEventListener("click", handlePrevPage);
    
      // renderPageNavigator();
    })();
    
    Tools.send = function (data, toolName) {
      toolName = toolName || Tools.curTool.name;
      var d = data;
      d.tool = toolName;
      Tools.applyHooks(Tools.messageHooks, d);
      var message = {
        board: Tools.boardName,
        data: d,
      };
      Tools.socket.emit("broadcast", message);
    };
    
    Tools.navigatePage = function (data) {
      var d = data;
      Tools.applyHooks(Tools.messageHooks, d);
      var message = {
        board: Tools.boardName,
        data: d,
      };
      Tools.socket.emit("navigate", message);
      document.getElementById("drawingArea").innerHTML = "";
    };
    
    Tools.drawAndSend = function (data, tool) {
      if (tool == null) tool = Tools.curTool;
      tool.draw(data, true);
      Tools.send(data, tool.name);
    };
    
    //Object containing the messages that have been received before the corresponding tool
    //is loaded. keys : the name of the tool, values : array of messages for this tool
    Tools.pendingMessages = {};
    
    // Send a message to the corresponding tool
    function messageForTool(message) {
      var name = message.tool,
        tool = Tools.list[name];
    
      if (tool) {
        Tools.applyHooks(Tools.messageHooks, message);
        tool.draw(message, false);
      } else {
        ///We received a message destinated to a tool that we don't have
        //So we add it to the pending messages
        if (!Tools.pendingMessages[name]) Tools.pendingMessages[name] = [message];
        else Tools.pendingMessages[name].push(message);
      }
    
      if (
        message.tool !== "Hand" &&
        message.deltax != null &&
        message.deltay != null
      ) {
        //this message has special info for the mover
        messageForTool({
          tool: "Hand",
          type: "update",
          deltax: message.deltax || 0,
          deltay: message.deltay || 0,
          id: message.id,
        });
      }
    }
    
    // Apply the function to all arguments by batches
    function batchCall(fn, args) {
      var BATCH_SIZE = 1024;
      if (args.length === 0) {
        return Promise.resolve();
      } else {
        var batch = args.slice(0, BATCH_SIZE);
        var rest = args.slice(BATCH_SIZE);
        return Promise.all(batch.map(fn))
          .then(function () {
            return new Promise(requestAnimationFrame);
          })
          .then(batchCall.bind(null, fn, rest));
      }
    }
    
    // Call messageForTool recursively on the message and its children
    function handleMessage(message) {
      //Check if the message is in the expected format
      if (!message.tool && !message._children) {
        console.error("Received a badly formatted message (no tool). ", message);
      }
      if (message.tool) messageForTool(message);
      if (message._children) {
        return batchCall(handleMessage, message._children);
      } else return Promise.resolve();
    }
    
    function handleNavigation(e) {
      e.stopPropagation();
      const { innerText: pageNumber } = e.target;
      currentPage = +pageNumber - 1;
      currentPageElm.innerHTML = navigatorElm.innerHTML = pageNumber;
      navigateTo(currentPage);
    }
    
    function renderPageNavigator() {
      removeAllChildNodes(pagesElm);
      totalPageElm.innerHTML = totalPage;
      [...Array(totalPage).keys()].map((f) => {
        let newItem = document.createElement("div");
        newItem.className = "page-item";
        newItem.onclick = handleNavigation;
        newItem.innerHTML = f + 1;
        pagesElm.appendChild(newItem);
      });
    }
    
    Tools.unreadMessagesCount = 0;
    Tools.newUnreadMessage = function () {
      Tools.unreadMessagesCount++;
      updateDocumentTitle();
    };
    
    window.addEventListener("focus", function () {
      Tools.unreadMessagesCount = 0;
      updateDocumentTitle();
    });
    
    function updateDocumentTitle() {
      document.title =
        (Tools.unreadMessagesCount ? "(" + Tools.unreadMessagesCount + ") " : "") +
        Tools.boardName +
        " | WBO";
    }
    
    (function () {
      // Scroll and hash handling
      var scrollTimeout,
        lastStateUpdate = Date.now();
    
      window.addEventListener("scroll", function onScroll() {
        // var scale = Tools.getScale();
        // var x = document.documentElement.scrollLeft / scale,
        //   y = document.documentElement.scrollTop / scale;
        // clearTimeout(scrollTimeout);
        // scrollTimeout = setTimeout(function updateHistory() {
        //   var hash =
        //     "#" + (x | 0) + "," + (y | 0) + "," + Tools.getScale().toFixed(1);
        //   if (
        //     Date.now() - lastStateUpdate > 5000 &&
        //     hash !== window.location.hash
        //   ) {
        //     window.history.pushState({}, "", hash);
        //     lastStateUpdate = Date.now();
        //   } else {
        //     window.history.replaceState({}, "", hash);
        //   }
        // }, 100);
      });
    
      function setScrollFromHash() {
        var coords = window.location.hash.slice(1).split(",");
        var x = coords[0] | 0;
        var y = coords[1] | 0;
        var scale = parseFloat(coords[2]);
        resizeCanvas({ x: x, y: y });
        Tools.setScale(scale);
        window.scrollTo(x * scale, y * scale);
      }
    
      window.addEventListener("hashchange", setScrollFromHash, false);
      window.addEventListener("popstate", setScrollFromHash, false);
      window.addEventListener("DOMContentLoaded", setScrollFromHash, false);
    })();
    
    function resizeCanvas(m) {
      //Enlarge the canvas whenever something is drawn near its border
      var x = m.x | 0,
        y = m.y | 0;
      var MAX_BOARD_SIZE = Tools.server_config.MAX_BOARD_SIZE || 65536; // Maximum value for any x or y on the board
      if (x > Tools.svg.width.baseVal.value - 2000) {
        Tools.svg.width.baseVal.value = 2000;
      }
      if (y > Tools.svg.height.baseVal.value - 2000) {
        Tools.svg.height.baseVal.value = 2000;
      }
    }
    
    function updateUnreadCount(m) {
      if (document.hidden && ["child", "update"].indexOf(m.type) === -1) {
        Tools.newUnreadMessage();
      }
    }
    
    // List of hook functions that will be applied to messages before sending or drawing them
    Tools.messageHooks = [resizeCanvas, updateUnreadCount];
    
    Tools.scale = Math.min(window.innerWidth, window.innerHeight) / 2000;
    var scaleTimeout = null;
    Tools.setScale = function setScale(scale) {
      var fullScale =
        Math.max(window.innerWidth, window.innerHeight) /
        Tools.server_config.MAX_BOARD_SIZE;
      var minScale = Math.min(window.innerWidth, window.innerHeight) / 2000;
      var maxScale = 10;
      if (isNaN(scale))
        scale = Math.min(window.innerWidth, window.innerHeight) / 2000;
      scale = Math.max(minScale, Math.min(maxScale, scale));
      Tools.svg.style.willChange = "transform";
      Tools.svg.style.transform = "scale(" + scale + ")";
      clearTimeout(scaleTimeout);
      scaleTimeout = setTimeout(function () {
        Tools.svg.style.willChange = "auto";
      }, 1000);
      Tools.scale = scale;
      return scale;
    };
    Tools.getScale = function getScale() {
      return Tools.scale;
    };
    
    //List of hook functions that will be applied to tools before adding them
    Tools.toolHooks = [
      function checkToolAttributes(tool) {
        if (typeof tool.name !== "string") throw "A tool must have a name";
        if (typeof tool.listeners !== "object") {
          tool.listeners = {};
        }
        if (typeof tool.onstart !== "function") {
          tool.onstart = function () {};
        }
        if (typeof tool.onquit !== "function") {
          tool.onquit = function () {};
        }
      },
      function compileListeners(tool) {
        //compile listeners into compiledListeners
        var listeners = tool.listeners;
    
        //A tool may provide precompiled listeners
        var compiled = tool.compiledListeners || {};
        tool.compiledListeners = compiled;
    
        function compile(listener) {
          //closure
          return function listen(evt) {
            
            var x =
                (evt.pageX -
                  document.getElementById("board").getBoundingClientRect().left -
                  window.scrollX) /
                Tools.getScale(),
              y =
                (evt.pageY -
                  document.getElementById("board").getBoundingClientRect().top -
                  window.scrollY) /
                Tools.getScale();
            // var x = (evt.pageX) / Tools.getScale(),
            // y = (evt.pageY) / Tools.getScale();
            return listener(x, y, evt, false);
          };
        }

        function compileTouch(listener) {
          //closure
          return function touchListen(evt) {
            //Currently, we don't handle multitouch
            if (evt.changedTouches.length === 1) {
              //evt.preventDefault();
              var touch = evt.changedTouches[0];
              var x = touch.pageX / Tools.getScale(),
                y = touch.pageY / Tools.getScale();
              return listener(x, y, evt, true);
            }
            return true;
          };
        }

        function wrapUnsetHover(f, toolName) {
          return function unsetHover(evt) {
            document.activeElement &&
              document.activeElement.blur &&
              document.activeElement.blur();
            return f(evt);
          };
        }

        if (listeners.press) {
          compiled["mousedown"] = wrapUnsetHover(
            compile(listeners.press),
            tool.name
          );
          compiled["touchstart"] = wrapUnsetHover(
            compileTouch(listeners.press),
            tool.name
          );
        }
        if (listeners.move) {
          compiled["mousemove"] = compile(listeners.move);
          compiled["touchmove"] = compileTouch(listeners.move);
        }
        if (listeners.release) {
          var release = compile(listeners.release),
            releaseTouch = compileTouch(listeners.release);
          compiled["mouseup"] = release;
          if (!Tools.isIE) compiled["mouseleave"] = release;
          compiled["touchleave"] = releaseTouch;
          compiled["touchend"] = releaseTouch;
          compiled["touchcancel"] = releaseTouch;
        }
      },
    ];

    Tools.applyHooks = function (hooks, object) {
      //Apply every hooks on the object
      hooks.forEach(function (hook) {
        hook(object);
      });
    };

    // Utility functions

    Tools.generateUID = function (prefix, suffix) {
      var uid = Date.now().toString(36); //Create the uids in chronological order
      uid += Math.round(Math.random() * 36).toString(36); //Add a random character at the end
      if (prefix) uid = prefix + uid;
      if (suffix) uid = uid + suffix;
      return uid;
    };

    Tools.createSVGElement = function createSVGElement(name, attrs) {
      var elem = document.createElementNS(Tools.svg.namespaceURI, name);
      if (typeof attrs !== "object") return elem;
      Object.keys(attrs).forEach(function (key, i) {
        elem.setAttributeNS(null, key, attrs[key]);
      });
      return elem;
    };

    Tools.positionElement = function (elem, x, y) {
      elem.style.top = y + "px";
      elem.style.left = x + "px";
    };

    Tools.colorPresets = [
      { color: "#212121", key: "2" },
      { color: "#b813fd", key: "6" },
      { color: "#ff005e", key: "3" },
      { color: "#007eff", key: "5" },
      { color: "#ffff00", key: "1" },
      { color: "#00c500", key: "4" },
    ];

    Tools.color_chooser = document.getElementById("chooseColor");

    Tools.setColor = function (color) {
      Tools.color_chooser.value = color;
    };

    Tools.getColor = (function color() {
      var color_index = (Math.random() * Tools.colorPresets.length) | 0;
      // var initial_color = Tools.colorPresets[color_index].color;
      var initial_color = Tools.colorPresets[0].color;
      Tools.setColor(initial_color);
      return function () {
        return Tools.color_chooser.value;
      };
    })();

    Tools.colorPresets.forEach(Tools.HTML.addColorButton.bind(Tools.HTML));

    Tools.sizeChangeHandlers = [];
    Tools.setSize = (function size() {
      var chooser = document.getElementById("chooseSize");

      function update() {
        var size = Math.max(1, Math.min(50, chooser.value | 0));
        chooser.value = size;
        Tools.sizeChangeHandlers.forEach(function (handler) {
          handler(size);
        });
      }
      update();

      chooser.onchange = chooser.oninput = update;
      return function (value) {
        if (value !== null && value !== undefined) {
          chooser.value = value;
          update();
        }
        return parseInt(chooser.value);
      };
    })();

    Tools.getSize = function () {
      return Tools.setSize();
    };

    Tools.getOpacity = (function opacity() {
      return 1;
      //   var chooser = document.getElementById("chooseOpacity");
      //   var opacityIndicator = document.getElementById("opacityIndicator");

      //   function update() {
      //     opacityIndicator.setAttribute("opacity", chooser.value);
      //   }
      //   update();

      //   chooser.onchange = chooser.oninput = update;
      //   return function () {
      //     return Math.max(0.1, Math.min(1, chooser.value));
      //   };
    })();

    //Scale the canvas on load
    Tools.svg.width.baseVal.value = document.body.clientWidth;
    Tools.svg.height.baseVal.value = document.body.clientHeight;

    let boardSize = 2000 * Tools.scale;
    Tools.board.style.width = `${boardSize}px`;
    Tools.board.style.height = `${boardSize}px`;
     

    //===================================================================

    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

    (function () {
      //Code isolation

      // Allocate the full maximum server update rate to pencil messages.
      // This feels a bit risky in terms of dropped messages, but any less
      // gives terrible results with the default parameters.  In practice it
      // seems to work, either because writing tends to happen in bursts, or
      // maybe because the messages are sent when the time interval is *greater*
      // than this?
      var MIN_PENCIL_INTERVAL_MS =
        Tools.server_config.MAX_EMIT_COUNT_PERIOD /
        Tools.server_config.MAX_EMIT_COUNT;

      var AUTO_FINGER_WHITEOUT = Tools.server_config.AUTO_FINGER_WHITEOUT;
      var hasUsedStylus = false;

      //Indicates the id of the line the user is currently drawing or an empty string while the user is not drawing
      var curLineId = "",
        lastTime = performance.now(); //The time at which the last point was drawn

      //The data of the message that will be sent for every new point
      function PointMessage(x, y) {
        this.type = "child";
        this.parent = curLineId;
        this.x = x;
        this.y = y;
      }

      function handleAutoWhiteOut(evt) {
        if (
          evt.touches &&
          evt.touches[0] &&
          evt.touches[0].touchType == "stylus"
        ) {
          //When using stylus, switch back to the primary
          if (hasUsedStylus && Tools.curTool.secondary.active) {
            Tools.change("Pencil");
          }
          //Remember if starting a line with a stylus
          hasUsedStylus = true;
        }
        if (
          evt.touches &&
          evt.touches[0] &&
          evt.touches[0].touchType == "direct"
        ) {
          //When used stylus and touched with a finger, switch to secondary
          if (hasUsedStylus && !Tools.curTool.secondary.active) {
            Tools.change("Pencil");
          }
        }
      }

      function startLine(x, y, evt) {
        //Prevent the press from being interpreted by the browser
        evt.preventDefault();

        if (AUTO_FINGER_WHITEOUT) handleAutoWhiteOut(evt);

        curLineId = Tools.generateUID("l"); //"l" for line

        Tools.drawAndSend({
          type: "line",
          id: curLineId,
          color: Tools.getColor(),
          size: Tools.getSize(),
          //   opacity: pencilTool.secondary.active ? 1 : Tools.getOpacity(),
          opacity: 1,
        });

        //Immediatly add a point to the line
        continueLine(x, y);
      }

      function continueLine(x, y, evt) {
        /*Wait 70ms before adding any point to the currently drawing line.
		This allows the animation to be smother*/
        if (
          curLineId !== "" &&
          performance.now() - lastTime > MIN_PENCIL_INTERVAL_MS
        ) {
          Tools.drawAndSend(new PointMessage(x, y));
          lastTime = performance.now();
        }
        if (evt) evt.preventDefault();
      }

      function stopLineAt(x, y) {
        //Add a last point to the line
        continueLine(x, y);
        stopLine();
      }

      function stopLine() {
        curLineId = "";
      }

      var renderingLine = {};
      function draw(data) {
        Tools.drawingEvent = true;
        switch (data.type) {
          case "line":
            renderingLine = createLine(data);
            break;
          case "child":
            var line =
              renderingLine.id === data.parent
                ? renderingLine
                : svg.getElementById(data.parent);
            if (!line) {
              console.error(
                "Pencil: Hmmm... I received a point of a line that has not been created (%s).",
                data.parent
              );
              line = renderingLine = createLine({ id: data.parent }); //create a new line in order not to loose the points
            }
            addPoint(line, data.x, data.y);
            break;
          case "endline":
            //TODO?
            break;
          default:
            console.error("Pencil: Draw instruction with unknown type. ", data);
            break;
        }
      }

      function getPathData(line) {
        //fixbug 
        var pathDataCache = {};
        var pathData = pathDataCache[line.id];
        if (!pathData) {
          pathData = line.getPathData();
          pathDataCache[line.id] = pathData;
        }
        return pathData;
      }

      var svg = Tools.svg;

      function addPoint(line, x, y) {
        var pts = getPathData(line);
        pts = wboPencilPoint(pts, x, y);
        line.setPathData(pts);
      }

      function createLine(lineData) {
        //Creates a new line on the canvas, or update a line that already exists with new information
        var line =
          svg.getElementById(lineData.id) || Tools.createSVGElement("path");
        line.id = lineData.id;
        //If some data is not provided, choose default value. The line may be updated later
        line.setAttribute("stroke", lineData.color || "black");
        line.setAttribute("stroke-width", lineData.size || 10);
        line.setAttribute(
          "opacity",
          Math.max(0.1, Math.min(1, lineData.opacity)) || 1
        );
        Tools.drawingArea.appendChild(line);
        return line;
      }

      //Remember drawing and white-out sizes separately
      var drawingSize = -1;
      var whiteOutSize = -1;

      function restoreDrawingSize() {
        whiteOutSize = Tools.getSize();
        if (drawingSize != -1) {
          Tools.setSize(drawingSize);
        }
      }

      function restoreWhiteOutSize() {
        drawingSize = Tools.getSize();
        if (whiteOutSize != -1) {
          Tools.setSize(whiteOutSize);
        }
      }

      //Restore remembered size after switch
      function toggleSize() {
        if (pencilTool.secondary.active) {
          restoreWhiteOutSize();
        } else {
          restoreDrawingSize();
        }
      }

      var pencilTool = {
        name: "Pencil",
        fname: "قلم",
        shortcut: "p",
        listeners: {
          press: startLine,
          move: continueLine,
          release: stopLineAt,
        },
        draw: draw,
        onstart: function (oldTool) {
          //Reset stylus
          hasUsedStylus = false;
        },
        // secondary: {
        //   name: "White-out",
        //   fname: "قلم سفید",
        //   icon: "tools/icons/whiteout_tape.svg",
        //   active: false,
        //   switch: function () {
        //     stopLine();
        //     toggleSize();
        //   },
        // },
        // onstart: function () {
        //   //When switching from another tool to white-out, restore white-out size
        //   if (pencilTool.secondary.active) {
        //     restoreWhiteOutSize();
        //   }
        // },
        // onquit: function () {
        //   //When switching from white-out to another tool, restore drawing size
        //   if (pencilTool.secondary.active) {
        //     restoreDrawingSize();
        //   }
        // },
        mouseCursor: "url('tools/pencil/cursor.svg'), crosshair",
        icon: "tools/icons/Brush tool.svg",
        stylesheet: "tools/pencil/pencil.css",
      };
      Tools.add(pencilTool);
    
      isAdmin && Tools.change("Pencil"); //Use the Pencil tool by default
    })(); //End of code isolation
    //===================================================
    /**
     *                CANVASCOLOR color picker
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013-2014  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

    /*jshint bitwise:false*/

    // ==ClosureCompiler==
    // @output_file_name canvascolor.js
    // @compilation_level ADVANCED_OPTIMIZATIONS
    // @js_externs var canvascolor;
    // @language ecmascript5_strict
    // @use_types_for_optimization true
    // ==/ClosureCompiler==

    var canvascolor = (function() {//Code Isolation
      "use strict";
  
      (function addCSS () {
          var styleTag = document.createElement("style");
          styleTag.innerHTML = [".canvascolor-container{",
              "background-color:black;",
              "border-radius:5px;",
              "overflow:hidden;",
              "width:179px;",
              "padding:2px;",
              "display:none;",
              "}",
              ".canvascolor-container canvas{",
              "cursor:crosshair;",
              "}",
              ".canvascolor-history{",
              "overflow:auto;",
              "}",
              ".canvascolor-history > div{",
              "margin:2px;",
              "display:inline-block;",
              "}"].join("");
          document.head.appendChild(styleTag);
      })();
  
      function hsv2rgb (h,s,v) {
          if( s === 0 ) return [v,v,v]; // achromatic (grey)
  
          h /= (Math.PI/6);			// sector 0 to 5
          var i = h|0,
              f = h - i,			// factorial part of h
              p = v * ( 1 - s ),
              q = v * ( 1 - s * f ),
              t = v * ( 1 - s * ( 1 - f ) );
          switch( i%6 ) {
              case 0: return [v,t,p];
              case 1: return [q,v,p];
              case 2: return [p,v,t];
              case 3: return [p,q,v];
              case 4: return [t,p,v];
              case 5:return [v,p,q];
          }
      }
  
      function isFixedPosition(elem) {
          do {
              if (getComputedStyle(elem).position === "fixed") return true;
          } while ( (elem = elem.parentElement) !== null );
          return false;
      }
  
      var containerTemplate;
      (function createContainer(){
          containerTemplate = document.createElement("div");
          containerTemplate.className = "canvascolor-container";
          var canvas = document.createElement("canvas");
          var historyDiv = document.createElement("div");
          historyDiv.className = "canvascolor-history";
          containerTemplate.appendChild(canvas);
          containerTemplate.appendChild(historyDiv);
      })();
  
      function canvascolor(elem) {
          var curcolor = elem.value || "#000";
  
          var w=200, h=w/2;
  
          var container = containerTemplate.cloneNode(true);
          container.style.width = w+"px";
          container.style.position = isFixedPosition(elem) ? "fixed" : "absolute";
          var canvas = container.getElementsByTagName("canvas")[0];
          var ctx = canvas.getContext("2d");
          canvas.width = w; canvas.height=h;
  
          var prevcolorsDiv = container.getElementsByClassName("canvascolor-history")[0];
          prevcolorsDiv.style.width=w+"px";
          prevcolorsDiv.style.maxHeight=h+"px";
  
          var previewdiv = createColorDiv(curcolor);
          previewdiv.style.border = "1px solid white";
          previewdiv.style.borderRadius = "5px";
  
          document.body.appendChild(container);
  
          function displayContainer(){
              var rect = elem.getBoundingClientRect();
              var conttop=(rect.top+rect.height+3),
                  contleft=rect.left;
              if (container.style.position !== "fixed") {
                  conttop += document.documentElement.scrollTop;
                  contleft += document.documentElement.scrollLeft;
              }
              container.style.top = conttop+"px";
              container.style.left = contleft+"px";
              container.style.display = "block";
          }
          function hideContainer(){
              container.style.display = "none";
          }
  
          elem.addEventListener("mouseover", displayContainer, true);
          container.addEventListener("mouseleave", hideContainer, false);
          elem.addEventListener("keyup", function(){
              changeColor(elem.value, true);
          }, true);
  
          changeColor(elem.value, true);
  
          var idata = ctx.createImageData(w,h);
  
          function rgb2hex (rgb) {
              function num2hex (c) {return (c*15/255|0).toString(16);}
              return "#"+num2hex(rgb[0])+num2hex(rgb[1])+num2hex(rgb[2]);
          }
  
          function colorAt(coords) {
              var x=coords[0], y=coords[1];
              return hsv2rgb(x/w*Math.PI, 1, (1-y/h)*255);
          }
  
          function render() {
              for (var x=0; x<w; x++) {
                  for (var y=0;y<h; y++) {
                      var i = 4*(x+y*w);
                      var rgb = colorAt([x,y]);
                      idata.data[i] = rgb[0];//Red
                      idata.data[i+1] = rgb[1];//Green
                      idata.data[i+2] = rgb[2];//Blue
                      idata.data[i+3] = 255;
                  }
              }
              ctx.putImageData(idata,0,0);
          }
  
          render();
  
  
          /** Changes the current color (the value of the input field) and updates other variables accordingly
           * @param {string} color The new color. Must be a valid CSS color string if ensureValid is not specified
           * @param {boolean} [ensureValid=false] Do not make the change if color is not a valid CSS color
           */
          function changeColor(color, ensureValid) {
              elem.style.backgroundColor = color;
              if (ensureValid && elem.style.backgroundColor.length === 0) {
                  elem.style.backgroundColor = curcolor;
                  return;
              }
              previewdiv.style.backgroundColor = color;
              curcolor = color;
              elem.value = color;
              elem.focus();
          }
  
          function createColorDiv (color) {
              var div = document.createElement("div");
              div.style.width = (w/3-10)+"px";
              div.style.height = (h/3-8)+"px";
              div.style.backgroundColor = color;
              div.addEventListener("click", function(){
                  changeColor(color);
              }, true);
              if (prevcolorsDiv.childElementCount <= 1) prevcolorsDiv.appendChild(div);
              else prevcolorsDiv.insertBefore(div,prevcolorsDiv.children[1]);
              return div;
          }
  
          function canvasPos(evt) {
              var canvasrect = canvas.getBoundingClientRect();
              return [evt.clientX - canvasrect.left, evt.clientY - canvasrect.top];
          }
  
          canvas.addEventListener("mousemove", function(evt){
              var coords = canvasPos(evt);
              previewdiv.style.backgroundColor = rgb2hex(colorAt(coords));
          }, true);
  
          canvas.addEventListener("click", function(evt){
              var coords = canvasPos(evt);
              var color = rgb2hex(colorAt(coords));
              createColorDiv(color);
              changeColor(color);
          }, true);
  
          canvas.addEventListener("mouseleave", function(){
              previewdiv.style.backgroundColor = curcolor;
          }, true);
      }
  
  
      //Put a color picker on every input[type=color] if the browser doesn't support this input type
      //and on every input with the class canvascolor
      var pickers = document.querySelectorAll("input.canvascolor, input[type=color]");
      for (var i=0;i <pickers.length; i++) {
          var input = pickers.item(i);
          //If the browser supports native color picker and the user didn't
          //explicitly added canvascolor to the element, we do not add a custom color picker
          if (input.type !== "color" ||
              input.className.split(" ").indexOf("canvascolor") !== -1) {
              canvascolor(input);
          }
      }
  
      return canvascolor;
  }());
    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2020  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

    (function () {
      // Code isolation

      // Allocate half of the maximum server updates to cursor updates
        var MIN_CURSOR_UPDATES_INTERVAL_MS = Tools.server_config.MAX_EMIT_COUNT_PERIOD / Tools.server_config.MAX_EMIT_COUNT * 2;
    
        var CURSOR_DELETE_AFTER_MS = 1000 * 5;
    
        var lastCursorUpdate = 0;
        var sending = true;
    
        var cursorTool = {
            "name": "Cursor",
            "listeners": {
                "press": function () { sending = false },
                "move": handleMarker,
                "release": function () { sending = true },
            },
            "onSizeChange": onSizeChange,
            "draw": draw,
            "mouseCursor": "crosshair",
            "icon": "tools/pencil/icon.svg",
        };
        Tools.register(cursorTool);
        Tools.addToolListeners(cursorTool);
    
        var message = {
            type: "update",
            x: 0,
            y: 0,
            color: Tools.getColor(),
            size: Tools.getSize(),
        };
    
        function handleMarker(x, y) {
            // throttle local cursor updates
            message.x = x;
            message.y = y;
            message.color = Tools.getColor();
            message.size = Tools.getSize();
            updateMarker();
        }
    
        function onSizeChange(size) {
            message.size = size;
            updateMarker();
        }
    
        function updateMarker() {
            if (!Tools.showMarker || !Tools.showMyCursor) return;
            var cur_time = Date.now();
            if (cur_time - lastCursorUpdate > MIN_CURSOR_UPDATES_INTERVAL_MS &&
                (sending || Tools.curTool.showMarker)) {
                Tools.drawAndSend(message, cursorTool);
                lastCursorUpdate = cur_time;
            } else {
                draw(message);
            }
        }
    
        var cursorsElem = Tools.svg.getElementById("cursors");
    
        function createCursor(id) {
            var cursor = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            cursor.setAttributeNS(null, "class", "opcursor");
            cursor.setAttributeNS(null, "id", id);
            cursor.setAttributeNS(null, "cx", 0);
            cursor.setAttributeNS(null, "cy", 0);
            cursor.setAttributeNS(null, "r", 10);
            cursorsElem.appendChild(cursor);
            setTimeout(function () {
                cursorsElem.removeChild(cursor);
            }, CURSOR_DELETE_AFTER_MS);
            return cursor;
        }
    
        function getCursor(id) {
            return document.getElementById(id) || createCursor(id);
        }
    
        function draw(message) {
            var cursor = getCursor("cursor-" + (message.socket || 'me'));
            cursor.style.transform = "translate(" + message.x + "px, " + message.y + "px)";
            if (Tools.isIE) cursor.setAttributeNS(null, "transform", "translate(" + message.x + " " + message.y + ")");
            cursor.setAttributeNS(null, "fill", message.color);
            cursor.setAttributeNS(null, "r", message.size / 2);
        }
  })();

    //==========================================================
    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function () { //Code isolation
      //Indicates the id of the line the user is currently drawing or an empty string while the user is not drawing
      var curLine = null,
        lastTime = performance.now(); //The time at which the last point was drawn
    
      //The data of the message that will be sent for every update
      function UpdateMessage(x, y) {
        this.type = 'update';
        this.id = curLine.id;
        this.x2 = x;
        this.y2 = y;
      }
    
      function startLine(x, y, evt) {
    
        //Prevent the press from being interpreted by the browser
        evt.preventDefault();
    
        curLine = {
          'type': 'straight',
          'id': Tools.generateUID("s"), //"s" for straight line
          'color': Tools.getColor(),
          'size': Tools.getSize(),
          // 'opacity': Tools.getOpacity(),
          'opacity': 1,
          'x': x,
          'y': y
        }
    
        Tools.drawAndSend(curLine);
      }
    
      function continueLine(x, y, evt) {
        /*Wait 70ms before adding any point to the currently drawing line.
        This allows the animation to be smother*/
        if (curLine !== null) {
          if (lineTool.secondary.active) {
            var alpha = Math.atan2(y - curLine.y, x - curLine.x);
            var d = Math.hypot(y - curLine.y, x - curLine.x);
            var increment = 2 * Math.PI / 16;
            alpha = Math.round(alpha / increment) * increment;
            x = curLine.x + d * Math.cos(alpha);
            y = curLine.y + d * Math.sin(alpha);
          }
          if (performance.now() - lastTime > 70) {
            Tools.drawAndSend(new UpdateMessage(x, y));
            lastTime = performance.now();
          } else {
            draw(new UpdateMessage(x, y));
          }
        }
        if (evt) evt.preventDefault();
      }
    
      function stopLine(x, y) {
        //Add a last point to the line
        continueLine(x, y);
        curLine = null;
      }
    
      function draw(data) {
        switch (data.type) {
          case "straight":
            createLine(data);
            break;
          case "update":
            var line = svg.getElementById(data['id']);
            if (!line) {
              console.error("Straight line: Hmmm... I received a point of a line that has not been created (%s).", data['id']);
              createLine({ //create a new line in order not to loose the points
                "id": data['id'],
                "x": data['x2'],
                "y": data['y2']
              });
            }
            updateLine(line, data);
            break;
          default:
            console.error("Straight Line: Draw instruction with unknown type. ", data);
            break;
        }
      }
    
      var svg = Tools.svg;
      function createLine(lineData) {
        //Creates a new line on the canvas, or update a line that already exists with new information
        var line = svg.getElementById(lineData.id) || Tools.createSVGElement("line");
        line.id = lineData.id;
        line.x1.baseVal.value = lineData['x'];
        line.y1.baseVal.value = lineData['y'];
        line.x2.baseVal.value = lineData['x2'] || lineData['x'];
        line.y2.baseVal.value = lineData['y2'] || lineData['y'];
        //If some data is not provided, choose default value. The line may be updated later
        line.setAttribute("stroke", lineData.color || "black");
        line.setAttribute("stroke-width", lineData.size || 10);
        line.setAttribute("opacity", Math.max(0.1, Math.min(1, lineData.opacity)) || 1);
        Tools.drawingArea.appendChild(line);
        return line;
      }
    
      function updateLine(line, data) {
        line.x2.baseVal.value = data['x2'];
        line.y2.baseVal.value = data['y2'];
      }
    
      var lineTool = {
        "name": "Straight line",
        "fname": "خط",
        "shortcut": "l",
        "listeners": {
          "press": startLine,
          "move": continueLine,
          "release": stopLine,
        },
        "secondary": {
          "name": "Straight line",
          "fname": "خط صاف",
          "icon": "tools/line/icon-straight.svg",
          "active": false,
        },
        "draw": draw,
        "mouseCursor": "crosshair",
        "icon": "tools/line/icon.svg",
        "stylesheet": "tools/line/line.css"
      };
      Tools.add(lineTool);
    })(); //End of code isolation
    //==========================================================

    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function () { //Code isolation
      //Indicates the id of the shape the user is currently drawing or an empty string while the user is not drawing
      var end = false,
        curId = "",
        curUpdate = { //The data of the message that will be sent for every new point
          'type': 'update',
          'id': "",
          'x': 0,
          'y': 0,
          'x2': 0,
          'y2': 0
        },
        lastTime = performance.now(); //The time at which the last point was drawn
    
      function start(x, y, evt) {
    
        //Prevent the press from being interpreted by the browser
        evt.preventDefault();
    
        curId = Tools.generateUID("r"); //"r" for rectangle
    
        Tools.drawAndSend({
          'type': 'rect',
          'id': curId,
          'color': Tools.getColor(),
          'size': Tools.getSize(),
          // 'opacity': Tools.getOpacity(),
          'opacity': 1,
          'x': x,
          'y': y,
          'x2': x,
          'y2': y
        });
    
        curUpdate.id = curId;
        curUpdate.x = x;
        curUpdate.y = y;
      }
    
      function move(x, y, evt) {
        /*Wait 70ms before adding any point to the currently drawing shape.
        This allows the animation to be smother*/
        if (curId !== "") {
          if (rectangleTool.secondary.active) {
            var dx = x - curUpdate.x;
            var dy = y - curUpdate.y;
            var d = Math.max(Math.abs(dx), Math.abs(dy));
            x = curUpdate.x + (dx > 0 ? d : -d);
            y = curUpdate.y + (dy > 0 ? d : -d);
          }
          curUpdate['x2'] = x; curUpdate['y2'] = y;
          if (performance.now() - lastTime > 70 || end) {
            Tools.drawAndSend(curUpdate);
            lastTime = performance.now();
          } else {
            draw(curUpdate);
          }
        }
        if (evt) evt.preventDefault();
      }
    
      function stop(x, y) {
        //Add a last point to the shape
        end = true;
        move(x, y);
        end = false;
        curId = "";
      }
    
      function draw(data) {
        Tools.drawingEvent = true;
        switch (data.type) {
          case "rect":
            createShape(data);
            break;
          case "update":
            var shape = svg.getElementById(data['id']);
            if (!shape) {
              console.error("Straight shape: Hmmm... I received a point of a rect that has not been created (%s).", data['id']);
              createShape({ //create a new shape in order not to loose the points
                "id": data['id'],
                "x": data['x2'],
                "y": data['y2']
              });
            }
            updateShape(shape, data);
            break;
          default:
            console.error("Straight shape: Draw instruction with unknown type. ", data);
            break;
        }
      }
    
      var svg = Tools.svg;
      function createShape(data) {
        //Creates a new shape on the canvas, or update a shape that already exists with new information
        var shape = svg.getElementById(data.id) || Tools.createSVGElement("rect");
        shape.id = data.id;
        updateShape(shape, data);
        //If some data is not provided, choose default value. The shape may be updated later
        shape.setAttribute("stroke", data.color || "black");
        shape.setAttribute("stroke-width", data.size || 10);
        shape.setAttribute("opacity", Math.max(0.1, Math.min(1, data.opacity)) || 1);
        Tools.drawingArea.appendChild(shape);
        return shape;
      }
    
      function updateShape(shape, data) {
        shape.x.baseVal.value = Math.min(data['x2'], data['x']);
        shape.y.baseVal.value = Math.min(data['y2'], data['y']);
        shape.width.baseVal.value = Math.abs(data['x2'] - data['x']);
        shape.height.baseVal.value = Math.abs(data['y2'] - data['y']);
      }
    
      var rectangleTool = {
        "name": "Rectangle",
        "fname": "مستطیل",
        "shortcut": "r",
        "listeners": {
          "press": start,
          "move": move,
          "release": stop,
        },
        "secondary": {
          "name": "Square",
          "fname": "مربع",
          "icon": "tools/rect/Rectangle.svg",
          "active": false,
        },
        "draw": draw,
        "mouseCursor": "crosshair",
        "icon": "tools/icons/Shape tool - Rectangle.svg",
        "stylesheet": "tools/rect/rect.css"
      };
      Tools.add(rectangleTool);
    
    })(); //End of code isolation
    
    //==========================================================


    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2020  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function () { //Code isolation
      var curUpdate = { //The data of the message that will be sent for every new point
          'type': 'update',
          'id': "",
          'x': 0,
          'y': 0,
          'x2': 0,
          'y2': 0
      },
          lastPos = { x: 0, y: 0 },
          lastTime = performance.now(); //The time at which the last point was drawn
  
      function start(x, y, evt) {
  
          //Prevent the press from being interpreted by the browser
          evt.preventDefault();
  
          curUpdate.id = Tools.generateUID("e"); //"e" for ellipse
  
          Tools.drawAndSend({
              'type': 'ellipse',
              'id': curUpdate.id,
              'color': Tools.getColor(),
              'size': Tools.getSize(),
        // 'opacity': Tools.getOpacity(),
        'opacity': 1,
              'x': x,
              'y': y,
              'x2': x,
              'y2': y
          });
  
          curUpdate.id = curUpdate.id;
          curUpdate.x = x;
          curUpdate.y = y;
      }
  
      function move(x, y, evt) {
          if (!curUpdate.id) return; // Not currently drawing
          if (evt) {
              circleTool.secondary.active = circleTool.secondary.active || evt.shiftKey;
              evt.preventDefault(); 
          }
          lastPos.x = x;
          lastPos.y = y;
          doUpdate();
      }
  
      function doUpdate(force) {
          if (!curUpdate.id) return; // Not currently drawing
          if (drawingCircle()) {
              var x0 = curUpdate['x'], y0 = curUpdate['y'];
              var deltaX = lastPos.x - x0, deltaY = lastPos.y - y0;
              var diameter = Math.max(Math.abs(deltaX), Math.abs(deltaY));
              curUpdate['x2'] = x0 + (deltaX > 0 ? diameter : -diameter);
              curUpdate['y2'] = y0 + (deltaY > 0 ? diameter : -diameter);
          } else {
              curUpdate['x2'] = lastPos.x;
              curUpdate['y2'] = lastPos.y;
          }
  
          if (performance.now() - lastTime > 70 || force) {
              Tools.drawAndSend(curUpdate);
              lastTime = performance.now();
          } else {
              draw(curUpdate);
          }
      }
  
      function stop(x, y) {
          lastPos.x = x;
          lastPos.y = y;
          doUpdate(true);
          curUpdate.id = "";
      }
  
      function draw(data) {
          Tools.drawingEvent = true;
          switch (data.type) {
              case "ellipse":
                  createShape(data);
                  break;
              case "update":
                  var shape = svg.getElementById(data['id']);
                  if (!shape) {
                      console.error("Ellipse: Hmmm... I received an update for a shape that has not been created (%s).", data['id']);
                      createShape({ //create a new shape in order not to loose the points
                          "id": data['id'],
                          "x": data['x2'],
                          "y": data['y2']
                      });
                  }
                  updateShape(shape, data);
                  break;
              default:
                  console.error("Ellipse: Draw instruction with unknown type. ", data);
                  break;
          }
      }
  
      var svg = Tools.svg;
      function createShape(data) {
        //Creates a new shape on the canvas, or update a shape that already exists with new information
        var shape = svg.getElementById(data.id) || Tools.createSVGElement("ellipse");
        updateShape(shape, data);
        shape.id = data.id;
        //If some data is not provided, choose default value. The shape may be updated later
        shape.setAttribute("stroke", data.color || "black");
        shape.setAttribute("stroke-width", data.size || 10);
        shape.setAttribute("opacity", Math.max(0.1, Math.min(1, data.opacity)) || 1);
        Tools.drawingArea.appendChild(shape);
        return shape;
      }
  
      function updateShape(shape, data) {
        shape.cx.baseVal.value = Math.round((data['x2'] + data['x']) / 2);
        shape.cy.baseVal.value = Math.round((data['y2'] + data['y']) / 2);
        shape.rx.baseVal.value = Math.abs(data['x2'] - data['x']) / 2;
        shape.ry.baseVal.value = Math.abs(data['y2'] - data['y']) / 2;
      }
  
      function drawingCircle() {
          return circleTool.secondary.active;
      }
  
      var circleTool = { //The new tool
        "name": "Ellipse",
        "fname":"بیضی",
        "icon": "tools/ellipse/Ellipse.svg",
        "secondary": {
            "name": "Circle",
            "fname": "دایره",
            "icon": "tools/icons/Shape tool - Cirlcle.svg",
            "active": false,
            "switch": doUpdate,
        },
        "shortcut": "c",
        "listeners": {
            "press": start,
            "move": move,
            "release": stop,
        },
        "draw": draw,
        "mouseCursor": "crosshair",
        "stylesheet": "tools/ellipse/ellipse.css"
      };
      Tools.add(circleTool);
  
    })(); //End of code isolation
  
    //==============================================

    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function () { //Code isolation
      var board = Tools.board;
    
      var input = document.createElement("input");
      input.id = "textToolInput";
      input.type = "text";
      input.setAttribute("autocomplete", "off");
    
      var curText = {
        "x": 0,
        "y": 0,
        "size": 36,
        "rawSize": 16,
        "oldSize": 0,
        "opacity": 1,
        "color": "#000",
        "id": 0,
        "sentText": "",
        "lastSending": 0
      };
    
      var active = false;
    
    
      function onStart() {
        curText.oldSize = Tools.getSize();
        Tools.setSize(curText.rawSize);
      }
    
      function onQuit() {
        stopEdit();
        Tools.setSize(curText.oldSize);
      }
    
      function clickHandler(x, y, evt, isTouchEvent) {
        //if(document.querySelector("#menu").offsetWidth>Tools.menu_width+3) return;
        if (evt.target === input) return;
        if (evt.target.tagName === "text") {
          editOldText(evt.target);
          evt.preventDefault();
          return;
        }
        curText.rawSize = Tools.getSize();
        curText.size = parseInt(curText.rawSize * 1.5 + 12);
        // curText.opacity = Tools.getOpacity();
        curText.opacity = 1;
        curText.color = Tools.getColor();
        curText.x = x;
        curText.y = y + curText.size / 2;
    
        stopEdit();
        startEdit();
        evt.preventDefault();
      }
    
      function editOldText(elem) {
        curText.id = elem.id;
        var r = elem.getBoundingClientRect();
        var x = (r.left + document.documentElement.scrollLeft) / Tools.scale;
        var y = (r.top + r.height + document.documentElement.scrollTop) / Tools.scale;
    
        curText.x = x;
        curText.y = y;
        curText.sentText = elem.textContent;
        curText.size = parseInt(elem.getAttribute("font-size"));
        curText.opacity = parseFloat(elem.getAttribute("opacity"));
        curText.color = elem.getAttribute("fill");
        startEdit();
        input.value = elem.textContent;
      }
    
      function startEdit() {
        active = true;
        if (!input.parentNode) board.appendChild(input);
        input.value = "";
        var left = curText.x - document.documentElement.scrollLeft + 'px';
        var clientW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var x = curText.x * Tools.scale - document.documentElement.scrollLeft;
        if (x + 250 > clientW) {
          x = Math.max(60, clientW - 260)
        }
    
        input.style.left = x + 'px';
        input.style.top = curText.y * Tools.scale - document.documentElement.scrollTop + 20 + 'px';
        input.focus();
        input.addEventListener("keyup", textChangeHandler);
        input.addEventListener("blur", textChangeHandler);
        input.addEventListener("blur", blur);
      }
    
      function stopEdit() {
        try { input.blur(); } catch (e) { /* Internet Explorer */ }
        active = false;
        blur();
        curText.id = 0;
        curText.sentText = "";
        input.value = "";
        input.removeEventListener("keyup", textChangeHandler);
      }
    
      function blur() {
        if (active) return;
        input.style.top = '-1000px';
      }
    
      function textChangeHandler(evt) {
        if (evt.which === 13) { // enter
          curText.y += 1.5 * curText.size;
          stopEdit();
          startEdit();
        } else if (evt.which === 27) { // escape
          stopEdit();
        }
        if (performance.now() - curText.lastSending > 100) {
          if (curText.sentText !== input.value) {
            //If the user clicked where there was no text, then create a new text field
            if (curText.id === 0) {
              curText.id = Tools.generateUID("t"); //"t" for text
              Tools.drawAndSend({
                'type': 'new',
                'id': curText.id,
                'color': curText.color,
                'size': curText.size,
                'opacity': curText.opacity,
                'x': curText.x,
                'y': curText.y
              })
            }
            Tools.drawAndSend({
              'type': "update",
              'id': curText.id,
              'txt': input.value.slice(0, 280)
            });
            curText.sentText = input.value;
            curText.lastSending = performance.now();
          }
        } else {
          clearTimeout(curText.timeout);
          curText.timeout = setTimeout(textChangeHandler, 500, evt);
        }
      }
    
      function draw(data, isLocal) {
        Tools.drawingEvent = true;
        switch (data.type) {
          case "new":
            createTextField(data);
            break;
          case "update":
            var textField = document.getElementById(data.id);
            if (textField === null) {
              console.error("Text: Hmmm... I received text that belongs to an unknown text field");
              return false;
            }
            updateText(textField, data.txt);
            break;
          default:
            console.error("Text: Draw instruction with unknown type. ", data);
            break;
        }
      }
    
      function updateText(textField, text) {
        textField.textContent = text;
      }
    
      function createTextField(fieldData) {
        var elem = Tools.createSVGElement("text");
        elem.id = fieldData.id;
        elem.setAttribute("x", fieldData.x);
        elem.setAttribute("y", fieldData.y);
        elem.setAttribute("font-size", fieldData.size);
        elem.setAttribute("fill", fieldData.color);
        elem.setAttribute("opacity", Math.max(0.1, Math.min(1, fieldData.opacity)) || 1);
        if (fieldData.txt) elem.textContent = fieldData.txt;
        Tools.drawingArea.appendChild(elem);
        return elem;
      }
    
      Tools.add({ //The new tool
        "name": "Text",
        "fname": "متن",
        "shortcut": "t",
        "listeners": {
          "press": clickHandler,
        },
        "onstart": onStart,
        "onquit": onQuit,
        "draw": draw,
        "stylesheet": "tools/text/text.css",
        "icon": "tools/icons/Text box.svg",
        "mouseCursor": "text"
      });
    
    })(); //End of code isolation
    

    //==========================================================
    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function eraser() { //Code isolation

      var erasing = false;
    
      function startErasing(x, y, evt) {
        //Prevent the press from being interpreted by the browser
        evt.preventDefault();
        erasing = true;
        erase(x, y, evt);
      }
    
      var msg = {
        "type": "delete",
        "id": ""
      };
    
      function inDrawingArea(elem) {
        return Tools.drawingArea.contains(elem);
      }
    
      function erase(x, y, evt) {
        // evt.target should be the element over which the mouse is...
        var target = evt.target;
        if (evt.type === "touchmove") {
          // ... the target of touchmove events is the element that was initially touched,
          // not the one **currently** being touched
          var touch = evt.touches[0];
          target = document.elementFromPoint(touch.clientX, touch.clientY);
        }
        if (erasing && target !== Tools.svg && target !== Tools.drawingArea && inDrawingArea(target)) {
          msg.id = target.id;
          Tools.drawAndSend(msg);
        }
      }
    
      function stopErasing() {
        erasing = false;
      }
    
      function draw(data) {
        var elem;
        switch (data.type) {
          //TODO: add the ability to erase only some points in a line
          case "delete":
            elem = svg.getElementById(data.id);
            if (elem.tagName === "image") return; // Prevent images from deleting (added later)
            if (elem === null) console.error("Eraser: Tried to delete an element that does not exist.");
            else Tools.drawingArea.removeChild(elem);
            break;
          default:
            console.error("Eraser: 'delete' instruction with unknown type. ", data);
            break;
        }
      }
    
      var svg = Tools.svg;
    
      Tools.add({ //The new tool
        "name": "Eraser",
        "fname": "پاک کن",
        "shortcut": "e",
        "listeners": {
          "press": startErasing,
          "move": erase,
          "release": stopErasing,
        },
        "draw": draw,
        "icon": "tools/icons/Earaser.svg",
        "mouseCursor": "crosshair",
        "showMarker": true,
      });
    
    })(); //End of code isolation
    

    //=================================================================
    /**
     *						  WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *	JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function hand() { //Code isolation
      var selected = null;
      var last_sent = 0;
    
    
      function startMovingElement(x, y, evt) {
        //Prevent the press from being interpreted by the browser
        evt.preventDefault();
        if (!evt.target || !Tools.drawingArea.contains(evt.target)) return;
        var tmatrix = get_translate_matrix(evt.target);
        selected = { x: x - tmatrix.e, y: y - tmatrix.f, elem: evt.target };
      }
    
      function moveElement(x, y) {
        if (!selected) return;
        var deltax = x - selected.x;
        var deltay = y - selected.y;
        var msg = { type: "update", id: selected.elem.id, deltax: deltax, deltay: deltay };
        var now = performance.now();
        if (now - last_sent > 70) {
          last_sent = now;
          Tools.drawAndSend(msg);
        } else {
          draw(msg);
        }
      }
    
      function get_translate_matrix(elem) {
        // Returns the first translate or transform matrix or makes one
        var translate = null;
        for (var i = 0; i < elem.transform.baseVal.numberOfItems; ++i) {
          var baseVal = elem.transform.baseVal[i];
          // quick tests showed that even if one changes only the fields e and f or uses createSVGTransformFromMatrix
          // the brower may add a SVG_TRANSFORM_MATRIX instead of a SVG_TRANSFORM_TRANSLATE
          if (baseVal.type === SVGTransform.SVG_TRANSFORM_TRANSLATE || baseVal.type === SVGTransform.SVG_TRANSFORM_MATRIX) {
            translate = baseVal;
            break;
          }
        }
        if (translate == null) {
          translate = elem.transform.baseVal.createSVGTransformFromMatrix(Tools.svg.createSVGMatrix());
          elem.transform.baseVal.appendItem(translate);
        }
        return translate.matrix;
      }
    
      function draw(data) {
        switch (data.type) {
          case "update":
            var elem = Tools.svg.getElementById(data.id);
            if (!elem) throw new Error("Mover: Tried to move an element that does not exist.");
            var tmatrix = get_translate_matrix(elem);
            tmatrix.e = data.deltax || 0;
            tmatrix.f = data.deltay || 0;
            break;
    
          default:
            throw new Error("Mover: 'move' instruction with unknown type. ", data);
        }
      }
    
      function startHand(x, y, evt, isTouchEvent) {
        if (!isTouchEvent) {
          selected = {
            x: document.documentElement.scrollLeft + evt.clientX,
            y: document.documentElement.scrollTop + evt.clientY,
          }
        }
      }
      function moveHand(x, y, evt, isTouchEvent) {
        if (selected && !isTouchEvent) { //Let the browser handle touch to scroll
          window.scrollTo(selected.x - evt.clientX, selected.y - evt.clientY);
        }
      }
    
      function press(x, y, evt, isTouchEvent) {
        if (!handTool?.secondary?.active) startHand(x, y, evt, isTouchEvent);
        else startMovingElement(x, y, evt, isTouchEvent);
      }
    
    
      function move(x, y, evt, isTouchEvent) {
        if (!handTool?.secondary?.active) moveHand(x, y, evt, isTouchEvent);
        else moveElement(x, y, evt, isTouchEvent);
      }
    
      function release(x, y, evt, isTouchEvent) {
        move(x, y, evt, isTouchEvent);
        selected = null;
      }
    
      function switchTool() {
        selected = null;
      }
    
      var handTool = { //The new tool
        "name": "Hand",
        "fname": "پیمایش",
        "shortcut": "h",
        "listeners": {
          "press": press,
          "move": move,
          "release": release,
        },
        "draw": draw,
        "icon": "tools/hand/Hand icon.svg",
        "mouseCursor": "move",
        "showMarker": true,
      };
      isAdmin &&
        (handTool["secondary"] = {
          name: "Mover",
          fname: "انتقال",
          icon: "tools/icons/Move tool.svg",
          active: false,
          switch: switchTool,
        });
      Tools.add(handTool);
      !isAdmin && Tools.change("Hand"); //Use the Pencil tool by default
    })(); //End of code isolation
    
    //===================================================
    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2020  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-source (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function grid() { //Code isolation

      var index = 0; //grid off by default
      var states = ["none", "url(#grid)", "url(#dots)"];
  
      function toggleGrid(evt) {
          index = (index + 1) % states.length;
          gridContainer.setAttributeNS(null, "fill", states[index]);
      }
  
      function createPatterns() {
          // create patterns
          // small (inner) grid
          var smallGrid = Tools.createSVGElement("pattern", {
              id: "smallGrid",
              width: "30",
              height: "30",
              patternUnits: "userSpaceOnUse"
          });
          smallGrid.appendChild(
              Tools.createSVGElement("path", {
                  d: "M 30 0 L 0 0 0 30",
                  fill: "none",
                  stroke: "gray",
                  'stroke-width': "0.5"
              })
          );
          // (outer) grid
          var grid = Tools.createSVGElement("pattern", {
              id: "grid",
              width: "300",
              height: "300",
              patternUnits: "userSpaceOnUse"
          });
          grid.appendChild(Tools.createSVGElement("rect", {
              width: "300",
              height: "300",
              fill: "url(#smallGrid)"
          }));
          grid.appendChild(
              Tools.createSVGElement("path", {
                  d: "M 300 0 L 0 0 0 300",
                  fill: "none",
                  stroke: "gray", 'stroke-width': "1"
              })
          );
          // dots
          var dots = Tools.createSVGElement("pattern", {
              id: "dots",
              width: "30",
              height: "30",
              x: "-10",
              y: "-10",
              patternUnits: "userSpaceOnUse"
          });
          dots.appendChild(Tools.createSVGElement("circle", {
              fill: "gray",
              cx: "10",
              cy: "10",
              r: "2"
          }));
  
          var defs = Tools.svg.getElementById("defs");
          defs.appendChild(smallGrid);
          defs.appendChild(grid);
          defs.appendChild(dots);
      }
  
      var gridContainer = (function init() {
          // initialize patterns
          createPatterns();
          // create grid container
          var gridContainer = Tools.createSVGElement("rect", {
              id: "gridContainer",
              width: "100%", height: "100%",
              fill: states[index]
          });
          Tools.svg.insertBefore(gridContainer, Tools.drawingArea);
          return gridContainer;
      })();
  
      Tools.add({ //The new tool
          "name": "Grid",
          "fname": "صفحه شطرنجی",
          "shortcut": "g",
          "listeners": {},
          "icon": "tools/icons/Grid View.svg",
          "oneTouch": true,
          "onstart": toggleGrid,
          "mouseCursor": "crosshair",
      });
  
  })(); //End of code isolation
    //=====================================================
    /**
     *                        WHITEBOPHIR
     *********************************************************
     * @licstart  The following is the entire license notice for the
     *  JavaScript code in this page.
     *
     * Copyright (C) 2013  Ophir LOJKINE
     *
     *
     * The JavaScript code in this page is free software: you can
     * redistribute it and/or modify it under the terms of the GNU
     * General Public License (GNU GPL) as published by the Free Software
     * Foundation, either version 3 of the License, or (at your option)
     * any later version.  The code is distributed WITHOUT ANY WARRANTY;
     * without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
     *
     * As additional permission under GNU GPL version 3 section 7, you
     * may distribute non-sourc``e (e.g., minimized or compacted) forms of
     * that code without the copy of the GNU GPL normally required by
     * section 4, provided you include this license notice and a URL
     * through which recipients can access the Corresponding Source.
     *
     * @licend
     */

     (function () {
      //Code isolation
      var origin = {
        scrollX: document.documentElement.scrollLeft,
        scrollY: document.documentElement.scrollTop,
        x: 0.0,
        y: 0.0,
        clientY: 0,
        scale: Math.min(window.innerWidth, window.innerHeight) / 2000,
      };
      var ZOOM_FACTOR = 0.5;
      const ZOOM_STEP = 0.1;
      let ZOOM_LEVEL = origin.scale;
      var moved = false,
        pressed = false;
      const zoomer = document.getElementById("zoomer");
      const zoomInBtn = document.getElementById("zoom-in");
      const zoomOutBtn = document.getElementById("zoom-out");
      const inputEvent = new Event("input", { bubbles: true, cancelable: true });
      const zoomPercentElem = document.getElementById("zoom-percentage");
    
      zoomer.setAttribute("min", origin.scale);
      zoomer.setAttribute("max", 2 + +origin.scale);
      zoomer.setAttribute("step", 0.1);
      zoomer.setAttribute("value", origin.scale);
    
      function setPersent() {
        let percent = Math.ceil(+((ZOOM_LEVEL / origin.scale) * 100).toFixed(2));
        zoomPercentElem.innerHTML = `${percent}%`;
      }
      setPersent();
    
      zoomInBtn.onclick = zoomIn;
      zoomOutBtn.onclick = zoomOut;
      zoomer.oninput = handleSlideZoom;
    
      function handleSlideZoom(e) {
        const { value } = e.target;
        ZOOM_LEVEL = +value;
        setPersent();
        animate(value);
      }
      function zoomIn() {
        ZOOM_LEVEL += ZOOM_STEP;
        zoomer.value = +ZOOM_LEVEL.toFixed(1);
        zoomer.dispatchEvent(inputEvent);
      }
      function zoomOut() {
        ZOOM_LEVEL -= ZOOM_STEP;
        zoomer.value = +ZOOM_LEVEL.toFixed(1);
        zoomer.dispatchEvent(inputEvent);
      }
    
      function zoom(origin, scale) {
        let d = scale * 2000;
        if (d < Math.min(window.innerWidth, window.innerHeight)) return;
        var oldScale = origin.scale;
        var newScale = Tools.setScale(scale);
        document.getElementById("board").style.width = `${d}px`;
        document.getElementById("board").style.height = `${d}px`;
        window.scrollTo(
          origin.scrollX + origin.x * (newScale - oldScale),
          origin.scrollY + origin.y * (newScale - oldScale)
        );
      }
    
      var animation = null;
      function animate(scale) {
        cancelAnimationFrame(animation);
        animation = requestAnimationFrame(function () {
          zoom(origin, scale);
        });
      }
    
      function setOrigin(x, y, evt, isTouchEvent) {
        origin.scrollX = document.documentElement.scrollLeft;
        origin.scrollY = document.documentElement.scrollTop;
        origin.x = x;
        origin.y = y;
        origin.clientY = getClientY(evt, isTouchEvent);
        origin.scale = Tools.getScale();
      }
    
      function press(x, y, evt, isTouchEvent) {
        evt.preventDefault();
        setOrigin(x, y, evt, isTouchEvent);
        moved = false;
        pressed = true;
      }
    
      function move(x, y, evt, isTouchEvent) {
        if (pressed) {
          evt.preventDefault();
          var delta = getClientY(evt, isTouchEvent) - origin.clientY;
          var scale = origin.scale * (1 + (delta * ZOOM_FACTOR) / 100);
          if (Math.abs(delta) > 1) moved = true;
          animation = animate(scale);
        }
      }
    
      function onwheel(evt) {
        evt.preventDefault();
        var multiplier =
          evt.deltaMode === WheelEvent.DOM_DELTA_LINE
            ? 30
            : evt.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? 1000
            : 1;
        var deltaX = evt.deltaX * multiplier,
          deltaY = evt.deltaY * multiplier;
        if (!evt.ctrlKey) {
          // zoom
          var scale = Tools.getScale();
          var x = evt.pageX / scale;
          var y = evt.pageY / scale;
          setOrigin(x, y, evt, false);
          animate((1 - deltaY / 800) * Tools.getScale());
        } else if (evt.altKey) {
          // make finer changes if shift is being held
          var change = evt.shiftKey ? 1 : 5;
          // change tool size
          Tools.setSize(Tools.getSize() - (deltaY / 100) * change);
        } else if (evt.shiftKey) {
          // scroll horizontally
          window.scrollTo(
            document.documentElement.scrollLeft + deltaY,
            document.documentElement.scrollTop + deltaX
          );
        } else {
          // regular scrolling
          window.scrollTo(
            document.documentElement.scrollLeft + deltaX,
            document.documentElement.scrollTop + deltaY
          );
        }
      }
      // Tools.board.addEventListener("wheel", onwheel, { passive: false });
    
      Tools.board.addEventListener(
        "touchmove",
        function ontouchmove(evt) {
          // 2-finger pan to zoom
          var touches = evt.touches;
          if (touches.length === 2) {
            var x0 = touches[0].clientX,
              x1 = touches[1].clientX,
              y0 = touches[0].clientY,
              y1 = touches[1].clientY,
              dx = x0 - x1,
              dy = y0 - y1;
            var x = (touches[0].pageX + touches[1].pageX) / 2 / Tools.getScale(),
              y = (touches[0].pageY + touches[1].pageY) / 2 / Tools.getScale();
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (!pressed) {
              pressed = true;
              setOrigin(x, y, evt, true);
              origin.distance = distance;
            } else {
              var delta = distance - origin.distance;
              var scale = origin.scale * (1 + (delta * ZOOM_FACTOR) / 100);
              animate(scale);
            }
          }
        },
        { passive: true }
      );
      function touchend() {
        pressed = false;
      }
      Tools.board.addEventListener("touchend", touchend);
      Tools.board.addEventListener("touchcancel", touchend);
    
      function release(x, y, evt, isTouchEvent) {
        if (pressed && !moved) {
          var delta = evt.shiftKey === true ? -1 : 1;
          var scale = Tools.getScale() * (1 + delta * ZOOM_FACTOR);
          zoom(origin, scale);
        }
        pressed = false;
      }
    
      function key(down) {
        return function (evt) {
          if (evt.key === "Shift") {
            Tools.svg.style.cursor = "zoom-" + (down ? "out" : "in");
          }
        };
      }
    
      function getClientY(evt, isTouchEvent) {
        return isTouchEvent ? evt.changedTouches[0].clientY : evt.clientY;
      }
    
      var keydown = key(true);
      var keyup = key(false);
    
      function onstart() {
        window.addEventListener("keydown", keydown);
        window.addEventListener("keyup", keyup);
      }
      function onquit() {
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("keyup", keyup);
      }
    
      var zoomTool = {
        name: "Zoom",
        fname: "بزرگنمایی",
        shortcut: "z",
        listeners: {
          // press: press,
          // move: move,
          // release: release,
        },
        onstart: onstart,
        onquit: onquit,
        mouseCursor: "zoom-in",
        icon: "tools/icons/Zoom in.svg",
        helpText: "click_to_zoom",
        showMarker: true,
      };
      // Tools.add(zoomTool);
    })(); //End of code isolation
    
    //======================================================
  }
  render() {
    return (
      <>
        <div id="board">
        <svg
          id="canvas"
          width="500"
          height="500"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs id="defs"></defs>
          <g id="drawingArea"></g>
          <g id="cursors"></g>
        </svg>
      </div>

      {/* Loading */}
      <div id="loadingMessage">
        <img src={WbLoaderIcon} alt="" />
      </div>

      {/* Menu */}
      <div id="menu">
        <div id="menuItems">
          <ul className="tools" id="tools">
            <li className="tool" tabIndex="-1">
              <img className="tool-icon" src="" alt="" />
              <span className="tool-name"></span>
              <img className="tool-icon secondaryIcon" src="data:," alt="" />
            </li>
          </ul>

          <ul className="tools" id="settings">
            <li className="tool" tabIndex="-1">
              <input
                className="tool-icon"
                type="color"
                id="chooseColor"
                defaultValue="#1913B0"
              />
              <span className="colorPresets" id="colorPresetSel">
                <span className="colorPresetButton"></span>
              </span>
            </li>
            <li
              className="tool"
              tabIndex="-1"
              title="(alt + کلید میانبر: ) سایز قلم"
            >
              <img
                className="tool-icon"
                width="60"
                height="60"
                src={sizeIcon}
                alt="size"
              />
              <label className="tool-name slider" htmlFor="chooseSize">
                <input
                  type="range"
                  id="chooseSize"
                  defaultValue="4"
                  min="1"
                  max="50"
                  step="1"
                  className="rangeChooser"
                />
              </label>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Tools */}
      <div className="bottomTools">
        <div className="button-container page-zoom-container">
          <button id="zoom-out">
            <img src={zoomOutIcon} alt="" />
          </button>
          <input type="range" step="0.1" id="zoomer" />
          <div id="zoom-percentage"></div>
          <button id="zoom-in">
            <img src={zoomInIcon} alt="" />
          </button>
        </div>
        <div className="button-container page-shower">
          <button id="next-page">
            <img src={chevronRightIcon} alt="" />
          </button>
          <div className="page-indicator">
            <span id="currentPage"></span>
            <span>/</span>
            <span id="totalPage"></span>
          </div>
          <button id="prev-page">
            <img src={chevronRightIcon} alt="" />
          </button>
        </div>
        <div className="button-container page-selector-container">
          <input type="checkbox" id="page-selector" />
          <span id="page-navigator"></span>
          <label htmlFor="page-selector">
            <img src={chevronRightIcon} alt="" id="up-arrow" />
          </label>
          <div className="column" id="pages"></div>
        </div>
      </div>

      {/* Overlay */}
      <div id="overlay"></div>
      </>
    );
  }
}
