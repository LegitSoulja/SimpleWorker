/*
var worker = new SimpleWorker();
var x = 5;
var y = 25
var pid = worker.prepare(function(x,y){ return x * y; }, x, y);
worker.execute(pid, function(e){
  console.log(e); // 125
})
*/

(function(w,d){

  var worker_handler = w.URL.createObjectURL(
  new Blob(['(', 
    function(){ 
      self.onmessage = function(e){ 
		var func = eval('(function(func){return func;})(' +e.data.func+ ')');
		var resp = (func.apply(this, e.data.args));
		return self.postMessage(resp);
	  }
    }.toString(),
  ')()'], {type: "text/javascript"}))
  
  function dth(n)
  {
      if (n < 0) n = 0xFFFFFFFF + n + 1;
      return n.toString(16).toUpperCase();
  }
  
  var SimpleWorker = function(){
    this.workers = {}
    this.pid = -1;
  }
  
  SimpleWorker.prototype = {
  
    prepare: function(func){
      var pid = this.pid;
      var args = [];
	  for(var i in arguments)
		  args.push(arguments[i])
      if(args.length > 1) args.shift();
      var _export = {
        id: pid,
        worker: new Worker(worker_handler),
        init: function(cb){
          if(this.worker.onmessage == null)
            this.worker.onmessage = function(e){
              if(typeof(cb) === 'function')
                return cb(e.data);
            }
            this.worker.postMessage({func: (this.func).toString(), args: args});
        },
        func: func
      }
      this.workers[dth(pid)] = _export;
	  this.pid--;
      return pid;
    },
    restore: function(pid, func){
      this.workers[id].func = func;
    },
    execute: function(pid, cb){
      if(this.workers[dth(pid)] != null) {
        this.workers[dth(pid)].init(function(e){
			if(typeof(cb) === 'function')
				return cb(e);
			return e;
		});
	  }
    }
  
  }

  w.SimpleWorker = SimpleWorker;
  
})(window,document)
