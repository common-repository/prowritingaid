(function () {
    var each = tinymce.each, DOM = tinymce.DOM;
    tinymce.create('tinymce.plugins.prowritingaid', {
        initPWAUtil: function (editor, plugin) {
            var util = new PWAUtil();
            util.map = each;
            util.getAttrib = function (node, key) {
                return editor.dom.getAttrib(node, key);
            };

            util.findSpans = function (parent) {
                if (parent == undefined)
                    return editor.dom.select('span');
                else
                    return editor.dom.select('span', parent);
            };

            util.hasClass = function (node, className) {
                return editor.dom.hasClass(node, className);
            };

            util.contents = function (node) {
                return node.childNodes;
            };

            util.replaceWith = function (old_node, new_node) {
                return editor.dom.replace(new_node, old_node);
            };

            util.removeParent = function (node) {
                editor.dom.remove(node, 1);
                return node;
            };

            util.remove = function (node) {
                editor.dom.remove(node);
            };
            return util;
        },
        init: function (ed, url) {
            var t = this;
            var plugin = this;
            var editor = ed;
            var util = this.initPWAUtil(editor, plugin);
            this.url = url;
            this.editor = ed;
            ed.util = util;

            ed.addCommand('prowritingaidClearCmd', function () {
                // test clearing all of the spans from the DOM
                plugin._removeWords();
            });

            ed.addCommand('prowritingaidOverusedCmd', function () {
                plugin._runReport("overused");
            });

            ed.addCommand('prowritingaidClicheCmd', function () {
                plugin._runReport("cliche");
            });

            ed.addCommand('prowritingaidGrammarCmd', function () {
                plugin._runReport("grammar");
            });

            ed.addCommand('prowritingaidSSentencesCmd', function () {
                plugin._runReport("ssentences");
            });

            ed.addCommand('prowritingaidPassivesCmd', function () {
                plugin._runReport("passive");
            });

            ed.addCommand('prowritingaidDVACmd', function () {
                plugin._runReport("dva");
            });

            ed.addCommand('prowritingaidTimeCmd', function () {
                plugin._runReport("time");
            });

            ed.addCommand('prowritingaidWordsAndPhrasesCmd', function () {
                plugin._runReport("wordsandphrases");
            });

            ed.addCommand('prowritingaidCmd', function () {
                var form = document.createElement("form");
                form.setAttribute("method", "post");
                form.setAttribute("action", "http://prowritingaid.com/Free-Editing-Software.aspx");

                // setting form target to a window named 'formresult'
                form.setAttribute("target", "_blank");

                var hiddenField = document.createElement("input");
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

            editor.onClick.add(plugin._showMenu, plugin);

            editor.onContextMenu.add(plugin._showMenu, plugin);

            /* strip out the markup before the contents is serialized (and do it on a copy of the markup so we don't affect the user experience) */
            editor.onPreProcess.add(function (sender, object) {
                var dom = sender.dom;

                each(dom.select('span', object.node).reverse(), function (n) {
                    if (n && (dom.hasClass(n, 'hiddenGrammarError') || dom.hasClass(n, 'hiddenSpellError') || dom.hasClass(n, 'hiddenSuggestion') || dom.hasClass(n, 'mceItemHidden') || (dom.getAttrib(n, 'class') == "" && dom.getAttrib(n, 'style') == "" && dom.getAttrib(n, 'id') == "" && !dom.hasClass(n, 'Apple-style-span') && dom.getAttrib(n, 'mce_name') == ""))) {
                        dom.remove(n, 1);
                    }
                });
            });

            /* strip out the markup before the contents is serialized (and do it on a copy of the markup so we don't affect the user experience) */
            editor.onPreProcess.add(function (sender, object) {
                var dom = sender.dom;

                each(dom.select('span', object.node).reverse(), function (n) {
                    if (n && (dom.hasClass(n, 'pwa'))) {
                        dom.remove(n, 1);
                    }
                });
            });

            /* cleanup the HTML before executing certain commands */
            editor.onBeforeExecCommand.add(function (editor, command) {
                if (command == 'mceCodeEditor') {
                    plugin._removeWords();
                }
                else if (command == 'mceFullScreen') {
                    plugin._done();
                }
            });

            ed.addButton('prowritingaid', {
                title: 'Analyze with Pro Writing Aid',
                image: url + '/pwabutton.gif',
                cmd: 'prowritingaidCmd'
            });
            ed.addButton('prowritingaidOverused', {
                title: 'Find overused words',
                image: url + '/pwaoverused.gif',
                cmd: 'prowritingaidOverusedCmd'
            });
            ed.addButton('prowritingaidCliche', {
                title: 'Find cliches and redundancies',
                image: url + '/pwacliches.gif',
                cmd: 'prowritingaidClicheCmd'
            });
            ed.addButton('prowritingaidSSentences', {
                title: 'Find sticky sentences',
                image: url + '/pwassentences.gif',
                cmd: 'prowritingaidSSentencesCmd'
            });
            ed.addButton('prowritingaidGrammar', {
                title: 'Find spelling and grammar issues',
                image: url + '/pwagrammar.gif',
                cmd: 'prowritingaidGrammarCmd'
            });
            ed.addButton('prowritingaidPassives', {
                title: 'Find passives, adverbs and hidden verbs',
                image: url + '/pwapassives.gif',
                cmd: 'prowritingaidPassivesCmd'
            });
            ed.addButton('prowritingaidDVA', {
                title: 'Find diction problems, vague, abstract and complex words',
                image: url + '/pwadva.gif',
                cmd: 'prowritingaidPassivesCmd'
            });
            ed.addButton('prowritingaidWordsAndPhrases', {
                title: 'Find repeated words and phrases',
                image: url + '/pwawordsandphrases.gif',
                cmd: 'prowritingaidWordsAndPhrasesCmd'
            });
            ed.addButton('prowritingaidTime', {
                title: 'Find references to time',
                image: url + '/pwatime.gif',
                cmd: 'prowritingaidTimeCmd'
            });
            ed.addButton('prowritingaidClear', {
                title: 'Clear Pro Writing Aid markings',
                image: url + '/pwaclear.png',
                cmd: 'prowritingaidClearCmd'
            });

        },
        createControl: function (n, cm) {
            return null;
        },
        _done: function () {
            var plugin = this;
            plugin._removeWords();

            if (plugin._menu) {
                plugin._menu.hideMenu();
            }

            plugin.editor.nodeChanged();
        },
        _removeWords: function (w) {
            var ed = this.editor, dom = ed.dom, se = ed.selection, b = se.getBookmark();

            ed.util.removeTags(undefined, w);

            /* force a rebuild of the DOM... even though the right elements are stripped, the DOM is still organized
            as if the span were there and this breaks my code */

            dom.setHTML(dom.getRoot(), dom.getRoot().innerHTML);

            se.moveToBookmark(b);
        },
        _runReport: function (r) {
            // we make an ajax call to the service with the content and replace it when it comes back
            var ed = this.editor;
            tinyMCE.activeEditor.setProgressState(true);
            this._removeWords();
            var reportname = r;
            var content = ed.getContent({ format: 'raw' });
            var data = {
                action: 'PWA_redirect_call',
                text: encodeURIComponent(content),
                report: reportname
            };
            // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
            jQuery.post(ajaxurl, data, function (response) {
                if (response.lastIndexOf('Analysis Error:', 0) === 0) {
                    ed.windowManager.alert("Unexpected analysis error. " + response);
                }
                else if (response.lastIndexOf('License Error:', 0) === 0) {
                    ed.windowManager.alert("There is a problem with your license. " + response);
                }
                else if (response.lastIndexOf('No Licence Error:', 0) === 0) {
                    ed.windowManager.alert("You need a valid license to use this functionality for over 200 words. Click the green 'Go Premium' button to get a license. If you have one you may need to login.");
                }
                else {
                    ed.setContent(response, { format: 'raw' });
                }
                tinyMCE.activeEditor.setProgressState(false);
            });
        },
        _showMenu: function (ed, e) {
            var t = this, ed = t.editor, m = t._menu, p1, dom = ed.dom, vp = dom.getViewPort(ed.getWin());

            if (!m) {
                p1 = DOM.getPos(ed.getContentAreaContainer());

                m = ed.controlManager.createDropMenu('spellcheckermenu',
                {
                    offset_x: p1.x,
                    offset_y: p1.y,
                    'class': 'mceNoIcons'
                });

                t._menu = m;
            }

            if (ed.util.isMarkedNode(e.target) && ed.util.hasSuggestions(e.target)) {
                m.removeAll();

                var errorSuggestions = ed.util.findSuggestions(e.target).split(',');

                for (var i = 0; i < errorSuggestions.length; i++) {
                    (function (sugg) {
                        if (sugg == "(none)") {
                            m.add({
                                title: "No suggestions",
                                onclick: function () {                                   
                                }
                            });
                        }
                        else {
                            m.add({
                                title: sugg,
                                onclick: function() {
                                    ed.util.applySuggestion(e.target, sugg);                                    
                                }
                            }); 
                        }
                    })(errorSuggestions[i]);
                }
                m.add({
                    title: "Ignore",
                    onclick: function () {
                        ed.util.removeParent(e.target);
                    }
                });
                m.add({
                    title: "Ignore all",
                    onclick: function () {
                        // iterate the names of all the 
                        var className = "none";
                        var classList = e.target.className.split(/\s+/);
                        for (var i = 0; i < classList.length; i++) {
                            if (classList[i].match("^grammarGroup")) {
                                className = classList[i];
                            }
                        }
                        ed.util.removeTagsByClass(e.target, className);
                    }
                });
                ed.selection.select(e.target);
                p1 = dom.getPos(e.target);
                m.showMenu(p1.x, p1.y + e.target.offsetHeight - vp.y);

                return tinymce.dom.Event.cancel(e);
            }
            else {
                m.hideMenu();
            }
        },
        getInfo: function () {
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