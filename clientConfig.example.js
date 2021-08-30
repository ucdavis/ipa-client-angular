/**
 * URL for the IPA API server ("the backend")
 */
var serverRoot;

if (window.location.hostname === 'test-ipa.dss.ucdavis.edu'){
	serverRoot = 'https://staging.api.ipa.ucdavis.edu';
} else if (window.location.hostname === 'ipa.ucdavis.edu') {
	serverRoot = 'https://api.ipa.ucdavis.edu';
} else {
	serverRoot = 'http://localhost:8080';
}

/**
 * URL and token for DW server
 */
var dwUrl = 'https://dw.dss.ucdavis.edu';
var dwToken = 'YOUR_DW_TOKEN';

/**
 * Debugger mode
 */
var debuggerEnabled = window.location.hostname === 'ipa.ucdavis.edu' ? false : true;
var ipaRunningMode = window.location.hostname === 'ipa.ucdavis.edu' ? 'production' : 'development';
