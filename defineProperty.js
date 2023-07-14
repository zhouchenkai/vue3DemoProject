const { get } = require("http")

var obj = {
    name:'zs',
    age:12,
    love:['足球','篮球']
}

function defineproperty(obj,key,val){
    observe(val)
    Object.defineProperty(obj,key,{
        get:function(){
            console.log("获取",key,"成功",val)
            return val
        },
        set:function(newval){
            console.log("设置",key,"为",newval)
            //如果用户传入的值为对象的话
            observe(newval)
            val = newval
        }
    })
}

function observe(obj){
    if(typeof obj != 'object' || obj == null){
        return
    }
    if(Array.isArray(obj)){
        obj.__proto__ = arrayProto
        for(var i=0;i<obj.length;i++){
            observe(obj[i])
        }
    }else{
        for(var key in obj){
            defineproperty(obj,key,obj[key])
        }
    }
    
}

//实现对数组的监听
const orginalProto = Array.prototype;
var arrayProto = Object.create(orginalProto)
var methodsToPatch = [ 
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ]
methodsToPatch.forEach(method => {
    arrayProto[method] = function () {
        // 执行原始操作
        orginalProto[method].apply(this, arguments)
        console.log('监听赋值成功', method,arguments)
    }
})


observe(obj)

obj.love.push('qq')
