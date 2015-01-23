/*
* https://github.com/fczbkk/UrlMatch
* */

(function() {
  var UrlMatch, root,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) { return i; } } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) {child[key] = parent[key]; } } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  UrlMatch = (function() {
    function UrlMatch(patterns) {
      if (patterns == null) {
        patterns = [];
      }
      this.patterns = [];
      this.add(patterns);
    }

    UrlMatch.prototype.add = function(patterns) {
      var pattern, _i, _len;
      if (patterns == null) {
        patterns = [];
      }
      if (typeof patterns === 'string') {
        patterns = [patterns];
      }
      for (_i = 0, _len = patterns.length; _i < _len; _i++) {
        pattern = patterns[_i];
        if (__indexOf.call(this.patterns, pattern) < 0) {
          this.patterns.push(pattern);
        }
      }
      return this.patterns;
    };

    UrlMatch.prototype.remove = function(patterns) {
      if (patterns == null) {
        patterns = [];
      }
      if (typeof patterns === 'string') {
        patterns = [patterns];
      }
      return this.patterns = this.patterns.filter(function(item) {
        return __indexOf.call(patterns, item) < 0;
      });
    };

    UrlMatch.prototype.test = function(content) {
      var pattern, pattern_obj, _i, _len, _ref;
      _ref = this.patterns;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pattern = _ref[_i];
        pattern_obj = new UrlMatch.Pattern(pattern);
        if (pattern_obj.test(content)) {
          return true;
        }
      }
      return false;
    };

    UrlMatch.Pattern = (function() {
      function Pattern(pattern) {
        var sanitized_pattern;
        if (pattern === '*' || pattern === '<all_urls>') {
          pattern = '*://*/*?*#*';
        }
        this.original_pattern = pattern;
        sanitized_pattern = this.sanitize(pattern);
        this.pattern = sanitized_pattern;
        this.url_parts = this.getUrlParts(sanitized_pattern);
      }

      Pattern.prototype.split_re = /^([a-z]+|\*)*:\/\/(.+@)*([\w\*\.\-]+)*(\:\d+)*(\/([^\?\#]*))*(\?([^\#]*))*(\#(.*))*/;

      Pattern.prototype.split = function(pattern, empty_value) {
        var key, parts, parts_map, result, val;
        if (pattern == null) {
          pattern = '';
        }
        if (empty_value == null) {
          empty_value = null;
        }
        parts = pattern.match(this.split_re);
        parts_map = {
          scheme: 1,
          host: 3,
          path: 6,
          params: 8,
          fragment: 10
        };
        result = {};
        for (key in parts_map) {
          val = parts_map[key];
          result[key] = (parts != null ? parts[val] : void 0) || empty_value;
        }
        return result;
      };

      Pattern.prototype.getUrlParts = function(pattern) {
        var splits;
        if (pattern == null) {
          pattern = this.pattern;
        }
        splits = this.split(pattern);
        return {
          scheme: new UrlMatch.Scheme(splits.scheme),
          host: new UrlMatch.Host(splits.host),
          path: new UrlMatch.Path(splits.path),
          params: new UrlMatch.Params(splits.params),
          fragment: new UrlMatch.Fragment(splits.fragment)
        };
      };

      Pattern.prototype.sanitize = function(pattern) {
        var universal_pattern;
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        universal_pattern = '*://*/*?*#*';
        if (pattern === '*' || pattern === '<all_urls>') {
          pattern = universal_pattern;
        }
        return pattern;
      };

      Pattern.prototype.validate = function(url_parts) {
        var key, result, val;
        if (url_parts == null) {
          url_parts = this.url_parts;
        }
        result = true;
        for (key in url_parts) {
          val = url_parts[key];
          if (!val.validate()) {
            result = false;
          }
        }
        return result;
      };

      Pattern.prototype.test = function(url) {
        var part, result, splits, _i, _len, _ref;
        if (url != null) {
          splits = this.split(url);
          result = true;
          _ref = ['scheme', 'host', 'path', 'params', 'fragment'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            part = _ref[_i];
            if (!this.url_parts[part].test(splits[part])) {
              result = false;
            }
          }
          return result;
        } else {
          return false;
        }
      };

      return Pattern;

    })();

    UrlMatch.UrlPart = (function() {
      function UrlPart(pattern) {
        this.original_pattern = pattern;
        this.pattern = this.sanitize(pattern);
      }

      UrlPart.prototype.validate = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        return false;
      };

      UrlPart.prototype.test = function(content, pattern) {
        if (content == null) {
          content = '';
        }
        if (pattern == null) {
          pattern = this.pattern;
        }
        if (pattern != null) {
          return pattern.test(content);
        } else {
          return true;
        }
      };

      UrlPart.prototype.sanitize = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (this.validatePattern) {
          return RegExp("^" + pattern + "$");
        } else {
          return null;
        }
      };

      return UrlPart;

    })();

    UrlMatch.Scheme = (function(_super) {
      __extends(Scheme, _super);

      function Scheme() {
        return Scheme.__super__.constructor.apply(this, arguments);
      }

      Scheme.prototype.validate = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (pattern != null) {
          return /^(\*|[a-z]+)$/.test(pattern);
        } else {
          return false;
        }
      };

      Scheme.prototype.sanitize = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (this.validate(pattern)) {
          pattern = pattern.replace('*', 'https?');
          return RegExp("^" + pattern + "$");
        } else {
          return null;
        }
      };

      return Scheme;

    })(UrlMatch.UrlPart);

    UrlMatch.Host = (function(_super) {
      __extends(Host, _super);

      function Host() {
        return Host.__super__.constructor.apply(this, arguments);
      }

      Host.prototype.validate = function(pattern) {
        var invalidate_rules, result, rule, validate_rules, _i, _j, _len, _len1;
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (pattern != null) {
          validate_rules = [/.+/];
          invalidate_rules = [/\*\*/, /\*[^\.]+/, /.\*/, /^(\.|-)/, /(\.|-)$/, /[^a-z0-9-.\*]/];
          result = true;
          for (_i = 0, _len = validate_rules.length; _i < _len; _i++) {
            rule = validate_rules[_i];
            if (!rule.test(pattern)) {
              result = false;
            }
          }
          for (_j = 0, _len1 = invalidate_rules.length; _j < _len1; _j++) {
            rule = invalidate_rules[_j];
            if (rule.test(pattern)) {
              result = false;
            }
          }
          return result;
        } else {
          return false;
        }
      };

      Host.prototype.sanitize = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (this.validate(pattern)) {
          pattern = pattern.replace('.', '\\.');
          pattern = pattern.replace('*', '[a-z0-9-.]+');
          return RegExp("^" + pattern + "$");
        } else {
          return null;
        }
      };

      return Host;

    })(UrlMatch.UrlPart);

    UrlMatch.Path = (function(_super) {
      __extends(Path, _super);

      function Path() {
        return Path.__super__.constructor.apply(this, arguments);
      }

      Path.prototype.validate = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        return true;
      };

      Path.prototype.sanitize = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (pattern == null) {
          pattern = '';
        }
        pattern = pattern.replace(/\/$/, '\\/*');
        pattern = pattern.replace('*', '[a-z0-9-./]*');
        return RegExp("^" + pattern + "$");
      };

      return Path;

    })(UrlMatch.UrlPart);

    UrlMatch.Params = (function(_super) {
      __extends(Params, _super);

      function Params() {
        return Params.__super__.constructor.apply(this, arguments);
      }

      Params.prototype.validate = function(pattern) {
        var invalidate_rules, result, rule, _i, _len;
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (pattern != null) {
          invalidate_rules = [/\=\=/, /\=[^\&]+\=/, /^\=$/];
          result = true;
          for (_i = 0, _len = invalidate_rules.length; _i < _len; _i++) {
            rule = invalidate_rules[_i];
            if (rule.test(pattern)) {
              result = false;
            }
          }
          return result;
        } else {
          return true;
        }
      };

      Params.prototype.sanitize = function(pattern) {
        var key, pair, result, val, _i, _len, _ref, _ref1;
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (pattern === '*') {
          pattern = null;
        }
        result = {};
        if (pattern != null) {
          _ref = pattern.split('&');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pair = _ref[_i];
            _ref1 = pair.split('='), key = _ref1[0], val = _ref1[1];
            key = key === '*' ? '.+' : key.replace(/\*/g, '.*');
            val = val === '*' ? '=?.*' : '=' + val.replace(/\*/g, '.*');
            result[key] = val;
          }
        }
        return result;
      };

      Params.prototype.test = function(content, pattern) {
        var key, re, result, val;
        if (content == null) {
          content = '';
        }
        if (pattern == null) {
          pattern = this.pattern;
        }
        result = true;
        for (key in pattern) {
          val = pattern[key];
          re = RegExp("(^|\\&)" + key + val + "(\\&|$)");
          if (!re.test(content)) {
            result = false;
          }
        }
        return result;
      };

      return Params;

    })(UrlMatch.UrlPart);

    UrlMatch.Fragment = (function(_super) {
      __extends(Fragment, _super);

      function Fragment() {
        return Fragment.__super__.constructor.apply(this, arguments);
      }

      Fragment.prototype.validate = function(pattern) {
        var invalidate_rules, result, rule, _i, _len;
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (pattern != null) {
          invalidate_rules = [/\#/];
          result = true;
          for (_i = 0, _len = invalidate_rules.length; _i < _len; _i++) {
            rule = invalidate_rules[_i];
            if (rule.test(pattern)) {
              result = false;
            }
          }
          return result;
        } else {
          return true;
        }
      };

      Fragment.prototype.sanitize = function(pattern) {
        if (pattern == null) {
          pattern = this.original_pattern;
        }
        if (this.validate(pattern)) {
          if (pattern != null) {
            pattern = pattern.replace(/\*/g, '.*');
            return RegExp("^" + pattern + "$");
          }
        }
        return null;
      };

      return Fragment;

    })(UrlMatch.UrlPart);

    return UrlMatch;

  })();

  root = typeof exports === 'object' ? exports : this;

  root.UrlMatch = UrlMatch;

}).call(this);