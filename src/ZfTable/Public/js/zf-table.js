(function(jQuery) {

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


    jQuery.fn.animateGreenHighlight = function (highlightColor, duration) {
        var highlightBg = highlightColor || "#68e372";
        var animateMs = duration || "1000"; // edit is here
        var originalBg = this.css("background-color");

        if (!originalBg || originalBg == highlightBg)
            originalBg = "#FFFFFF"; // default to white

        jQuery(this)
            .css("backgroundColor", highlightBg)
            .animate({ backgroundColor: originalBg }, animateMs, null, function () {
                jQuery(this).css("backgroundColor", originalBg);
            });
    };

    jQuery.fn.zfTable = function(url , options) {

        var initialized = false;

        var defaults = {
            beforeSend: function(){},
            success: function(){},
            error: function(){ addErrorMessage('An error occurred.') },
            complete: function(){},
            onInit: function(options){
                vars = document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
                if ( vars ) {
                    var string = '';
                    $.each(vars,function(key, val){
                        if ( key && val ) {
                            string += key + '=' + val;
                            string += '&';
                        }
                    })
                    return string;
                }
                return '';
            },
            sendAdditionalParams: function(data){
                if ( data ) {
                    return data;
                }
                return '';
            }
        };

        var options = $.extend(defaults, options);

        function strip(html){
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function init($obj) {
            vars = document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
            var string = '';
            if ( vars ) {
                $.each(vars,function(key, val){
                    if ( key && val ) {
                        string += key + '=' + val;
                        string += '&';
                    }
                })
            }
            if ( string ) {
                 post_data = string + '&' + options.sendAdditionalParams();
            }else{
                post_data = options.sendAdditionalParams();
            }
            initial_ajax($obj, post_data);
        }
        function initial_ajax($obj, post_data) {
            $obj.prepend('<div class="processing" style=""></div>');
            jQuery.ajax({
                url: url,
                data: post_data,
                type: 'POST',

                beforeSend: function( e ){ options.beforeSend( e ) },
                success: function(data) {
                    $obj.html('');
                    $obj.html(data);
                    initNavigation($obj);
                    $obj.find('.processing').hide();


                    options.success();
                },

                error : function(e){ options.error( e )},
                complete : function(e){ options.complete( e )},
                dataType: 'html',
                timeout: 120000 // sets timeout to 120 seconds
            });

        }
        function ajax($obj) {
            var check = options.sendAdditionalParams();
            $obj.prepend('<div class="processing" style=""></div>');
            if ( $obj.find(':input').length ) {
                var post_data = $obj.find(':input').serialize() + '&' + options.sendAdditionalParams();
            }else{
                var post_data = options.sendAdditionalParams();
            }
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?'+post_data;
                window.history.pushState({path:newurl},'',newurl);
            }
            jQuery.ajax({
                url: url,
                data: post_data,
                type: 'POST',

                beforeSend: function( e ){ options.beforeSend( e ) },
                success: function(data) {
                    $obj.html('');
                    $obj.html(data);
                    initNavigation($obj);
                    $obj.find('.processing').hide();


                    options.success();
                },

                error : function(e){ options.error( e )},
                complete : function(e){ options.complete( e )},

                dataType: 'html',
                timeout: 120000 // sets timeout to 120 seconds
            });

        }
        function initNavigation($obj){
            var _this = this;

            /* Add input masks and pickers */
            $obj.find('input[name="zff_date"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            });
            $obj.find('input[name="zff_date"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

            $obj.find('input[name="zff_exchange_expires_hours"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            });
            $obj.find('input[name="zff_exchange_expires_hours"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

            $obj.find('input[name="zff_start_date"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            });
            $obj.find('input[name="zff_start_date"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

            $obj.find('input[name="zff_end_date"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            });
            $obj.find('input[name="zff_end_date"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

            /*
            $obj.find('input[name="zff_created"]').datetimepicker({
                format: 'MM/DD/YYYY LT',
                stepping: 1,
                showClear: true
            });
            */
            $obj.find('input[name="zff_created"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            });
            $obj.find('input[name="zff_created"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

            $obj.find('input[name="start_date"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            }).on("dp.change", function (e) {
                if ( e.date ) {
                    if ( e.date > $obj.find('input[name="end_date"]').data("DateTimePicker").date() ) {
                        $obj.find('input[name="end_date"]').data("DateTimePicker").date(null);
                    }
                    $obj.find('input[name="end_date"]').data("DateTimePicker").minDate(e.date);
                    $obj.find('input[name="end_date"]').data("DateTimePicker").defaultDate(e.date);
                }else{
                    $obj.find('input[name="end_date"]').data("DateTimePicker").minDate(false);
                    $obj.find('input[name="end_date"]').data("DateTimePicker").defaultDate(false);
                }
            })
            $obj.find('input[name="start_date"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
            $obj.find('input[name="end_date"]').datetimepicker({
                format: 'MM/DD/YYYY',
                showClear: true
            }).on("dp.change", function (e) {
                if (e.date) {
                    if ( e.date < $obj.find('input[name="start_date"]').data("DateTimePicker").date() ) {
                        $obj.find('input[name="start_date"]').data("DateTimePicker").date(null);
                    }
                    $obj.find('input[name="start_date"]').data("DateTimePicker").maxDate(e.date);
                    $obj.find('input[name="start_date"]').data("DateTimePicker").defaultDate(e.date);
                }else{
                    $obj.find('input[name="start_date"]').data("DateTimePicker").maxDate(false);
                    $obj.find('input[name="start_date"]').data("DateTimePicker").defaultDate(false);
                }
            });
            $obj.find('input[name="end_date"]').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
            $obj.find('input[name="zff_time"]').datetimepicker({
                format: 'LT',
                stepping: 5,
                showClear: true
            });
            $obj.find('input[name="zff_start_time"]').datetimepicker({
                format: 'LT',
                stepping: 5,
                showClear: true
            });
            $obj.find('input[name="zff_end_time"]').datetimepicker({
                format: 'LT',
                stepping: 5,
                showClear: true
            });
            $obj.find('input[name="zff_phone"]').mask("(999) 999-9999? x99999");

            /* End input masks and pickers */

            $obj.find('table th.sortable').on('click',function(e){
                $obj.find('input[name="zfTableColumn"]').val(jQuery(this).data('column'));
                $obj.find('input[name="zfTableOrder"]').val(jQuery(this).data('order'));
                ajax($obj);
            });
            $obj.find('.pagination').find('a').on('click',function(e){
                $obj.find('input[name="zfTablePage"]').val(jQuery(this).data('page'));
                e.preventDefault();
                ajax($obj);
            });
            $obj.find('.itemPerPage').on('change',function(e){
                $obj.find('input[name="zfTableItemPerPage"]').val(jQuery(this).val());
                ajax($obj);
            });
            $obj.find('input.filter').on('keypress',function(e){
               if(e.which === 13) {
                   e.preventDefault();
                   ajax($obj);
               }
            });
            $obj.find('input[type="text"].filter').on('blur',function(e){
                e.preventDefault();
                ajax($obj);
            });
            $obj.find('select.filter').on('change',function(e){
                   e.preventDefault();
                   ajax($obj);
            });
            $obj.find('.quick-search').on('keypress',function(e){
               if(e.which === 13) {
                   e.preventDefault();
                   $obj.find('input[name="zfTableQuickSearch"]').val(jQuery(this).val());
                   ajax($obj);
               }
            });
            jQuery('.editable').dblclick(function(){
                if(jQuery(this).find('input').size() === 0){
                    var val = jQuery(this).html();
                    if ( jQuery(this).attr('data-maxlength') ) {
                        jQuery(this).html('<input style="width: 80%" type="text" maxlength="'+jQuery(this).attr('data-maxlength')+'" value="'+val+'" data-old="'+val+'" class="form-control"/><a href="#" class="row-save">Save</a>');
                    }else{
                        jQuery(this).html('<input style="width: 80%" type="text" value="'+val+'" data-old="'+val+'" class="form-control"/><a href="#" class="row-save">Save</a>');
                    }
                }
            });
            $obj.on('click', '.row-save', function(e){
                e.preventDefault();

                var newVal = jQuery(this).siblings('input').val();
                var oldVal = jQuery(this).siblings('input').attr('data-old');
                var $td = jQuery(this).parents('td');
                $td.html(newVal);
                $td.animateGreenHighlight();
                jQuery.ajax({
                    url:  $obj.find('.rowAction').attr('href'),
                    data: {column: $td.data('column') , value : newVal , id: $td.parent().data('row'), old: oldVal },
                    type: 'POST',
                    success: function(data) {
                        if ( data.success == true ) {
                            addSuccessMessage(data.message);
                        }else{
                            $td.html(data.old);
                            addErrorMessage(data.error);
                        }
                    },
                    dataType: 'json',
                    error: function(jqXHR, exception) {
                        var o = $.parseJSON(jqXHR.responseText);
                        addErrorMessage(o.detail);
                    },
                    timeout: 120000 // sets timeout to 120 seconds
                });
            });

            $obj.find('.export-csv').on('click',function(e){
                e.preventDefault();
                exportToCSV(jQuery(this), $obj);
            });
        }
        function exportToCSV(link, $table){
            var data = new Array();
            $table.find("tr.zf-title , tr.zf-data-row").each(function(i,el){
                var row = new Array();
                $(this).find('th, td').each(function(j, el2){
                    row[j] = strip($(this).html());
                });
                data[i] = row;
            });
            console.log(data);
            var csvHeader= "data:application/csv;charset=utf-8,";
            var csvData = '';
            data.forEach(function(infoArray, index){
               dataString = infoArray.join(";");
               csvData += dataString + '\r\n';

            });
            link.attr({
                 'download': 'export-table.csv',
                 'href': csvHeader + encodeURIComponent(csvData),
                 'target': '_blank'
            });
        }

        function addErrorMessage(message)
        {
            if ( message ) {
                $('.view-container .alert-area').prepend('<div class="alert alert-dismissable alert-danger fade in"><button class="close" type="button"><span>×</span></button><div>' + message + '</div></div>');
            }else{
                $('.view-container .alert-area').prepend('<div class="alert alert-dismissable alert-danger fade in"><button class="close" type="button"><span>×</span></button><div>An error occurred.</div></div>');
            }
        }

        function addSuccessMessage(message)
        {
            if ( message ) {
                $('.view-container .alert-area').prepend('<div class="alert alert-dismissable alert-success fade in"><button class="close" type="button"><span>×</span></button><div>' + message + '</div></div>');
            }else{
                $('.view-container .alert-area').prepend('<div class="alert alert-dismissable alert-success fade in"><button class="close" type="button"><span>×</span></button><div>Your changes were saved successfully.</div></div>');
            }
        }

        return this.each(function() {
           var $this = jQuery( this );

           if(!initialized){
              init($this);
           }

           $this.on('refresh_table', function() {
                ajax($this);
           });

        });
    };

})(jQuery); 