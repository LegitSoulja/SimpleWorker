# SimpleWorker
###### Size: 1.09KB

Make JavaScript Workers easier, and friendly to use.

```js
var worker = SimpleWorker.create('job1', function(x,y){
  var ix, iy, map = [];
  ix = iy = 0;

  for(ix = 0; ix < x; ix++)
    for(iy = 0; iy < y; iy++)
        map.push({x : ix , y : iy});
        
  return map;
});

worker.execute([200,200], function(response){
  console.log(response); 
});
```

##### Notes
- You cannot use SimpleWorker for DOM uses.
