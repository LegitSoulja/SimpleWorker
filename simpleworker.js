/*
\| LegitSoulja | 2017
\| All Rights Reserved
\| Documentation: https://github.com/LegitSoulja/SimpleWorker
\|
\| License: Apache
\|
*/

(function (w, d) {

    var worker_handler = w.URL.createObjectURL(new Blob(['(',
        function () {
            self.onmessage = function (e) { 
                return self.postMessage(((eval('(function(func){return func;})(' + (e.data.func) + ')')).apply(null, e.data.args))); 
            }
        }.toString(), 
    ')()'], { type: "text/javascript" }));

    var dth = function(n) {
        if(n > 0) n = -(Math.abs(n)); 
        n = 0xFFFFFFFF + n + 1;
        return n.toString(16).toUpperCase();
    }
	
    var SimpleWorker = function () {
        this.workers = {}
        this.pid = -1;
    }
	
    SimpleWorker.prototype = {

        prepare: function (func) {
            var pid = this.pid;
            var args = [];
            if(arguments.length > 1) {
                for (var i in arguments)
                    args.push(arguments[i])
                args.shift();
            }
            this.workers[dth(pid)] = {
                pid: pid,
                worker: new Worker(worker_handler),
                args: args,
                init: function (cb) {
                    if (this.worker.onmessage == null)
                        this.worker.onmessage = function (e) {
                            if (typeof (cb) === 'function')
                                return cb(e.data);
                        }
                    this.worker.postMessage({ func: (this.func).toString(), args: this.args });
                },
                func: func
            }
            this.pid--;
            return pid;
        },
        restore: function (pid, func) {
            pid = dth(pid);
            if (this.workers[pid] != null) {
                if (func != null)
                    this.workers[pid].func = func;
                var args = [];
                if (arguments.length > 2) {
                    for (var i in arguments)
                        args.push(arguments[i]);
                    args.shift();
                    args.shift();
                    this.workers[pid].args = args;
                }
                return;
            }
            throw new Error("Thread 0x" + pid + " does not exist.");
        },
        execute: function (pid, cb) {
            pid = dth(pid);
            if (this.workers[pid] != null)
                if(typeof(cb) === 'function')
                    this.workers[pid].init(function (e) { return cb(e); });
                else throw new Error("Execute must require an async callback");
            else throw new Error("Thread 0x" + pid + " does not exist.");	
        },
        kill: function (pid) {
            pid = dth(pid);
            if (this.workers[pid] != null) {
                this.workers[pid].worker.terminate();
                delete this.workers[pid];
                return;
            }
            throw new Error("Could not find thread " + "0x" + pid)
        },
        killAll: function () {
            var keys = Object.keys(this.workers);
            for (var i in keys) {
                this.workers[keys[i]].worker.terminate();
                delete this.workers[keys[i]];
            }
        }

    }

    w.SimpleWorker = SimpleWorker;

})(window, document);
