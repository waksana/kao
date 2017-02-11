require('should');

const {c, t} = require('./lib');

describe('assemble command', () => {

  it('likes a normal fn', () => {
    var rawData = {key: 'va1ue', key2: 'asdf'};
    var checker = c.Obj({
      key: t.Str,
      keyDefault: c.Default(t.Str, 'ok')
    });
    var result = checker(rawData);
    result.should.eql({
      key: 'va1ue',
      keyDefault: 'ok'
    });
  });

  it('register a type declear object and cache filter', () => {
    t.Num.should.throw();
    t.Num('12').should.eql(12);
  });

  it('get a boolean type', () => {
    t.Bool('true').should.eql(true);
    t.Bool('false').should.eql(false);
  });

  it('transfer to date', () => {
    const time = new Date('2016-02-24').getTime();
    t.Date('2016-02-24').getTime().should.equal(time);
  });

	it('OrVal -> it should be one of the value', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		};
		var val2 = {
			name: 'lisi',
			age: 13,
			email: 'lis@163.com'
		};
		var val3 = {
			name: 'lisizhangsan',
			age: 13,
			email: 'lisizhangsan@163.com'
		};

		var orValType = c.Obj({
			name: c.OrVal('zhangsan', 'lisi'),
			age: t.Num
		});
		orValType(val1).should.eql({
			name: 'zhangsan',
			age: 13
		});
		orValType(val2).should.eql({
			name: 'lisi',
			age: 13
		});
		try{
			orValType(val3);
		}catch(err){
			//err包括错误信息（message），和错误的对象(value)
			console.log('message:', err.message);
			console.log('value:', err.value);
		}
	});

	it('ValConvert -> 检查原有数据内容，并替换', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		};

		var orConvertType = c.Obj({
			name: c.ValConvert('zhangsan', 'lisi'),
			age: t.Num
		});
		orConvertType(val1).should.eql({
			name: 'lisi',
			age: 13
		});
	});

	it('ObjConvert -> 检查原有对象属性，并替换属性名称', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		};

		var objConvertType = c.ObjConvert({
			name: c.ValConvert('zhangsan', 'lisi'),
			age: t.Num
		}, 'name', 'title');
		objConvertType(val1).should.eql({
			title: 'lisi',
			age: 13
		});
	});

	it('Extend -> 合并两个通过检查的对象', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		};
		var val2 = {
			name: 'zhangsan',
			age: 13,
			phone: '1234567890'
		};
		var extendType = c.Extend(
			c.Obj({
				name: t.Str,
				age: t.Num
			}),
			c.Or(
				c.Obj({
					email: t.Str
				}),
				c.Obj({
					phone: t.Str
				})
			)
		);

		extendType(val1).should.eql({
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		});
		extendType(val2).should.eql({
			name: 'zhangsan',
			age: 13,
			phone: '1234567890'
		});
	});

	it('Optional -> 属性可选', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		};
		var val2 = {
			name: 'zhangsan',
			phone: '1234567890'
		};
		var OptionalType = c.Obj({
			name: t.Str,
			age: c.Optional(t.Num)
		});

		OptionalType(val1).should.eql({
			name: 'zhangsan',
			age: 13
		});
		OptionalType(val2).should.eql({
			name: 'zhangsan'
		});
	});

	it('Default -> 设置默认属性', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			email: 'zhangsan@163.com'
		};
		var val2 = {
			name: 'zhangsan',
			phone: '1234567890'
		};
		var DefaultType = c.Obj({
			name: t.Str,
			age: c.Default(t.Num, 24)
		});

		DefaultType(val1).should.eql({
			name: 'zhangsan',
			age: 13
		});
		DefaultType(val2).should.eql({
			name: 'zhangsan',
			age: 24
		});
	});

	it('Arr -> 判断是否为Arr', () => {
		var val1 = {
			name: 'zhangsan',
			age: 13,
			friends: ['lisi', 'wangwu']
		};
		var ArrType = c.Obj({
			name: t.Str,
			age: c.Default(t.Num, 24),
			friends: c.Arr(t.Str)
		});

		ArrType(val1).should.eql({
			name: 'zhangsan',
			age: 13,
			friends: ['lisi', 'wangwu']
		});
	});

});
