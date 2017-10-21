# SimpleWorker
Make JavaScript Workers easier, and friendly to use.

```js
var worker = new SimpleWorker();

var a = 5;
var b = 50;

var thread = function(a,b){ 
    return a * b; 
};

var pid = worker.prepare(thread, a, b);

worker.execute(pid, function(e){
  console.log(e); // 250
});

// you can even restore a worker without re-creating it
worker.restore(pid, thread, a, 100)

// *Null will not overwrite your thread
// worker.restore(pid, null, a, 100); 

worker.execute(pid, function(e){
  console.log(e); // 500
});

// kill/destroy worker
worker.kill(pid);
```

##### Notes

- A ```pid``` is a negative number associated with each worker thread. 
- You cannot use SimpleWorker for DOM manipulations. All Worker rules applies.
- SimpleWorker's worker cannot be shared with other workers

##### Todo
- Ability to load libraries inside a worker using ```importScript```


