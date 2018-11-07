if(ipaRunningMode === 'production') {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
  ga('create', 'UA-83774200-1', 'auto');
  ga('send', 'pageview');
}

/**
 * Wrapper for ga('send', 'event' ...), used in site analytics
 */
window.ipa_analyze_event = function(category, action, label) {
  if(ipaRunningMode === 'production') {
    //ga('send', 'event', category, action, label);
    event_data = {
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    };

    if(typeof(window.ipa_user_tracking_id) === 'string') {
      event_data['userId'] = window.ipa_user_tracking_id;
    }

    console.log('sending event data ...');
    console.log(event_data);
    ga('send', 'event', event_data);
  } else {
    console.debug('Event: ' + category + ', ' + action + ', ' + label);
  }
};

// ga('send', 'event', 'link', 'click', 'http://example.com', {
//   nonInteraction: true
// });

// ga('send', 'event', {
//   eventCategory: 'Outbound Link',
//   eventAction: 'click',
//   eventLabel: event.target.href
// });

// ga('create', 'UA-XXXX-Y', {'userId': 'as8eknlll'});