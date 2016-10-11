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
	*		num:		【数组】保存表情包表情个数
	*/
	var defaults = { 
		dir: ['mr', 'gnl', 'lxh', 'bz'],
		num: [75, 46, 83, 70],
		category: ['默认', '拜年', '浪花', '暴走']
	};

	function Face(wrap, options) { 
		this.$wrap = $(wrap);
		this.opts = $.extend({}, defaults, options);

		this.init();
	};

	Face.prototype.init = function() { 
		this.initNav();
		this.loadIcons(0);
		this.toggleCategory();
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
		var arr = [];
		for (var i = 1; i < num[index]; i++) { 
			arr.push('<img src="img/' + dir[index] + '/' + i + '.gif">');
		}
		this.$wrap.prepend('<div class="clearfix category">' + arr.join('') + '</div>');
	};

	Face.prototype.toggleCategory = function() { 
		var index = 0;
		var _this = this;
		$('.f-nav').click(function(e) { 
			var a = e.target;
			if (a.tagName == 'A') { 
				e.preventDefault();
				index = $(a).index();
				$(a).addClass('selected').siblings().removeClass('selected');
				//$('.category').eq(index).show().siblings('.category').hide();
				_this.loadIcons(index);
			}
		});
	};

	$.fn.face = function(options) { 
		return this.each(function(index, value) { 
			new Face(value, options);
		});
	};
})(jQuery);