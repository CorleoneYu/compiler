# 编译原理

## 编译流程

1. 词法分析
2. 语法分析
3. 语义分析
4. 中间代码生成
5. 代码优化
6. 后端：目标代码生成

## 知识点

1. 文法 语言
2. 正规集 -> （正规式 正规文法 DNA） NFA
3. 自顶向下：LL(1) -> 提取左公因子 消除左递归 FIRST FOLLOW SELECT 预测表
4. 自底向上：LR(1)
5. 运行时存储管理：活动记录 DISPLAY表

## DONE 编译原理 廖力

快速刷完了B站廖力老师的视频 有了大体的认识

## DONE 加乘编译器

有些小bug 而且还没加错误提醒  

![加乘编译器](https://chenweilin.xin/blogImg/1562782153663GiT1.PNG)

## TODO 网易云课堂教程

[自己动手用java写编译器](https://study.163.com/provider/7600199/course.htm)

[编译原理动手实操,用java实现一个简易编译器1-词法解析入门](https://blog.csdn.net/tyler_download/article/details/50668983)

## 简单编译器

### 词法分析

支持：

1. 操作符： - + / * == != ! < >
2. 界符： , ; { } ( )
3. 保留字: let if else fn false true return

### 语法分析

支持：

1. 表达式类型：error integer boolean string null 前序表达式 中序表达式 fn表达式 fnCall表达式
2. 语句类型：let声明语句 赋值语句 return语句 表达式语句 块级语句 if-else语句 while语句

```javascript
// 1. 前序表达式 boolean integer
!true
-3

// 2. 字符串
'hello world'

// 3. 中序表达式 integer
1 + 1

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
```

### 执行

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

### 效果图

![语法分析](https://chenweilin.xin/blogImg/1565419787205h6Gi语法分析.png)  

![执行](https://chenweilin.xin/blogImg/156541978755038G执行.png)  

### todo

1. array object解析
2. 内置api

## TODO 编译原理 虎书

## TODO 编译原理 龙书

可以结合B站哈工大的视频看

## TARGET 完成自己的小编译器
