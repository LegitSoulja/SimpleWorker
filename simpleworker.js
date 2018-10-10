(function(){
  
  var $workers = { global: { } };
  var $scope = 'global';
  
  var $handler = this.URL.createObjectURL(new Blob(['(',
    function () {
      self.onmessage = function (e) {
        return self.postMessage({
          data: ((eval('(function(a){return a;})(' + (e.data.func) + ')'))
            .apply(null, e.data.data))
        });
      }
    }.toString(), ')()'], 
  { type: "application/javascript" }));
    
  
  class Worker {
    constructor(job){
      this.callbacks = [];
      this.job = job;
      this.worker = new window.Worker($handler);
      this.worker.onmessage = function(e){
        if(e && e.data) {
          for(var i = 0; i < this.callbacks.length; i++)
            this.callbacks[i](e.data);
        }
      }.bind(this);
    }

    clear(){
      this.callbacks = [];
    }
    
    execute(args, callback = null) {

      if(typeof(args) != 'object') {
        args = [];
      }
      if(args.length != this.job.length) {
        throw new Error("Job requires " + this.job.length + " arguments, but only " + args.length + " was given");
      }else{

        if(callback != null) {
          this.callbacks.push(callback);
        }

        if(!this.callbacks.length) {
          throw new Error("Execute requires atleast one callback registered.");
        }

        this.worker.postMessage({func: this.job.toString(), data: args});
      }
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

      if(name.length <= 0) {
        throw new Error("No name provided for this job.");
      } else if(typeof job != 'function') {
        throw new Error("Typeof job must be a function.");
      }
      
      if(Object.hasOwnProperty($workers[$scope], name)) {
        throw new Error("Job " + name + " already exist in scope " + $scope);
      }
      $workers[$scope][name] = new Worker(job);
      return $workers[$scope][name];
      
    }
    
  }

})();
