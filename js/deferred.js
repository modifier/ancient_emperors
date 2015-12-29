// source: http://stackoverflow.com/questions/18096715/implement-deferred-object-without-using-jquery

function Deferred(){
  this._done = [];
  this._fail = [];
}

Deferred.prototype = {
  execute: function(list, args){
    var i = list.length;

    // convert arguments to an array
    // so they can be sent to the
    // callbacks via the apply method
    args = Array.prototype.slice.call(args);

    while(i--) list[i].apply(null, args);
  },
  resolve: function(){
    this.execute(this._done, arguments);
  },
  reject: function(){
    this.execute(this._fail, arguments);
  }, 
  done: function(callback){
    this._done.push(callback);
  },
  fail: function(callback){
    this._fail.push(callback);
  }  
}