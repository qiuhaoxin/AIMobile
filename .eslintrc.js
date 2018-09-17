

module.exports={
	root:true,
	parser:'babel-eslint',
	parserOptions:{
		sourceType:'module'
	},
	env:{
		browser:true,
	},
	//0:off  1:warn   2:error
	rules:{
		'for-direction':2,
		'no-console':0,
		'getter-return':2,
		'no-await-in-loop':0,// 循环可以发多个异步请求
		'no-cond-assign':2,//禁止条件表达式中出现赋值操作符
		'no-constant-condition':2,//禁止在条件中使用常量表达式
		'no-control-regex':2,//禁止在正则表达式使用控制字符
		'no-debugger':2,//禁用debugger
		'no-dupe-args':2,//禁止function定义中出现重名参数
		'no-dupe-keys':2,//禁止对象字面量出现重复的key  
		'no-duplicate-case':2,//禁止出现重复的case标签
		'no-empty':2,//禁止出现空语句块
		'no-empty-character-class':2,//禁止在正则表达式使用空字符集
		'no-ex-assign':2,//禁止对catch子句的参数重新赋值
		'no-extra-boolean-cast':2,//禁止不必要的布尔转换
		'no-extra-parens':2,//禁止不必要的括号
		'no-extra-semi':2,//禁止不必要的分号
		'no-func-assign':2,//禁止对function声明重新赋值

        'use-isnan':2,//要求使用isNaN()检测NaN
        'valid-jsdoc':2,//强制使用有效的JSDoc注释
        'valid-typeof':2,//强制typeof表达式与有效的字符串比较
		'no-obj-calls':2,//禁止把全局对象作为函数调用
		'no-sparse-arrays':2,//禁止稀疏数组
        'no-alert':2,//禁用alert,confirm,prompt

        'no-proto':2,//禁用__proto__属性
        'no-redeclare':2,//禁止多次声明同一变量
        'no-return-assign':2,//禁止在return语句中使用赋值语句
        'no-return-await':2,//禁用不必要的 return await
        'no-script-url':2,//禁止使用javascript:url
        'no-self-assign':2,//禁止给自身赋值
        'no-self-compare':2,//禁止自身比较
        'no-sequences':2,//禁止逗号操作符
        'no-unmodified-loop-condition':2,//禁用一成不变的循环条件
        'no-unused-labels':2,//禁用出现未使用的标签
        'no-useless-call':2,//禁止不必要的.call() 或 .apply()
        'no-void':2,//禁用void操作符
        'no-useless-return':2,//禁止多余的return语句
        'no-with':2,//禁用with语句
        'no-warning-comments':2,//禁止在注释中 使用特定的警告术语
        'radix':2,//强制在parseInt() 使用基数参数
        'require-await':2,//禁止使用不带await的async函数
        'vars-on-top':2,//要求所有的var声明

        'no-caller':0,//禁止使用argument.caller、argument.callee
        'no-case-declarations':2,//不允许在case子句中使用词法声明
        'no-else-return':2,//禁止if语句中return语句之后又else块
        'no-empty-pattern':2,//禁止空解构模式
        'no-eq-null':0,//禁止在没有使用类型检测情况下与null比较
        'no-eval':2,//禁止使用eval();
        'no-extra-bind':0,//禁止不必要的.bind()调用
        'no-extra-label':0,//禁止不必要的标签
        'no-fallthrougn':2,//禁止case语句落空
        'no-invalid-this':2,//禁止this关键字出现类和类对象之外
        //链式调用的时候，点号必须放在第二行开头处，不能放在第一行结尾
        'dot-location':[
           'error',
           'property',
        ],
        'dot-notation':2,//
        //必须使用  === 或 !==,禁止使用 ==或!= ,null比较除外
        'eqeqeq':[
           'error',
           'always',
           {
           	  null:'ignore'
           }
        ]
	}
}