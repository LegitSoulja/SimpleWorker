(function(){
  
  var $workers = { global: { } };
  var $scope = 'global';
  
  var $handler = this.URL.createObjectURL(new Blob(['(',
      function () {
            self.onmessage = function (e) {
                return self.postMessage({
                    data: ((eval('(function(a){return a;})(' + (e.data.func) + ')'))
                        .apply(null, e.data.args))
                });
            }
      }.toString(),
  ')()'], {
        type: "application/javascript"
    }));
    
  class Helper {
    
    static getFuncProperties(a) {

      if (typeof a != "function")
        throw new Error("A function is required, but a(n) " + typeof a + " was given");

      var e = a.toString();
      var o = -1;
      var c = -1;

      for (var i = 0; i < e.length; i++) {
        if (o <= -1 && e.charCodeAt(i) === 40) o = i + 1;
        if (c <= -1 && e.charCodeAt(i) === 41) {
          c = i;
        break;
        }
      }

      if (c <= -1 || o <= -1) 
        throw new Error("Failed to obtain function");
      
      return {name:e.substr(0, o - 1), args:e.substr(o, c - o).split(","), etc:e.substr(c + 1)};
  }
    
  }
  
  class Worker {
    constructor(job){
      this.callbacks = [];
      this.job = job;
      this.info = Helper.getFuncProperties(job);

      this.worker = new window.Worker($handler);
      
      this.worker.onmessage = function(e){

        if(e && e.data) {
          for(var i = 0; i < this.callbacks.length; i++)
            this.callbacks[i](e.data);
        }
      }.bind(this);
    }
    
    execute(args, callback) {
      if(args.length != this.info.args.length)
        throw new Error("Job requires " + this.info.args.length + " arguments, but only " + args.length + " was given");
      this.callbacks.push(callback);
      this.worker.postMessage({func: this.job.toString(), data: args});
    }
  }
  
  class SimpleWorker {
    
    static setScope(a){
      if(a.length <= 0) return;
      if(!Object.hasOwnProperty($workers, a)) {
        $workers[a] = {}
      }
      $scope = a;
    }
    
    static create(name, job){
      
      if(name.length <= 0)
        throw new Error("No name provided for this job.");
      else if(typeof job != 'function') 
        throw new Error("Typeof job must be a function.");
      
      if(Object.hasOwnProperty($workers[$scope], name)) {
        throw new Error("Job " + name + " already exist in scope " + $scope);
      }
      
      $workers[$scope][name] = new Worker(job);
      
      console.log("Created " + name + " in " + $scope);
      
      return $workers[$scope][name];
      
    }
    
  }
})();
