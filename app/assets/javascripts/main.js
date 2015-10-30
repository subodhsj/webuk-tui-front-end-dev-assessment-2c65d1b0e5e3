var babySteps = function(){
  this.elm = $(),
  this.friendsMessages = [];
  this.init();
  return this;
};
babySteps.prototype.init = function(){
  var that = this;
  that.elm = $('#BabyStepContents');
  $.ajax({
    url : 'assets/javascripts/baby-steps.json',
    success : function (response) {
      that.makeFriendsMessages(response.friends);
      that.addMessages();
    }
  });
};
babySteps.prototype.makeFriendsMessages = function(friendsBabySteps){
  var that = this;
  for(var friend in friendsBabySteps){
    var currentFriend = friendsBabySteps[friend];
    var babyStepId = 'babyStep'+currentFriend.babyStep;
    if(typeof(that.friendsMessages[babyStepId]) == 'undefined'){
      that.friendsMessages[babyStepId] = [];
    }
    that.friendsMessages[babyStepId].push(currentFriend.firstName +' '+ currentFriend.lastName);
  }
}
babySteps.prototype.addMessages = function(){
  var that = this;
  that.elm.find($('.babyStepContent')).each(function(){
    var stepElement = $(this),
      message = that.getMessage(stepElement.attr('data-babystep'));
      messageElement = stepElement.find('.stepMessage');
      if(message){
        message = message + ' ' + stepElement.find('.heading').text();
        messageElement.append(message);
      }
  });
};
babySteps.prototype.getMessage = function(step){
  var that = this,
    messageHtml = '',
    currentStepFriends = that.friendsMessages[step] || [],
    numberOfFriends = currentStepFriends.length,
    template = '<a href="#">{{data}}</a>',
    isAre = numberOfFriends > 1 ? 'are' : 'is',
    getMessageHTML = function(friends){
      var rawMessage = '',
      otherFriends = friends.length - 2;
      friends.splice(2);
      for(index in friends){
        var separator = ', ';
        if(index == 0){
          separator = '';
        }else if(index == friends.length - 1 && otherFriends == 0){
          separator = ' and ';
        }
        if(index < 3){
          rawMessage = rawMessage + separator + template.replace('{{data}}', friends[index]);
        }
      }
      if(otherFriends > 0){
        rawMessage = rawMessage + ' and '+ otherFriends +' other friends';
      }
      return rawMessage;
    }
    messageHtml = getMessageHTML(currentStepFriends);
    if(numberOfFriends > 0){
      messageHtml = messageHtml +' '+ isAre + ' also in ';
    }
    return messageHtml;
}

var leftNav = function(e){
  this.elm = $(e);
  this.init();
}
leftNav.prototype.init = function(){
  var nav = this.elm.find('.babyStepsNav');
  var navContent = this.elm.find('.babyStepContents');
  nav.find('li').bind('click',function(){
    var navLi = $(this);
    if(navLi.hasClass('menuHandle')){
      nav.hasClass('expanded') ? nav.removeClass('expanded') : nav.addClass('expanded');
    }else {
      var selector = navLi.attr('data-target');
      navLi.addClass('active').siblings('li').removeClass('active');
      navContent.find('div[data-babystep="'+ selector +'"]').addClass('active').siblings('.active').removeClass('active');
    }
  });
}
new babySteps();
new leftNav('#MainContent');
