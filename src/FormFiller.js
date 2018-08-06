var formfiller = new FormFiller();
formfiller.loadForm();

/**
 * FormFiller
 * 
 * Main FormFiller class, which handles all requests
 * @returns {FormFiller}
 */
function FormFiller() {

    var _version = '0.1.12';
    var _context = this;
    this.jsCode = 'javascript:/* FormFiller v' + _version + ' */var d=document;function p(a){return d.getElementById(a).querySelector(\':scope input\')}function i(a){return d.getElementById(a)}function n(a){return d.getElementsByName(a)[0]}function e(a){t=\'change\';if(window.navigator.userAgent.match(/Trident|MSIE\s/g)!=null){x=d.createEvent(\'Events\');x.initEvent(t,1,0);}else{x=new Event(t);}a.dispatchEvent(x);}function v(a,v){a.value=v;e(a)}function c(a){a.checked=true;e(a)}';
    this.loadForm = function () {
        _loadJQuery();
    };

    var _loadJQuery = function () {
        if (typeof jQuery === 'undefined') {
            new Loader().script('//code.jquery.com/jquery-1.11.1.min.js', function (context) {
                context.doLoadForm();
            }, _context);
        } else {
            _context.doLoadForm();
        }
    };

    this.doLoadForm = function () {
        if (jQuery('div#formfiller').length === 0) {
            var html = '<div id="formfiller"> <section style="position:fixed;top:20%;left:0;right:0;z-index:9999;width:40%;margin:0 auto;padding:40px;background-color:#fff;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif"> <h1 style="margin:0 0 18px;font-size:32px">Form Filler v' + _version + '</h1> <div id="formfiller-formwrapper"><input id="formfiller-bookmarkletname" style="margin-bottom:18px" value="' + document.title + '"> <input type="button" value="Save" onclick="javascript:formfiller.save();return false;"></div> <p style="margin:0;display:none"> Click and drag this link to the bookmarks bar: <a id="bookmarklet">My bookmarklet</a> </p><a href="javascript:$(\'#formfiller\').remove();void(0);" style=position:absolute;top:0;right:0;font-size:32px;padding:10px;line-height:.55;color:#aaa;text-decoration:none>&times;</a> </section> <div style=position:fixed;top:0;right:0;bottom:0;left:0;z-index:9998;background-color:rgba(0,0,0,.25)></div></div>';
            jQuery('body').append(html);
        }
    };

    this.save = function () {
        jQuery('input:not(:hidden,:radio,:checkbox,:submit,:file), textarea, select, input[type="radio"]:checked, input[type="checkbox"]:checked').each(function () {
            if (_isVisible(this) && (_hasName(this) || _hasId(this) || _hasParentId(this))) {
                if (_hasName(this) && _hasId(this) && _isRadioOrCheckbox(this)) {
                    formfiller.jsCode += 'c(i("' + _getId(this) + '"));';
                } else if (_hasId(this)) {
                    formfiller.jsCode += 'v(i("' + _getId(this) + '"),"' + _getValue(this) + '");'
                } else if (_hasName(this)) {
                    formfiller.jsCode += 'v(n("' + _getName(this) + '"),"' + _getValue(this) + '");';
                } else if (_hasParentId(this)) {
                    formfiller.jsCode += 'v(p("' + _getParentId(this) + '"),"' + _getValue(this) + '");';
                }
            }
        });
        jQuery('#bookmarklet').attr('href', this.jsCode + 'void(0);').html(jQuery('#formfiller-bookmarkletname').val()).parent('p').show();
        jQuery('#formfiller-formwrapper').hide();
    };
    
    var _isVisible = function(element) {
        return jQuery(element).is(':visible');
    };

    var _hasName = function (element) {
        return (_getName(element) !== undefined);
    };

    var _getName = function (element) {
        return jQuery(element).attr('name');
    };

    var _hasParentId = function (element) {
        return (_getParentId(element) !== undefined);
    };

    var _getParentId = function (element) {
        var parent = jQuery(element).closest('[id]')
        return parent && parent.attr('id');
    };

    var _hasId = function (element) {
        return (_getId(element) !== undefined);
    };

    var _getId = function (element) {
        return jQuery(element).attr('id');
    };

    var _isRadioOrCheckbox = function (element) {
        return ((_nameHasArray(element)) || (_isType(element, ['radio', 'checkbox'])))
    };

    var _nameHasArray = function (element) {
        return (_getName(element).indexOf('[]') >= 0)
    };

    var _isType = function (element, types) {
        return (jQuery.inArray(jQuery(element).attr('type'), types) >= 0);
    };

    var _getValue = function (element) {
        var value = jQuery(element).val();
        return (value === null) ? '' : value.replace(/"/g, '\\"');
    };

}

/**
 * Loader
 * 
 * Class for loading external files
 * Supported tags:
 *   - script
 *   - link
 * @returns {Loader}
 */
function Loader() {

    var TYPE = {
        SCRIPT: 'script'
    };

    var _fileLoaded = false;
    var _callback = null;
    var _context = null;

    this.script = function (url, callback, context) {
        _callback = callback;
        _context = context;
        _appendNewElementToBody(
                TYPE.SCRIPT
                , {
                    src: url
                    , type: 'text/javascript'
                }
        );
        _cleanup();
    };

    var _appendNewElementToBody = function (type, attrs) {
        _getFirstElementByTagName('body').appendChild(_createElement(type, attrs));
    };

    var _getFirstElementByTagName = function (name) {
        return document.getElementsByTagName(name)[0];
    };

    var _createElement = function (type, attrs) {
        var element = document.createElement(type);

        for (var key in attrs) {
            element.setAttribute(key, attrs[key]);
        }

        element.onload = element.onreadystatechage = function () {
            if (!_fileLoaded && (!this.readyState || ['loaded', 'complete'].indexOf(this.readyState) !== -1)) {
                _fileLoaded = true;
                element.onload = element.onreadystatechange = null;
                _getFirstElementByTagName('body').removeChild(element);
                _callback(_context);
            }
        };

        return element;
    };

    var _cleanup = function () {
        _fileLoaded = false;
    };

}
