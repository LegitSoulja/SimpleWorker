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
                return self.postMessage({
                    index: e.data.index,
                    data: ((eval('(function(func){return func;})(' + (e.data.func) + ')'))
                        .apply(null, e.data.args))
                });
            }
      }.toString(),
  ')()'], {
        type: "application/javascript"
    }));

    this.SimpleWorker = class SimpleWorker {

        constructor() {
            this.workers = {}
        }

        prepare(func) {
            var args = [];
            if (arguments.length > 1)
                Array.prototype.push.apply(args, arguments);
            args.shift(); // remove func
            var pid = (Object.keys(this.workers).length);

            this.workers[("!" + pid)] = {
                worker: new Worker(worker_handler),
                func: func,
                args: args,
                loads: [],
                init: function (cb) {
                    var len = this.loads.length;
                    this.loads.push(cb)
                    var a = this;
                    this.worker.onmessage = function (e) {
                        var i = 0;
                        if (typeof (e) != 'undefined' && typeof (e.data.index) != 'undefined') 
                            if (typeof (a.loads[e.data.index]) != 'undefined') {
                                a.loads[e.data.index](e.data.data);
                                a.loads[e.data.index] = null;
                            }
                    }
                    this.worker.postMessage({func: (this.func).toString(),args: this.args,index: len});
                },
                terminate: function () {
                    this.worker.terminate();
                }
            }
            return pid;
        }
        shiftN(args, n) {
            for (var i = 0; i < n; i++) args.shift();
            return args;
        }
        restore(pid, func) {
            pid = ("!" + pid);
            if (typeof (this.workers[pid]) != 'undefined') {
                if (func != null) this.workers[pid].func = func;
                var args = [];
                if (arguments.length > 2) {
                    Array.prototype.push.apply(args, arguments);
                    args = this.shiftN(args, 2);
                    this.workers[pid].args = args;
                }
                return;
            }
            throw new Error('Unable to find worker with pid ID #' + pid);
        }
        execute(pid, cb, persistent = false) {
            pid = ("!" + pid);
            var a = this;
            if (typeof (this.workers[pid]) != 'undefined') {
                if (typeof (cb) == 'function') this.workers[pid].init(function (e) {
                    cb(e);
                    if (!persistent) {
                        a.workers[pid].terminate();
                        delete a.workers[pid];
                    }
                });
                else throw new Error('Execute requires a callback function as the second argument.');
            } else throw new Error('Unable to find worker with pid ID #' + pid);
        }
        kill(pid) {
            pid = ("!" + pid)
            if (typeof (this.workers[pid]) != 'undefined') {
                this.workers[pid].terminate();
                delete this.workers[pid];
            }
        }

        killAll() {
            var keys = Object.keys(this.workers);
            for (var i in keys) {
                this.workers[keys[i]].terminate();
                delete this.workers[keys[i]];
            }
        }

        newInstance() {
            return new SimpleWorker();
        }

    }
})(this);
