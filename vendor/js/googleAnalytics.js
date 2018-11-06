if(ipaRunningMode === 'production') {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
  var sendPageViewTimerId;

  function sendPageViewIfUserIdIsSet() {
    if(typeof(window.ipa_user_tracking_id) === "undefined") {
      // Will retry next interval ...
    } else {
      // Set user ID and sending to GA ...
      ga('set', 'userId', window.ipa_user_tracking_id);
      ga('create', 'UA-83774200-1', 'auto');
      ga('send', 'pageview');
      clearInterval(sendPageViewTimerId);
    }
  }
  
  sendPageViewTimerId = setInterval(sendPageViewIfUserIdIsSet, 500);
}
