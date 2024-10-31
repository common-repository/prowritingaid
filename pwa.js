(function(){
 
    tinymce.create('tinymce.plugins.prowritingaid', {
 
        init : function(ed, url){
            ed.addCommand('prowritingaidCmd', function(){
                var form = document.createElement("form");
                form.setAttribute("method", "post");
                form.setAttribute("action", "http://prowritingaid.com/Free-Editing-Software.aspx");
                // setting form target to a window named 'formresult'
                form.setAttribute("target", "_blank");

                var hiddenField = document.createElement("input");
                //var content = encodeURIComponent(ed.getContent({ format: 'raw' }));
				var content = encodeURIComponent(ed.getContent({ format: 'text' }));
                hiddenField.setAttribute("name", "text");
                hiddenField.setAttribute("value", content);
                form.appendChild(hiddenField);
                var hiddenField2 = document.createElement("input");
                hiddenField2.setAttribute("name", "reports");
				var availableReports = "summary,overused,cliche,pacing,initial,slength,phrases,wordsphrases,dialog,homonym,diction,vague,complex,ssentences,alliteration,consistency,sentiment,passive"; 				
                hiddenField2.setAttribute("value", availableReports);
                form.appendChild(hiddenField2);
                document.body.appendChild(form);
                form.submit();
            });
            ed.addButton('prowritingaid', {
                title: 'Analyze with Pro Writing Aid',
                image: url + '/pwabutton.gif',
                cmd: 'prowritingaidCmd'
            });
			
        },
        createControl : function(n, cm){
            return null;
        },
        getInfo : function(){
            return {
                longname: 'Pro Writing Aid Buttons',
                author: '@ProWritingAid',
                authorurl: 'http://prowritingaid.com/',
                infourl: 'http://prowritingaid.com/',
                version: "1.0"
            };
        }
    });
	
    tinymce.PluginManager.add('prowritingaid', tinymce.plugins.prowritingaid);
})();