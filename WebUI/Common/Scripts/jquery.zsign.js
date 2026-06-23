/*
    desc:jQuery模拟盖章
    author:hyf
    date:2012-11-08
*/
$.fn.zSign = function (options) {
    var _s = $.extend({
        top: 0,
        left: 0,
        img: '',
        width: 150,
        height: 150,
        offset: 8,           //边界值
        callBack: null
    }, options || {});

    var _parent = $(this).addClass('zsign');
    var range = {
        minX: _s.offset,
        minY: _s.offset,
        maxX: _parent.width() - _s.width - _s.offset - 18,      //扣去2个padding=8px以及2个边框1px
        maxY: _parent.height() - _s.height - _s.offset - 18
    };
    var _btnPanel = $("<div class='panel'><button class='btn add' >太湖流域防汛抗旱总指挥部</button><button class='btn cancel'>水利部太湖流域管理局</button></div>").appendTo(_parent);
    var _html = "<div class='sign' style='height:" + _s.height + "px;width:" + _s.width + "px;top:" + _s.top + "px;left:" + _s.left + "px'><img src='" + _s.img + "' draggable='false'/><button class='btn ok'>确定</button></div>";//<button class='btn del' >删除</button>


    var _add = $('.add', _btnPanel).click(function (e) {
        //var strWhere = { "getValue": "FBFDZB", "title": "/Common/images/Seal/FBFZB.gif" };
        //onValueChanged(strWhere);
        _s.top = 416;
        _s.left = 276;
        _s.img = "/Common/images/Seal/FBFZB2.gif";
        _html = "<div class='sign' style='height:" + _s.height + "px;width:" + _s.width + "px;top:" + _s.top + "px;left:" + _s.left + "px'><img src='" + _s.img + "' draggable='false'/><button class='btn ok'>确定</button></div>";//<button class='btn del' >删除</button>
        $("#SEAL").val("FBFZB");
        //$('.sign:not(.ok)', _parent).remove();
        //_btnPanel.remove();
        if (_add.attr('disabled') == 'disabled') {
        } else {
            _add.attr('disabled', 'disabled');
            _cancel.attr('disabled', 'disabled');
        }

        setTimeout(function () {
            var sign = $(_html).appendTo(_parent);
            $('.ok', sign).click(function () {
                try {
                    BtnTIF();
                } catch (ex) { }
                //确定盖章
                sign.addClass('ok').off('mousedown').find('.btn').remove();
                //_add.removeAttr('disabled');
                //_cancel.removeAttr('disabled');
                if (_s.callBack) {
                    _s.callBack.call(this, { img: _s.img, top: parseInt(sign.css('top')), left: parseInt(sign.css('left')) });
                }
                //$("#panel").attr("display", "none");
            });
            $('.del', sign).click(function () {
                //取消盖章
                sign.remove();
                _add.removeAttr('disabled');
                _cancel.removeAttr('disabled');
            });

            //绑定移动事件
            sign.on('mousedown', function (e) {
                sign.data('x', e.clientX);
                sign.data('y', e.clientY);
                var position = sign.position();
                $(document).on('mousemove', function (e1) {
                    var x = e1.clientX - sign.data('x') + position.left;
                    var y = e1.clientY - sign.data('y') + position.top;
                    x = x < range.minX ? range.minX : x;
                    x = x > range.maxX ? range.maxX : x;
                    y = y < range.minY ? range.minY : y;
                    y = y > range.maxY ? range.maxY : y;

                    sign.css({ left: x, top: y });
                }).on('mouseup', function () {
                    $(this).off('mousemove').off('mouseup');
                });
            });
        }, 10);
     
    });

    var _cancel=$('.cancel', _btnPanel).click(function () {
        var r = true;
        if (_cancel.attr('disabled') == 'disabled') {
            if (!confirm("未确定的盖章将被取消，确定要关闭吗？")) {
                r = false;
            }
        }
        if (r) {
            //删除未确定位置的盖章 
            //$('.sign:not(.ok)', _parent).remove();
            //_btnPanel.remove();
            //var strWhere = { "getValue": "FBFD", "title": "/Common/images/Seal/FBFD.gif" };
            //onValueChanged(strWhere); 
            _s.top = 115;
            _s.left = 358;
            _s.img = "/Common/images/Seal/FBFD2.gif";
            $("#SEAL").val("FBFD");
            _html = "<div class='sign' style='height:" + _s.height + "px;width:" + _s.width + "px;top:" + _s.top + "px;left:" + _s.left + "px'><img src='" + _s.img + "' draggable='false'/><button class='btn ok'>确定</button></div>";//<button class='btn del' >删除</button>

            if (_cancel.attr('disabled') == 'disabled') {
            } else {
                _add.attr('disabled', 'disabled');
                _cancel.attr('disabled', 'disabled');

            }
            setTimeout(function () {
                var sign = $(_html).appendTo(_parent);

                $('.ok', sign).click(function () {
                    try {
                        BtnTIF();
                    } catch (ex) { }
                    //确定盖章
                    sign.addClass('ok').off('mousedown').find('.btn').remove();
                    //_add.removeAttr('disabled');
                    //_cancel.removeAttr('disabled');
                    if (_s.callBack) {
                        _s.callBack.call(this, { img: _s.img, top: parseInt(sign.css('top')), left: parseInt(sign.css('left')) });
                    }
                   // $("#panel").attr("display", "none");
                });
                $('.del', sign).click(function () {
                    //取消盖章
                    sign.remove();
                    _add.removeAttr('disabled');
                    _cancel.removeAttr('disabled');
                });

                //绑定移动事件
                sign.on('mousedown', function (e) {
                    sign.data('x', e.clientX);
                    sign.data('y', e.clientY);
                    var position = sign.position();
                    $(document).on('mousemove', function (e1) {
                        var x = e1.clientX - sign.data('x') + position.left;
                        var y = e1.clientY - sign.data('y') + position.top;
                        x = x < range.minX ? range.minX : x;
                        x = x > range.maxX ? range.maxX : x;
                        y = y < range.minY ? range.minY : y;
                        y = y > range.maxY ? range.maxY : y;

                        sign.css({ left: x, top: y });
                    }).on('mouseup', function () {
                        $(this).off('mousemove').off('mouseup');
                    });
                });
            }, 100);
        }

    });
};