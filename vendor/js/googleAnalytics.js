if(window.ipaRunningMode === 'production') {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
  ga('create', 'UA-83774200-1', 'auto'); // eslint-disable-line no-undef
  ga('send', 'pageview'); // eslint-disable-line no-undef
}

/**
 * Wrapper for ga('send', 'event' ...), used in site analytics
 * 
 * @param category - IPA module used (GA recommends "object interacted with, e.g. video")
 * @param action - action performed, e.g. "mass import"
 * @param label - categorize events (a detail), e.g. "banner"
 * 
 * e.g. ipa_analyze_event(module, action_performed, optional_detail);
 * ipa_analyze_event('courses', 'mass import', 'IPA');
 */
window.ipa_analyze_event = function(category, action, label) {
  if(window.ipaRunningMode === 'production') {
    ga('send', 'event', category, action, label); // eslint-disable-line no-undef
  } else {
    console.debug('Event: ' + category + ', ' + action + ', ' + label); // eslint-disable-line no-console
  }
};
