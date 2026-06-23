
//{ id, text, parentId?, href?, hrefTarget?, icon, iconCls, cls, expanded, children }

var Menu_Id = 1;
var tempMenu = 0;
var Menu = function (element, options) {
    this.element = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.init();
}

Menu.prototype = {

    options: {
        data: null,    
        itemclick: null
    },

    loadData: function (data) {
        this.options.data = data || [];
        this.refresh();
    },

    refresh: function () {
        this._render();
    },

    init: function () {
        var me = this,
            opt = me.options,
            el = me.element;

        //el.addClass('menu');

        me.loadData(opt.data);

        el.on('click', '.menu-title', function (event) {
            var el = $(event.currentTarget);
            var li = el.parent(); 

            var item = me.getItemByEvent(event);
             
            $("#mainMenu .menu li").removeClass('open');
            $(this).parent().addClass('open');
            if (el.parents().hasClass('has-children')) { 
                el.parents(".has-children").toggleClass('open');
            } else {
                $(this).parent().toggleClass('open');
            }
            //alert(li.parents().hasClass('open'));
            li.toggleClass('open');

            if (opt.itemclick) opt.itemclick.call(me, item);

        });

    },

    _render: function () {
        var data = this.options.data || [];
        var html = this._renderItems(data, null);
        this.element.html(html);        
    },

    _renderItems: function (items, parent) {
        var s = '<ul class="' + (parent ? "menu-submenu" : "menu") + '">';
        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i];
            s += this._renderItem(item);
        }
        s += '</ul>';
        return s;
    },

    _renderItem: function (item) {

        var me = this,
            hasChildren = item.children && item.children.length > 0;
        var temHas = "";
        if (tempMenu == 0) {
            temHas = "open";
        }
        var s = '<li class="' + (hasChildren ? 'has-children' : '' + temHas +'') + '">';        //class="menu-item" open, expanded?
        tempMenu++;
        s += '<a class="menu-title" data-id="' + item.id + '" ';
        //        if (item.href) {
        //            s += 'href="' + item.href + '" target="' + (item.hrefTarget || '') + '"';
        //        }
        s += '>';

        s += '<i class="menu-icon fa ' + item.iconCls + '"></i>';
        s += '<span class="menu-text">' + item.text + '</span>';

        if (hasChildren) {
            s += '<span class="menu-arrow fa"></span>';
        }

        s += '</a>';

        if (hasChildren) {
            s += me._renderItems(item.children, item);
        }

        s += '</li>';
        return s;
    },

    getItemByEvent: function (event) {
        var el = $(event.target).closest('.menu-title');
        var id = el.attr("data-id");
        return this.getItemById(id);
    },

    getItemById: function (id) {
        var me = this,
            idHash = me._idHash;

        if (!idHash) {
            idHash = me._idHash = {};
            function each(items) {
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    if (item.children) each(item.children);
                    idHash[item.id] = item;
                }
            }
            each(me.options.data);
        }

        return me._idHash[id];
    }

};
