<?php
/*
   Plugin Name: Pro Writing Aid
   Plugin URI:  http://www.prowritingaid.com
   Description: More than just a spell/grammar check, Pro Writing Aid provides a thorough analysis of your writing to help you improve it. It highlights: sticky sentences; overused, vagues, and abstract words; repeated words and phrases, and more. Improve your writing easily in 5 minutes.
   Author:      @ProWritingAid
   Version:     1.1
   Author URI:  http://www.prowritingaid.com
*/
function prowritingaid_addbuttons() {
   // Don't bother doing this stuff if the current user lacks permissions
   if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
     return;
   // Add only in Rich Editor mode
   if ( get_user_option('rich_editing') == 'true') {
     add_filter("tiny_mce_version", "pwa_tiny_mce_version" );
     add_filter("mce_external_plugins", "add_prowritingaid_tinymce_plugin");
     add_filter('mce_buttons', 'register_prowritingaid_button');
   }
}
 
function register_prowritingaid_button($buttons) {
   array_push($buttons, "separator", "prowritingaid");
   return $buttons;
}
 
function add_prowritingaid_tinymce_plugin($plugin_array) {
   $plugin_array['prowritingaid'] = plugins_url('/prowritingaid/editor_plugin.js');
   return $plugin_array;
}

function pwa_tiny_mce_version($version) {
    return ++$version;
}

// init process for button control
add_action('init', 'prowritingaid_addbuttons');
?>