$(function() { 
	var $panel = $('#panel');
	var $panelBody = $('#panelBody');
	var $send = $('#send');
	var $enterBox = $('#enterBox');
	var $face = $('#face');
	var $keyboard = $('#keyboard');
	var $faceSwitch = $('#faceSwitch');
	var $faceIcons = $('#faceIcons');

	heSaid('您好，感谢您对国网湖北电力的支持与信任！您的问题我们已经收到，请您留下您的联系方式、用电客户编号或详细地址，我们将尽快答复您。');

	$(window).resize(function() { 
		scrollToBottom();
	});

	//输入文字时，发送按钮变亮
	$enterBox.keyup(function() { 
		var html = $(this).html();
		if (html.length) { 
			$send.addClass('btn-primary');
		} else { 
			$send.removeClass('btn-primary');
		}
	});

	//点击输入框时，隐然表情
	$enterBox.click(function() { 
		$faceIcons.hide();
		showFace();
	});

	//点击笑脸
	$faceSwitch.faceIsShowed = false;
	$faceSwitch.faceInited = false;
	$faceSwitch.click(function() { 
		if (!this.faceIsShowed) { 
			showKeyboard();
			$faceIcons.show();
			this.faceIsShowed = true;
		} else { 
			showFace();
			$enterBox.focus();
			$faceIcons.hide();
			this.faceIsShowed = false;
		}

		if (!this.faceInited) { 
			$faceIcons.face();
			this.faceInited = true;
		}
	});

	//点击发送按钮时
	$send.click(function(e) { 
		e.preventDefault();
		var html = $enterBox.html();
		if (html.length) { 
			iSaid(html);
			setTimeout(function() { 
				heSaid('您好，感谢您对国网湖北电力的支持与信任！您的问题我们已经收到，请您留下您的联系方式、用电客户编号或详细地址，我们将尽快答复您。');
			}, Math.ceil(Math.random() * 2000));
			
		}
		$enterBox.html('');
		$send.removeClass('btn-primary');
		if ($faceIcons.css('display') === 'block') { 
			$faceIcons.hide();
			showFace();
		}
		$enterBox.focus();
	});

	var pos = { 
		startPageY: 0,
		offsetY: 0,
		endPageY: 0
	};
	var loadingH = 30;
	var paging = { 
		pageNumber: 1,
		pageSize: 5
	};
	var panel = $panel[0];

	panel.addEventListener('touchstart', fingerStart, false);
	panel.addEventListener('touchmove', fingerMove, false);
	panel.addEventListener('touchend', fingerEnd, false);

	//手指触摸
	function fingerStart(e) { 
		pos.startPageY = e.touches[0].pageY;
	};

	//手指触摸后移动
	function fingerMove(e) {
		$enterBox.blur();

		//记录偏移量 = 移动位置座标 - 开始位置座标
		pos.offsetY = e.touches[0].pageY - pos.startPageY;
		pos.offsetY /= 4;
		pos.offsetY >= 200 ? pos.offsetY = 200 : pos.offsetY;

		if ($(window).scrollTop() === 0 && e.touches[0].pageY > pos.startPageY) { 
			e.preventDefault();
			setLoadingPosition(pos.offsetY);
		}
	};

	//手指抬起
	function fingerEnd(e) { 
		pos.endPageY = e.changedTouches[0].pageY;
		if (pos.endPageY - pos.startPageY > loadingH && pos.offsetY > loadingH) { 
			setLoadingPosition(loadingH);
			loadContent(paging);
		} else { 
			setLoadingPosition(0);
		}
	};

	function loadContent(paging) { 
		$.ajax({ 
			url: 'json/chat.json',
			data: paging
		}).then(function(res) { 
			if (res.length) { 
				setLoadingPosition(0);
				for (var i = res.length - paging.pageSize * (paging.pageNumber - 1) - 1; i >= res.length - paging.pageSize * paging.pageNumber && i >= 0; i--) { 
					loadPreviousChat(res[i].content, res[i].time);
				};
				paging.pageNumber++;
			}
		}, function(err) { 
			console.log(err);
		});
	}

	function loadPreviousChat(txt, time) { 
		time = $.format.date(new Date(time * 1), "yyyy-MM-dd HH:mm:ss");
		var html = '<div class="m-b">' +
				'<a href="" class="pull-right thumb-sm avatar"><img src="img/a3.jpg" class="img-circle" alt="..."></a>' +
				'<div class="m-r-xxl m-l-xxl">' +
				  '<div class="pos-rlt wrapper bg-primary r r-2x">' +
					'<span class="arrow right pull-up arrow-primary"></span>' +
					'<p class="m-b-none">' + txt + '</p>' +
				  '</div>' +
				  '<small class="text-muted">' + time + '</small>' +
				'</div>' +
			'</div>';
		$panelBody.prepend(html);
	}

	function setLoadingPosition(y) { 
		$panel.css({
			'-webkit-transform': 'translate3d(0, ' + y + 'px, 0)',
			'transition': 'transform 0.4s ease-out'
		});
	}

	function scrollToBottom() { 
		$(window).scrollTop($panelBody.height());
	}

	function iSaid(txt) { 
		var idNo = new Date() * 1;
		var time = $.format.date(idNo, "yyyy-MM-dd HH:mm:ss");
		var html = '<div class="m-b">' +
				'<a href="" class="pull-right thumb-sm avatar"><img src="img/a3.jpg" alt="..."></a>' +
				'<div class="m-r-xxl m-l-xxl">' +
				  '<div class="pos-rlt wrapper b r r-2x">' +
					'<span class="arrow right pull-up"></span>' +
					'<p class="m-b-none iSaid">' + txt + '</p>' +
				  '</div>' +
				  '<small class="text-muted">' + time + '</small>' +
				'</div>' +
			'</div>';
		$panelBody.append(html);
		$('.iSaid:last')[0].scrollIntoView();
	}

	function heSaid(txt) { 
		var idNo = new Date() * 1;
		var time = $.format.date(idNo, "yyyy-MM-dd HH:mm:ss");
		var html = '<div class="m-b">' +
				'<a href="" class="pull-left thumb-sm avatar"><img src="img/a2.jpg" alt="..."></a>' +
				'<div class="m-r-xxl m-l-xxl">' +
				  '<div class="pos-rlt wrapper bg-primary r r-2x">' +
					'<span class="arrow left pull-up arrow-primary"></span>' +
					'<p class="m-b-none heSaid">' + txt + '</p>' +
				  '</div>' +
				  '<small class="text-muted">' + time + '</small>' +
				'</div>' +
			'</div>';
		$panelBody.append(html);
		$('.heSaid:last')[0].scrollIntoView();
	}

	function loading_add() { 
		if ($('#loading').length === 0) { 
			var html = '<div class="loading" id="loading"></div>';
			$panelBody.prepend(html);
		}
	}

	function showFace() { 
		$face.show();
		$keyboard.hide();
	}

	function showKeyboard() { 
		$face.hide();
		$keyboard.show();
	}
});