function showOffscreenElement(e){var d=e.bounds,d=Math.atan2(viewboxY+viewboxHeight/2+contentOffsetY-d.centerY,d.centerX-(viewboxX+viewboxWidth/2+contentOffsetX))+Math.PI/2,h=boardWidth/2,f=boardHeight/2,f=f+f*Math.cos(d);e.offscreenElement.css({position:"absolute",left:px(h+h*Math.sin(d)*.96),top:px(f)}).show()}
function precacheOffscreenElement(e){var d=e.bounds;console.log("precached element for ",e.identity);e.offscreenElement=Canvas.circle(e.color[0],20).click(function(){viewboxX=d.centerX-viewboxWidth/2;viewboxY=d.centerY-viewboxHeight/2;blit()}).appendTo("#radar")}
var GroupFinder=function(){var e=function(){$("#radar").empty();var a=_.sortBy(_.values(boardContent.inks),function(a){return a.timestamp}),b=[],c={items:[]},e=0;$.each(a,function(a,p){1E4>p.timestamp-e?c.items.push(p):(b.push(c),c={items:[p]});e=p.timestamp});b.push(c);b=_.filter(b,function(a){return 0<a.items.length});$.each(b,function(a,b){b.identity=b.items[0].identity;b.bounds=_.reduce(b.items,function(a,b){return mergeBounds(a,b.bounds)},b.items[0].bounds);b.color=b.items[0].color;var c=$("<canvas />");
c.attr("width",px(b.bounds.width));c.attr("height",px(b.bounds.height));b.canvas=c[0];var e=b.canvas.getContext("2d");$.each(b.items,function(a,c){e.drawImage(c.canvas,c.bounds[0]-b.bounds.minX,c.bounds[1]-b.bounds.minY)});precacheOffscreenElement(b)});console.log("contentGroups",b.length,b);return b};String.prototype.hashCode=function(){var a=0,b;if(0==this.length)return a;for(var c=0;c<this.length;c++)b=this.charCodeAt(c),a=(a<<5)-a+b,a&=a;return a};var d=function(a,b){$("#targetSlide").text(a);
showSpinner();setTimeout(b,2500)},h=function(a){return _.map(a.members,"nickname").join(", ")},f=function(a,b){$.each(g,function(b,e){k(c[a.name],e)});b.members[a.name]=a;$("#groupHud").html(unwrap(_.values(b.members).map(function(a){return $("<img />",{"class":"groupMemberPortrait",width:px(50),height:px(50)})}))).show()},k=function(a,b){delete b.members[a.name];$("#groupHud").hide()},q=function(a){var b=$("<iframe />",{src:a.url}).css({position:"absolute",top:0,left:0,width:"100%",height:"100%",
"background-color":"white"}).insertAfter($("#marquee")),c=loadSlide;loadSlide=function(a){b.remove();loadSlide=c;loadSlide(a)}},l=function(a){return"progress"in a&&"goal"in a&&a.progress>=a.goal},m=function(a){var b=$("<div />",{"class":"groupOverview"});l(a)?$("<div />",{text:"Closed",title:"This group has completed their exercise","class":"closedGroup"}).appendTo(b):c[username].name in a.members?$("<div />",{text:"Leave",click:function(){k(c[username],a);d(sprintf("Leaving %s",h(a)),n)}}).appendTo(b):
a.isFormal?$("<div />",{text:"Closed",title:"You may not join this group because it will be submitting this work for formal group assessment"}).addClass("closedGroup").appendTo(b):$("<div />",{text:"Join",click:function(){f(c[username],a);d(sprintf("Expanding group to %s",h(a)),function(){switch(a.medium){case "quizzing":loadSlide(a.location);getQuizzesForConversation(a.conversation);showBackstage("quizzing");break;case "document":q(a);hideBackstage();break;default:loadSlide(a.location)}})}}).appendTo(b);
return b},t=function(a){var b=$("<div />",{"class":"groupOverview"}),e=$("<div />",{"class":"groupOverview"}).css({"text-align":"center"}),d=$("<div />",{"class":"groupOverview"}),f=$("<img />",{width:px(80)}).appendTo(b);switch(a.medium){case "metlx":f.attr("src",sprintf("/thumbnail/madam/%s",a.location));break;case "document":f.attr({src:"/static/images/doc.jpg",height:px(60)});c[username].name in a.members&&f.click(function(){q(a)});break;case "quizzing":f.attr({src:"/static/images/quizzing.png",
height:px(60)}).click(function(){showBackstage("quizzing")})}if("quizzing"==a.medium)var g=$("<div />",{"class":"progressDisplay",text:sprintf("%s / %s",a.progress,a.goal),title:"The minimum progress that every member of the group shares"}).appendTo(e);else $("<img />",{src:sprintf("/static/images/%s.%s",a.medium,"document"==a.medium?"jpg":"png"),width:px(40),height:px(40)}).appendTo(e);var r=$("<div />").appendTo(e),k=m(a);d.append(k).append($("<div />",{"class":"groupOverview",html:$("<div />",
{"class":"memberDetail",text:h(a)})}));f=$("<div />");f.append(b);f.append(e);f.append(d);var n=function(){r.text(prettyTime(new Date-a.startTime));"progress"in a&&"goal"in a&&.2>Math.random()&&(a.progress+=1,l(a)?(g.text("Done"),k.remove(),d.prepend(m(a))):g.text(sprintf("%s / %s",a.progress,a.goal)));r.is(":visible")&&!l(a)&&setTimeout(n,1E3)};setTimeout(n,1E3);f.attr("id","party_"+h(a).hashCode());return f},r=function(){c[username]={nickname:username,name:username};var a=$("#currentGroupOverview").empty(),
b=$("#groupingStatus").empty(),e=$("#currentGroup").empty(),f=_.groupBy(g,function(a){return c[username].name in a.members});if(f[!0]){var d=f[!0][0];b.text(sprintf("You are grouped with %s",h(d)));e.html(t(d))}else b.text(sprintf("How do you want to work today?"));f[!1]&&$.each(f[!1],function(b,c){a.append(t(c))})},c={llewellyn:{name:"llewellyn",nickname:"Forell",isFriend:!0},ann:{nickname:"Ann31",name:"ann"},william:{nickname:"The Billster",name:"william"},stuart:{nickname:"Stu",name:"stuart"},
ramesh:{nickname:"Ramses",name:"ramesh"},pepe:{nickname:"Pepe",name:"pepe"},june:{nickname:"Mrs Carter",name:"june"},james:{nickname:"jimmy",name:"james"},dave:{nickname:"Dave",name:"dave"}},g=[{location:1931006,medium:"metlx",members:{}},{medium:"document",url:"https://docs.google.com/document/pub?id=1LvnKG9I3NMIgfW46ALcpjQFt6EU7PAFqbSEhV3GfuWQ&amp;embedded=true",members:{}},{location:1931002,medium:"metlx",members:{}},{location:2436004,conversation:2436E3,medium:"quizzing",progress:0,goal:2,members:{}},
{medium:"document",url:"http://penny-arcade.com",members:{},isFormal:!0}];f(c.llewellyn,g[0]);f(c.ramesh,g[1]);f(c.william,g[1]);f(c.stuart,g[2]);f(c.ramesh,g[2]);f(c.pepe,g[2]);f(c.june,g[2]);f(c.stuart,g[2]);$.each([c.llewellyn,c.dave],function(a,b){g[3].members[b.name]=b});$.each(g,function(a,b){b.startTime=new Date-3E5*Math.random()});$.each([c.ann,c.james],function(a,b){g[4].members[b.name]=b});var n=function(){r();$("#quizzingPopup").hide();showBackstage("groupFinder")};$(function(){$("<span />",
{text:"Groups"}).click(n).prependTo($("#quickMoves"));$("#meetingChat").attr("title","Meeting").dialog({closeText:"",resizable:!1,resize:"auto",width:px(380),position:"left bottom",onClose:function(){return!1}})});Progress.historyReceived.createContentGroups=function(){boardContent.contentGroups=e()};Progress.postRender.showOffscreenGroups=function(){var a=[viewboxX,viewboxY,viewboxX+viewboxWidth,viewboxY+viewboxHeight];$.each(boardContent.contentGroups,function(b,c){boardContext.strokeStyle="red";
boardContext.strokeWidth=2;intersectRect(a,c.bounds)?c.offscreenElement.hide():showOffscreenElement(c)})};return{parties:g}}(),Tagger=function(){var e={};$(function(){var d,h,f,k,q=function(){d=viewboxX;h=viewboxY;f=viewboxWidth;k=viewboxHeight;viewboxX=boardContent.minX;viewboxY=boardContent.minY;viewboxWidth=boardContent.width;viewboxHeight=boardContent.height;$.each(boardContent.contentGroups,function(f,d){var c=d.bounds,c=worldToScreen(c.centerX,c.centerY),g=$("<div />").css({position:"absolute",
left:px(c.x),top:px(c.y+15)}).appendTo(m),h=function(){d.identity in e&&g.html(unwrap(e[d.identity].map(function(a){return $("<input />",{type:"button",value:a})})))};h();var a=Canvas.circle("blue",20).css({position:"absolute",left:px(c.x),top:px(c.y)}).click(function(){$(d.canvas).css({position:"absolute","background-color":"white",width:px(boardWidth/3)}).insertBefore(a).show();d.identity in e||(e[d.identity]=[]);var b=prompt("Tag me! (Comma separated multiple tags are okay)");$(d.canvas).remove();
b&&(e[d.identity]=b.split(",").map(function(a){return a.trim()}),h())}).appendTo(m)})},l=$("<div />",{"class":"backstage",id:"taggingPopup"}).insertAfter($("#marquee")),m=$("<div />",{id:"contentGroupMap"}).css({width:"100%%",height:"100%",position:"relative"}).appendTo(l);$("<div />").css({display:"absolute","background-color":"white"}).prependTo(l);$("<span />",{text:"Tags"}).click(function(){l.is(":visible")?(viewboxX=d,viewboxY=h,viewboxWidth=f,viewboxHeight=k,m.empty(),hideBackstage()):(q(),
showBackstage("tagging"))}).prependTo($("#quickMoves"))});return{tags:e}}(),prettyTime=function(e){var d=Math.floor(e/1E3),h=Math.floor(d/3600);e=Math.floor((d-3600*h)/60);d=d-3600*h-60*e;10>e&&(e="0"+e);10>d&&(d="0"+d);return e+":"+d};
