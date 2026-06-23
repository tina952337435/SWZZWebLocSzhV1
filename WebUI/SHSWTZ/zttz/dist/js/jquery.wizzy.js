(function($){

    $.fn.wizzy = function(options) {
        
        let settings = $.extend({
            stepNumbers: false,
            progressType: 'fill',
        }, options);

        return this.each(function(){
            let elem = $(this);
            let nav = elem.find('.wz-header nav');
            let navigator = elem.find('.wz-navigator');
            let content = elem.find('.wz-inner');

            let btnNext = '<a href="#" class="btn btn-primary right" data-action="next">\u4e0b\u4e00\u6b65 <i class="fa fa-forward"></i></a>';
            let btnBack = '<a href="#" class="btn btn-default left" data-action="back"><i class="fa fa-backward"></i> \u4e0a\u4e00\u6b65</a>';
            let btnFinish = '<a href="#" class="btn btn-success right" data-action="finish">\u53d1\u5e03\u4e13\u9898 <i class="fa fa-check-circle"></i></a>';

            let step_links = elem.find('nav a').toArray();
            let step_count = step_links.length;
            let step_status = new Array(step_count);
            let step_content = elem.find('.wz-step').toArray();
            let link_width = $(step_links[0]).width();
            let step = 0;

            function init(){
                for(i = 1 ; i < step_count ; i++){
                    step_status[i] = 0;
                }
                step_status[0] = 1;
                updateTemplate();
                render();
            }

            function moveProgress(step){
                if(settings.progressType == 'fill'){
                    let progressWidth = link_width * (step + 1);
                    nav.find('.progress').css({'width':progressWidth + 'px'});
                }
                if(settings.progressType == 'slide'){
                    nav.find('.progress').css({'width':link_width + 'px'});
                    let distance = link_width * (step);
                    nav.find('.progress').css({'left':distance + 'px'});
                }
                
            }

            function updateTemplate(){
                nav.append('<div class="progress"></div>');
                moveProgress(step);
                step_links.forEach(element => {
                    $(element).wrapInner('<span></span>');
                });
            }

            /**
             * 
             * @param {boolean} show 
             */
            function loader(show){
                let loader ='<div class="loading"></div>';
                if(show === true){ //Show Loader Spinner
                    content.fadeOut(400,function(){
                        elem.addClass('progress');
                        setTimeout(() => {
                            elem.append(loader);
                        }, 500);
                    });
                }
                else{
                    elem.find('.loading').remove();
                    elem.removeClass('progress');
                    setTimeout(() => {
                        content.fadeIn(400);
                    }, 400);
                }
            }

            /**
             * 
             * @param {string} action 
             */
            function react(action){

                if (step >= 0 && step < step_count) {
                    var _ZT_STIME = mini.get("ZT_STIME").getFormValue();
                    var _ZT_ETIME = mini.get("ZT_ETIME").getFormValue();
                    if (action === 'next') {
                        if (step == 0) {
                            $(".switch").removeClass("bootstrap-switch-handle-on");
                            $(".switch").addClass("bootstrap-switch-handle-off");
                            $("#switch1").toggleClass("bootstrap-switch-handle-on");
                            $(".fit").hide();
                            $("#fit1").show();
                            var form = new mini.Form("#form1");
                            form.validate();
                            if (form.isValid() == false) return;
                            btnSearch();
                        }else if(step==1)
                        {
                            $(".switch").removeClass("bootstrap-switch-handle-on");
                            $(".switch").addClass("bootstrap-switch-handle-off");
                            $("#switch3").toggleClass("bootstrap-switch-handle-on");
                            $(".fit").hide();
                            $("#fit3").show();
                            btnYQSearch();
                        } else if (step == 2) {
                            //var strWhere = {
                            //    "STIME": _ZT_STIME + " 00:00:00",
                            //    "ETIME": _ZT_ETIME + " 23:59:59",
                            //    "WD_TYPE": "\u5de5\u7a0b\u8c03\u5ea6\u6307\u4ee4,\u9632\u6c5b\u6297\u65f1\u7b80\u62a5,\u7535\u8bdd\u901a\u77e5\u5355,\u8c03\u5ea6\u6587\u4ef6,\u65b9\u6848\u9884\u6848,\u4e13\u9898\u76f8\u5173\u6587\u4ef6"
                            //}
                            //GetJosns("DATA_WD_LISTTABLESel", strWhere, "XGWJSel");
                            TQsearch();

                        } else if (step == 3) {
                            PicSearch();
                        } else if (step == 4) {
                            //var strWhere = {
                            //    "STIME": _ZT_STIME + " 00:00:00",
                            //    "ETIME": _ZT_ETIME + " 23:59:59",
                            //    "TBA_INFOTYPE": "\u534e\u4e1c\u96f7\u8fbe\u62fc\u56fe,\u5168\u56fd\u96f7\u8fbe\u62fc\u56fe,\u98ce\u4e91\u4e8c\u53f7,\u5f69\u8272\u5706\u76d8\u56fe"
                            //}
                            //GetJosns("WATER_TBA_WEACONTENTNEWSel", strWhere, "TQ_Sel");
                            GetJosns("DATA_FZ_TYPESel", { "FLAG": "4" }, "TQCITY");//ËùÊô·ÖÀà

                        }
                        step_status[step++] = 1;
                        if(step_status[step] === 0){
                            step_status[step] = 1;
                        }
                        render(step);
                    }
                    else if (action == 'back') { 
                        if (step == 2) {
                            $(".switch").removeClass("bootstrap-switch-handle-on");
                            $(".switch").addClass("bootstrap-switch-handle-off");
                            $("#switch1").toggleClass("bootstrap-switch-handle-on");
                            $(".fit").hide();
                            $("#fit1").show();
                            var form = new mini.Form("#form1");
                            form.validate();
                            if (form.isValid() == false) return;
                            btnSearch();
                        } else if (step == 3) {
                            $(".switch").removeClass("bootstrap-switch-handle-on");
                            $(".switch").addClass("bootstrap-switch-handle-off");
                            $("#switch3").toggleClass("bootstrap-switch-handle-on");
                            $(".fit").hide();
                            $("#fit3").show();
                            btnYQSearch();
                        } 
                        step--;
                        render(step);
                    }
                    else if (action == 'finish') {
                        SavaData();
                        //return;
                        //loader(true);
                        //setTimeout(() => {
                        //    loader(false);
                        //}, 3000);
                    }
                }
                
            }

            /**
             * Render out the content
             */
            function render(){
                navigator.html('');

                if(step === 0){
                    navigator.append(btnNext);
                }
                else if(step === step_count-1){
                    navigator.append(btnBack + btnFinish);
                }
                else{
                    navigator.append(btnBack + btnNext);
                }

                elem.find('nav a').removeClass('active completed');
                for(i = 0 ; i < step ; i++){
                    $(step_links[i]).addClass('completed');
                }
                $(step_links[i]).addClass('active');

                elem.find('.wz-body .wz-step').removeClass('active');
                $(step_content[step]).addClass('active');

                moveProgress(step);
            }

            /**
             * Click events
             */
            $(elem).on('click','.wz-navigator .btn',function(e){
                e.preventDefault();
                let action = $(this).data('action');
                react(action);
            });

            $(elem).on('click','nav a',function(e) {
                e.preventDefault();
                let step_check = $(this).index();
                if(step_status[step_check] === 1 || step_status[step_check] === 2){
                    step = $(this).index();
                    render();
                }
                else{
                    console.log('Check errors');
                }
            });

            
            init();
        });
    }

}(jQuery));