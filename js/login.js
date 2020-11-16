var WBI = {};
jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires
				&& (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime()
						+ (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires
															// attribute,
															// max-age is not
															// supported by IE
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [ name, '=', encodeURIComponent(value), expires,
				path, domain, secure ].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie
							.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};
var ref = "";
function checkpid() {
/*	var cookiepid  = $.cookie('pid');
	var currentpagepid = $('#pid').val();
	if (cookiepid!=undefined && cookiepid!='' && cookiepid!=null && 
			currentpagepid!=undefined && currentpagepid!='' && currentpagepid!=null &&
			currentpagepid != cookiepid) {
		alert(currentpagepid+"------"+cookiepid);
		clearInterval(ref);
		location.reload();
		alert('同一浏览器不能同时登陆2个账号，请关闭当前已失效的页面');
		window.close();
	}*/
	
	var cookieloginuserid  = $.cookie('login_user_id');
	var currentpageuserid = $('#userid').val();
	if (cookieloginuserid!=undefined && cookieloginuserid!='' && cookieloginuserid!=null && 
			currentpageuserid!=undefined && currentpageuserid!='' && currentpageuserid!=null &&
			currentpageuserid != cookieloginuserid) {
		clearInterval(ref);
		location.reload();
		alert('同一浏览器不能同时登陆2个账号，请关闭当前已失效的页面');
		top.window.open('','_self','');//苹果浏览器上 不能正确执行window.close(),需要添加此段代码后 才能正确执行关闭窗体
		window.close();
	}
}
$(function() {

	// 3. 设置定时刷新
	/*
	 * if('0'== $('#InitAccountingComplete').val()){
	 * $(parent.document).find('li[class=mWAC]').hide(); }else if('1'==
	 * $('#InitAccountingComplete').val()){
	 * $(parent.document).find('li[class=mWAC]').show();
	 * //隐藏其他按钮，保留”会计设置“--”创建账套“按钮！！
	 * $(parent.document).find('#secondmenu6').find('ul:first').hide();
	 * $(parent.document).find('#secondmenu6').find('ul:eq(1)').find('li').hide();
	 * $(parent.document).find('#secondmenu6').find('ul:eq(1)').find('li:first').show();
	 * }else if('2'== $('#InitAccountingComplete').val()){
	 * $(parent.document).find('li[class=mWAC]').show();
	 * $(parent.document).find('#secondmenu6').find('ul:eq(1)').find('li:first').show();//隐藏”在先会计“--”会计设置“--”创建账套“按钮
	 * }else{ $(parent.document).find('li[class=mWAC]').hide(); }
	 */

	$(".main").css("height", ($(window).height() - 97) + "px");

	/* 鼠标移出左侧菜单的时候，隐藏二级菜单 */
	$(".leftMenu").hover(function() {// 对div的处理
		t = setTimeout(function() {
			hideSecondMenu();
		}, 10);
	});

	// 免费版去除适用图标
	var productversion=getValueFromRoot("productversion");
	if (productversion == 3) {
		$("#shiyong").hide();
	} else {

	}

	var fristlogin = getCookie("fristlogin");
	if (fristlogin == "" || fristlogin == null || fristlogin == undefined
			|| fristlogin == "null") {
		setCookie("fristlogin", "1");
	}
	var sobstate = $("#index_sobstate").val();
	var isshow_newstart = getCookie("isshow_newstart");
	if (isshow_newstart == "true") {
		addTabByTitleAndUrl('新手引导', 'desktop/newstart.htm','desktop-newstart', 'WMAIN', false);
	}
	showIndex();
	// 如果是演示账号，则显示业务流程图tab TODO
	if ("demo" == $('#loginType').val()) {
		addTabByTitleAndUrl('新手引导', 'desktop/newstart.htm','desktop-newstart', 'WMAIN', false);
		// selectTab($("#tab li:first-child").next());
	}
	// 未开账打开期初录入
	if (sobstate == 0) {
		var url = getCookie("init_lastmenu");
		if (url == "" || url == null || url == undefined) {
			// 第一次先进入新手向导
			// openNewStart();
		} else {
			openAddInitData();
		}
	}

	var url = getCookie("fristlogin");
	// 用户第一次登陆显示提示
	if (url == "" || url == null || url == undefined || url == "null") {
		// 第一次先进入新手向导
		// openNewStart();
		// showFirstPage();
	}

	var index = 0;
	$(".tab_title ul li").click(function() {
		index = $(".tab_title ul li").index(this);
		$(this).addClass("select").siblings().removeClass("select");
		$(".tab_content div").eq(index).show().siblings().hide();
	});

	$(".vright").click(
			function(e) {
				var topTabWidth = $(".vright").offset().left
						- $(".vleft").offset().left - 45;

				var scrolbWidth = 0;
				$(".u .scrol li").each(function() {
					// 10px 为margin值
					scrolbWidth = scrolbWidth + this.offsetWidth + 10;
				});

				var leftNew = $(".u .scrol").offset().left - 300;

				if (scrolbWidth > topTabWidth) {
					if (leftNew < topTabWidth - scrolbWidth) {
						leftNew = topTabWidth - scrolbWidth;
					}

					$(".u .scrol").css({
						left : leftNew + "px"
					});
				}
			});

	$(".vleft").click(function() {
		var leftNew = $(".u .scrol").offset().left + 150;
		if (leftNew > 0) {
			leftNew = 0;
		}

		$(".u .scrol").css({
			left : leftNew + "px"
		});
	});

	// 专属客服
	$('#customerservice').mouseenter(function() {
		$('#customerservicelist').fadeIn(250);
	});
	$('#customerservice').mouseleave(function() {
		$('#customerservicelist').fadeOut(250);
	});
	// 帮助
	$("#divHelpArea").mouseenter(function() {
		$("#divHelpList").fadeIn(250);
	});
	$("#divHelpArea").mouseleave(function() {
		$("#divHelpList").fadeOut(250);
	});
	// 设置
	$("#divSetArea").mouseenter(function() {
		$("#divSetList").fadeIn(250);
	});
	$("#divSetArea").mouseleave(function() {
		$("#divSetList").fadeOut(250);
	});
	//检测是否有优惠券
	checkHasCouponGift();
	//检测可用优惠券数量
	queryCouponGiftCount();
	

	// 用户pc 页面跳转指定具体的跳转页
	var pctableurl = $('#pctableurl').val();
	var pctableid = $('#pctableid').val();
	var pctablename = decodeURI(decodeURI($('#pctablename').val()));
	if (pctableid != null && pctableid != '' && pctablename != null
			&& pctablename != '' && pctableurl != null && pctableurl != '') {
		openTab(pctablename, pctableurl, pctableid, 0);
		// 移除tab中样式
		$("#tab li").each(function(i) {
			$(this).attr("class", "normal");

		});
		$("#" + pctableid).attr("class", "select");
	}
	// 如果是演示账号登录则 页面加载完毕 跳转至《业务流程》Tab中。
	if ("demo" == $('#loginType').val()) {
		selectTab($("#tab li:first-child").next());
	}
	//免费版检查到期日
	var productversion=getValueFromRoot("productversion");
	if(productversion==3){
		$.post("/UCenter-webapp/SysConfig/GetPayEndDate.json", {}, function(result, resultState) {
			if (resultState == "success") {
				parent.$(".loadding").hide();
				if(result.data.Data!=undefined){
					var payenddate=result.data.Data.PayEndDate;
					$("#hidPayEndDate").val(payenddate);
					if(result.data.Data.PayEndState==3){

						var freeenddate = getCookie($("#contactid").val()+"freeenddate");
						if (freeenddate == "" || freeenddate == null || freeenddate == undefined
								|| freeenddate == "null") {
							setCookie($("#contactid").val()+"freeenddate", "1");
							
						layer.alert('您的移动支付功能已经到期，不能继续使用。续费后才能重新使用该功能。',{title:"提示",btn:['去交费']},
								function(index){
							 layer.close(index);
							 gopay();
						}); 

						}
					}else{
					if(result.data.Data.PayEndState==2){
						layer.alert('移动支付到期时间为：'+payenddate+' 请在到期之前缴费，以免影响移动支付功能的使用。',{title:"提示",btn:['去交费']},
								function(index){
							 layer.close(index);
							 gopay();
						}); 
					}
					}

				}
			}
		})
	}

	var newsobid1 = $("#sobid").val();
	var nowsobid1 = $("#newSobid").val();
	if(newsobid1 == nowsobid1){
		//最新的帐套里 才会显示添加员工按钮
		$("#goShowUser").show();
		// 检查支付进度
		var param = {};
		param["PayChannel"] = 1;
		param["AuditStep"] = "step1";
		$.post("/UCenter-webapp/SysConfig/GetPayAuditResult4Read.json", param, function(result,resultState) {
			if (resultState == "success") {
				
				if (result!=null && result.data!=null && result.data.Data != undefined) {
					var msg="";
					var turnpaychannel=0;
					$.each(result.data.Data,function(index,value){
						if(value.PayChannel==2){
							msg=msg+" 支付宝";
							turnpaychannel=2;
						}
						if(value.PayChannel==1){
							msg=msg+" 微信";
							if(turnpaychannel==0){
								turnpaychannel=1;
							}
						}
					});
						layer.confirm('您的'+msg+' 开通申请有新进展<br />您也可以在业务设置页面下查看最新的进展', 
								{title:'友情提醒',btn: ['立即查看', '稍后处理']}, 
								function(index){
									layer.close(index);
									$.post("/UCenter-webapp/SysConfig/GetPayInfo.json", {}, function(result, resultState) {
										if (resultState == "success") {
											if (result.data.IsSuccess) {
												if(turnpaychannel==2){
													if (result.data.Data != undefined
															&& result.data.Data.AlipayCurStep != undefined
															&& result.data.Data.AlipayCurStep != 0) {
		
														var url = "SysConfig/Alipay"
																+ result.data.Data.AlipayCurStep + ".htm";
														var title = "开启支付宝";
														var id = "AlipayPay-InitOpen";
														addTabByTitleAndUrl(title, url, id, "WBI", true);
		
													}
												}
												if(turnpaychannel==1){
													if (result.data.Data != undefined
															&& result.data.Data.WXCurStep != undefined
															&& result.data.Data.WXCurStep != 0) {
		
														var url = "SysConfig/WX"
																+ result.data.Data.WXCurStep + ".htm";
														var title = "开启微信";
														var id = "WXPay-InitOpen";
														addTabByTitleAndUrl(title, url, id, "WBI", true);
		
													}
												}
											} else {
												showErrorMsg("调用支付接口出现了点异常：" + result.data.Message);
											}
										}
									});
							});
					}
			}
		});
	}
	
	
	HELPINFO.init();
	
	//显示 需求反馈有新回复的new标记
	showNewMark();
	if(productversion == 3){
		if(getwarehouseislocked(1)){
			$("#InvTakState").show();
		}else{
			$("#InvTakState").hide();
		}
	}else{
		if(getwarehouseislocked(2)){
			$("#InvTakState").show();
		}else{
			$("#InvTakState").hide();
		}
	}
	if("demo"!=$('#loginType').val() && 
			(undefined == getCookie($("#userid").val()+"newshow"+"_FirstShowNewFunction_1_"+productversion)
				|| "20180710_new_function" != getCookie($("#userid").val()+"newshow"+"_FirstShowNewFunction_1_"+productversion)		
			)
	 ){
		
		$("#newF").val("1");
		$('#warnningcover').show();
		if(productversion == 3){
			popup($('#newFunctionTipFree'));
		}else if(productversion == 1){
			popup($('#newFunctionTip'));
		}else if(productversion == 2){
			popup($('#newFunctionTipChain'));
		}
		setCookie($("#userid").val()+"newshow"+"_FirstShowNewFunction_1_"+productversion,'20180710_new_function');
	}
	
	//检测帐套状态
	balanceSOBstate();
	
	//切换为老的账套，隐藏新手向导
	var isOldSob = checkCurrentSob(1);
	if(isOldSob){
		$("#newStartLi").hide();
		$("#waringInfo").hide();
		$("#noWaringInfo").show();
		$("#waringbutton").hide();
	}else{
		$("#waringInfo").show();
		$("#noWaringInfo").hide();
		$("#waringbutton").show();
	}
	
	//切换帐套后，获取所切换帐套的起止时间
	getNowSOBSEDate();
	//获取结存状态为1或3的结束时间
	getLastBalanceDate();
	//结存提醒
	getBalanceState();
	
	//判断是否显示线上订单预警
	$.YY_post("SaleOrder/CheckShowOnlineOrder.json", {}, function(result) {
		if (null != result && null != result.showonlineorder) {
			if ("1" == result.showonlineorder) {
				$("#onlineSaleOrderLi").show();
			}
		}else{
			showErrorMsg("判断是否显示线上订单预警失败，请刷新重试");
		}
	}, null, null, null, true);
	
	//演示帐号登录时，顶部显示 注册引导按钮
	if("demo" == $('#loginType').val()){
		//切换角色，隐藏立即体验弹窗
		var ishowyanshitip = $("#ishowyanshitip").val();
		if(ishowyanshitip == 1){
			$("#YSpoparea").hide();
			$("#main_cover_yanshi").hide();
		}
		
		//演示帐号登录 隐藏新功能和优惠券提醒
		$("#couponGiftTip").hide();
		$("#couponGiftTip4Activity").hide();
		$("#newFunctionTip").hide();
		$("#newFunctionTipFree").hide();
		
		if($("#productversion").val() != 3){
			$("#logotop").show();
			$("#btnRole").show();//显示角色切换按钮
		}
		var registurl = $("#BasePath_WMAIN").val();
		var PType = $("#productversion").val();
		if(PType == "1"){//专业版
			PType="0";
		}
		if(PType == "2"){//连锁版
			PType="1";
		}
		if(PType == "3"){//免费版
			PType="2";
		}
		var reg = registurl+"Register/Init.htm?ProductType="+PType+"&timestamp="+new Date().getTime();
		$("#tiptext").attr("target","_blank");
		$("#tiptext").attr("href",reg);
		$("#loginTypeDemo").show();
	}
	
	setTimeout(function(){
		ref = setInterval(function() {
			checkpid();
		}, 2000);
	}, 5000);
	initNearBuyPricePermFlag();
	//检测最近未查看的优惠券，标记小红点
	queryNearCouponGiftCount();
});

$(window).resize(function() {
	$(".main").css("height", ($(window).height() - 97) + "px");
});

var isHideIframe = false;// 是否是隐藏IFRAME

// module_id 模块ID， isHide true 为隐藏IFRAME ，否则直接关闭清空iframe
function doCancel(module_id, isHide) {
	$("#" + module_id).find(".popArea").hide();
	$("#" + module_id).find("#main_cover").hide();
	if (isHide == undefined || isHide == null || isHide == false) {
		$("#" + module_id).find("#main_showPop").empty();
		$("#" + module_id).find("#iframe_model").attr("src", "about:blank");
		isHideIframe = false;
	} else {
		isHideIframe = true;
	}
	// $(document).unbind("mousemove");
	if (module_id == null || module_id == undefined) {
		$(".popArea").hide();
		$("#main_cover").hide();
		if (isHide == undefined || isHide == null || isHide == false) {
			$("#main_showPop").empty();
			$("#iframe_model").attr("src", "about:blank");
			isHideIframe = false;
		} else {
			isHideIframe = true;
		}
	}
}

function fullScree() {
	$(".popArea").css({
		height : '100%',
		width : '100%'
	});
	$(".content").css({
		height : '100%',
		width : '100%'
	});
}

function showMainModel(obj) {
	$("#main_showPop").append(obj);
	$("#main_showPop").find('.popArea').show();
	var iTop = (window.screen.availHeight - 100 - $(obj).height()) / 2; // 获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth - 10 - $(obj).width()) / 2; // 获得窗口的水平位置;
	$("#main_showPop").find('.popArea').css({
		opacity : 1,
		top : iTop + 'px',
		left : iLeft + 'px'
	});
	// $("#main_cover").css("background", "url(images/coverBg.png)");
	$("#main_cover").show();
	$("#main_showPop").find("input").bind("keyup", function() {
		$(".noActionButton").removeClass("noActionButton");
	});
	$("#main_showPop").find("input:checkbox").bind("click", function() {
		$(".noActionButton").removeClass("noActionButton");
	});
	$("#main_showPop").find("input:radio").bind("click", function() {
		$(".noActionButton").removeClass("noActionButton");
	});
	$("#main_showPop").find("textarea").bind("keyup", function() {
		$(".noActionButton").removeClass("noActionButton");
	});
	$("#main_showPop").find("input").blur(function() {
		this.value = removeHTMLTag(this.value);
	});
	$("#main_showPop").find("textarea").blur(function() {
		this.value = removeHTMLTag(this.value);
	});
	$(document).unbind("mousemove");
	drag($("#main_showPop").find(".popArea"));
}

/**
 * 显示没有标题的弹出框
 * @param url
 * @param isClose 1：关闭弹窗
 */
function showNoTitlePopArea(url,isClose, height, width){
	if(1==isClose){
		$("#main_noTitlePopArea").hide();
	}else{
		if("undefined"==typeof width)
			width = "200";
		if("undefined"==typeof height)
			height = "55";
		
		$("#main_cover").show();
		$("#main_noTitlePopArea").attr("midPopArea", 1);
		$("#main_noTitlePopArea").show();
		$("#main_noTitlePopArea").css("width",width+"px");
		$("#main_noTitlePopArea").css("height",height+"px");
		$("#main_noTitlePopArea").find(".content").css("height",(height) + "px");
		$("#no_title_poparea_iframe_model").attr("src", url);
	}
	var iTop = (document.body.clientHeight - 60 - $("#main_noTitlePopArea").height()) / 2; // 获得窗口的垂直位置;
	var iLeft = (document.body.clientWidth - 10 - $("#main_noTitlePopArea").width()) / 2; // 获得窗口的水平位置;
	if (iTop < 0) {
		iTop = 0;
	}
	$("#main_noTitlePopArea").css({
		"opacity" : 1,
		"top" : Number(Number(iTop)+Number(50)) + 'px',
		"left" : iLeft + 'px'
	});
}

function showMainPage(url, title, pageHeight, pageWidth) {
	showPopPage(url, title, pageHeight, pageWidth, "main_showPage", "999");
}
function showMainTwoPage(url, title, pageHeight, pageWidth) {
	showPopPage(url, title, pageHeight, pageWidth, "main_showTwoPage", "1010");
}
function showMainThreePage(url, title, pageHeight, pageWidth) {
	showPopPage(url, title, pageHeight, pageWidth, "main_showThreePage", "1020");
}
function showPopPage(url, title, pageHeight, pageWidth, iframeId, zindex) {
	if (url.indexOf('../UCenter-webapp/Login/reloginpassword.htm') == -1 && url.indexOf("Login/balancerelogin.htm")== -1 && url.indexOf('Login/balancesuccessrelogin.htm')== -1) {
		$.ajax({
			async : false,
			url : 'index/checksession.json',// 跳转到 action
			data : {},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (data.flag == '1') {
					$('.loadding').hide();
					window.parent.showMainPage('../UCenter-webapp/Login/reloginpassword.htm?random'+ Math.random(), '录入密码', 200, 400);
				} else if(data.flag == '2'){
					$('.loadding').hide();
					window.parent.showMainPage('../UCenter-webapp/Login/balancerelogin.htm?random'+Math.random(),'系统提醒',200,400);
				}else if(data.flag == '3'){
					$('.loadding').hide();
					window.parent.showMainPage('../UCenter-webapp/Login/balancesuccessrelogin.htm?random'+Math.random(),'系统提醒',200,400);
				} else if(data.flag=='4'){
					window.parent.location.href='../UCenter-webapp/Login/Init.htm?msg=4';
				} else{
					if (isHideIframe) {
						$("#" + iframeId).find('.popArea').show();
						$("#" + iframeId).find("#main_cover").show();
						return;
					}
					if (pageHeight != null && pageHeight != undefined) {
						$("#" + iframeId).find(".popArea").css("height",
								(parseInt(pageHeight) + 30) + "px");
						$("#" + iframeId).find(".content").css("height",
								(pageHeight) + "px");
					}
					if (pageWidth != null && pageWidth != undefined) {
						$("#" + iframeId).find(".popArea").css("width",
								(pageWidth) + "px");
						// $("#"+iframeId).find(".content").css("width",(pageWidth)+"px");
					}

					$("#" + iframeId).find("#iframe_model").attr("src", url);
					$("#" + iframeId).find("#title_text").empty();
					$("#" + iframeId).find("#title_text").append(title);
					$("#" + iframeId).find('.popArea').show();
					var iTop = (document.body.clientHeight   - 60 - $(
							"#" + iframeId).find('.popArea').height()) / 2; // 获得窗口的垂直位置;
					var iLeft = (document.body.clientWidth - 10 - $(
							"#" + iframeId).find('.popArea').width()) / 2; // 获得窗口的水平位置;
					if (iTop < 0) {
						iTop = 0;
					}
					$("#" + iframeId).find('.popArea').css({
						opacity : 1,
						"z-index" : zindex,
						top : Number(Number(iTop)+Number(50)) + 'px',
						left : iLeft + 'px'
					});
					$("#" + iframeId).find("#main_cover").css({
						// background : "url(images/coverBg.png)",
						"z-index" : zindex - 5
					});

					$("#" + iframeId).find("#main_cover").show();
					drag($("#" + iframeId).find(".popArea"));
				}
			},
			error : function() {
			}
		});
	} else {
		if (isHideIframe) {
			$("#" + iframeId).find('.popArea').show();
			$("#" + iframeId).find("#main_cover").show();
			return;
		}
		if (pageHeight != null && pageHeight != undefined) {
			$("#" + iframeId).find(".popArea").css("height",
					(parseInt(pageHeight) + 30) + "px");
			$("#" + iframeId).find(".content").css("height",
					(pageHeight) + "px");
		}
		if (pageWidth != null && pageWidth != undefined) {
			$("#" + iframeId).find(".popArea").css("width", (pageWidth) + "px");
			// $("#"+iframeId).find(".content").css("width",(pageWidth)+"px");
		}

		$("#" + iframeId).find("#iframe_model").attr("src", url);
		$("#" + iframeId).find("#title_text").empty();
		$("#" + iframeId).find("#title_text").append(title);
		$("#" + iframeId).find('.popArea').show();
		var iTop = (document.body.clientHeight - 60 - $("#" + iframeId).find(
				'.popArea').height()) / 2; // 获得窗口的垂直位置;
		var iLeft = (document.body.clientWidth - 10 - $("#" + iframeId).find(
				'.popArea').width()) / 2; // 获得窗口的水平位置;
		if (iTop < 0) {
			iTop = 0;
		}
		$("#" + iframeId).find('.popArea').css({
			opacity : 1,
			"z-index" : zindex,
			top : Number(Number(iTop)+Number(50)) + 'px',
			left : iLeft + 'px'
		});
		$("#" + iframeId).find("#main_cover").css({
			// background : "url(images/coverBg.png)",
			"z-index" : zindex - 5
		});

		$("#" + iframeId).find("#main_cover").show();
		drag($("#" + iframeId).find(".popArea"));
		$(window).resize();
	}
}

/**
 * 
 * @param popAreaElement 弹窗元素
 * @param specifyDragElement 拖动元素
 * @param specifyDocument 鼠标所在的document
 * @returns
 */
function drag(popAreaElement, specifyDragElement, specifyDocument) {
	//弹窗的元素
	var $div = popAreaElement;
	//被拖动的元素
	var dragElment = null;
	if("undefined" == typeof specifyDragElement){
		dragElment = $div.find(".moveArea");
	}else{
		dragElment = specifyDragElement;
	}
	//指定上下文的Document
	var documentE = null;
	if("undefined" == typeof specifyDocument){
		documentE = document;//调用方法的document
	}else{
		documentE = specifyDocument;
	}
	
	/* 绑定鼠标左键住事件 */
	dragElment.bind("mousedown", function(event) {
		/* 获取需要拖动节点的坐标 */
		var offset_x = $(popAreaElement)[0].offsetLeft;// x坐标
		var offset_y = $(popAreaElement)[0].offsetTop;// y坐标
		/* 获取当前鼠标的坐标 */
		var mouse_x = event.screenX;
		var mouse_y = event.screenY;
		/* 绑定拖动事件 */
		/* 由于拖动时，可能鼠标会移出元素，所以应该使用全局（document元素 */
		$(documentE).bind("mousemove", function(ev) {
			/* 计算鼠标移动了的位置 */
			var _x = ev.screenX - mouse_x;
			var _y = ev.screenY - mouse_y;
			/* 设置移动后的元素坐标 */
			var now_x = (offset_x + _x);
			var now_y = (offset_y + _y);

			/* 改变目标元素的位置 */
			popAreaElement.css({
				top : now_y > 0 ? now_y : 0 + "px",
						left : now_x > 0 ? now_x : 0 + "px"
			});
		});
	});
	/* 当鼠标左键松开，接触事件绑定 */
	$(documentE).bind("mouseup", function() {
		$(this).unbind("mousemove");
	});

}

function doSave(obj) {
	if (obj != undefined && $(obj).hasClass('noActionButton')) {
		return;
	}
	$("#myForm").submit();
	if ($("#myForm").find(".n-error:visible").length > 0) {
		return;
	}
	$(obj).addClass('noActionButton');
	// $(".loadding").show();
	$(".main:visible").find("#iframe")[0].contentWindow.doSave();
	// window.frames["iframe"].doSave();
}
function saveAccountSetPage(obj) {
	if (obj != undefined && $(obj).hasClass('noActionButton')) {
		return;
	}
	$("#myForm").submit();
	if ($("#myForm").find(".n-error:visible").length > 0) {
		return;
	}
	$(obj).addClass('noActionButton');
	// $(".loadding").show();
	$(".main:visible").find("#iframe")[0].contentWindow.saveAccountSetPage();
	// window.frames["iframe"].doSave();
}
function ErrorSuccessIcon(obj){
	var AccountNumberObj = $(obj).val();
	if(AccountNumberObj !="" && !(/^\d+$/.test(AccountNumberObj))){
		$(obj).removeClass("n-invalid");
		$(obj).addClass("n-invalid");
		$(obj).parent().find("span").remove();
		var str = "<span class='msg-box n-right' style='' for='AccountNumber'>" +
				"<span class='msg-wrap n-error' role='alert'><span class='n-icon'>" +
				"</span><span class='n-msg'>请输入正确的银行账号</span></span></span>";
		$(obj).parent().append(str);
	}
	
}

/**
 * 提交 留言反馈
 */
function submitFeedback() {
	var paramPath = validateParam();
	if (true != paramPath) {
		$('.is_failure').text(paramPath).show();
		return;
	}
	var path = false;
	$.YY_post("Captcha/checkcaptcha.json", {
		captcha : $('#validateCode').val()
	}, function(result) {
		if (null != result && null != result.serviceResult) {
			if ('1' == result.serviceResult.statu) {
				path = true;
			} else {
				path = false;
				var errormsg = result.serviceResult.message;
				$('.is_failure').text(errormsg).show();
			}
		}
	}, null, null, null, false);
	if (!path) {
		return;
	}
	var param = {};
	param["name"] = $('#name').val();
	param["phone"] = $('#phone').val();
	param["title"] = "来自进销存";
	param["content"] = $('#content').val();
	param["overdue"]=$("#overdue").val();
	// alert( param["name"] +"==" + param["phone"] + "==" + param["title"]+
	// "=="+ param["content"]);
	$.YY_post("index/sumitFeedbackForm.json", param, function(result,
			resultState) {
		if (resultState == "success") {
			if (null != result && null != result.serviceResult) {
				if ('1' == result.serviceResult.statu) {
					$('.is_success').text('建议提交成功，感谢！').show();
					$('.is_failure').hide();
					$('#feedback_table').hide();
				} else {
					$('.is_failure').text('建议提交失败，请重试！').show();
					$('.is_success').hide();
				}
			}
		} else {
		}
	});
}
/**
 * 重置 留言反馈
 */
function resetFeedback() {
	$('#name').val('');
	$('#phone').val('');
	$('#title').val('');
	$('#content').val('');
	$('#validateCode').val('');
	$('.is_success').text('').hide();
	$('.is_failure').text('').hide();
	$('#phone_msg').html('').hide();
	$('#feedback_table').show();
	$('#validateCode_msg').text('').hide();
	// $('#captchaImage').click();
}

function doSaveAdd(obj) {
	if (obj != undefined && $(obj).hasClass('noActionButton')) {
		return;
	}
	$("#myForm").submit();
	if ($("#myForm").find(".n-error:visible").length > 0) {
		return;
	}
	$(obj).addClass('noActionButton');
	// $(".loadding").show();
	$(".main:visible").find("#iframe")[0].contentWindow.doSaveAdd();
	// window.frames["iframe"].doSaveAdd();
}

/**
 * 保存门店
 * 
 * @param obj
 */
function doSaveBranch(obj) {
	if (obj != undefined && $(obj).hasClass('noActionButton')) {
		return;
	}
	$("#myForm").submit();
	if ($("#myForm").find(".n-error:visible").length > 0) {
		return;
	}
	// $($(".main:visible").find("#iframe")[0].contentDocument).find("#doSaveBranchButton").attr("onclick","");
	$(".main:visible").find("#iframe")[0].contentWindow.doSaveBranch();
}
// 复制门店信息
WBI.copyInfo = function(obj) {
	$(".main:visible").find("#iframe")[0].contentWindow.copyInfo(obj);
	// window.frames["iframe"].copyInfo(obj);
};
// 显示钮
function showButton() {
	if ($(".noActionButton").length > 0) {
		$(".noActionButton").removeClass("noActionButton");
	}
	// $(".main:visible").find("#iframe")[0].contentWindow.showButton();
}

// 安全退出
function safetyExit() {
	var param = {};
	if (confirm("确认退出！")) {
		var userid = $("#userid").val();
		deleteCookie("trialDivTip_"+userid);
		
		//如果导入中退出，会导致导入页面显示弹窗
		top.$("iframe:visible").each(function(){
			if( null!=$(this).attr("src") && $(this).attr("src").indexOf("Product/ImportInit.htm")>0 ){
				$(this)[0].contentWindow.$('body').stopTime('A');
			}
		});
		
		$.YY_post("index/logout.json", param, function(result, resultState) {
			if (resultState == "success") {
				if (result.serviceResult.statu == 1) {
					window.location = $('#BasePath_WMAIN').val()
							+ "/Login/Init.htm?msg=99";
				}
			} else {
			}
		});
	}
}

// 打开二级菜单
function showMenuDiv(obj) {
	// 移除一级菜单的选中样式
	$(".icon").parent().removeClass("select");
	// 关闭全部的二级菜单
	$(".mGoodsSon").hide();
	// 获取一级菜单id
	var id = $(obj).attr("id");
	// 根据一级菜单id，获取二级菜单id，并打开二级菜单
	$("#" + id + "Div").show();
}
// 给一级菜单增加选中样式
function addMenuSelect(obj) {
	// 获取二级菜单id
	var id = $(obj).attr("id");
	// 获取一级菜单id
	id = id.substring(0, 5);
	// 给一级菜单增加选中样式
	$("#" + id).addClass("select");
}

var t;
// 解决div中存在ul时，频繁调用onmouseout方法的问题
// 解决setTimeout对象传递问题
// 延迟关闭二级菜单
function delayHideSecondMenu(obj) {
	var showsecondmenu = ($(obj).attr("secondmenu"));
	if ($('#' + showsecondmenu).is(":visible")) {
		return;
	}
	t = setTimeout(function() {
		hideSecondMenu();
	}, 10);
}

// 清除延迟事件
function clearTime() {
	clearTimeout(t);
}
// 关闭二级菜单
function hideSecondMenu() {
	$("#firstmenu li").removeClass("select");
	// 隐藏二级菜单
	$(".secondMenu").hide();
}
// 展示二级菜单
function showSecondMenu(obj) {
	// 因为关闭二级菜单的时候存在延时关闭所二级菜单，所以在打开二级菜单的时候也需要延时打开，否则容易出现打开另外一个二级菜单之后调用关闭所有二级菜单的方法。
	t = setTimeout(function() {
		delayShowSecondMen(obj);
	}, 20);
}

function delayShowSecondMen(obj) {
	$("#firstmenu li").removeClass("select");
	// 隐藏二级菜单
	$(".secondMenu").hide();

	var secondmenu = $(obj).attr("secondmenu");
	$(obj).addClass("select");
	var clientHeight = window.document.body.clientHeight;
	var menuHeight = $("#" + secondmenu).css("height");
	menuHeight = menuHeight.substring(0, menuHeight.indexOf("px"));
	var top = $("#" + secondmenu).css("top");
	top = top.substring(0, top.indexOf("px"));
	if (clientHeight - menuHeight < top) {
		top = clientHeight - menuHeight - 20;
	}
	$("#" + secondmenu).css("top", top + "px");
	$("#" + secondmenu).show();
}

// isRefresh 是否刷新
// baseTag 取得首页隐藏域值
// 客户端管理 WBI
// 基础资料 WBI
// 单据业务 WBILL
function addTabByTitleAndUrl(title, url, tabid, baseTag, isRefresh) {
	// 隐藏二级菜单
	// 隐藏二级菜单
	var executestate = "";
	$.ajax({
		async : false,
		url : 'index/checksession.json',// 跳转到 action
		data : {},
		type : 'post',
		cache : false,
		dataType : 'json',
		success : function(data) {
			if (data.flag == '1') {
				$('.loadding').hide();
				window.parent.showMainPage(
						'../UCenter-webapp/Login/reloginpassword.htm?random'
								+ Math.random(), '录入密码', 200, 400);
				executestate = "timeout-exit";
			} else if(data.flag=='4'){
				window.parent.location.href='../UCenter-webapp/Login/Init.htm?msg=4';
			}  else {
				$(".secondMenu").hide();
				if (baseTag != null && baseTag != "" && baseTag!="WHC") {
					url = $("#BasePath_" + baseTag).val() + url;
				}
				openTab(title, url, tabid, isRefresh);
			}
		}
	});
	return executestate;
}

// isRefresh 是否刷新
// baseTag 取得首页隐藏域值
// 客户端管理 WBI
// 基础资料 WBI
// 单据业务 WBILL
function addTabByTitleAndUrlAndJsonStr(title, url, tabid, baseTag, jsonstr,
		isRefresh) {
	// 隐藏二级菜单
	$.ajax({
		async : false,
		url : 'index/checksession.json',// 跳转到 action
		data : {},
		type : 'post',
		cache : false,
		dataType : 'json',
		success : function(data) {
			if (data.flag == '1') {
				$('.loadding').hide();
				window.parent.showMainPage(
						'../UCenter-webapp/Login/reloginpassword.htm?random'
								+ Math.random(), '录入密码', 200, 400);
			} else if(data.flag=='4'){
				window.parent.location.href='../UCenter-webapp/Login/Init.htm?msg=4';
			}  else {
				$(".secondMenu").hide();
				if (baseTag != null && baseTag != "") {
					url = $("#BasePath_" + baseTag).val() + url;
				}
				openTabForJson(title, url, tabid, jsonstr, isRefresh);
			}
		}
	});
}
// isRefresh 是否刷新
function openTabForJson(title, url, tabid, jsonstr, isRefresh) {
	// 增加随机数解决 firefox 不能刷新问题
	url = url.indexOf("?") > -1 ? (url + "&transNo="+guidGenerator()) : (url
			+ "?transNo="+guidGenerator());
	// 如果点击了已打开的tab
	if ($("#" + tabid).length > 0) {
		$("#firstmenu li").each(function() {
			$(this).removeClass("select");
		});

		var index = -1;
		// 移除tab中样式
		$("#tab li").each(function(i) {
			$(this).attr("class", "normal");
			if (this.id == tabid) {
				index = i;
			}
		});
		$("#" + tabid).attr("class", "select");

		if (index != -1) {
			$(".main").hide();
			$($(".main")[index]).show();
			if (isRefresh) {
				$("#" + tabid).attr("url", url);
				$($(".main")[index]).find("#iframe")[0].contentWindow.location.href = url;
				$("#" + tabid + "_jsonStr").val(jsonstr);
			}
		}

	} else {
		// 获取tab的链接

		var html = "";
		if (url.indexOf("?") > -1) {
			html = url + '&tabid=' + tabid;
		} else {
			html = url + '?tabid=' + tabid;
		}

		// 移除tab中样式
		$("#tab li").each(function() {
			$(this).attr("class", "normal");
		});
		var copyHome = $("#home").clone();
		copyHome.attr("id", tabid);
		copyHome.attr("tabid", tabid);
		copyHome.attr("class", "select");
		copyHome.attr("url", html);
		copyHome
				.html('<input type="hidden" id="'
						+ tabid
						+ "_jsonStr"
						+ '" value="'
						+ jsonstr
						+ '"><span  class="fl" title="'
						+ title
						+ '" url="'
						+ html
						+ '" href="javascript:;" tabid="'
						+ tabid
						+ '" onclick="selectTab(this)">'
						+ title
						+ '</span><a tabid="'
						+ tabid
						+ '" class="tabClose" href="javascript:;" onclick="deleteTab(this)"></a>');
		$("#tab").append(copyHome);

		var copyMainPage = $("#maincontentinit").clone();
		copyMainPage.addClass("page");
		copyMainPage.attr("id", "maincontent");
		copyMainPage.attr("name", "maincontent");
		copyMainPage.css('overflow', 'hidden');
		$("#mainpage").append(copyMainPage);
		$(".main").hide();
		copyMainPage.find("#iframe").attr("src", html);
		copyMainPage.show();

		// 显示tab到
		try {

		} catch (e) {
		}
	}
}

// 通过菜单新增tab
function addTab(obj) {
	// 判断session是否过期，过期提示录入密码
	$.ajax({
		async : false,
		url : 'index/checksession.json',// 跳转到 action
		data : {},
		type : 'post',
		cache : false,
		dataType : 'json',
		success : function(data) {
			if (data.flag == '1') {
				$('.loadding').hide();
				window.parent.showMainPage(
						'../UCenter-webapp/Login/reloginpassword.htm?random'
								+ Math.random(), '录入密码', 200, 400);
			} else if(data.flag == '2'){
				$('.loadding').hide();
				window.parent.showMainPage('../UCenter-webapp/Login/balancerelogin.htm?random'+Math.random(),'系统提醒',200,400);
			}else if(data.flag == '3'){
				$('.loadding').hide();
				window.parent.showMainPage('../UCenter-webapp/Login/balancesuccessrelogin.htm?random'+Math.random(),'系统提醒',200,400);
			} else if(data.flag=='4'){
				window.parent.location.href='../UCenter-webapp/Login/Init.htm?msg=4';
			} else{
				
				//零售收银页面
				if($(obj).attr("url").indexOf("pos/init.htm")>=0){
					if(checkNowSobIsOldSob()){
						return;
					}
					//检测初始化
					var isInit = false;
					var accountid = null;
					var warehouseid = null;
					
					$.ajax({
						url : '/UCenter-webapp/SysConfig/getPosConfig.json',
						data : {},
						type : 'post',
						async : false,
						cache : false,
						dataType : 'json',
						success : function(data) {
							if(null!=data && null!=data.result){
								var noUse = false;
								var permflag = $("#permflag").val();
								var isAdmin = $("#isAdminRole").val();
								if(!checkPerm("100401","PERM_KD",false)){
									noUse = true;
									showErrorMsg("您没有操作权限，请联系管理员");
									return false;
								}
								var allNoSet = false;
								if("1"==data.result.NotInitWarehouse && "1"==data.result.NotInitAccount){
									allNoSet = true;
								}
								if( ("1"==data.result.WarehouseIsDel || "1"==data.result.WarehouseIsStop) && ("1"==data.result.AcountAllDel ||"1"==data.result.AccountAllStop) ){
									allNoSet = true;
								}
								if("1"==data.result.NotInitWarehouse && ("1"==data.result.AcountAllDel ||"1"==data.result.AccountAllStop) ){
									allNoSet = true;
								}
								if( "1"==data.result.NotInitAccount && ("1"==data.result.WarehouseIsDel || "1"==data.result.WarehouseIsStop)){
									allNoSet = true;
								}
								if(allNoSet){
									noUse = true;
									//都不可用时
									var alertText = "当前无可用的结算账户和出库仓库，无法进行零售收银开单，请前往零售收银设置选择结算账户和出库仓库。";
									var btn1 = "去设置";
									var btn1Click = "openCashierSet()";
									var btn2 = "取消";
									var btn2Click = "hidedoCancel()";
									var btn3Click = "hidedoCancel()";
									showMainTip2(alertText,btn1,btn1Click,btn2,btn2Click,btn3Click);
									return false;
								}
								
								if("1"==data.result.NotInitWarehouse || "1"==data.result.WarehouseIsDel || "1"==data.result.WarehouseIsStop){
									noUse = true;
									var alertText = "当前无可用的出库仓库，无法进行零售收银开单，请前往零售收银设置选择发货仓库。";
									var btn1 = "去设置";
									var btn1Click = "openCashierSet()";
									var btn2 = "取消";
									var btn2Click = "hidedoCancel()";
									var btn3Click = "hidedoCancel()";
									showMainTip2(alertText,btn1,btn1Click,btn2,btn2Click,btn3Click);
									return false;
								}
								if("1"==data.result.NotInitAccount || "1"==data.result.AcountAllDel ||"1"==data.result.AccountAllStop){
									noUse = true;
									//结算账户不能用时
									var alertText = "当前无可用的结算账户，无法进行零售收银开单，请前往零售收银设置选择结算账户。";
									var btn1 = "去设置";
									var btn1Click = "openCashierSet()";
									var btn2 = "取消";
									var btn2Click = "hidedoCancel()";
									var btn3Click = "hidedoCancel()";
									showMainTip2(alertText,btn1,btn1Click,btn2,btn2Click,btn3Click);
									return false;
								}
								if("1"==data.result.WarehouseNoPerm){
									noUse = true;
									showErrorMsg("您无零售收银仓库权限，请联系管理员");
									return false;
								}
								//仓库不能用时
								if("1"==data.result.WarehouseBlocked){
									isInit = false;
									showErrorMsg(data.message);
									return;
								}
								
								if(!noUse){
									isInit = true;
									accountid = data.result.AccountIdList;
									warehouseid = data.result.WarehouseId;
								}
							}
						},
						error : function() {
						}
					});
					if(isInit){
						$(obj).attr("href","pos/init.htm");
						$(obj).attr("target","_blank");
						$(obj).removeAttr("onclick");
					}
					setTimeout(function(){
						$("a[url='pos/init.htm']").each(function(){
							$(this).attr("href","javascript:;");
							$(this).removeAttr("target");
							$(this).attr("onclick","checkAndAddTab(this)");
						});
					},1000*5);
					return;
				}
				
				var menuid = $(obj).attr("menuid");
				if (menuid == "recommendmenu" && $("#ispay").val() == "false") {
					$("#recommendtip").show();
					return;
				}
				// tab id 以该页面url定义
				var url = $(obj).attr("basepath") + $(obj).attr("url");

				var tabid = "";
				if ($(obj).attr("url").indexOf("ViewInitData/List") > -1) {
					tabid = "ViewInitData-List";
				} else {
					tabid = $(obj).attr("url").replace(".htm", "").replace("/",
							"-");
				}
				if(tabid.indexOf("?")>0){
					tabid = tabid.substring(0, tabid.indexOf("?"));
				}
				// 获取tab的标题
				var title = "";
				if ($(obj).attr("title") != undefined) {
					title = $(obj).attr("title");
				} else {
					title = $(obj).html();
				}
				if (title.indexOf("<") != -1) {// 特殊处理菜单中添加的new标志span，不能出现在标题中
					title = title.substr(0, title.indexOf("<"));
				}
				if (title.indexOf("新增商品") != -1) {
					var productversion = $("#productversion").val();
					if ('3' == productversion) {
						var invking = $("#invking").val();
						if ('3' == invking) {
							showErrorMsg("盘点中，不允许新增商品。");
							return;
						}
					}
				}
				if (title.indexOf("新增") != -1 
						||title.indexOf("编辑") != -1  
						|| title == '新增盘点'
						|| title == '新增组装拆卸' 
						|| title == '新增调拨') {
					if (!isOverDue()) {
						return;
					}
				}
				// 隐藏二级菜单
				$(".secondMenu").hide();
				openTab(title, url, tabid, true);
			}
		},
		error : function() {
		}
	});

}
// isRefresh 是否刷新
function openTab(title, url, tabid, isRefresh) {
	var random = Math.random();
	// 增加随机数解决 firefox 不能刷新问题
	url = url.indexOf("?") > -1 ? (url + "&random=" + random+"&transNo="+guidGenerator()) : (url
			+ "?random=" + random+"&transNo="+guidGenerator());
	// 如果点击了已打开的tab
	if ($("#" + tabid).length > 0) {
		$("#firstmenu li").each(function() {
			$(this).removeClass("select");
		});

		var index = -1;
		// 移除tab中样式
		$("#tab li").each(function(i) {
			$(this).attr("class", "normal");
			if (this.id == tabid) {
				index = i;
			}
		});
		$("#" + tabid).attr("class", "select");

		if (index != -1) {
			$(".main").hide();
			$($(".main")[index]).show();
			if (isRefresh) {
				$("#" + tabid).attr("url", url);
				$($(".main")[index]).find("#iframe")[0].contentWindow.location.href = url;
				setTimeout("HELPINFO.mainTabChange()",500);
			}
		}
	} else {
		// 获取tab的链接

		var html = "";
		if (url.indexOf("?") > -1) {
			html = url + '&tabid=' + tabid;
		} else {
			html = url + '?tabid=' + tabid;
		}

		// 移除tab中样式
		$("#tab li").each(function() {
			$(this).attr("class", "normal");
		});
		var copyHome = $("#home").clone();
		copyHome.attr("id", tabid);
		copyHome.attr("tabid", tabid);
		copyHome.attr("class", "select");
		copyHome.attr("url", html);
		copyHome
				.html('<span  class="fl" title="'
						+ title
						+ '" url="'
						+ html
						+ '" href="javascript:;" tabid="'
						+ tabid
						+ '" onclick="selectTab(this)">'
						+ title
						+ '</span><a tabid="'
						+ tabid
						+ '" class="tabClose" href="javascript:;" onclick="deleteTab(this)"></a>');
		$("#tab").append(copyHome);

		var copyMainPage = $("#maincontentinit").clone();
		copyMainPage.addClass("page");
		copyMainPage.attr("id", "maincontent");
		copyMainPage.attr("name", "maincontent");
		copyMainPage.css('overflow', 'hidden');
		$("#mainpage").append(copyMainPage);
		$(".main").hide();
		copyMainPage.find("#iframe").attr("src", html);
		copyMainPage.show();
		setTimeout("HELPINFO.mainTabChange()",500);

		// 显示tab到
		try {

		} catch (e) {
		}
	}
}

// 中tab
function selectTab(obj, isrefresh) {
	if (checksession()) {
		return;
	}
	$("#firstmenu li").each(function() {
		$(this).removeClass("select");
	});

	var title = $(obj).attr("title");
	var tabid = $(obj).attr("tabid");
	$("#" + title).addClass("select");

	// 移除tab中样式
	var index = 0;
	$("#tab li").each(function(i) {
		$(this).attr("class", "normal");
		if (this.id == tabid) {
			index = i;
		}
	});
	if (tabid == undefined) {
		$("#home").attr("class", "select");
	} else {
		$("#" + tabid).attr("class", "select");
	}

	$(".main").hide();
	$($(".main")[index]).show();
	if (isrefresh) {
		$($(".main")[index]).find("#iframe")[0].contentWindow.location.reload();
	}
	setTimeout("HELPINFO.mainTabChange()",500);
}

/**
 * 根据tabid判断tab是否存在
 * 
 * @param tabid
 * @returns {Boolean}
 */
function isExistTab(tabid) {
	var flag = false;
	$("#tab li").each(function(i) {
		if (this.id == tabid) {
			flag = true;
		}
	});
	return flag;
}

// 删除tab
function deleteTab(obj) {
	$(".loadding").hide();
	var tabid = $(obj).attr("tabid");
	if(tabid.indexOf("desktop-newstart")>=0 && getCookie("isshow_newstart")=="true"){
		showErrorMsg("请先将新手引导从标签页解锁");
		return;
	}
	if ('InvTak-Add' == tabid && isExistTab('InvTak-ImportInit')) {
		deleteTabByTabId('InvTak-ImportInit');
	}
	deleteTabByTabId(tabid);
}
function getTabObj(tabid) {
	var j = 0;
	$(document).find("#tabDiv li").each(function(i) {
		if ($(this).attr("tabid") == tabid) {
			j = i;
		}
	});
	
	var index = 0;
	$("#tab li").each(function(i) {
		$(this).attr("class", "normal");
		if (this.id == tabid) {
			index = i;
		}
	});
	if (tabid == undefined) {
		$("#home").attr("class", "select");
	} else {
		$("#" + tabid).attr("class", "select");
	}
	$(".main").hide();
	$($(".main")[index]).show();
	
	return $($(document).find(".main")[j]).find("#iframe")[0].contentWindow;
}
function deleteTabByTabName(tabname) {
	var title = null;
	var index = -1;
	$("#tab li").each(function(i) {
		title = $(this).find("span").html();
		if (title == tabname) {
			$(this).remove();
			index = i;
		}
	});
	if (index > -1) {
		$($(".main")[index]).remove();
	}
}
// isSelect 表示是否需要选中最后一个tab
function deleteTabByTabId(tabid, isSelect) {

	if (tabid == "" || tabid == null || tabid == undefined) {
		return;
	}
	if ($("#tab li[id$='" + tabid + "']").attr("locktab")) {
		selectTab($("#tab li[id='businessprocess-stepone']"));
		showErrorMsg("请先解除锁定后关闭");
		return;
	}
	var index = -1;
	$("#tab li").each(
			function(i) {
				if (isSelect == undefined || isSelect == null || isSelect) {
					$(this).attr("class", "normal");
				}
				var id = this.id;
				if (id.indexOf(tabid) > -1
						&& id.substring(id.indexOf(tabid)) == tabid) {
					index = i;
				}
			});
	$("#tab li[id$='" + tabid + "']").remove();
	if (index > -1) {
		$($(".main")[index]).remove();
	}
	if (isSelect == undefined || isSelect == null || isSelect) {
		selectTab($("#tab li:last-child"));
	}

}

// 给定URL并刷新
function refreshTab(url) {
	var curUrl=$("#tab .select").attr("url");
	if(url != undefined && url != null && undefined!=curUrl && curUrl.indexOf("pointExchange/myCoupon.htm")>0){
		$($(".main:visible").find("#iframe")[0]).attr("src", curUrl);//通过src刷新页面
	}else{
		$.ajax({
			async : false,
			url : 'index/checksession.json',// 跳转到 action
			data : {},
			type : 'post',
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (data.flag == '1') {
					$('.loadding').hide();
					window.parent.showMainPage(
							'../UCenter-webapp/Login/reloginpassword.htm?random'
									+ Math.random(), '录入密码', 200, 400);
				} else if(data.flag=='4'){
					window.parent.location.href='../UCenter-webapp/Login/Init.htm?msg=4';
				}
				else {
					if (url != undefined && url != null) {
						$(".main:visible").find("#iframe")[0].contentWindow.location.href = url;
					} else {
						var src = $($(".main:visible").find("#iframe")[0]).attr("src");
						if(undefined!=src && src.indexOf("pointExchange/itemList.htm")>0){
							 $($(".main:visible").find("#iframe")[0]).attr("src", src);//通过src刷新页面
						}else
							$(".main:visible").find("#iframe")[0].contentWindow.location.reload();
					}
				}
			},
			error : function() {
			}
		});
	}
}
// 刷新指定name的tab
function refreshByTabName(tabName, whenShowFresh) {
	var j = "";
	$("#tab li").each(function(i) {
		var title = $(this).find("span").attr("title");
		if ($.trim(title) == tabName) {
			j = i;
		}
	});
	if (j != "") {
		
		var mainObj = $( $(".main").find("#iframe")[j] ).parents(".main:first");
		if(1==whenShowFresh && mainObj.is(":hidden")){
			//标记打开页面时，刷新页面
			mainObj.attr("showNeedReload",1);
		}else{
			$(".main").find("#iframe")[j].contentWindow.location.reload();
		}
	}
}

// 刷新指定tabid的tab
function refreshByTabId(tabid) {
	var j = "";
	$("#tab li").each(function(i) {
		var curtabid = $(this).find("span").attr("tabid");
		if ($.trim(curtabid) == tabid) {
			j = i;
		}
	});
	if (j != "") {
		$(".main").find("#iframe")[j].contentWindow.location.href = $(".main")
				.find("#iframe")[j].contentWindow.location.href;
	}
}
function getTabObjByTabId(tabid) {
	var j = 0;
	$(document).find("#tabDiv li").each(function(i) {
		if ($(this).attr("tabid") == tabid) {
			j = i;
		}
	});
	return $($(document).find(".main")[j]).find("#iframe")[0].contentWindow;
}

function refreshAllTab() {
	$("#tab li").each(function(i) {
		$(".main").find("#iframe")[i].contentWindow.location.reload();
	});
}

// 关闭全部tab
function closeAllTab() {
	$(".loadding").hide();
	var len = $("#mainpage .main").length;
	$("#tab li").each(
			function(i) {
				var id = $(this).attr("id");
				// var isremove = true;
				if (id != "home" && !$(this).attr("locktab")) {
					$(this).remove();
				}
				if (len != 0 && !$($(".main")[len]).attr("locktab")
						&& $($(".main")[len]).attr("id") != "maincontentinit") {
					$($(".main")[len]).remove();
				}
				len = len - 1;
				$(this).attr("class", "normal");
			});

	$("#home").attr("class", "select");
	$($(".main")[0]).show();

	// 恢复tab行到首页，防止值一个菜单是首页被隐藏
	$(".u .scrol").css({
		left : "0px"
	});
}
// 关闭其他
function closeOtherTab() {
	$(".loadding").hide();
	$("#tab li").each(
			function(i) {
				var id = $(this).attr("id");
				if (id != "home" && $(this).attr("class") != "select"
						&& !$(this).attr("locktab")) {
					$(this).remove();
				}
			});
	$(".main").each(
			function(i) {
				if ($(this).hasClass('page')
						&& $(this).css("display") == "none"
						&& !$(this).attr("locktab")) {
					$(this).remove();
				}
			});
	// 恢复tab行到首页，防止值一个菜单是首页被隐藏
	$(".u .scrol").css({
		left : "0px"
	});
}

// 显示错误信息，自动隐藏
function showErrorMsg(msg) {
	try {
		$(".errorInfo").text(msg);
		// 判断成功信息是否显示，如果显示下移30像素
		if ($(".succeedInfo").is(':hidden') == false
				&& $(".succeedInfo").offset().top == 10) {
			$(".errorInfo").css("top", "50px").show().delay(3000).fadeOut(200);
		} else {
			$(".errorInfo").css("top", "10px").show().delay(3000).fadeOut(200);
		}
	} catch (e) {
		alert(e);
	}
}

// 显示操作成功信息，自动隐藏
function showSuccessMsg(msg) {
	try {
		$(".succeedInfo").text(msg);
		if ($(".errorInfo").is(':hidden') == false
				&& $(".errorInfo").offset().top == 10) {
			$(".succeedInfo").css("top", "50px").show().delay(3000)
					.fadeOut(200);
		} else {
			$(".succeedInfo").css("top", "10px").show().delay(3000)
					.fadeOut(200);
		}

	} catch (e) {
		alert(e);
	}
}

// 显示弹出框信息
function showAlertMsg(title, msg) {
	try {
		$(".main_showAlertMsg").find(".alert").find(".title").text(title);
		$(".main_showAlertMsg").find(".alert").find(".content").html(msg);
		$(".main_showAlertMsg").find(".cover").show();
		$(".main_showAlertMsg").find(".alert").show();
	} catch (e) {
		alert(e);
	}
}

// 隐藏消息框
function hideAlertMsg() {
	$(".main_showAlertMsg").find(".cover").fadeOut();
	$(".main_showAlertMsg").find(".alert").fadeOut();
}

function warningInfo() {
	var title = "预警信息";
	var url = "Warning/Init.htm";
	var id = "Warning-Init";
	parent.addTabByTitleAndUrl(title, url, id, "WBILL");
}

// 显示首页
function showIndex() {
	selectTab($("#tab li:first-child"));
}

function buildHtmlPage(obj) {
	$(".main:visible").find("#iframe")[0].contentWindow.buildHtmlPage(obj);
}

// 计算库存

function parentsetInventory(warehouseid, detailjson, type, busiid) {
	var productIdArray = new Array();
	var productid = null;
	var record = null;
	var productids = "";
	if (null == warehouseid) {
		warehouseid = "";
	}
	if (null != detailjson) {
		for ( var i in detailjson) {
			record = detailjson[i];
			productid = record.productid;
			productIdArray.push(productid);
		}
		productids = JSON.stringify(productIdArray);
	}
	if (undefined == type) {
		type = "";
	}
	if (undefined == busiid) {
		busiid = "";
	}
	$.ajax({
		async : true,
		url : '/UCenter-webapp/commondata/GetInventory.json',
		data : {
			warehouseid : warehouseid,
			productids : productids,
			type : type,
			busiid : busiid
		},
		type : 'post',
		cache : false,
		dataType : 'json',
		success : function(data) {
			var serviceResult = data.serviceResult;
			var statu = serviceResult.statu;
			if ('1' == statu) {
			} else {
				showErrorMsg("计算库存相关失败1");
			}
		}
	// ,
	// error : function() {
	// showErrorMsg("计算库存相关失败2");
	// }
	});
}

// 计算库存(多一个busidate，用户处理毛利更新所有成本价导致的错误)

function parentsetNewInventory(busidate, warehouseid, detailjson, type, busiid) {
	var productIdArray = new Array();
	var productid = null;
	var record = null;
	var productids = "";
	if (null == warehouseid) {
		warehouseid = "";
	}
	if (null != detailjson) {
		for ( var i in detailjson) {
			record = detailjson[i];
			productid = record.productid;
			productIdArray.push(productid);
		}
		productids = JSON.stringify(productIdArray);
	}
	if (undefined == type) {
		type = "";
	}
	if (undefined == busiid) {
		busiid = "";
	}
	$.ajax({
		async : true,
		url : '/UCenter-webapp/commondata/GetInventory.json',
		data : {
			warehouseid : warehouseid,
			productids : productids,
			type : type,
			busiid : busiid,
			busidate : busidate
		},
		type : 'post',
		cache : false,
		dataType : 'json',
		success : function(data) {
			var serviceResult = data.serviceResult;
			var statu = serviceResult.statu;
			if ('1' == statu) {
			} else {
				showErrorMsg("计算库存相关失败1");
			}
		}
	});
}

function checksession() {
	var flag = false;
	$.ajax({
		async : false,
		url : 'index/checksession.json',// 跳转到 action
		data : {},
		type : 'post',
		cache : false,
		dataType : 'json',
		success : function(data) {
			if (data.flag == '1') {
				$('.loadding').hide();
				window.parent.showMainPage(
						'../UCenter-webapp/Login/reloginpassword.htm?random'
								+ Math.random(), '录入密码', 200, 400);
				flag = true;
			} else if(data.flag=='4'){
				window.parent.location.href='../UCenter-webapp/Login/Init.htm?msg=4';
			} else {
			}
		},
		error : function() {
		}
	});
	return flag;
}

function openInvTakTab() {
	// 检查按钮权限
	if (!checkPerm("100301", "PERM_VIEW")) {
		return;
	}
	addTabByTitleAndUrl('库存盘点', 'InvTak/List.htm', 'InvTak-List', 'WBILL', true);
}

function getMainPageFuntion() {
	return $(".main:visible").find("#iframe")[0].contentWindow;
}
function firstLoadWarnning() {
	var temp = $("#hidIsLoadWarn").val();
	if (temp == 0) {
		loadWarnningData();
		$("#hidIsLoadWarn").val("1");
	}
}

function loadWarnningData() {
	// 加载预警信息
	initWarning();
}

function initWarning() {
	// 加载预警信息
	initWarningInfo();
	// 加载出入库预警信息
	initWarehouseIOCount();
}
//弹出升级 选择版本界面
function showChooseVersion(){
	layer.open({
		title:false,
	    type: 2,
	    area: ['768px', '500px'],
	    fix: false, //不固定
	    maxmin: false,
	    closeBtn:false,
	    content: '/UCenter-webapp/pay/chooseversion.htm',
	    success:function(layero,index){
 
	     }
	});

}

// add by wangsheng 增加监听，用以实现免费版用户在优惠券页面调用父页面的【弹出升级 选择版本界面】
// 规避跨域问题
window.onmessage = function(e){ 
    if(e.data == "showChooseVersion"){
    	showChooseVersion();
    }
}

/**
 * 保持 && 保持成功  均会触发此方法，去刷新 上级页面的列表刷新按钮
 */
function refreshTabList(tabid){
	var index = 0;
	$("#tab li").each(function(i) {
		$(this).attr("class", "normal");
		if (this.id == tabid) {
			index = i;
		}
	});
	if (tabid == undefined) {
		$("#home").attr("class", "select");
	} else {
		$("#" + tabid).attr("class", "select");
	}
	$(".main").hide();
	$($(".main")[index]).show();
	$($(".main")[index]).find("#iframe")[0].contentWindow.$("#refresh").click();
}

function setActivityImage(){
	if($("#ishaveactivity").val()=="1"){
		var activityId=$("#hidactivityid").val();
		//如果缓存记录为空则显示
		var activityCookies = getCookie("activity-"+activityId);
		if (activityCookies == "" || activityCookies == null || activityCookies == undefined|| activityCookies == "null") {
			$("#activityimg").show();
		}
	}
	
}
//关闭广告时记录缓存，本活动广告在用户下次登录时不显示
function closeActivityImage(){
	$("#activityimg").hide();
    var activityId=$("#hidactivityid").val();
	var activityCookies = getCookie("activity-"+activityId);
	if (activityCookies == "" || activityCookies == null || activityCookies == undefined|| activityCookies == "null") {
		setCookie("activity-"+activityId, "1");
	}
}

//关闭 商家年终总结报告
function closeEndYearReport(){
	$("#endYearReport").hide();
	setCookie("close_end_year_report", "1");
}
/**
 * 控制积分中心签到按钮版本颜色
 */
$(function(){
	var _temp = $("#productversion").val();
	if(_temp == 1){//专业版
	//	$("#qiandao").css("background-color","#5180da");
		$("#buyXuFei").css("background-color","#5180da");
	}
	if(_temp == 2){//连锁版
	//	$("#qiandao").css("background-color","#1a4c6d");
		$("#buyXuFei").css("background-color","#1a4c6d");
	}
	if(_temp == 3){//免费版
	//	$("#qiandao").css("background-color","#269865");
	//	$("#upShengJi").css("background-color","#269865");
	}
});

var pageUrlToModulelist = {
		"SaleOrder/List.htm" : "6BA0F04A-D9AB-44CA-8587-B645B7121FE4",// 慧管货,销售订单,历史
		"SaleOrder/Add.htm" : "CDC5B0A6-94B6-4104-A453-B11B42BFC05A",// 慧管货,销售订单,新增
		"SaleOrder/Detail.htm" : "7DA592E1-4E3F-4B59-A882-C57C4CA5D414",// 慧管货,销售订单,详情
		"SaleOrder/CopyAdd.htm" : "FB65E9DD-4BED-4DE6-9853-F795E0E27527",// 慧管货,销售订单,复制新增
		"SaleOrder/EditInit.htm" : "4CE61046-731C-4D54-9787-3643A8213511",// 慧管货,销售订单,编辑
		"Sale/List.htm" : "1E2ADFD6-0393-4DEA-A99A-D5BC388D3A98",// 慧管货,销售,历史
		"Sale/Add.htm" : "AD7D8AE9-84D1-490E-940A-1BA448E653E4",// 慧管货,销售,新增
		"Sale/Detail.htm" : "E5D1F12E-3823-4B7D-8F7E-EF87691556AF",// 慧管货,销售,详情
		"Sale/CopyAdd.htm" : "5203FC3F-F52C-44AE-89E7-FA3E95BA7242",// 慧管货,销售,复制新增
		"SaleReturn/List.htm" : "8B379E0D-D3E6-4923-AED1-4B134977146C",// 慧管货,销售退货,历史
		"SaleReturn/MidPage.htm" : "812AE2E1-052C-4875-9319-D8274DBFFB27",//慧管货,销售退货,新增-选择退货方式
		"SaleReturn/AddBySale.htm" : "9364A994-27EB-4F18-BDFA-3BEE49FB18A2",// 慧管货,销售退货,新增关联退货
		"SaleReturn/Add.htm" : "A5D00EF8-C53D-4C68-B21D-155568A2A9E3",// 慧管货,销售退货,新增不关联退货
		"SaleReturn/Detail.htm" : "E4005064-4DCC-4CDA-A50F-2BA7026207C5",// 慧管货,销售退货,详情
		"BuyOrder/List.htm" : "620B90F1-69AC-4EB8-8FC8-C8E4DF4018A8",// 慧管货,进货订单,历史
		"BuyOrder/Add.htm" : "F440E42F-73E5-4C18-8410-62DDDC7ECAF1",// 慧管货,进货订单,新增
		"BuyOrder/Detail.htm" : "096F11AC-8B6D-4CF5-8E4B-AD76C94B8677",// 慧管货,进货订单,详情
		"BuyOrder/CopyAdd.htm" : "86861341-7EE9-4BF6-9C65-068181C25A34",// 慧管货,进货订单,复制新增
		"BuyOrder/Edit.htm" : "4EF008E5-A102-4F22-9AE8-810903F877E9",// 慧管货,进货订单,编辑
		"Buy/List.htm" : "5B46E129-96A9-4EE8-B167-A4BC768789F5",// 慧管货,进货单,历史
		"Buy/Add.htm" : "21B6E669-0DF7-4677-9086-B4B9F87A0BD3",// 慧管货,进货单,新增
		"Buy/Detail.htm" : "28A53503-8724-445F-9AB6-2721960C16C3",// 慧管货,进货单,详情
		"Buy/CopyAdd.htm" : "637A835A-E435-4B78-ABF3-D7807206B592",// 慧管货,进货单,复制新增
		"BuyReturn/List.htm" : "3F741E6F-4A6F-40A9-B4A2-5992B195C2D4",// 慧管货,进货退货,历史
		"BuyReturn/MidPage.htm" : "14DC80D3-76D3-4124-B44F-8F0C66240C16",// 慧管货,进货退货,新增-选择退货方式
		"BuyReturn/AddByBuy.htm" : "AB76AE6B-F44A-4440-952B-3F4C299D8B95",// 慧管货,进货退货,新增关联退货
		"BuyReturn/Add.htm" : "6D0B4C39-3E47-4F72-A3DA-F481A64CE052",// 慧管货,进货退货,新增不关联退货
		"BuyReturn/Detail.htm" : "BB34068D-6647-47FE-85AF-C7335B049B0D",// 慧管货,进货退货,详情
		"InvTak/List.htm" : "D5036266-1905-419F-9697-BA0F5ED49BA4",// 慧管货,库存盘点,库存盘点
		"InvTak/Edit.htm" : "F2FDE6B7-B1FC-4E11-922A-6577AEBA4EC2",// 慧管货,库存盘点,编辑盘点
		"InvTak/Add.htm" : "485D495A-DC91-4C2D-8AE3-B9D0907F0C95",// 慧管货,库存盘点,新增
		"InvTak/Detail.htm" : "F63E46E1-E1B0-46F5-830C-018DFBAA49E0",// 慧管货,库存盘点,库存盘点单详情
		"Assembly/List.htm" : "C5DD535F-29F6-4EB4-B62A-FFF44ABB9611",// 慧管货,组装拆卸,历史
		"Assembly/Add.htm" : "99A98A25-A236-4F2F-9350-10008405CF45",// 慧管货,组装拆卸,新增
		"Assembly/detail.htm" : "007AA986-6C4F-40EB-A06E-3A383660D7E7",// 慧管货,组装拆卸,详情
		"Assembly/copyAdd.htm" : "A7FC46B5-6F8A-4DA8-A89B-0B8638500577",// 慧管货,组装拆卸,复制新增
		"Transfer/List.htm" : "BB167833-846A-49D0-8997-07E8AEA9BBB6",// 慧管货,调拨单,历史
		"Transfer/Add.htm" : "67099153-F9EA-439E-82CA-8F010BFE9FBD",// 慧管货,调拨单,新增
		"Transfer/detail.htm" : "7278C980-A2E7-4EB3-8AC1-8320F37517CF",// 慧管货,调拨单,详情
		"Transfer/copyAdd.htm" : "3F85DD10-4F8E-44AD-BC34-52B67DCAB123",// 慧管货,调拨单,复制新增
		"InStorage/List.htm" : "5F07E528-5F89-4C84-93D1-7FD7146E8C6E",// 慧管货,入库历史,入库历史（待入库）
		"InStorage/HasList.htm" : "5F07E528-5F89-4C84-93D1-7FD7146E8C6E",// 慧管货,入库历史,入库历史
		"InStorage/Add.htm" : "E626AEB5-76B5-4221-9000-82086ADF2622",// 慧管货,入库历史,新增入库
		"InStorage/NoDetail.htm" : "D297B1C1-2AAE-4298-AE1F-7267C90D5AD8",// 慧管货,入库历史,待入库详情
		"InStorage/Detail.htm" : "36722218-F30F-4E65-826E-7272FDF45817",// 慧管货,入库历史,入库详情
		"OutStorage/List.htm" : "6A137172-6F41-47E8-B9DB-0336F13A4279",// 慧管货,出库历史,出库历史（待出库）
		"OutStorage/HasList.htm" : "6A137172-6F41-47E8-B9DB-0336F13A4279",// 慧管货,出库历史,出库历史
		"OutStorage/Add.htm" : "B2EE329C-6D99-44C5-94D2-9BDB15469FEA",// 慧管货,出库历史,新增出库
		"OutStorage/NoDetail.htm" : "8D01C4AA-C8E4-44FB-AADF-FABC755A235E",// 慧管货,出库历史,待出库详情
		"OutStorage/Detail.htm" : "4291D01B-950E-463F-93CD-ED92261E0FF7",// 慧管货,出库历史,出库详情
		"Borrow/List.htm" : "45D122E2-DCA0-4D3C-83C2-99744F1CD77A",// 慧管货,借入单,历史
		"Borrow/Add.htm" : "C351754B-C180-417C-86FB-D50B13DD3917",// 慧管货,借入单,新增借入
		"LendReturn/Add.htm" : "A0CACE19-16CA-4A8D-8542-BBBA2474029A",// 慧管货,借入单,新增归还
		"Borrow/TurnBuy.htm" : "F1A85FE5-BD63-49C8-9395-0EE9454D9EB6",// 慧管货,借入单,新增转进货
		"Borrow/Detail.htm" : "98DEE20C-769B-4C23-8185-0AC67C8ADA20",// 慧管货,借入单,详情
		"Lend/List.htm" : "E5B4C68B-5CD9-42E5-B38A-3345B706C6B0",// 慧管货,借出单,历史
		"Lend/Add.htm" : "94AA2913-7EBC-47DF-A20C-AD51CCFF7AD1",// 慧管货,借出单,新增借出
		"LendReturn/Add.htm" : "276B89A5-C63D-42B0-933C-B3C51514C28F",// 慧管货,借出单,新增归还
		"Lend/TurnSale.htm" : "4C7B463A-F288-4254-9FF4-D6AF9CD816D0",// 慧管货,借出单,新增转销售
		"Lend/Detail.htm" : "D72FE9C1-7CE9-4871-891C-E9D803091D8A",// 慧管货,借出单,详情
		"QueryProducts/List.htm" : "AFFF26F0-F473-4926-B95D-FC71392438F4",// 慧管货,库存查询,库存查询
		"QueryProducts/StockDetail.htm" : "BAA9C87D-6A16-40D2-BCFA-2DBCCD2B54A8",// 慧管货,库存查询,库存流水明细
		"QueryProducts/SerialNoDetail.htm" : "63596A43-90CE-4934-8A9C-DA6F2A526A0C",// 慧管货,序列号查询,序列号查询
		"QueryProductSN/DetailList.htm" : "FC7F6200-174F-4371-A2CB-A2D45DBE2B06",// 慧管货,序列号查询,序列号跟踪
		
		"IncomeAndPay/List.htm" : "1C17E5FB-0FC1-4C14-90FA-0C28C48751C1",// 慧管账,日常收支,日常收支
		"IncomeAndPay/detail.htm" : "DEEEBBC2-F81E-44E2-8BED-584CE48D4C2B",// 慧管账,日常收支,日常收支详细
		"IncomeAndPayProject/List.htm" : "4FF91B2B-DAE1-4719-8586-180E393A308A",// 慧管账,收支项目管理,收支项目管理
		"ClientReceive/AmountsDueInit.htm" : "C5DBD7DA-CAD0-4B0C-98C4-6CA49DB484E0",// 慧管账,客户应收欠款,客户应收欠款
		"ClientReceive/RelatedSupplierDetail.htm" : "8FD8B9CB-AD4E-42D7-AFB5-6B7C0B137F3E",// 慧管账,客户应收欠款,客户欠款详细（关联供应商）
		"ClientReceive/ReceivablesDetailInit.htm" : "8FD8B9CB-AD4E-42D7-AFB5-6B7C0B137F3E",// 慧管账,客户应收欠款,客户欠款详细
		"SupplierPay/AmountsDueToInit.htm" : "8132DA64-274B-4EAD-B3D6-2FE4A2D554CA",// 慧管账,供应商应付欠款,供应商应付欠款
		"SupplierPay/RelatedClientDetail.htm" : "30C96DA7-9789-4A41-B0D2-C6A2F8463EDD",// 慧管账,供应商应付欠款,供应商付款详细（关联客户）
		"SupplierPay/PaymentDetailInit.htm" : "30C96DA7-9789-4A41-B0D2-C6A2F8463EDD",// 慧管账,供应商应付欠款,供应商付款详细
		"FundsFlow/Init.htm" : "4AF857C9-D2B5-41CD-A9C4-517D0B2997EF",// 慧管账,资金流水,资金流水
		"AccountTran/List.htm" : "4035BBEE-403D-4689-8E13-F15EE09A8D6D",// 慧管账,账户转账,账户转账
		
		"ClientInfo/List.htm" : "8D4B77BE-DAB2-4BE2-B761-1A01D24E1A2F",// 慧管客,客户管理,客户管理
		"ClientInfo/AddInit.htm" : "B19669C3-36E2-4B6F-B903-2D29981C2B11",// 慧管客,客户管理,新增客户
		"ClientInfo/EditInit.htm" : "8636B68C-B1A1-4984-9F98-3D8A360D2E76",// 慧管客,客户管理,编辑客户
		"SupplierInfo/List.htm" : "22246CC5-763C-4068-B4D3-169736A2FEB1",// 慧管客,供应商管理,供应商管理
		"SupplierInfo/AddInit.htm" : "A4821787-3A1D-4150-8FF7-21ED20E8DB40",// 慧管客,供应商管理,新增供应商
		"SupplierInfo/EditInit.htm" : "0CE82A00-7155-4A6E-BBA1-867274A10027",// 慧管客,供应商管理,编辑供应商
		
		"BuyReport/List.htm" : "6012DCD7-DFF4-4EEE-94F4-04FAD07A5039",// 慧分析,进货报表,进货报表
		"BuyReport/DetailByProduct.htm" : "8D613C4B-94F0-4608-9FA1-A220C78B03EF",// 慧分析,进货报表,进货明细
		"BuyReport/DetailBySupplier.htm" : "8D613C4B-94F0-4608-9FA1-A220C78B03EF",// 慧分析,进货报表,进货明细
		"BuyReport/DetailByBill.htm" : "8D613C4B-94F0-4608-9FA1-A220C78B03EF",// 慧分析,进货报表,进货明细
		"SaleReport/Init.htm" : "C81041D1-EF88-45C8-9672-FDC9D5990AB8",// 慧分析,销售报表,销售报表
		"SaleReport/DetailInit1.htm" : "0063F80B-2214-4C6A-9225-A50D36E8E50C",// 慧分析,销售报表,销售明细（按商品）
		"SaleReport/DetailInit2.htm" : "0063F80B-2214-4C6A-9225-A50D36E8E50C",// 慧分析,销售报表,销售明细（按客户）
		"SaleReport/DetailInit3.htm" : "0063F80B-2214-4C6A-9225-A50D36E8E50C",// 慧分析,销售报表,销售明细（按单据）
		"InventoryReport/List.htm" : "42B2C7A9-68D8-4A2D-AB9B-6C459748895D",// 慧分析,库存状况,库存状况
		"InventoryReport/Detail.htm" : "A2B03CA7-31E6-477D-8018-22C717B5972F",// 慧分析,库存状况,库存流水明细
		"BusinessConditionsReport/List.htm" : "1F1B7227-611C-4B8A-B145-1C6E4E83ACF1",// 慧分析,经营状况报告,经营状况报告
		"ProfitReport/List.htm" : "B231C208-2483-4BBE-8FAA-76D74CB9AA6F",// 慧分析,利润报表,利润报表
		"PerformanceReport/List.htm" : "9D9626C8-F379-4A1D-994F-54355B75FACD",// 慧分析,业绩报表,业绩报表
		"PerformanceReport/detailList.htm" : "159728DB-8B14-49C5-BA24-5BE4EA1B75AE",// 慧分析,业绩报表,员工销售明细
		
		"ProductDT/Init1.htm?tabid=" : "5068A143-290E-4666-ADD3-67C1540BDC21",// 慧营销,商品套餐,历史
		"ProductDT/AddInit1.htm" : "C06D306E-D294-48C8-8377-01E69EE1DAA3",// 慧营销,商品套餐,新增商品套餐
		"ProductDT/Detail1.htm" : "211AE4B7-392A-4D2C-994A-51367661948C",// 慧营销,商品套餐,商品套餐详情
		"ProductDT/Init1.htm?tabid=ProductDT-edit-Init1" : "D1CB5A7E-5369-4595-82D6-AD01EE0B578D",// 慧营销,商品套餐,编辑商品套餐（和套餐历史相似的URl，参数不同）
		"ProductDT/Init1.htm?tabid=ProductDT-sale-Init1" : "6EE441E0-78E1-4AB3-880E-5CEDB86E08BE",// 慧营销,商品套餐,套餐销售明细
		"ProductDT/Init2.htm?tabid=" : "20C2F657-5545-4249-8F17-EF17CC90DABD",// 慧营销,商品模板,历史
		"ProductDT/AddInit2.htm" : "27FF532B-A4AE-4860-A1EF-3F9B1AF6EA6B",// 慧营销,商品模板,新增商品模板
		"ProductDT/Detail2.htm" : "AE7891DA-F7E0-41D5-90C5-48E8442B1A6B",// 慧营销,商品模板,详情
		"ProductDT/Init2.htm?tabid=ProductDT-edit-Init2" : "AFD91338-9679-4120-8D60-F87F01ED0E47",// 慧营销,商品模板,编辑
		"ShowCaseInfo/Init.htm" : "6D4C487F-BA79-41CC-8F10-8F69E7685CB6",// 慧营销,商品展柜,展柜列表
		"ShowCaseInfo/addShowCaseInit.htm" : "A090470B-2341-4B95-A5DB-D9349EC267D6",// 慧营销,商品展柜,新增展柜
		"ShowCaseInfo/editShowCaseInit.htm" : "0E7DA313-79E2-4890-9EAB-022E39925432",// 慧营销,商品展柜,编辑展柜
		"ShowCaseInfo/BusiInfo.htm" : "1F4B85A6-7300-4881-B162-07FF4A29EC12",// 慧营销,商品展柜,商家简介
		
		"ViewInitData/List.htm" : "A6CFE64D-7A3C-4469-9608-C7CB29B14978",// 基础资料,期初查询,期初查询
		//TODO scq 同商品详细页
		//"" : "CE634701-9BA9-4B42-AFA1-04AF45992910",// 基础资料,期初查询,商品详细
		"Product/List.htm" : "9F416C4C-5A62-4FEB-BC3C-3400CF35B642",// 基础资料,商品列表,商品列表
		"Product/AddInit.htm" : "CD81E964-84A8-4830-B37A-3CE7D419EBC1",// 基础资料,商品列表,新增
		"Product/DetailInit.htm" : "CEFE0E27-9491-495D-83B5-350819A486C6",// 基础资料,商品列表,详细
		"Product/CopyAndNewRecordInit.htm" : "BB3EDEBB-28DE-48CD-A23D-45B289E68D5C",// 基础资料,商品列表,复制新增
		"Product/EditInit.htm" : "6777407C-F9AE-4045-A665-24C58AC54520",// 基础资料,商品列表,编辑
		"ProductClass/Init.htm" : "91B49816-453E-4832-A045-F7851FFAE63B",// 基础资料,商品分类,商品分类
		"ProductAttr/List.htm" : "D60CA5F1-0252-4D7B-A896-0517031A0AF0",// 基础资料,属性设置,属性设置
		"UnitSetting/List.htm" : "DEC7F214-BAEB-4188-9922-E6D9DA9E654C",// 基础资料,单位设置,单位设置
		"Account/List.htm" : "DE5F6A5A-7348-4015-A8F0-D6F85C5B193F",// 基础资料,结算账户,结算账户
		"Branch/List.htm" : "F10D8E87-328F-475B-A744-C4D5E9A6A184",// 基础资料,门店管理,门店管理
		"Warehouse/List.htm" : "897ECE6A-F6D9-47DF-A51D-C2519E7681D4",// 基础资料,仓库管理,仓库管理
		
		"SysConfig/List.htm" : "480ECE36-861B-43B1-AFA4-806986203822",// 系统设置,业务设置,业务设置
		"BillnoSetting/List.htm" : "9018FB9C-02F5-412A-A25F-B389082B073B",// 系统设置,单号规则设置,单号规则设置
		"PrintTemplate/List.htm" : "E33B0F11-6BE6-4EA5-95B1-3453F9667369",// 系统设置,打印模板设置,打印模板设置
		"Contact/ContactInfo.htm" : "9C21B58C-DB0C-4BD7-BC9D-FBEE1670569D",// 系统设置,企业资料维护,企业资料维护
		"SysUser/List.htm" : "6C0CB5A2-E8DB-4A9C-B221-9BA110854EE1",// 系统设置,员工管理,员工管理
		"SysUser/goAdd.htm?tabid=addUser" : "B12831E7-5AA2-4A37-94F9-53C79845AE12",// 系统设置,员工管理,新增员工
		"SysUser/goAdd.htm?tabid=editUser" : "7ED815B0-8160-4ABC-BA8F-E5A2374643C1",// 系统设置,员工管理,编辑员工
		"SalesMan/InitList.htm" : "EC81E5B0-E247-4BBF-AC68-FEA67C92A5D4",// 系统设置,导购员管理,导购员管理
		"SysRole/List.htm" : "FBBE3E9A-6615-435C-9C7D-BA066545E7A0",// 系统设置,角色管理,角色管理
		"SysReset/Index.htm" : "942E7B91-DCB2-4EE1-8507-3263956F7F80",//系统设置,系统重置,系统重置
		
		"desktop/admin.htm" : "A4111003-D03D-414B-9A1D-E476D3B13BAC"//首页,首页,首页
	};

/**
 * 帮助中心
 */
var HELPINFO = {
	elementId : "#helpcenterTWo_Div",
	mousex : 0, 
	mousey : 0,
    divLeft : 0, 
    divTop : 0,
    oldTop : 200,//记录上次距离顶部的距离
    
	init : function(){
		$(HELPINFO.elementId).mousedown(function(e) {
			var offset = $(HELPINFO.elementId).offset();
			HELPINFO.divLeft = parseInt(offset.left, 10);
			HELPINFO.divTop = parseInt(offset.top, 10);
			HELPINFO.mousey = e.pageY;
			HELPINFO.mousex = e.pageX;
			$(HELPINFO.elementId).bind('mousemove', HELPINFO.dragElement);
		});
		
		$(document).mouseup(function() {
			$(HELPINFO.elementId).unbind('mousemove');
		});
		
		HELPINFO.onclick();
		
		HELPINFO.tabClick();
	},
	dragElement : function (event) {
//		var left = HELPINFO.divLeft + (event.pageX - HELPINFO.mousex);
		var top = HELPINFO.divTop + (event.pageY - HELPINFO.mousey);
		$(HELPINFO.elementId).css({
			'top' : top + 'px'
//			'left' : left + 'px',
//			'position' : 'absolute'
		});
		return false;
	},
	onclick : function(){
		$(HELPINFO.elementId).click(function(event){
			//显示新回复的new标志
			showNewMark();
			
			var pathname = null;
			if( $(document).find(".main").find("iframe:visible").attr("src").indexOf(location.host)>=0)//解决跨域
				pathname = $(document).find(".main").find("iframe:visible")[0].contentWindow.location.pathname;
			else
				pathname = $(document).find(".main").find("iframe:visible").attr("src");
			var nowTop = $(HELPINFO.elementId).css("top").replace("px","");
			if(HELPINFO.oldTop != nowTop){//通过高度比较是：mouseover事件，还是onclick时间
				HELPINFO.oldTop = nowTop;
				return false;
			}
			HELPINFO.oldTop = nowTop;
			
			if( $(HELPINFO.elementId).is(":visible") ){
				$(HELPINFO.elementId).hide();
				var moduleid = HELPINFO.getModuleid();
				HELPINFO.showMainPage("/UCenter-webapp/help/helplist.htm?moduleid="+moduleid);
			}else
			if( $(HELPINFO.elementId).is(":hidden") ){
				$(HELPINFO.elementId).show();
				$("#help_center_page").hide();
				$("#help_center_page").find("iframe").hide();
			}
		});
	},
	showMainPage : function(url){
		$("#help_center_page").find(".contentTab").find("li").removeClass("normal");
		$("#help_center_page").find(".contentTab").find("li[id='help']").addClass("normal");
		$("#help_center_page").find("iframe").hide();
		$("#help_center_page").find("#iframe_help").show();
		$("#help_center_page").find("#iframe_help").attr("src", url);
		
		HELPINFO.noReadReply();
		
		$(window).resize(function(){
			if($("#help_center_page").is(":visible")){
				var height = $(".main").height();
				$("#help_center_page").show().height(height);
				var iframeHight = height - $("#help_center_page").find(".contentTab").height() - $("#help_center_page").find(".CustomerCare").height();
				$("#help_center_page").find("iframe").height(iframeHight);
			}
		});
		$("#help_center_page").show();
		$(window).resize();
		
	},
	tabClick : function(){
		$("#help_center_page").find(".contentTab").find("li").click(function(event){
			if( $(this).hasClass("normal") ){
//				return false;
			}
			
			$("#help_center_page").find(".contentTab").find("li").removeClass("normal");
			$(this).addClass("normal");
			
			if("help"==$(this).attr("id")){
				var moduleid = HELPINFO.getModuleid();
				var helpSrc = '/UCenter-webapp/help/helplist.htm?moduleid='+moduleid;
				var preHelpSrc = $("#help_center_page").find("#iframe_help").attr("src");
				
				$("#help_center_page").find("#iframe_feedback").hide();
				$("#help_center_page").find("#iframe_help").show();
				
				if(helpSrc != preHelpSrc){
					$("#help_center_page").find("#iframe_help").attr("src", helpSrc).show();
				}
				HELPINFO.noReadReply();
			}else if("feedback"==$(this).attr("id")){

				
				$("#help_center_page").find("#iframe_feedback").show();
				$("#help_center_page").find("#iframe_help").hide();

				$("#help_center_page").find("#noReadReply_count").hide();
				
				var feedSrc = '/UCenter-webapp/help/feedback.htm';
				var preFeddSrc = $("#help_center_page").find("#iframe_feedback").attr("src");
				if(feedSrc != preFeddSrc){
					$("#help_center_page").find("#iframe_feedback").attr("src", feedSrc).show();
				}else{
					$("#help_center_page").find("#iframe_feedback")[0].contentWindow.feedback_init();
				}
			}
		});
	},
	noReadReply : function(){
		var count = 0;
		$.YY_post("/UCenter-webapp/help/noreadreply.json", {}, function(result){
			count = result.count;
			if(0!=count)
				$("#help_center_page").find("#noReadReply_count").text(count).show();
			else
				$("#help_center_page").find("#noReadReply_count").hide();
			if($("#help_center_page").find(".contentTab").find(".normal").attr("id")=="feedback"){
				$("#help_center_page").find("#noReadReply_count").hide();
			}
			return count;
		}, null , null , null , true);
	},
	getModuleid : function(){
		var pathname = null;
		if( $(document).find(".main").find("iframe:visible").attr("src").indexOf("UCenter-webapp")==0
				||$(document).find(".main").find("iframe:visible").attr("src").indexOf("UCenter-webapp")==1
				||$(document).find(".main").find("iframe:visible").attr("src").indexOf(location.host)>=0)//解决跨域
			pathname = $(document).find(".main").find("iframe:visible")[0].contentWindow.location.pathname;
		else
			pathname = $(document).find(".main").find("iframe:visible").attr("src");
		pathname = pathname.replace("/UCenter-webapp/","").replace("/UCenter-webapp/","").replace("/UCenter-webapp/","");
		pathname= pathname.indexOf("/")==0? pathname.substr(1) : pathname;
		if("ProductDT/Init1.htm"==pathname || "ProductDT/Init2.htm"==pathname || "SysUser/goAdd.htm"==pathname){
			var tabid = $(document).find(".main").find("iframe:visible")[0].contentWindow.request("tabid");
			pathname = pathname+"?tabid="+tabid;
		}
		var moduleid = HELPINFO.moduleList(pathname);
		return moduleid;
	},
	moduleList : function(url){
		
		return pageUrlToModulelist[url];
	},
	mainTabChange : function(){//页面的Tab页面，切换，如果新打开一个页面，切换页面，就会触发改变帮助中心的内容
		try{
			var moduleid = HELPINFO.getModuleid();
			$("#help_center_page").find("#iframe_help").attr("redirecturl", '/UCenter-webapp/help/helplist.htm?moduleid='+moduleid);
		}catch(e){
			console.log(e);
		}
	}
	
};

/**
 * 帮助中心显示新回复new标记
 */
function showNewMark(){
	var count = 0;
	$.YY_post("/UCenter-webapp/help/noreadreply.json", {}, function(result){
		count = result.count;
		if(0!=count){
			$("#helpNewMark").show();
		}else
			$("#helpNewMark").hide();
	}, null , null , null , true);
}

/*
 * 加载盘点锁定中的仓库
 * */
function firstLoadLockWarehouse(){
	var param={};
	var userid = $("#userid").val();
	param['userid']=userid;
	param["ivtak"]="1";
	var warehouseArray = new Array(); 
	var lockwarehousehtml="";
	var pv = $('#productversion').val();
	
	$.post("/UCenter-webapp/Warehouse/getuserwarehouseinfo.json",param,function(result, resultState){
		if(resultState == "success"){
			warehouseArray = result.ivtakUserWarehouse;
			if(null!=warehouseArray && undefined!=warehouseArray && ""!=warehouseArray){
				for(var i=0 ; i<warehouseArray.length;i++){
					if(warehouseArray[i].islocked == 1){
						if(pv == 1){
							lockwarehousehtml += "<tr align='center'><td width='70%' align='left' style='padding-left:10px;'><span>"+warehouseArray[i].warehousesimplename+"</span></td><td width='50%'><span style='color:#FD765C;'>盘点中</span></td></tr>";
								
						}else if(pv == 2){
							lockwarehousehtml += "<tr align='center'><td width='70%' align='left' style='padding-left:10px;'><span>"+warehouseArray[i].branchname+" > "+warehouseArray[i].warehousesimplename+"</span></td><td width='50%'><span style='color:#FD765C;'>盘点中</span></td></tr>";
								
						}
					}
				}
				$("#lockwarehouselist").html(lockwarehousehtml);
			}
		}
	});
	
	$("#InvTakState").hover(
			function(){ $("#pandianzhong").css("display","block");},
			function(){ $("#pandianzhong").css("display","none");
			  });
//	 $("#pandianzhong").hover(
//		function(){ $("#pandianzhong").css("display","block");},
//		function(){ $("#pandianzhong").css("display","none");
//		  });
	$("#pandianzhong").show();
}

//免费版
function getwarehouseislocked(type){
	var userid = $("#userid").val();//当前登录的用户
	var islocked = false;
	$.ajax({
        dataType: "json",
        data: {userid:userid,ivtak:"1"},
        cache: false,
        async: false,
        url: "/UCenter-webapp/Warehouse/getuserwarehouseinfo.json?" + Math.random(),
        type: "post",
        success: function(o) {
        		if(o.count > 0){
        			if(type ==1){
	        			if(o.serviceResult[0].islocked == 1){
	        				islocked = true;
	        			}
        			}else if(type ==2){
        				if(o.ivCount2 >0){
        					islocked = true;
        				}
        			}
        			
        		}
        },
        error: function() {
        }
    });
	return islocked;
}
//获取状态结存记录-3
function opensonsatelist(){
	var balanceHTML="";
	var param={};
	
	$.post("/UCenter-webapp/SysReset/queryBalanceInfo.json",param,function(result, resultState){
		if(resultState == "success"){
			if(result.count > 0){
				var SOBId = result.nowSOBId;
				var balance = result.sobbalance;
				if(balance[balance.length-1].balancebranchid != "notshow"){//门店id不等于notshow-则显示该条记录
					if(SOBId == balance[balance.length-1].sobid){
						balanceHTML +="<tr><td align='left'>"+balance[balance.length-1].balname+"</td><td align='right'><a style='background-position: 0 36px; background-repeat: repeat-y;' line='1' class='jiecun-true icon' data-balname='"+balance[balance.length-1].balname +"' data-sobid='"+balance[balance.length-1].sobid+"' data-branchid='"+balance[balance.length-1].balancebranchid+"'></a></td></tr>";
					}else{
						balanceHTML +="<tr><td align='left'>"+balance[balance.length-1].balname+"</td><td align='right'><div style='position: relative; left: -18px;'><a line='1' onclick='changesob(this)' data-balname='"+balance[balance.length-1].balname +"'  data-sobid='"+balance[balance.length-1].sobid+"' data-branchid='"+balance[balance.length-1].balancebranchid+"'>切换</a></div></td></tr>";
						
					}
				}
				
				
				if(null!=balance && undefined!=balance && ""!=balance){
					for(var i=0;i<balance.length;i++){
						if(balance[i].balancebranchid != "notshow"){
							if(balance[i].balstate == 3){
								if(SOBId == balance[i].sobid){
									balanceHTML +="<tr><td align='left'>"+balance[i].balname+"</td><td align='right'><a style='background-position: 0 36px; background-repeat: repeat-y;' line='2' class='jiecun-true icon' data-balname='"+balance[i].balname +"' data-sobid='"+balance[i].sobid+"' data-branchid='"+balance[i].balancebranchid+"'></a></td></tr>";
								}else{
									balanceHTML +="<tr><td align='left'>"+balance[i].balname+"</td><td align='right'><div style='position: relative; left: -18px;'><a line='2' onclick='changesob(this)' data-balname='"+balance[i].balname +"' data-sobid='"+balance[i].sobid+"' data-branchid='"+balance[i].balancebranchid+"'>切换</a></div></td></tr>";
									
								}
							}
						}
					}
				}
				$("#sobstatelist").html(balanceHTML);
			}
		}
	});
	
	$("#SOBState").hover(
			function(){ $("#SOBStateP").css("display","block");},
			function(){ $("#SOBStateP").css("display","none");
			  });
	$("#SOBStateP").show();
}

function changesob(obj){
	var sobid = $(obj).attr("data-sobid");
	var branchid = $(obj).attr("data-branchid");
	var balname=$(obj).attr("data-balname");
	var line = $(obj).attr("line");
	if(line == 1){
		$("#changBlanceText").text("");
	}else{
		$("#changBlanceText").text("切换至已结存帐套时，只可查看数据，不可增改");
	}
	$("#changeSOBId").val(sobid);
	$("#changeBranchid").val(branchid);
	$("#changeBalname").val(balname);
	$("#balname").text(balname);
	$("#main_cover").show();
	$("#balancePOP").show();
}

function balanceSOBstate(){
	$.ajax({
        dataType: "json",
        data: {showall:1},
        cache: false,
        async: false,
        url: "/UCenter-webapp/SysReset/queryBalanceInfo.json?"+Math.random(),
        type: "post",
        success: function(o) {
        	if(jQuery.isEmptyObject(o) == false){
        		var balance = o.serviceResult;
        		
        		if(balance == undefined || balance =="" || balance==null){
        			return;
        		}
            	for(var i=0;i<balance.length;i++){
            		if(balance[i].balstate == 3){
        				$("#SOBState").show();
            		}
            	}
            	//获取最近一次结存的ID
            	$("#balid").val(balance[0].balid);
            	//获取最新一次结存成功结存的的截至时间
            	for(var i=0;i<balance.length;i++){
            		if(balance[i].balstate == 3){
            			var date = new Date(balance[i].enddate).format('yyyy-MM-dd');
                    	$("#lastsuccessbalanceenddate").val(date);
                    	break;
            		}
            	}
            	
            	
        	}
        },
        error: function() {
        }
    });
}
//获取最新一次结存成功/待结存的的截至时间
function getLastBalanceDate(){
	
	var param={};
	$.post("/UCenter-webapp/SysReset/getLastBalanceDate.json",param,function(result, resultState){
		if(resultState == "success"){
			var end = result.enddate;
			$("#lastbalanceenddate").val(end);
		}
	});
}
//获取结存状态
function getBalanceState(){
	var param={};
	$.post("/UCenter-webapp/SysReset/getLastBalanceState.json",param,function(result, resultState){
		if(resultState == "success"){
			if(jQuery.isEmptyObject(result) == false){
        		var balance = result.serviceResult;
        		if(balance[0].isview==1){
            		if(balance[0].balstate == 4 ){//不能和新功能提醒冲突&& $("#newF").val()!=1
                		$("#balname").text(balance[0].balname);
            			$("#main_cover").show();
            			$("#balanceState4").show();
            			updatebalIsView(balance[0].balid);
            			//setCookie("balnamebalstate"+$("#balid").val(), balance[0].balstate);
                	}
                	if(balance[0].balstate == 5 ){
                		$("#balname").text(balance[0].balname);
            			$("#main_cover").show();
            			$("#balanceState5").show();
            			updatebalIsView(balance[0].balid);
                	}
                	if(balance[0].balstate == 6){
            			var paramF={};
            			paramF['balid']=balance[0].balid;
            			$.post("/UCenter-webapp/SysReset/getfailreason.json", paramF, function(result, resultState) {
            				if (resultState == "success") {
            					if(result.tiptype == 0){
            						$("#balname").text(balance[0].balname);
                        			$("#main_cover").show();
                        			$("#balanceState7").show();
                        			updatebalIsView(balance[0].balid);
            					}else if(result.tiptype == 1){
            						var tipmessage = result.failtip;
                					$("#balname").text(balance[0].balname);
                					$("#failtip").text(tipmessage);
                        			$("#main_cover").show();
                        			$("#balanceState6").show();
            					}
                    			updatebalIsView(balance[0].balid);
            				}
            			});
                	}
            	}
			}
		}
	});
}

//切换帐套
function changeSOB(){
	var sobid = $("#changeSOBId").val();
	var branchid = $("#changeBranchid").val();
	$.ajax({
        dataType: "json",
        data: {sobid:sobid,branchid:branchid},
        cache: false,
        async: false,
        url: "/UCenter-webapp/SysReset/changeSOB.json?"+Math.random(),
        type: "post",
        success: function(o) {
        	
        	$("#balancePOP").hide();
        	$(".loadding").show();
        	setTimeout(function(){
        		$("#main_cover").hide();
        		showSuccessMsg("切换结存帐套成功");
        		location.reload(false);
        	},3000);
        	
        	;
        },
        error: function() {
        }
    });
}

/**
 * 打开积分兑换
 */
function pointExchang(){
	var isAdmin = $("#isAdminRole").val();
	if(isAdmin != "true"){
		showErrorMsg("您没有权限");
		return;
	}
	//https://whc.yingyuntech.com:8443/pointExchange/itemList.htm?ProductType=1&ContactId=7075B3B5-7427-4889-8F2D-7D4B9C2BD5F0&UserId=EE1F7AE6-6DE5-4034-B434-8FAA4A4A167C
	var title="积分兑换";
	var url = "pointExchange/itemList.htm?ProductType=1&ContactId=contactid_param&UserId=userid_param";
	url = url.replace("contactid_param", $("#contactid").val()).replace("userid_param", $("#userid").val());
	url = $("#whcRoot").val()+"/"+url;
	var id="pointExchange-itemList";
	addTabByTitleAndUrl(title, url, id, 'WHC', true);
}

/**
 * 验证后新增单据
 */
function checkAndAddTab(obj) {
	if($(obj).hasClass("addIcon")){
		//触发验证账套
		$("#oldfirst").val("1");
		
		var result = checkCurrentSob();
		if (result) {
			return;
		}
	}else if($(obj).attr("url").indexOf("SysReset/Index.htm")>=0){
		var result = checkCurrentSob();
		if (result) {
			return;
		}
		if(checkIsHaveBalance()){//为结存帐套中 检测 该帐号有无结存成功的记录
			window.parent.showMainPage('/UCenter-webapp/SysReset/isSysAlert.htm?', '系统提醒', 200, 400);
			return;
		}
	}
	addTab(obj);
	
}
//检测未结存时间是否超过12个月
function checkIsBalance(){
	var count = 0;
	var startDate = $("#startDate").val();
	$.ajax({
        dataType: "json",
        data: {startDate:startDate},
        cache: false,
        async: false,
        url: "/UCenter-webapp/SysReset/checkIsBalance.json?"+Math.random(),
        type: "post",
        success: function(o) {
        	count = o.monthCha;
        	if(count != undefined && count !=null && count !=""){
        		if(count >= 12){
            		$("#main_cover").show();
            		$("#monthTip").show();
            		 //首先隐藏页面滚动条
            	       document.documentElement.style.overflow='hidden';
            	}
        	}
        },
        error: function() {
        }
    });
	return count;
}

function gotoBalance(){
	$("#main_cover").hide();
	$("#monthTip").hide();
	parent.addTabByTitleAndUrl("结存", "SysReset/Balance.htm", 'SysReset-Balance','WBI', true);
}

/**
 * 检测是否有优惠券
 */
function checkHasCouponGift(){
	$.YY_post('/UCenter-webapp/index/checkHasCouponGift.json', {} , function(result,statu){
		if("1"==result.issuccess){
			var RecordId=result.RecordId;
			//检测是否已提示过
			var history = getCookie("ShowCouponHistory_"+RecordId);
			//var history =null;
			if("1"==result.hasdata && (""==history || undefined==history || null==history)){
				setCookie("ShowCouponHistory_"+RecordId, "1");
				
				if(result.activityPicture){
					var toPayHref = $("#couponGiftTip4ActivityToPay").attr("href");
					if(result.limitPayYear && result.limitPayYear>0){
						toPayHref += "&userNum="+result.limitPayYear;
					}
					
					if(result.limitPayYear && result.limitPayYear>0){
						toPayHref += "&proYears="+result.limitPayYear;
					}
					
					$("#couponGiftTip4ActivityToPay").attr("href",toPayHref);
					$("#couponGiftTip4ActivityPicture").attr("src", result.activityPicture);
					if("demo" != $('#loginType').val()){
						$("#couponGiftTip4Activity").show();
						$("#warnningcover").show();
					}
				}else{
					var recordTypeStr="现金券";
					var recordUnit="元";
					if(result.ItemSecondType=="1"){
						recordTypeStr = "现金券";
					}else if(result.ItemSecondType=="2"){
						recordTypeStr = "折扣券";
						recordUnit="折";
					}else if(result.ItemSecondType=="3"){
						recordTypeStr = "满减券";
					}else if(result.ItemSecondType=="4"){
						recordTypeStr = "特价券";
					}
					var recordDesc=replaceUseDesc(result);
					
					$(".couponTypeName").html( recordTypeStr );
					$("span[name='couponUnit']").html( recordUnit );
					$("div[name='couponDesc']").html(recordDesc);
					$("span[name='couponValue']").html(parseFloat(result.DiscountValue));
					$("#couponGiftTermsday").html(replaceCouponDays(result));
					if("demo" != $('#loginType').val()){
						$("#couponGiftTip").show();
						$("#warnningcover").show();
					}
				}
			}else{
				
			}
		}else{
			showErrorMsg("获取是否有优惠券失败");
		}
	}, null , null , null , true);
}
function replaceCouponDays(record){
	var TermDaysDesc="";
	if(record.termdays > 0){
		var availableDays = record.AvailableDays;
		if(availableDays>0){
			TermDaysDesc = (Number(availableDays)+1)+'天后到期';
		}else{
			TermDaysDesc = '今日'+record.TermEndDate.substr(11,5)+'到期';
		}
		
	}else{
		TermDaysDesc = '永久有效';
		TermEndDate = '永久有效';
	}
	return TermDaysDesc;
}
function replaceUseDesc(row){
	var desc = "";
	if(row.LimitAmt>0){
		desc = '满'+row.LimitAmt+'元可用 ';
	}
	
	if(row.LimitVersion>0||row.limitUserCount>0||row.limitPayYear>0){
		desc += '限购';
		if(row.LimitVersion==1){
			desc += '专业版';
		}else if(row.LimitVersion==2){
			desc += '连锁版';
		}else if(row.LimitVersion==3){
			desc += '免费版';
		}
		if(row.limitUserCount>0){
			desc += row.limitUserCount+'用户';
		}
		if(row.limitPayYear>0){
			desc += row.limitPayYear+'年';
		}
	}
	if(desc.length==0){
		desc = "无使用门槛";
	}
	return desc;
}

/**
 * 检测是否有优惠券
 */
function queryCouponGiftCount(){
	$.YY_post('/UCenter-webapp/index/queryCouponGiftCount.json', {} , function(result,statu){
		if("1"==result.issuccess){
			$("#couponCount").html(result.hascount+"张可用");
		}else{
			showErrorMsg("获取是否有优惠券失败");
		}
	}, null , null , null , true);
}
function setViewCountTime(){
	var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + "-" + month + "-" + strDate
            + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    
    setCookie("LastClickViewCoupon_"+$("#contactid").val(), currentDate);
    $("#couponRedPoint").hide();
    if($("#hidissigned").val()=="1"){
    		$("#isSignFlag").hide();
    }
}
/**
 * 检测最近3天有优惠券，标记小红点
 */
function queryNearCouponGiftCount(){
	var startDate=getCookie("LastClickViewCoupon_"+$("#contactid").val());
	$.YY_post('/UCenter-webapp/index/queryNearCouponGiftCount.json', 
			{"startDate":startDate} , 
			function(result,statu){
		if("1"==result.issuccess){
			if(parseFloat(result.hascount)>0){
				$("#isHaveNoViewCoupon").val("1");
				$("#couponRedPoint").css("display","inline-block");
				$("#isSignFlag").css("display","inline-block");
			}
		}else{
			showErrorMsg("获取是否有优惠券失败");
		}
	}, null , null , null , true);
}
//切换帐套后，获取所切换帐套的起止时间
function getNowSOBSEDate(){
	var param={};
	$.post("/UCenter-webapp/SysReset/getnowSOBseDate.json",param,function(result, resultState){
		if(resultState == "success"){
			$("#nowbalancesobstartdate").val(result.startdate);
			$("#nowbalancesobenddate").val(result.enddate);
		}
	});
}
//登陆后检测帐号 有无成功的结存记录
function checkIsHaveBalance(){
	var tip = false;
	$.ajax({
        dataType: "json",
        data: {},
        cache: false,
        async: false,
        url: "/UCenter-webapp/SysReset/checkIsHaveBalance.json?"+Math.random(),
        type: "post",
        success: function(o) {
        	if(o.count != undefined && o.count !=null && o.count !=""){
        		if(o.count >0){
	        		tip = true;
        		}
        	}
        },
        error: function() {
        }
    });
	return tip;
}

/**
 * 关闭某个弹窗遮罩时，
 * 检测是否有其他弹窗，
 * 如果有，不能关闭遮罩
 */
function coverHide(){
	if($(".popArea:visible").length>0)
		$('#warnningcover').show();
	else
		$('#warnningcover').hide();
}
//封装弹窗

function showMainAlert(text){
	$("#main_cover").show();
	$("#showmainalert").show();
	$("#alerttext").html(text);
}

function getTabObjInfo(tabid) {
	var j = 0;
	$(document).find("#tabDiv li").each(function(i) {
		if ($(this).attr("tabid") == tabid) {
			j = i;
		}
	});
	
	return $($(document).find(".main")[j]).find("#iframe")[0].contentWindow;
}
//显示角色列表
function roleShow(){
	var nowrole = $("#demorole").val();//角色（当前的角色）
	if(nowrole == "1"){//老板
		$("#lb").show();
	}
	if(nowrole == "2"){//财务
		$("#cw").show();
	}
	if(nowrole == "3"){//仓管采购
		$("#cg").show();
	}
	if(nowrole == "4"){//销售
		$("#xs").show();
	}
	
	$("#main_cover").show();
	$("#rolelist").show();
}
//隐藏角色列表
function doCancelRole(){
	$("#main_cover").hide();
	$("#rolelist").hide();
	$("#lb").hide();
	$("#cw").hide();
	$("#cg").hide();
	$("#xs").hide();
}
//选择角色
function chooseRole(obj){
	clearInterval(ref); //切换角色时，先停止定时器
	
	var nowrole = $("#demorole").val();//角色（当前的角色）
	var chooserole = $(obj).attr("rolevalue");//选择的角色
	if(String(nowrole) == String(chooserole)){//角色相同直接隐藏
		$("#main_cover").hide();
		$("#rolelist").hide();
		return;
	}
	var parentObj = $(obj).parent().parent().parent();
	$(parentObj).find("#nowrole").removeAttr("nowrolename");
	$(parentObj).find("#nowrole").removeAttr("nowrolevalue");
	$(parentObj).find("#nowrole").attr("nowrolename",$(obj).attr("data-role-name"));
	$(parentObj).find("#nowrole").attr("nowrolevalue",$(obj).attr("value"));
	var industry = $("#industry").val();
	var pversion = $("#productversion").val();
	$("#rolelist").hide();//隐藏角色列表
//	$(".loadding").show();
//	setTimeout(function(){
		$("#main_cover").hide();
//	},1000);
	$.ajax({
        dataType: "json",
        data: {role:chooserole,industry:industry,pversion:pversion},
        cache: false,
        async: true,
        url: "/UCenter-webapp/index/changeRole.json?"+Math.random(),
        type: "post",
        success: function(o) {
        	showSuccessMsg("切换角色成功");
    		location.reload(false);
        },
        error: function() {
        }
    });
}

//切换成功订货佳的演示账号
function goOrderPlusDemo(){
	var basepath = $("#basepath").val();
	window.location.href = basepath + "/UCenter-webapp/orderPlusLogin/DemoLogin.htm?type=51";
}

/**
* layer图片预览
* @param imgStr 图片地址，以逗号分隔
* @param imgIndex 初始显示的图片序号
* @param imgList 图片地址，和imgstr功能一样
*/
function previewImageList(imgStr, imgIndex, imgList) {

	var imgdata = new Array();

	if (null != imgStr || null!=imgList) {
		var imgStrArr = null;
		if(null!=imgStr)
			imgStrArr = imgStr.split(",");
		else if(null!=imgList)
			imgStrArr = imgList;
		for ( var i in imgStrArr) {
			imgdata.push({
				"alt" : "",
				"pid" : 666, // 图片id
				"src" : imgStrArr[i], // 原图地址
				"thumb" : "" // 缩略图地址
			});
		}
	}
	
	var json = {
		"title" : "", // 相册标题
		"id" : 123, // 相册id
		"start" : imgIndex, // 初始显示的图片序号，默认0
		"data" : imgdata
	}
	layer.photos({
		photos : json,
		shade : [ 0.3, '#000' ]
	});
}


function previewImageListNew(imgStr, imgIndex, imgList) {

	var imgdata = new Array();

	if (null != imgStr || null!=imgList) {
		var imgStrArr = null;
		if(null!=imgStr)
			imgStrArr = imgStr.split(",");
		else if(null!=imgList)
			imgStrArr = imgList;
		for ( var i in imgStrArr) {
			imgdata.push({
				"alt" : "",
				"pid" : 666, // 图片id
				"src" : imgStrArr[i], // 原图地址
				"thumb" : "", // 缩略图地址
				"errorRemarkTip" : "1"
			});
		}
	}
	
	var json = {
		"title" : "", // 相册标题
		"id" : 123, // 相册id
		"start" : imgIndex, // 初始显示的图片序号，默认0
		"data" : imgdata
	}
	layer.photos({
		photos : json,
		shade : [ 0.3, '#000' ],
		closeBtn:1,
		resize  : true,
		shadeClose:false
		//,btn: ['按钮一']
	});
}
//判断当前是否为 老帐套
function checkNowSobIsOldSob(){
	var isold = false;
	var oldSob = $("#sobid").val();
	var newSob = $("#newSobid").val();
	if(oldSob!= undefined && oldSob != "" && newSob != undefined && newSob != ""){
		if(oldSob != newSob){
			isold = true;
			showErrorMsg("当前为已结存账套，不可做任何改动");
		}
	}
	return isold;
}
/**
 * 首页广告-方法</br>
 * 活动到期日 DueDate (YYY-MM-DD)</br>
 * 显示频率（天）frequency</br>
 * 帐号到期日 endTime (YYY-MM-DD)
 */
function Advertisement(DueDate,frequency,endTime){
	if("demo" != $('#loginType').val()){
		var productversion = $("#productversion").val();//版本号
		var isPay = $("#ispay").val();//是否付费
		var userid = $("#userid").val();//用户id
		var usercount = $("#allowempcount").val();//用户数
		var enddate = $("#endDate").val();//帐号到期时间
		var now = moment();//当前时间
		var start = now.format('YYYY-MM-DD HH:mm:ss');//格式化当前时间
		var s = "";//活动开始时间
		var e = "";//活动结束时间
		var staticUrl = $("#static-webapp-path").val();
		var isExpire = moment(enddate).isAfter(start);//到期时间 是否 小于 当前时间 
		if(isPay == "true" && usercount >= 3 && isExpire){
			s = "2018-05-23 00:00:00";//活动开始时间
			e = "2018-06-04 23:59:59";//活动结束时间
			staticUrl = staticUrl+"/images/20180523.png?0001";
		}else{
			return;
		}
		//判断当前时间 是否 大于等于 活动开始时间
		var a1 = moment(start).isAfter(s);
		//判断当前时间 是否小于等于活动结束时间
		var a2 = moment(start).isBefore(e);
		if( productversion == "1" ){
			if(a1 && a2 ){//是否在 活动期间内
				var isShowAdver = getCookieAdvertisement("Advertisement_OldTime_"+userid);//获取时间缓存
				if(isShowAdver != 1){
					var isShowCount = getCookieAdvertisement("Advertisement_ActCount_"+userid);//获取次数缓存
					var isShowAdvertisement = false;
					if(isShowCount == undefined || isShowCount == "" || isShowCount == null){//第一次进来
						setCookieAdvertisement("Advertisement_ActCount_"+userid, 1);
						isShowAdvertisement = true;
					}else{
						//非第一次,且次数小于等于3次
						if(isShowCount <= 2){
							isShowAdvertisement = true;
							isShowCount = Number(isShowCount)+1
							setCookieAdvertisement("Advertisement_ActCount_"+userid, isShowCount);
						}
					}
					if(isShowAdvertisement){
						setCookieExpDaysAdvertisement("Advertisement_OldTime_"+userid,"1",2);//设定有效期2天的cookie
//						$("#Advertisement_Alert").css("height","450px");
						$("#Advertisement_Alert").css("z-index","100000000");
						$("#Advertisement_Alert").css("background","url("+staticUrl+") no-repeat center");
						$("#Advertisement_cover").show();
						$("#Advertisement_Alert").show();
					}
				}
			}
		}
	}
}
/**
 * 首页广告-公共方法
 * 跳转
 */
function goAdvertisement(){
	var productversion = $("#productversion").val();//版本号
	var isPay = $("#ispay").val();//是否付费
	if(isPay == "true"){
		if(productversion == 1){
			window.open("https://zhsmjxc.com/zt/20180521.html");
		}
	}
}
function setCookieAdvertisement(name,value){
	setCookieExpDaysAdvertisement(name,value,30);
}
function setCookieExpDaysAdvertisement(name,value,expDays){
    //此 cookie 将被保存 expDays 天
    var exp = new Date();
    exp.setTime(exp.getTime() + expDays*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+"; path=/";
}
function getCookieAdvertisement(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}
/**
 * 首页广告-公共方法
 * 关闭
 */
function closeAdvertisement(){
	$("#Advertisement_cover").hide();
	$("#Advertisement_Alert").hide();
	event.stopPropagation();
}
//打开全部介绍页
function allIntroducePage(){
	var title = "更多功能";
	var url="FunctionalIntroduce/AllIntroducePage.htm";
	var tabid ="FunctionalIntroduce-AllIntroducePage";
	parent.addTabByTitleAndUrl(title, url, tabid);
}

//初始化最近进货价格权限
function initNearBuyPricePermFlag(){
	//初始化 进货单查询的权限
	var isAdmin = $("#isAdminRole").val();
	if( isAdmin != "true" && !checkPerm("100201", "PERM_VIEW",false)){
		$("#nearbuypricepermflag").val(0);
	}
}