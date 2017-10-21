/*
\| LegitSoulja
\| All Rights Reserved
\| Documentation: https://github.com/LegitSoulja/SimpleWorker
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
        if (n < 0) n = 0xFFFFFFFF + n + 1;
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
            for (var i in arguments)
                args.push(arguments[i])
            if (args.length > 1) args.shift();
            this.workers[dth(pid)] = {
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
            }
        },
        execute: function (pid, cb) {
            pid = dth(pid);
            if (this.workers[pid] != null) {
                this.workers[pid].init(function (e) {
                    if (typeof (cb) === 'function')
                        return cb(e);
                    return e;
                });
            }
        },
        kill: function (pid) {
            pid = dth(pid);
            if (this.workers[pid] != null)
                this.workers[pid].worker.terminate();
        },
        killAll: function () {
            for (var i in this.workers)
                this.workers[i].worker.terminate();
        }

    }

    w.SimpleWorker = SimpleWorker;

})(window, document);
