# SimpleWorker
###### Size: 1.09KB

Make JavaScript Workers easier, and friendly to use.

```js
var worker = new SimpleWorker();

var x,y;
x = y =200;

// Create your thread
var thread = function(x,y){ 
  
  var ix, iy, map = [];
  ix = iy = 0;

  for(ix = 0; ix < x; ix++)
    for(iy = 0; iy < y; iy++)
        map.push({x : ix , y : iy});
        
  return map;
  
};


// Prepare your thread, along with arguments, -> return (pid) integer
var pid = worker.prepare(thread, x, y);

// Execute your work with the pid, along with a callback to recieve the response
worker.execute(pid, function(e){
  console.log(e.length); // 40,000
}, true); // true keeps the worker open, false is default


// You can restore a thread after it was prepared if needed
worker.restore(pid, thread, 500, 500)


// Using NULL will not overwrite your thread, but you can update arguments if needed
// worker.restore(pid, null, 500, 500); 

// Re-executing..
worker.execute(pid, function(e){
  console.log(e.length); // 250,000
}, false); // kill destroy worker, (False is default and is not required if closing)


// Another worker killing method
// worker.kill(pid);
```

##### Notes
- You cannot use SimpleWorker for DOM uses.
