(function($) {
	$.fn.tipTip = function(tiptype) {
		var defaults = {
			activation: "hover",
			keepAlive: false,
			maxWidth: "300px",
			edgeOffset: 3,
			defaultPosition: "bottom",
			delay: 400,
			fadeIn: 200,
			fadeOut: 200,
			attribute: "title",
			content: false,
			enter: function() {},
			exit: function() {}
		},
			t1 = {
				activation: "hover",
				keepAlive: false
			},
			t2 = {
				maxWidth: "300px",
				keepAlive: true
			},
			options = {};
		if (tiptype == "t1") {
			options = t1
		} else if (tiptype == "t2") {
			options = t2
		}
		var opts = $.extend(defaults, options);
		if ($("#tip_holder").length <= 0) {
			var tip_holder = $('<div id="tip_holder" style="max-width:' + opts.maxWidth + ';"></div>');
			var tip_content = $('<div id="tip_content"></div>');
			var tip_arrow = $('<div id="tip_arrow"></div>');
			$("body").append(tip_holder.html(tip_content).prepend(tip_arrow.html('<div id="tip_arrow_inner"></div>')))
		} else {
			var tip_holder = $("#tip_holder");
			var tip_content = $("#tip_content");
			var tip_arrow = $("#tip_arrow")
		}
		return this.each(function() {
			var org_elem = $(this);
			if (opts.content) {
				var org_title = opts.content
			} else {
				var org_title = org_elem.attr(opts.attribute)
			}
			if (org_title != "") {
				if (!opts.content) {
					org_elem.removeAttr(opts.attribute)
				}
				var timeout = false;
				if (opts.activation == "hover") {
					org_elem.hover(function() {
						active_tip()
					}, function() {
						if (!opts.keepAlive) {
							deactive_tip()
						}
					});
					if (opts.keepAlive) {
						tip_holder.hover(function() {}, function() {
							deactive_tip()
						})
					}
				} else if (opts.activation == "focus") {
					org_elem.focus(function() {
						active_tip()
					}).blur(function() {
						deactive_tip()
					})
				} else if (opts.activation == "click") {
					org_elem.click(function() {
						active_tip();
						return false
					}).hover(function() {}, function() {
						if (!opts.keepAlive) {
							deactive_tip()
						}
					});
					if (opts.keepAlive) {
						tip_holder.hover(function() {}, function() {
							deactive_tip()
						})
					}
				}
				function active_tip() {
					opts.enter.call(this);
					tip_content.html(org_title);
					tip_holder.hide().removeAttr("class").css("margin", "0");
					tip_arrow.removeAttr("style");
					var top = parseInt(org_elem.offset()['top']);
					var left = parseInt(org_elem.offset()['left']);
					var org_width = parseInt(org_elem.outerWidth());
					var org_height = parseInt(org_elem.outerHeight());
					var tip_w = tip_holder.outerWidth();
					var tip_h = tip_holder.outerHeight();
					var w_compare = Math.round((org_width - tip_w) / 2);
					var h_compare = Math.round((org_height - tip_h) / 2);
					var marg_left = Math.round(left + w_compare);
					var marg_top = Math.round(top + org_height + opts.edgeOffset);
					var t_class = "";
					var arrow_top = "";
					var arrow_left = Math.round(tip_w - 12) / 2;
					if (opts.defaultPosition == "bottom") {
						t_class = "_bottom"
					} else if (opts.defaultPosition == "top") {
						t_class = "_top"
					} else if (opts.defaultPosition == "left") {
						t_class = "_left"
					} else if (opts.defaultPosition == "right") {
						t_class = "_right"
					}
					var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
					var left_compare = (tip_w + left) > parseInt($(window).width());
					if ((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + opts.edgeOffset + 5))) {
						t_class = "_right";
						arrow_top = Math.round(tip_h - 13) / 2;
						arrow_left = -12;
						marg_left = Math.round(left + org_width + opts.edgeOffset);
						marg_top = Math.round(top + h_compare)
					} else if ((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)) {
						t_class = "_left";
						arrow_top = Math.round(tip_h - 13) / 2;
						arrow_left = Math.round(tip_w);
						marg_left = Math.round(left - (tip_w + opts.edgeOffset + 5));
						marg_top = Math.round(top + h_compare)
					}
					var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
					var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0;
					if (top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)) {
						if (t_class == "_top" || t_class == "_bottom") {
							t_class = "_top"
						} else {
							t_class = t_class + "_top"
						}
						arrow_top = tip_h;
						marg_top = Math.round(top - (tip_h + 5 + opts.edgeOffset))
					} else if (bottom_compare | (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)) {
						if (t_class == "_top" || t_class == "_bottom") {
							t_class = "_bottom"
						} else {
							t_class = t_class + "_bottom"
						}
						arrow_top = -12;
						marg_top = Math.round(top + org_height + opts.edgeOffset)
					}
					if (t_class == "_right_top" || t_class == "_left_top") {
						marg_top = marg_top + 5
					} else if (t_class == "_right_bottom" || t_class == "_left_bottom") {
						marg_top = marg_top - 5
					}
					if (t_class == "_left_top" || t_class == "_left_bottom") {
						marg_left = marg_left + 5
					}
					tip_arrow.css({
						"margin-left": arrow_left + "px",
						"margin-top": arrow_top + "px"
					});
					tip_holder.css({
						"margin-left": marg_left + "px",
						"margin-top": marg_top + "px"
					}).attr("class", "tip" + t_class);
					if (timeout) {
						clearTimeout(timeout)
					}
					timeout = setTimeout(function() {
						tip_holder.stop(true, true).fadeIn(opts.fadeIn)
					}, opts.delay)
				}
				function deactive_tip() {
					opts.exit.call(this);
					if (timeout) {
						clearTimeout(timeout)
					}
					tip_holder.fadeOut(opts.fadeOut)
				}
			}
		})
	}
})(jQuery);
var a = function(id) {
		return "string" == typeof id ? document.getElementById(id) : id
	};
var Class = {
	create: function() {
		return function() {
			this.initialize.apply(this, arguments)
		}
	}
}
var Extend = function(destination, source) {
		for (var property in source) {
			destination[property] = source[property]
		}
		return destination
	}
var Calendar = Class.create();
Calendar.prototype = {
	initialize: function(container, options) {
		this.Container = a(container);
		this.Days = [];
		this.SetOptions(options);
		this.Year = this.options.Year || new Date().getFullYear();
		this.Month = this.options.Month || new Date().getMonth() + 1;
		this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
		this.onSelectDay = this.options.onSelectDay;
		this.onToday = this.options.onToday;
		this.onFinish = this.options.onFinish;
		_this = this;
		this.Draw()
	},
	SetOptions: function(options) {
		this.options = {
			Year: 0,
			Month: 0,
			SelectDay: null,
			onSelectDay: function() {},
			onToday: function() {},
			onFinish: function() {}
		};
		Extend(this.options, options || {})
	},
	NowMonth: function() {
		this.PreDraw(new Date())
	},
	PreMonth: function(mydata) {
		this.PreDraw(new Date(this.Year, this.Month - 2, 1), mydata)
	},
	NextMonth: function(mydata) {
		this.PreDraw(new Date(this.Year, this.Month, 1), mydata)
	},
	PreYear: function(mydata) {
		this.PreDraw(new Date(this.Year - 1, this.Month - 1, 1), mydata)
	},
	NextYear: function(mydata) {
		this.PreDraw(new Date(this.Year + 1, this.Month - 1, 1), mydata)
	},
	NextCity: function(mydata) {
		this.Draw(mydata)
	},
	PreDraw: function(date, mydata) {
		this.Year = date.getFullYear();
		this.Month = date.getMonth() + 1;
		this.Draw(mydata)
	},
	Draw: function(mydata) {
		$(".sho").html("").hide();
		var arrstyle;
		if (mydata != undefined) {
			var tempmethod = parseInt(mydata);
			var tempmonth = parseInt($("#idCalendarMonth").html());
			var tempyear = parseInt($("#idCalendarYear").html());
			if (mydata == 1) {
				tempmonth = parseInt($("#idCalendarMonth").html()) + 1;
				if (tempmonth > 12) {
					tempmonth = 1;
					tempyear += 1
				}
			} else if (mydata == -1) {
				tempmonth = tempmonth - 1;
				if (tempmonth < 1) {
					tempmonth = 12;
					tempyear = tempyear - 1
				}
			} else if (mydata == 2) {
				var dater = tempyear + "-" + (tempmonth > 9 ? tempmonth : "0" + tempmonth) + "-01"
			}
			var dater = tempyear + "-" + (tempmonth > 9 ? tempmonth : "0" + tempmonth) + "-01"
		}
		$.ajax({
			type: "post",
			url: "/cjobs/jobfairinfo/indexcb33calendar?aae030_=" + this.Year + "-" + (this.Month > 9 ? this.Month : "0" + this.Month) + "-01",
			data: {},
			async: false,
			dataType: "json",
			success: function(data) {
				arrstyle = eval(data)
			}
		});
		var arr = [];
		for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
			arr.push(0)
		}
		for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
			arr.push(i)
		}
		if (arr.length != 42) {
			for (var i = arr.length; i < 42; i++) {
				arr.push(0)
			}
		}
		this.Days = [];
		var frag = document.createDocumentFragment();
		while (arr.length) {
			var row = document.createElement("ul");
			for (var i = 1; i <= 7; i++) {
				var cell = document.createElement("li");
				cell.innerHTML = "";
				if (i == 7) {
					cell.style.width = "33px"
				}
				if (arr.length) {
					var d = arr.shift();
					if (d) {
						var selectdate = new Date(this.Year, this.Month - 1, d);
						var nowdate = new Date();
						for (var i = 0; i < arrstyle.length; i++) {
							if (arrstyle[i].timeId == d) {
								cell.className = arrstyle[i].colourId
							}
						}
						cell.style.cursor = "pointer";
						cell.onclick = function(e) {
							//alert(new Date().toLocaleString());
							if (this.innerHTML == "") {
								return false
							} else {
								var dater = _this.Year + "-" + _this.Month + "-" + this.innerHTML;
								var _cell = $(this);
								$(".showbox").remove();
								var sho = $(".sho");
								sho.html("");
								sho.hide();
								$.post("/cjobs/jobfairinfo/indexcb33ajax?currenttime=" + new Date().toLocaleString() + "&aae030_=" + dater + "&aab301=" + $("#aab301forcb33").val(), function(data) {
									var jsondata = eval(data);
									var showcontent = "";
									var showbox = "";
									var stylepre = "<li class='overflowspan' style='background-color: rgb(238, 247, 252);'>";
									if (jsondata == "") {
										showbox = $("<div class='showbox_con'><li style='height:15px;padding-bottom:2px'><a style='padding-left:160px;' class='blu' target='_blank' href='/cjobs/jobfairinfo/listJobfairinfo?aae030_=" + dater + "&AREA=" + $("#aab301forcb33").val() + "' >更多</a></li><div class=''></div><div style='margin-left:50px;margin-top:70px;'>当天没有招聘会...</div><div id='nodatacb33' name='nodatacb33' class='closecb33'></div></div>")
									} else {
										for (var i in jsondata) {
											if (i % 2 == 0) {
												showcontent += stylepre + "<p><span title='" + jsondata[i].aab302 + "' class='overflowspanarea area'>" + jsondata[i].aab302 + "</span><span  style='color:#0670C0'><a class='overflowspan blu' href='/cjobs/jobfairinfo/show/" + jsondata[i].acb330 + "/1' title='" + jsondata[i].acb331 + "' alt='" + jsondata[i].acb331 + "' target='_blank'>" + jsondata[i].acb331 + "</a></span></p><p class='c999'>招聘日期:" + jsondata[i].aae030s.replace(/-/g, "/") + "-" + jsondata[i].aae031s.replace(/-/g, "/") + "</p></li>"
											} else {
												showcontent += "<li class='overflowspan'><p><span title='" + jsondata[i].aab302 + "' class='overflowspanarea area'>" + jsondata[i].aab302 + "</span><span  style='color:#0670C0'><a class='overflowspan blu' href='/cjobs/jobfairinfo/show/" + jsondata[i].acb330 + "/1' title='" + jsondata[i].acb331 + "' alt='" + jsondata[i].acb331 + "' target='_blank'>" + jsondata[i].acb331 + "</a></span></p><p class='c999'>招聘日期:" + jsondata[i].aae030s.replace(/-/g, "/") + "-" + jsondata[i].aae031s.replace(/-/g, "/") + "</p></li>"
											}
										}
										showbox = $("<div class='showbox_con'><ul><li style='height:15px;padding-bottom:2px'><a style='padding-left:160px;' class='blu' target='_blank' href='/cjobs/jobfairinfo/listJobfairinfo?aae030_=" + dater + "&AREA=" + $("#aab301forcb33").val() + "' >更多</a></li>" + showcontent + "</ul><div id='mycb33close' name='mycb33close' class='closecb33' style='top: 0px;'><img src='/r/cms/www/default/gaiban/guanbi.jpg'></div></div>")
									}
									sho.html(showbox);
									$("#mycb33close").click(function() {
										sho.html("");
										sho.hide()
									});
									$("#nodatacb33").click(function() {
										sho.html("");
										sho.hide()
									})
								});

								function autoclosewindow() {
									sho.html("");
									sho.hide()
								}
								var showbox = $("<div class='showbox_con'><div class='loadingnow'></div><div style='margin-left:50px;'>正在为您准备数据...</div><div id='loadcb33close' name='loadcb33close' class='closecb33'></div></div>");
								var myEvent = e || window.event;
								if (null == e) {
									var x = _cell.offset().left + _cell.width() / 2;
									var y = _cell.offset().top - _cell.height() / 2
								} else {
									var x = _cell.offset().left + _cell.width() / 2;
									var y = _cell.offset().top - (_cell.height()) * 1.5
								}
								sho.append(showbox).css({
									"left": x,
									"top": y
								}).show();
								$(".showbox_con li:even").css("background", "#eef7fc");
								$("#loadcb33close").click(function() {
									sho.html("");
									sho.hide()
								})
							}
						}
						cell.innerHTML = d;
						this.Days[d] = cell;
						var on = new Date(this.Year, this.Month - 1, d);
						this.IsSame(on, new Date()) && this.onToday(cell);
						this.SelectDay && this.IsSame(on, this.SelectDay) && this.onSelectDay(cell)
					}
				}
				row.appendChild(cell)
			}
			frag.appendChild(row)
		}
		while (this.Container.hasChildNodes()) {
			this.Container.removeChild(this.Container.firstChild)
		}
		this.Container.appendChild(frag);
		this.onFinish()
	},
	IsSame: function(d1, d2) {
		return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate())
	}
}