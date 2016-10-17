var _ = require('lodash');
var assert = require('assert');
var board = require('../page/board.page');
var sprintf = require('sprintf-js').sprintf;

var LoginPage = require("../page/login.page");
var ConversationsPage = require("../page/conversations.page");
var ConversationPage = require("../page/conversation.page");

var ANIMATION_DELAY = 1000;

var debugUnless = function(condF,fail){
    if(!(condF())){
        browser.debug();
    }
    else{
        console.log(fail);
    }
};
var within = function(a,b,tolerance){
    return Math.abs(a - b) <= tolerance;
};
var doubleClick = function(user,x,y){
    user.moveToObject("#board",x,y);
    /*On the theory that the wire protocol double click is problematic*/
    user.leftClick();
    user.leftClick();
};

describe('When a teacher presents, ', function() {
    var teacherT = board(teacher);
    var studentT = board(student);
    it('the teacher and student should find the application', function () {
        browser.url('/board');
    });

    var teacherLoginPage = LoginPage(teacher);
    var studentLoginPage = LoginPage(student);
    var teacherName = 'test.teacher.' + Math.floor(Math.random() * 10000);
    var studentName = 'test.student.' + Math.floor(Math.random() * 10000);

    var teacherConversationsPage = ConversationsPage(teacher);
    var studentConversationsPage = ConversationsPage(student);

    it('the teacher should successfully login', function () {
        teacherLoginPage.username.setValue(teacherName);
        teacherLoginPage.submit();
        assert(teacherConversationsPage.waitForSearchBox());
    });
    it('the student should successfully login', function () {
        studentLoginPage.username.setValue(studentName);
        studentLoginPage.submit();
        assert(studentConversationsPage.waitForSearchBox());
    });
    it("the teacher should be able to create and join a conversation", function() {
        teacher.waitForExist("#createConversationButton");
        var previousConversations = teacherConversationsPage.getConversations();
        teacher.click("#createConversationButton");
        var newConversations = teacherConversationsPage.getNewConversations(previousConversations);
        assert.ok(newConversations.length > 0,"expected there to be at least 1 new conversation");
        teacher.click(".newConversationTag");
        teacher.waitForExist("#board");
    });
    it("the student should find and join the conversation",function(){
        student.setValue("#conversationSearchBox > input","teacher");
        student.click("#searchButton");
        student.pause(1000);
        student.click(".newConversationTag");
        student.waitForExist("#board");
    });
    it("both should see a blank board", function(){
        assert.equal(_.keys(teacherT.texts).length,0);
        assert.equal(_.keys(studentT.texts).length,0);
    });
    it("the teacher should insert a paragraph",function(){
        teacherT.textMode.click();
        teacherT.keyboard(50,50,"This is a paragraph of text which is being typed programatically.  It runs over multiple lines.");
        assert.equal(_.keys(teacherT.texts).length,1);
        assert.equal(teacherT.textStanzas[_.keys(teacherT.texts)[0]].words.length,[
            "Consistently sized run"].length);
    });
    it("the teacher should highlight a word and enlarge it",function(){
        doubleClick(teacher,100,100);
        teacher.waitUntil(function(){/*Paragraph*/
            var r = teacherT.selectedRanges[0];
            return r.start == 10 && r.end == 19;
        });

        teacher.click("#fontLarger");
        teacher.waitUntil(function(){
            return teacherT.textStanzas[_.keys(teacherT.texts)[0]].words.length ==
                ["Before","Enlarged","After"].length;
        });

        doubleClick(teacher,100,300);
        teacher.waitUntil(function(){/*Programatically*/
            var r = teacherT.selectedRanges[0];
            console.log(r);
            return r.start == 49 && r.end == 65;
        });

        teacher.click("#redText");
        teacher.waitUntil(function(){
            return teacherT.textStanzas[_.keys(teacherT.texts)[0]].words.length ==
                ["Before","Enlarged","After","Red","After"].length;
        });

        doubleClick(teacher,100,400);
        teacher.waitUntil(function(){/*multiple*/
            var r = teacherT.selectedRanges[0];
            console.log(r);
            return r.start == 80 && r.end == 88;
        });

        teacher.click("#fontLarger");
        teacher.waitUntil(function(){
            return teacherT.textStanzas[_.keys(teacherT.texts)[0]].words.length ==
                ["Before","Enlarged","After","Red","After","Enlarged","After"].length;
        });
    });
    it("the teacher should create another textbox",function(){
        teacherT.keyboard(600,500,"This is a second paragraph.  It exists to be differentiated from the first paragraph.");
        assert.equal(_.keys(teacherT.texts).length,2);
        assert.equal(_.keys(teacherT.textStanzas).length,2);
        assert.equal(teacherT.textStanzas[_.keys(teacherT.texts)[1]].words.length,[
            "Consistently sized run"].length);
    });
    it("the teacher should drag their new textbox",function(){
        var active = teacherT.textStanzas[_.keys(teacherT.texts)[1]];
        assert.equal(active.x,600);
        assert.equal(active.y,500);
        assert.equal(teacherT.interactables.manualMove.length,1);
        var handle = teacherT.interactables.manualMove[0];
        teacherT.drag(handle,{x:-500,y:-250});
        active = teacherT.textStanzas[_.keys(teacherT.texts)[1]];
        assert.equal(active.x,100);
        assert.equal(active.y,250);
    });
    it("the teacher should rescale all the font in their new textbox",function(){
        var active = teacherT.textStanzas[_.keys(teacherT.texts)[1]];
        assert.equal(active.width,240);
        assert.equal(active.x,100);

        var handle = teacherT.interactables.resizeAspectLocked[0];
        teacherT.drag(handle,{x:200,y:0});

        active = teacherT.textStanzas[_.keys(teacherT.texts)[1]];
        assert.equal(active.x,100);
        assert(within(active.width,437,2));
        assert.equal(active.words[0].size, 55);
    });
    it("the teacher should scroll up on swipe out",function(){
        teacherT.swipeUp();
    });
    if("the teacher should reselect their box",function(){
        teacher.moveToObject("#board",200,300);
        teacher.leftClick();
        assert.equal(teacherT.interactables.resizeFree.length,1);
    });
    it("the teacher should resize their box rewrapping instead of rescaling the text",function(){
        var handle = teacherT.interactables.resizeFree[0];
        teacher.pause(ANIMATION_DELAY);
        teacherT.drag(handle,{x:200,y:0});
        var active = teacherT.textStanzas[_.keys(teacherT.texts)[1]];
        assert.equal(active.x,100);
	assert(active.words);
        assert.equal(active.words[0].size, 55);
        assert(within(active.width,638,2));
    });
    it("the teacher should be able to draw ink", function(){
        teacherT.inkMode.click();

        var inkStanzasBefore = _.filter(teacherT.inkStanzas,function(inkStanza){return inkStanza.author == "teacher";}).length;
        teacherT.handwrite(_.map(_.range(300,600,5), function(i){
            return {x:i,y:i};
        }));
        teacher.waitUntil(function(){
            return _.filter(teacherT.inkStanzas,function(inkStanza){return inkStanza.author == teacherT.username;}).length == (inkStanzasBefore + 1);
        },5000,"expected new ink to appear in inkStanzas after looping through server");
        assert.equal(_.keys(teacherT.inkStanzas).length,1);
        for(var i = 2; i < 5; i++){
            var len = 35;
            var root = (len + 20) * i;
            teacher.click(sprintf("#pen%sButton",i));
            teacherT.handwrite(_.map(_.range(0,30,0.7), function(j){
                return {
                    x: root + Math.cos(j) * len--,
                    y: root + Math.sin(j) * len--
                };
            }));
        }
        assert.equal(_.keys(teacherT.inkStanzas).length,4);
    });
    it("the teacher should add an image",function(){
        assert.equal(_.keys(teacherT.imageStanzas).length,0);
        teacherT.imageMode.click();
        teacher.click("#board");
        teacher.chooseFile("#imageFileChoice","testMaterials/mapleLeaf.jpg");
        teacher.waitUntil(function(){
            return _.keys(teacherT.imageStanzas).length == 1;
        },5000);
    });
    it("the teacher should have their new image selected when it appears",function(){
        assert.equal(_.keys(teacherT.selection.images).length,1);
    });
    it("the teacher should clear their selection by clicking on an empty spot on the canvas",function(){
        teacherT.selectMode.click();
        teacher.leftClick("#board",1,1);
        assert.equal(_.keys(teacherT.selection.inks).length,0);
        assert.equal(_.keys(teacherT.selection.texts).length,0);
        assert.equal(_.keys(teacherT.selection.multiWordTexts).length,0);
        assert.equal(_.keys(teacherT.selection.videos).length,0);
        assert.equal(_.keys(teacherT.selection.images).length,0);
    });
    it("the teacher should select all the items that are under their mouse when they click the board",function(){
        teacher.leftClick("#board",250,250);
        teacher.waitUntil(function(){
            var sel = teacherT.selection;
            return _.keys(sel.inks).length == 1 &&
                _.keys(sel.texts).length == 0 &&
                _.keys(sel.multiWordTexts).length == 1 &&
                _.keys(sel.videos).length == 0 &&
                _.keys(sel.images).length == 1;
        });
    });
    it("the student should see all public teacher-created elements",function(){
        student.waitUntil(function(){
            return _.keys(studentT.textStanzas).length == 2 &&
                _.keys(studentT.inkStanzas).length == 4 &&
                _.keys(studentT.imageStanzas).length == 1;
        });
    });
    it("the teacher should delete their selected elements",function(){
        teacherT.deleteSelection.click();
    });
    it("the student should see all remaining public teacher-created elements",function(){
        student.waitUntil(function(){
            return _.keys(studentT.imageStanzas).length == 0;
        });
        assert.equal(_.keys(studentT.textStanzas).length,1);
        assert.equal(_.keys(studentT.inkStanzas).length,3);
    });
    it("the teacher should have their participants view show the themes so far introduced in their conversation",function(){
        assert(teacherT.cloudData.length > 0);
    });
    it("the teacher should create a private image",function(){
        teacherT.privateMode.click();
        teacherT.imageMode.click();
        teacher.click("#board");
        teacher.chooseFile("#imageFileChoice","testMaterials/mapleLeaf.jpg");
        teacher.waitUntil(function(){
            return _.keys(teacherT.imageStanzas).length == 1;
        });
        assert.equal(_.keys(studentT.imageStanzas).length,0);
    });
    it("the student should not see private teacher-created content",function(){
        assert.equal(_.keys(studentT.imageStanzas).length,0);
    });
    it("the teacher should restore deleted content from the recycle bin",function(){
        teacherT.menuButton.click();
        teacherT.recycleBinMenu.click();
        teacher.waitUntil(function(){
            return teacherT.recycleables.length == 3;
        });
    });
});
