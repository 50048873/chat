/*
*	表情渲染JS
*	@author:	50048873@qq.com
*	@data:		2016年10月11日
*	@version:	1.0
*	@rely:		jQuery
*/
(function($) { 
	/*
	*		参数说明
	*		dir:		【数组】保存表情包文件夹名字
	*		num:		【数组】保存表情每个分类包表情个数
			category:	【数组】保存分类
			isLoaded:	【数组】保存是否加载过
	*/
	var defaults = { 
		dir: ['mr', 'gnl', 'lxh', 'bz'],
		num: [75, 46, 83, 70],
		category: ['默认', '拜年', '浪花', '暴走'],
		isLoaded: [false, false, false, false]
	};

	function Face(wrap, options) { 
		this.$wrap = $(wrap);
		this.opts = $.extend({}, defaults, options);
		this.index = 0;

		this.init();
	};

	Face.prototype.init = function() { 
		this.initNav();
		this.loadIcons(this.index);
		this.toggleCategory();
		this.chooseFace();
	};

	Face.prototype.initNav = function() { 
		var category = this.opts.category;
		var arr = [];
		for (var i = 0, len = category.length; i < len; i++) { 
			if (i === 0) { 
				arr.push('<a href="" class="selected">' + category[i] + '</a>');
			} else { 
				arr.push('<a href="">' + category[i] + '</a>');
			}
		}
		this.$wrap.append('<nav class="f-nav">' + arr.join('') + '</nav>');
	};

	Face.prototype.loadIcons = function(index) { 
		var dir = this.opts.dir;
		var num = this.opts.num;
		var isLoaded = this.opts.isLoaded;
		var arr = [];
		for (var i = 1; i < num[index]; i++) { 
			arr.push('<img src="img/' + dir[index] + '/' + i + '.gif" alt="' + i + '.gif">');
		}
		this.$wrap.append('<div class="clearfix category">' + arr.join('') + '</div>');
		isLoaded[index] = true;
	};

	Face.prototype.toggleCategory = function() { 
		var _this = this;
		var isLoaded = this.opts.isLoaded;
		$('.f-nav').click(function(e) { 
			var a = e.target;
			if (a.tagName == 'A') { 
				e.preventDefault();
				_this.index = $(a).index();
				$(a).addClass('selected').siblings().removeClass('selected');
				if (isLoaded[_this.index] == false) { 
					_this.loadIcons(_this.index);
				}
				$('.category').eq(_this.index).show().siblings('.category').hide();
			}
		});
	};

	Face.prototype.chooseFace = function() { 
		$('.category').click(function(e) { 
			var target = e.target;
			if (target.tagName === 'IMG') { 
				var img = $(target).clone();
				$('#enterBox').append(img);
				$('#send').addClass('btn-primary');
			}
		});
	};

	$.fn.face = function(options) { 
		return this.each(function(index, value) { 
			new Face(value, options);
		});
	};
})(jQuery);