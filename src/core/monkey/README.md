# monkey 解析器

实现了

1. 词法解析
2. 语法解析
3. 程序执行

## 词法分析

支持：

1. 操作符： - + / * == != ! < >
2. 界符： , ; { } ( ) [ ]
3. 保留字: let if else fn false true return while

## 语法分析

支持：

1. 表达式类型：error integer boolean string null 数组 类对象 前序表达式 中序表达式 fn表达式 fnCall表达式
2. 语句类型：let声明语句 赋值语句 return语句 表达式语句 块级语句 if-else语句 while语句

```javascript
// 1. 前序表达式 boolean integer
!true
-3

// 2. 字符串
'hello world'

// 3. 中序表达式 integer
1 + 1
1 + 2 * (3 + 4)

// 4. let声明语句 fn表达式 fnCall表达式（函数调用）
let add = fn(a, b) {
    // return 语句 块级语句
    return a + b;
}
add(1, 2);

// 5. if-else语句
if (true) {
    return 1;
} else {
    return 0;
}

// 6. while语句
let a = 0;
while(a < 5) {
    // 赋值语句
    a = a + 1;
}

let count = 4;
while(count > 0) {
    move(1);
    turnLeft();
    move(1);
    turnRight();
    count = count -1;
}

// 7. 数组
let arr = [1, 2, 3, 4];
arr[0]; // key取值 1

// 8. 类对象
let person = {
    "name": "lky"
};
person["name"]; // key取值 lky
```

## 执行

支持：

1. integer操作：
    1. 一元操作符 ! -
    2. 二元操作符 + - * / == != > <
2. boolean操作:
    1. 一元操作符 !
    2. 二元操作符 == !=
3. string操作：
    1. 一元操作符 !
    2. 二元操作符 + == !=
4. if-else 执行
5. fn执行 支持闭包
6. let 与简单赋值语句
7. while执行

## 效果图

![语法分析](https://chenweilin.xin/blogImg/1565419787205h6Gi语法分析.png)  

![执行](https://chenweilin.xin/blogImg/156541978755038G执行.png)  

## 与编程游戏结合

1. 支持内置函数
    1. move(step)
    2. canMove: 用于判断坦克是否可以向前移动
    3. turnLeft() turnRight()
2. 执行中代码高亮
3. 任务执行器

难点：

1. 程序执行中canMove()结果需返回给程序执行使用
2. 任务执行 异步调度

![效果](https://chenweilin.xin/blogImg/1572966259738Q2.gif)
