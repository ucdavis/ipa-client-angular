import './rolesTable.css';

let rolesTable = function ($rootScope, WorkgroupActionCreators, WorkgroupService) {
	return {
		restrict: 'E',
		template: require('./rolesTable.html'),
		replace: true,
		scope: {
			userRoles: '<',
			activeRoleId: '<',
			users: '=',
			ui: '<'
		},
		link: function(scope) {
			scope.view = {
				loadingPeople: false,
				noResults: false
			};

			scope.users = [{
				"id": 1,
				"description": "Victoria Havis",
				"email": "vhavis0@abc.net.au"
				}, {
				"id": 2,
				"description": "Lara Edensor",
				"email": "ledensor1@house.gov"
				}, {
				"id": 3,
				"description": "Harriott Depka",
				"email": "hdepka2@globo.com"
				}, {
				"id": 4,
				"description": "Halette Caddick",
				"email": "hcaddick3@t-online.de"
				}, {
				"id": 5,
				"description": "Lenora Di Lucia",
				"email": "ldi4@discovery.com"
				}, {
				"id": 6,
				"description": "Jerrine Tremlett",
				"email": "jtremlett5@ca.gov"
				}, {
				"id": 7,
				"description": "Tamqrah Prettjohn",
				"email": "tprettjohn6@blogspot.com"
				}, {
				"id": 8,
				"description": "Nichols Winnett",
				"email": "nwinnett7@cargocollective.com"
				}, {
				"id": 9,
				"description": "Anthiathia Housaman",
				"email": "ahousaman8@guardian.co.uk"
				}, {
				"id": 10,
				"description": "Curt Lilly",
				"email": "clilly9@is.gd"
				}, {
				"id": 11,
				"description": "Phelia Ranaghan",
				"email": "pranaghana@exblog.jp"
				}, {
				"id": 12,
				"description": "Matty Zorro",
				"email": "mzorrob@usa.gov"
				}, {
				"id": 13,
				"description": "Olimpia Farquharson",
				"email": "ofarquharsonc@meetup.com"
				}, {
				"id": 14,
				"description": "Shayla Cod",
				"email": "scodd@samsung.com"
				}, {
				"id": 15,
				"description": "Kathye Brimm",
				"email": "kbrimme@canalblog.com"
				}, {
				"id": 16,
				"description": "Jermain Bromell",
				"email": "jbromellf@engadget.com"
				}, {
				"id": 17,
				"description": "Margarethe Zute",
				"email": "mzuteg@blinklist.com"
				}, {
				"id": 18,
				"description": "Randy Meiner",
				"email": "rmeinerh@buzzfeed.com"
				}, {
				"id": 19,
				"description": "Angelle McGarvie",
				"email": "amcgarviei@skype.com"
				}, {
				"id": 20,
				"description": "Ari Baylie",
				"email": "abayliej@spiegel.de"
				}, {
				"id": 21,
				"description": "Mitzi Bebbington",
				"email": "mbebbingtonk@wisc.edu"
				}, {
				"id": 22,
				"description": "Francis Bines",
				"email": "fbinesl@craigslist.org"
				}, {
				"id": 23,
				"description": "Agneta Redmore",
				"email": "aredmorem@pbs.org"
				}, {
				"id": 24,
				"description": "Jeane Brognot",
				"email": "jbrognotn@usnews.com"
				}, {
				"id": 25,
				"description": "Jaye Hakewell",
				"email": "jhakewello@vimeo.com"
				}, {
				"id": 26,
				"description": "Malinde Elgey",
				"email": "melgeyp@ovh.net"
				}, {
				"id": 27,
				"description": "Lev Organer",
				"email": "lorganerq@booking.com"
				}, {
				"id": 28,
				"description": "Nathalie Sarney",
				"email": "nsarneyr@vk.com"
				}, {
				"id": 29,
				"description": "Jolene Mournian",
				"email": "jmournians@google.ru"
				}, {
				"id": 30,
				"description": "Kandy MacGill",
				"email": "kmacgillt@deviantart.com"
				}, {
				"id": 31,
				"description": "Guinna Poad",
				"email": "gpoadu@tumblr.com"
				}, {
				"id": 32,
				"description": "Daile Mothersole",
				"email": "dmothersolev@about.me"
				}, {
				"id": 33,
				"description": "Meggie Kebbell",
				"email": "mkebbellw@chronoengine.com"
				}, {
				"id": 34,
				"description": "Trevar Gooms",
				"email": "tgoomsx@seesaa.net"
				}, {
				"id": 35,
				"description": "Glori Matussevich",
				"email": "gmatussevichy@about.com"
				}, {
				"id": 36,
				"description": "Noam Cackett",
				"email": "ncackettz@wunderground.com"
				}, {
				"id": 37,
				"description": "Kevon Pretsell",
				"email": "kpretsell10@elegantthemes.com"
				}, {
				"id": 38,
				"description": "Mandi M'cowis",
				"email": "mmcowis11@shutterfly.com"
				}, {
				"id": 39,
				"description": "Griffy Yakubovics",
				"email": "gyakubovics12@businessinsider.com"
				}, {
				"id": 40,
				"description": "Eleni Tarbet",
				"email": "etarbet13@ted.com"
				}, {
				"id": 41,
				"description": "Byrom Geldeford",
				"email": "bgeldeford14@lycos.com"
				}, {
				"id": 42,
				"description": "Elsinore Rainy",
				"email": "erainy15@gizmodo.com"
				}, {
				"id": 43,
				"description": "Rayshell Schonfeld",
				"email": "rschonfeld16@nih.gov"
				}, {
				"id": 44,
				"description": "Zena Beatey",
				"email": "zbeatey17@hostgator.com"
				}, {
				"id": 45,
				"description": "Shurlocke Blackmuir",
				"email": "sblackmuir18@japanpost.jp"
				}, {
				"id": 46,
				"description": "Agneta Aleksahkin",
				"email": "aaleksahkin19@163.com"
				}, {
				"id": 47,
				"description": "Riobard Keilloh",
				"email": "rkeilloh1a@cmu.edu"
				}, {
				"id": 48,
				"description": "Seka Hurworth",
				"email": "shurworth1b@nsw.gov.au"
				}, {
				"id": 49,
				"description": "Valerye Grimshaw",
				"email": "vgrimshaw1c@canalblog.com"
				}, {
				"id": 50,
				"description": "Dulsea Lilleman",
				"email": "dlilleman1d@paginegialle.it"
				}, {
				"id": 51,
				"description": "Anatollo Betchley",
				"email": "abetchley1e@flickr.com"
				}, {
				"id": 52,
				"description": "Adelind Cicchetto",
				"email": "acicchetto1f@theatlantic.com"
				}, {
				"id": 53,
				"description": "Giuseppe Niland",
				"email": "gniland1g@google.it"
				}, {
				"id": 54,
				"description": "Anna Strickett",
				"email": "astrickett1h@acquirethisname.com"
				}, {
				"id": 55,
				"description": "Catlee Sisneros",
				"email": "csisneros1i@ed.gov"
				}, {
				"id": 56,
				"description": "Moshe Meekins",
				"email": "mmeekins1j@delicious.com"
				}, {
				"id": 57,
				"description": "Garnet Shoulder",
				"email": "gshoulder1k@washingtonpost.com"
				}, {
				"id": 58,
				"description": "Brianne Battershall",
				"email": "bbattershall1l@so-net.ne.jp"
				}, {
				"id": 59,
				"description": "Belinda Pettis",
				"email": "bpettis1m@miitbeian.gov.cn"
				}, {
				"id": 60,
				"description": "Fairfax Arzu",
				"email": "farzu1n@cloudflare.com"
				}, {
				"id": 61,
				"description": "Jsandye Beecraft",
				"email": "jbeecraft1o@naver.com"
				}, {
				"id": 62,
				"description": "Bethina Podbury",
				"email": "bpodbury1p@pcworld.com"
				}, {
				"id": 63,
				"description": "Vilhelmina Arent",
				"email": "varent1q@youku.com"
				}, {
				"id": 64,
				"description": "Annissa Wardhough",
				"email": "awardhough1r@tuttocitta.it"
				}, {
				"id": 65,
				"description": "Merry Woodhams",
				"email": "mwoodhams1s@wordpress.com"
				}, {
				"id": 66,
				"description": "Frankie Yon",
				"email": "fyon1t@nbcnews.com"
				}, {
				"id": 67,
				"description": "Kerrin Brogioni",
				"email": "kbrogioni1u@wikispaces.com"
				}, {
				"id": 68,
				"description": "Darrin Gillions",
				"email": "dgillions1v@nih.gov"
				}, {
				"id": 69,
				"description": "Susi Scalera",
				"email": "sscalera1w@rakuten.co.jp"
				}, {
				"id": 70,
				"description": "Trish Bernt",
				"email": "tbernt1x@theglobeandmail.com"
				}, {
				"id": 71,
				"description": "Keriann Sabate",
				"email": "ksabate1y@yale.edu"
				}, {
				"id": 72,
				"description": "Devora Merrydew",
				"email": "dmerrydew1z@samsung.com"
				}, {
				"id": 73,
				"description": "Caspar Golson",
				"email": "cgolson20@acquirethisname.com"
				}, {
				"id": 74,
				"description": "Mae Bradder",
				"email": "mbradder21@friendfeed.com"
				}, {
				"id": 75,
				"description": "Shoshanna MacCumiskey",
				"email": "smaccumiskey22@bravesites.com"
				}, {
				"id": 76,
				"description": "Bud Stubbings",
				"email": "bstubbings23@devhub.com"
				}, {
				"id": 77,
				"description": "Vite Gregorio",
				"email": "vgregorio24@myspace.com"
				}, {
				"id": 78,
				"description": "Bailey Bogays",
				"email": "bbogays25@tamu.edu"
				}, {
				"id": 79,
				"description": "Ashlin Mousley",
				"email": "amousley26@howstuffworks.com"
				}, {
				"id": 80,
				"description": "Matt Edie",
				"email": "medie27@icio.us"
				}, {
				"id": 81,
				"description": "Theressa Croston",
				"email": "tcroston28@yellowpages.com"
				}, {
				"id": 82,
				"description": "Aymer Norgate",
				"email": "anorgate29@ifeng.com"
				}, {
				"id": 83,
				"description": "Freeman Striker",
				"email": "fstriker2a@seesaa.net"
				}, {
				"id": 84,
				"description": "Pierre Eichmann",
				"email": "peichmann2b@nasa.gov"
				}, {
				"id": 85,
				"description": "Bary Birkenhead",
				"email": "bbirkenhead2c@vk.com"
				}, {
				"id": 86,
				"description": "Eudora Spencelayh",
				"email": "espencelayh2d@dell.com"
				}, {
				"id": 87,
				"description": "Whitney McPartling",
				"email": "wmcpartling2e@ted.com"
				}, {
				"id": 88,
				"description": "Lorilyn Mangeot",
				"email": "lmangeot2f@amazon.com"
				}, {
				"id": 89,
				"description": "Lutero Jonuzi",
				"email": "ljonuzi2g@ed.gov"
				}, {
				"id": 90,
				"description": "Nettle Trevenu",
				"email": "ntrevenu2h@dot.gov"
				}, {
				"id": 91,
				"description": "Greer Barkworth",
				"email": "gbarkworth2i@theatlantic.com"
				}, {
				"id": 92,
				"description": "Brenda Cottham",
				"email": "bcottham2j@macromedia.com"
				}, {
				"id": 93,
				"description": "Lalo Duddle",
				"email": "lduddle2k@goo.ne.jp"
				}, {
				"id": 94,
				"description": "Joshua Nardrup",
				"email": "jnardrup2l@elegantthemes.com"
				}, {
				"id": 95,
				"description": "Franky Banks",
				"email": "fbanks2m@engadget.com"
				}, {
				"id": 96,
				"description": "Archibald Ashness",
				"email": "aashness2n@virginia.edu"
				}, {
				"id": 97,
				"description": "Paulo Beneze",
				"email": "pbeneze2o@cloudflare.com"
				}, {
				"id": 98,
				"description": "Krystle Kornel",
				"email": "kkornel2p@adobe.com"
				}, {
				"id": 99,
				"description": "Leesa Lavrick",
				"email": "llavrick2q@sitemeter.com"
				}, {
				"id": 100,
				"description": "Bernetta Addlestone",
				"email": "baddlestone2r@jimdo.com"
				}];


			scope.removeUserRole = function (userRole) {
				WorkgroupActionCreators.removeRoleFromUser(userRole.userId, userRole.roleId, userRole);
			};

			scope.clearUserSearch = function () {
				scope.users.newUser = {};
				scope.users.searchQuery = "";
				scope.view.noResults = false;
			};

			scope.searchOnChange = function () {
				scope.view.noResults = false;
				scope.users.newUser = {};
			};

			scope.searchUsers = function (query) {
				return WorkgroupService.searchUsers(scope.ui.workgroupId, query).then(function (userSearchResults) {
					return userSearchResults;
				}, function () {
					$rootScope.$emit('toast', {message: "Could not search users.", type: "ERROR"});
				});
			};

			scope.searchUsersResultSelected = function ($item) {
				scope.users.newUser = $item;
			};

			scope.addUserToWorkgroup = function() {
				scope.users.newUser;
				WorkgroupActionCreators.createUser(scope.ui.workgroupId, scope.users.newUser, scope.activeRoleId);
				scope.clearUserSearch();
			};
		}
	};
};

export default rolesTable;
