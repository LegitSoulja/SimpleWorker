# SimpleWorker
Make workers easy

var worker = new SimpleWorker();

```js
var worker = new SimpleWorker();

var a = 5;
var b = 50;

var process = function(a,b){ return a * b; };

var pid = worker.prepare(process, a, b);

worker.execute(pid, function(e){
  console.log(e); // 250
});

// you can even restore a worker without re-creating it
worker.restore(pid, process, a, 100)

// *Null will no overwrite your process
// worker.restore(pid, null, a, 100); 

worker.execute(pid, function(e){
  console.log(e); // 500
});
```
