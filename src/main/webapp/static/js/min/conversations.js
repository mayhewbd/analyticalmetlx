var Conversations=function(){var f="",l=[],c={},A="external",g=0,h="",B=0,m=!1,C=void 0,v=void 0;$(function(){v=$("#searchResults");C=v.find(".searchResultItem").clone();v.empty()});var w=function(){var a={},b=function(b,e,c){e=sprintf("/thumbnailDataUri/%s",b.id);$.ajax({url:e,beforeSend:function(a){a.overrideMimeType("text/plain; charset=x-user-defined")},dataType:"text"}).done(function(e){a[b.id]={data:e,when:Date.now()};c.attr("src",e)})},e=function(a,b){var e=$("<canvas />");e.width=a;e.height=
b;e.attr("width",a);e.attr("height",b);var c=e[0].getContext("2d");c.rect(0,0,a,b);c.fillStyle="white";c.fill();return e[0].toDataURL()}(320,240),d=function(c){var d=$("#thumbScrollContainer"),f=d.height(),d=d.find(sprintf("#slideContainer_%s",c.id));try{var g=d.find("img"),h=d.position().top,k=h+d.height();if(h==k)g.attr("src",e);else if(0<=k&&h<=f){var l=d.find("img");c.id in a&&a[c.id].when>Date.now()-1E4?l.attr("src",a[c.id].data):b(c,d,l)}}catch(m){console.log("exception while painting thumb: ",
m)}};return{paintThumb:d,paintAllThumbs:_.debounce(function(){_.forEach(c.slides,function(a){var b=$(sprintf("#slideContainer_%s img",a.id));0==b.height()||void 0==b.height()?(b.on("load",function(){b.off("load");d(a)}),b.attr("src",e)):d(a)})},500),clearCache:function(){a={}}}}(),K=function(a){return!("slides"in c)||"slides"in a&&_.some(a,function(a,e){var d=c.slides[e];return d&&"id"in d&&"id"in a&&"index"in a&&"index"in d&&d.id==a.id&&d.index==a.index?!1:!0})},p=function(){try{w.paintAllThumbs()}catch(a){console.log("exception while painting thumbs",
a)}},N=function(){updateStatus("Refreshing slide display");var a=$("#slideContainer");a.html(unwrap(c.slides.sort(function(a,e){return a.index-e.index}).map(L)));$("#slideControls").html([x("addSlideButton","Add Slide","fa-angle-left",D,E),x("nextSlideButton","Next Slide","fa-angle-right",F,E),x("prevSlideButton","Prev Slide","fa-plus",M,k)]);a.off("scroll");a.on("scroll",p);Progress.call("onLayoutUpdated")},G=function(a){var b=c.permissions;changePermissionsOfConversation(c.jid.toString(),{studentCanOpenFriends:b.studentCanOpenFriends,
studentCanPublish:a,usersAreCompulsorilySynced:b.usersAreCompulsorilySynced})},H=function(a){var b=c.permissions;changePermissionsOfConversation(c.jid.toString(),{studentCanOpenFriends:b.studentCanOpenFriends,studentCanPublish:b.studentCanPublish,usersAreCompulsorilySynced:a})},q=function(){m=!0;y()},r=function(){"permissions"in c&&!k(c)&&c.permissions.usersAreCompulsorilySynced||(m=!1,y())},y=function(){m?($("#enableSync").addClass("activePrivacy active"),$("#disableSync").removeClass("activePrivacy active")):
($("#enableSync").removeClass("activePrivacy active"),$("#disableSync").addClass("activePrivacy active"));$("#followTeacherCheckbox").prop("checked",m)},O=function(a){(!k(c)||!UserSettings.getIsInteractive())&&"slides"in c&&0<c.slides.filter(function(b){return b.id.toString()==a.toString()}).length&&(B=a,Conversations.getIsSyncedToTeacher()&&g!=a&&(g=a,n(a)))},F=function(){if("slides"in c&&0<g){var a=_.find(c.slides,function(a){return a.id==g}),b=_.find(c.slides,function(b){return b.index==a.index+
1});void 0!=b&&"id"in b&&n(b.id.toString())}},D=function(){if("slides"in c&&0<g){var a=_.find(c.slides,function(a){return a.id==g}),b=_.find(c.slides,function(b){return b.index==a.index-1});void 0!=b&&"id"in b&&n(b.id.toString())}},t=function(){var a=window.location.origin,b=sprintf("/join?conversation=%s&slide=%s",h,g),e=sprintf("/projector/%s",h);$("#shareLink").html($("<a/>",{href:b,text:a+b}));$("#projectorLink").html($("<a/>",{href:e,text:a+e})).on("click",bounceAnd(function(){var a=document.documentElement;
(a.requestFullScreen||a.webkitRequestFullScreen||a.mozRequestFullScreen).call(a);DeviceConfiguration.setCurrentDevice("projector");return!1}));""==h||0==g?($("#projectorViewLink").empty(),$("#slideDeepLink").empty(),$("#conversationDeepLink").empty(),$("#oneNoteExport").empty()):($("#projectorViewLink").html($("<a/>",{href:sprintf("/board?conversationJid=%s&slideId=%s&showTools=false",h,g),text:"Project this conversation"})),$("#slideDeepLink").html($("<a/>",{href:sprintf("/board?conversationJid=%s&slideId=%s",
h,g),text:"DeepLink this slide"})),$("#conversationDeepLink").html($("<a/>",{href:sprintf("/board?conversationJid=%s",h),text:"Deeplink this conversation"})),$("#oneNoteExport").html($("<a/>",{href:sprintf("/saveToOneNote/%s",h),text:"Export this conversation"})))},P=function(a){var b=k(a),e=$("#studentsCanPublishCheckbox");e.off("change");e.prop("checked",a.permissions.studentCanPublish);e.prop("disabled",!b);if(b)e.on("change",function(){G(e.is(":checked"))});var c=$("#studentsMustFollowTeacherCheckbox");
c.off("change");c.prop("checked",a.permissions.usersAreCompulsorilySynced);c.prop("disabled",!b);var f=$("#followTeacherCheckbox");f.off("change");f.prop("checked",m);if(b)c.on("change",function(){H(c.is(":checked"))});else f.on("change",function(){var a=m,b=f.is(":checked");a!=b&&(b?q():r())});f.prop("disabled",a.permissions.usersAreCompulsorilySynced);b?($("#syncButtons").hide(),$("#syncCheckbox").hide()):($("#syncButtons").show(),$("#syncCheckbox").show())},R=function(a){a.jid==c.jid&&(!k(a)&&
a.permissions.usersAreCompulsorilySynced&&q(),P(a),updateConversationHeader(),t(),y(),K(a)&&N());Q(a)},Q=function(a){l=l.map(function(b){return b.jid==a.jid?a:b});u()},k=function(a){a||(a=c);return"author"in a&&a.author.toLowerCase()==UserSettings.getUsername().toLowerCase()?!0:!1},I=function(a){a||(a=c);return"blacklist"in a&&_.includes(a.blacklist,UserSettings.getUsername())},z=function(a){a||(a=c);return"subject"in a&&"deleted"!=a.subject.toLowerCase()&&("author"in a&&a.author==UserSettings.getUsername()||
_.some(UserSettings.getUserGroups(),function(b){return b.value.toLowerCase()==a.subject.toLowerCase()}))?!0:!1},u=function(){try{var a=_.sortBy(l.filter(function(a){return z(a)}),function(a){return new Date(a.created)}).reverse().map(S),b=$("#searchResults");0<_.size(a)?b.html(unwrap(a)):b.html($("<div/>",{text:"No search results found"}))}catch(e){console.log("refreshConversationSearchResults",e)}},x=function(a,b,e,d,f){return f(c)?$("<button/>",{id:a,"class":sprintf("toolbar fa %s btn-icon nmt",
e),name:a,type:"button"}).append($("<div class='icon-txt' />",{text:b})).on("click",bounceAnd(d)):$("<div/>")},M=function(){var a=c.jid,b=c.slides.filter(function(a){return a.id==g})[0].index+1;addSlideToConversationAtIndex(c.jid,b);Progress.conversationDetailsReceived.JoinAtIndexIfAvailable=function(c){"jid"in c&&c.jid==a&&"slides"in c&&(c=_.find(c.slides,function(a){return a.index==b&&a.id!=g}),n(c.id.toString()))}},E=function(){return!0},n=function(a){J(a);delete Progress.conversationDetailsReceived.JoinAtIndexIfAvailable;
WorkQueue.enqueue(function(){loadSlide(a);return!0})},J=function(a){$(".slideButtonContainer").removeClass("activeSlide");$(sprintf("#slideContainer_%s",a)).addClass("activeSlide")},L=function(a){var b=a.index+1,e=$("<div/>",{id:sprintf("slideContainer_%s",a.id),"class":"slideButtonContainer"});$("<img/>",{id:sprintf("slideButton_%s",a.id),"class":"thumbnail",alt:sprintf("Slide %s",b),title:sprintf("Slide %s (%s)",b,a.id)}).on("click",function(b){r();n(a.id.toString())}).appendTo(e);$("<span/>",{text:sprintf("%s/%s",
b,c.slides.length),"class":"slideThumbnailNumber"}).appendTo($("<div/>").addClass("slide-count").appendTo(e));return e},S=function(a){var b=function(b){return sprintf("%s_%s",b,a.jid)},c=a.jid.toString(),d=C.clone();d.attr("id",b("conversation")).on("click",bounceAnd(function(d){var f=d.target.parentElement.parentElement.id;d.target.parentElement.id!=b("extraConversationTools")&&f!=b("extraConversationTools")&&(h=c,d=a.slides.filter(function(a){return 0==a.index})[0],hideBackstage(),n(d.id.toString()))}));
c=a.jid.toString();d.find(".searchResultTopRow");d.find(".searchResultMiddleRow");d.find(".teacherConversationTools").attr("id",b("extraConversationTools"));d.find(".conversationTitle").attr("id",b("conversationTitle")).text(a.title);d.find(".conversationAuthor").text(a.author);d.find(".conversationSubject").text(a.subject);d.find(".conversationCreated").text(a.created);k(a)?(d.find(".conversationRename").attr("id",b("conversationRenameSubmit")).attr("name",b("conversationRenameSubmit")).on("click",
function(){requestRenameConversationDialogue(c)}),d.find(".conversationShare").attr("id",b("conversationChangeSubjectSubmit")).attr("name",b("conversationChangeSubjectSubmit")).on("click",function(){requestChangeSubjectOfConversationDialogue(c)}),d.find(".conversationDelete").attr("id",b("conversationDelete")).attr("name",b("conversationDelete")).on("click",function(){requestDeleteConversationDialogue(c)})):d.find(".teacherConversationTools").remove();"jid"in a&&h.trim().toLowerCase()==a.jid.toString().trim().toLowerCase()&&
d.addClass("activeConversation");return d};Progress.newConversationDetailsReceived.Conversations=function(a){if(-1<a.title.indexOf(f)||-1<a.author.indexOf(f))l=_.filter(l,function(b){return b.jid!=a.jid}),l.push(a),u()};Progress.conversationsReceived.Conversations=function(a){l=a;u()};Progress.syncMoveReceived.Conversations=function(a){(Conversations.getIsSyncedToTeacher()&&!k(c)||!UserSettings.getIsInteractive())&&"slides"in c&&0<c.slides.filter(function(b){return b.id.toString()==a.toString()}).length&&
WorkQueue.enqueue(function(){O(a);return!1})};Progress.conversationDetailsReceived.Conversations=function(a){var b="";"jid"in c&&(b=c.jid.toString().toLowerCase());try{updateStatus(sprintf("Updating to conversation %s",a.jid)),a.jid.toString().toLowerCase()==h.toLowerCase()&&(z(a)?(c=a,"configName"in a&&(A=a.configName),A,c.jid.toString().toLowerCase()!=b&&(Progress.call("onConversationJoin"),w.clearCache())):(c={},h="")),R(a),!_.some(l,function(b){return b.jid==a.jid})&&k(a)&&(l.push(a),u())}catch(e){updateStatus(sprintf("FAILED: ReceiveConversationDetails exception: %s",
e))}Progress.call("onLayoutUpdated")};Progress.currentSlideJidReceived.Conversations=function(a){g=a;J(a);t()};Progress.currentConversationJidReceived.Conversations=function(a){h=a;t()};Progress.onLayoutUpdated.Conversations=p;Progress.historyReceived.Conversations=p;$(function(){$("#thumbScrollContainer").on("scroll",p);$("#conversations").click(function(){showBackstage("conversations")});$("#importConversationButton").on("click",bounceAnd(function(){importConversation()}));$("#createConversationButton").on("click",
bounceAnd(function(){createConversation(sprintf("%s created on %s",UserSettings.getUsername(),Date()))}));$("#myConversationsButton").on("click",bounceAnd(function(){getSearchResult(UserSettings.getUsername())}));$("#searchButton").on("click",bounceAnd(function(){getSearchResult(f)}));var a=function(a){f=this.value;13==a.which&&(a.stopPropagation(),getSearchResult(f))},b=$("#searchForConversationBox");_.forEach(["blur","change","focus","keydown","select"],function(c){b.on(c,a)});$("<div />",{text:"share",
id:"shareButton","class":"icon-txt"}).on("click",bounceAnd(function(){$("#shareContainer").toggle();t()})).appendTo($("#shareButton"));$("#closeSharingButton").on("click",bounceAnd(function(){$("#shareContainer").toggle()}))});return{inConversation:function(){return 0<Conversations.getCurrentConversationJid().length},isAuthor:function(){return Conversations.inConversation()?UserSettings.getUsername()==Conversations.getCurrentConversation().author:!1},getCurrentTeacherSlide:function(){return B},getCurrentSlideJid:function(){return g},
getCurrentSlide:function(){return _.find(c.slides,function(a){return a.id.toString()==g.toString()})},getCurrentConversationJid:function(){return"jid"in c?c.jid.toString():h},getCurrentConversation:function(){return c},getIsSyncedToTeacher:function(){return m},getIsSyncedToTeacherDescriptor:function(){return m?"sync on":"sync off"},getConversationModeDescriptor:function(){return c&&c.permissions&&c.permissions.studentCanPublish?"collaboration enabled":"collaboration disabled"},enableSyncMove:q,disableSyncMove:r,
toggleSyncMove:function(){m?r():q()},setStudentsCanPublish:G,getStudentsCanPublish:function(){return c.permissions.studentCanPublish},setStudentsMustFollowTeacher:H,getStudentsMustFollowTeacher:function(){return c.permissions.usersAreCompulsorilySynced},shouldDisplayConversation:z,shouldPublishInConversation:function(a){a||(a=c);return"permissions"in a&&"studentCanPublish"in a.permissions&&(k(a)||a.permissions.studentCanPublish)&&!I(a)?!0:!1},shouldModifyConversation:k,goToNextSlide:F,goToPrevSlide:D,
updateThumbnail:function(a){var b=$("#slideContainer"),c=b.height();w.paintThumb({id:a,index:0},b,c)},getIsBanned:I}}();function unwrap(f){return _.map(f,"0")}function receiveCurrentSlide(f){Progress.call("currentSlideJidReceived",[f])}function receiveCurrentConversation(f){Progress.call("currentConversationJidReceived",[f])}function receiveConversationDetails(f){Progress.call("conversationDetailsReceived",[f])}
function receiveSyncMove(f){Conversations.getIsSyncedToTeacher()&&Progress.call("syncMoveReceived",[f])}function receiveNewConversationDetails(f){Progress.call("newConversationDetailsReceived",[f])}function receiveConversations(f){Progress.call("conversationsReceived",[f])};
