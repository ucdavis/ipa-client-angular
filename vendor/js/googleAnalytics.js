if(ipaRunningMode === 'production') {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
  var tryUserIdTimerId;

  function tryUserId() {
    console.log('window2 ...');
    if(typeof(window.ipa_user_id) === "undefined") {
      console.log('will retry ...');
    } else {
      console.log('will clear ');
      console.log(window.ipa_user_id);
      clearInterval(tryUserIdTimerId);
    }
  }
  
  tryUserIdTimerId = setInterval(tryUserId, 500);

  console.log('window ...');
  console.log(window.ipa_user_id);
  ga('create', 'UA-83774200-1', 'auto');
  ga('send', 'pageview');
}
