# SimpleWorker
Make JavaScript Workers easier, and friendly to use.

```js
// SimpleWorker is global in window, but you can create a new instance if needed for security
// var worker = SimpleWorker.newInstance()

/* global SimpleWorker */

var x = 200;
var y = 200;

// Your Thread (Function), that is passed to the worker to read
var thread = function(x,y){ 
  
  var ix, iy, Vector2, map = [];
  ix = iy = 0;
  
  Vector2 = function(x,y) {
    this.x = x;
    this.y = y;
  }
  
  for(ix = 0; ix < x; ix++)
    for(iy = 0; iy < y; iy++)
        map.push(new Vector2(ix,iy));
        
  return map;
  
};


// Create your worker, with it's thread (Function), along with any agruments you need to pass with
var pid = SimpleWorker.prepare(thread, x, y);


// Import a script to use with your thread
SimpleWorker.importScript(pid, "http://example.com/script.js");


// Import multiple scripts
SimpleWorker.importScript(pid, ["http://example.com/script.js", "http://example.com/script2.js"])


// execute your worker (async), get in return your responce. You MUST use a callback on execute, until another solution is found to properly handle a Promise.
SimpleWorker.execute(pid, function(e){
  console.log(e.length); // 40,000
});


// You can even restore a worker without making another. Pass back the thread, and arguments
SimpleWorker.restore(pid, thread, 500, 500)


// Using Null will not overwrite your thread, but you can change arguments if needed aswell
// SimpleWorker.restore(pid, null, 500, 500); 


SimpleWorker.execute(pid, function(e){
  console.log(e.length); // 250,000
});


// kill/destroy worker
SimpleWorker.kill(pid);
```

##### Notes

- A ```pid``` is a negative number associated with each worker thread. 
- You cannot use SimpleWorker for DOM manipulations. All Worker rules applies.
- SimpleWorker's worker cannot be shared with other workers

##### Todo
- [x] Ability to load libraries inside a worker using ```importScript```
- [ ] More advanced stuff
- [ ] Implement for/foreach threading, (Basically an implemented function within the worker), 
> When using for/foreach threading you still use for/foreach in your thread function. It'll just be replaced with a function the Worker can read that'll run for/each in a new thread. **This may or moy not be a feature, but for testing purposes only**.



