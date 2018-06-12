/**
 * author: cj
 */
const JsCallApp = (function(){

	/**
	 * 打开app
	 */
	function openApp(packageName){
		if(!window.jsObj || !window.jsObj.HtmlCallJavaOpenApp){
			showUpdateAppstoreNotice();
		}
		window.jsObj.HtmlCallJavaOpenApp(packageName);
	}

	/**
	 * 返回app在用户手机中的状态
	 */
	function getAppStatus(packageName,appId,versionCode){
		if(!window.jsObj || !window.jsObj.HtmlCallJavaCheckApp){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.HtmlCallJavaCheckApp(packageName,appId,versionCode);
	}

	/**
	 * 返回app在用户手机中的进度(下载或暂停状态需要)
	 */
	function getAppProcess(packageName){
		if(!window.jsObj || !window.jsObj.jsCallGetAppProcess){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallGetAppProcess(packageName);
	}

	/**
	 * 获得用户登录信息：如果有，返回对象；如果无，返回null
	 */
	function getUserLoginInfo(){
		if(window.jsObj && window.jsObj.jsCallGetUserLoginInfo){
      return window.jsObj.jsCallGetUserLoginInfo();
		} else{
      showUpdateAppstoreNotice();
    }
	}

	/**
	 * 获得用户应用市场的版本号
	 */
	function getAppstoreVersionCode(){
		if(!window.jsObj || !window.jsObj.jsCallGetAppstoreVersionCode){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallGetAppstoreVersionCode();
	}

	/**
	 * 跳转致登录界面
	 */
	function jumpToLogin(){
		if(!window.jsObj || !window.jsObj.jsCallJumpToLogin){
			showUpdateAppstoreNotice();
		}
		window.jsObj.jsCallJumpToLogin();
	}

	/**
	* 检测登录状态（true、false）
	*/
	function checkLogin(){
		if(!window.jsObj || !window.jsObj.jsCallCheckLogin){
			showUpdateAppstoreNotice();
			return false;
		}
		return window.jsObj.jsCallCheckLogin();
	}

	/**
	 * 跳转致应用升级页面
	 */
	function jumpToAppstoreUpdate(){
		if(!window.jsObj || !window.jsObj.jsCallJumpToAppstoreUpdate){
			alert("请先升级应用市场再打开此页面");
		}
		return window.jsObj.jsCallJumpToAppstoreUpdate();
	}

	/**
	 * 调用客户端弹一个吐司(吐司内容)
	 */
	function alertAToast(value){
		if(!window.jsObj || !window.jsObj.jsCallAlertAToast){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallAlertAToast(value);
	}

	/**
	 * 客户端调用http请求服务器(类型，链接，参数) 同步 无回调
	 */
	function requestServer(url, params){
		if(!window.jsObj || !window.jsObj.jsCallRequestServer){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallRequestServer(url, params);
	}

	/**
	 * 客户端调用http请求服务器(类型，链接，参数) 异步 成功 回调 requestServerByAsyncCallBack
	 */
	function requestServerByAsync(url, params, type){
		if(!window.jsObj || !window.jsObj.jsCallRequestServer){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallRequestServerByAsync(url, params, type);
	}

	/**
	 * 调用客户端过滤应用，并返回过滤完成之后的应用列表(应用json串)
	 */
	function filterApps(appsJson){
		if(!window.jsObj || !window.jsObj.jsCallFilterApps){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallFilterApps(appsJson);
	}

	/**
	 * 调用客户端初始化各应用状态，并返回应用列表(应用json串)
	 */
	function initStatusApps(appsJson){
		if(!window.jsObj || !window.jsObj.jsCallInitStatusApps){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallInitStatusApps(appsJson);
	}

	/**
	 * 调用客户端弹出confirm窗口(参数)：
	 * return: true/false
	 */
	function confirmText(text, callback){
		if(!window.jsObj || !window.jsObj.jsCallConfirmText){
			showUpdateAppstoreNotice();
			//alert('请先升级应用市场再打开此页面');
		}
		return window.jsObj.jsCallConfirmText(text, callback);
	}

	/**
	 * 调用获取用户消息头信息
	 */
	function getUserHeader(){
		if(!window.jsObj || !window.jsObj.jsCallUserHeader=== undefined){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallUserHeader();
	}

	/**
	 * 判断是不是系统版或三方手机（true/false）
	 */
	function isSystemAppstore(){
		if(!window.jsObj || !window.jsObj.jsCallIsSystemAppstore=== undefined){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallIsSystemAppstore();
	}

	/**
	 * 这里处理提示用户升级应用市场的信息
	 */
	function showUpdateAppstoreNotice(){
		if(!window.jsObj || !window.jsObj.jsCallConfirmText){
			// alert('请先升级应用市场再打开此页面');
			// showDialog('请先升级应用市场到最新版本再参与活动哟，进入【设置】-【关于】-【版本更新】','确定');
		}else{
			window.jsObj.jsCallConfirmText('请先升级应用市场到最新版本再参与活动哟，进入【设置】-【关于】-【版本更新】', 'jumpToAppstoreUpdate()');
		}
	}

	/**
	* 这里选择下载、安装、打开 app的操作
	*/
	function handleAppAction(appJson, action){
		if(!window.jsObj || !window.jsObj.jsCallHandleAppAction){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallHandleAppAction(appJson, action);
	}

	/**
	* 单纯将参数传递致客户端app
	*/
	function transferParam(param){
		if(!window.jsObj || !window.jsObj.jsCallTransferParam){
			showUpdateAppstoreNotice();
		}
		return window.jsObj.jsCallTransferParam(param);
	}
	/**
	* 获取当前app名称: gamecenter || appstore
	*/
	function getApplicationName(){
		if(!window.jsObj || !window.jsObj.jsCallGetApplicationName){
			return null
		}
		return window.jsObj.jsCallGetApplicationName();
	}

	return {
		openApp, //打开app
		getAppStatus, //获得app状态
		getUserLoginInfo, //登录判断
		alertAToast, //吐司
		requestServer, //代理加密请求
		jumpToAppstoreUpdate, //跳转致关于
		confirmText,
		initStatusApps, //过滤apps
		getAppProcess,  //获得下载进度
		getAppstoreVersionCode,  //返回app版本号
		jumpToLogin, //跳转致登录
		checkLogin, //检测登录状态
		handleAppAction,  //这里选择下载、安装、打开 app的操作
		isSystemAppstore, //判断是不是系统或三方版本
		requestServerByAsync,  //代理加密请求  异步
		transferParam, //单纯将参数传递致客户端app
		showUpdateAppstoreNotice, //弹窗更新
        getApplicationName //获取当前应用appstore  gamecenter
	};
})();

const WebUtils = (function(){
	function sizeFormat(val) {
		var fm = '';
		var u = 0;
		while (u < 4 && val > 1024) {
			u++;
			val /= 1024;
		}
		var unit = 'Byte';
		switch (u) {
		case 1:
			unit = 'KB';
			break;
		case 2:
			unit = 'MB';
			break;
		case 3:
			unit = 'GB';
			break;
		case 4:
			unit = 'TB';
		}
		fm += val.toFixed(2) + unit;
		return fm;
	}

	function timesFormat(val) {
		var fm = '';
		var u = 0;
		while (u < 2 && val > 10000) {
			u++;
			val /= 10000;
		}
		var unit = '';
		switch (u) {
		case 1:
			unit = '万';
			break;
		case 2:
			unit = '亿';
			break;
		}
		fm += val.toFixed(0) + unit;
		return fm;
	}

	return {
		sizeFormat: sizeFormat,
		timesFormat: timesFormat
	};
})();

const FINAL_DOWNLOAD = 4096;  //下载
const FINAL_UPDATE = 4101;  //更新 - 应用需要更新
const FINAL_OPEN = 4100;	//打开 - 应用已经被安装
const FINAL_PAUSE = 4098;  //暂停 - 应用被暂停
const FINAL_INSTALL = 4099; //安装 - 应用完成下载但未安装
const FINAL_INSTALL_ING = 4103; //安装中
const FINAL_DOWNLOAD_ING = 4097;  //下载
const FINAL_WAITING = 4102;  //等待下载
export const appState = {
  FINAL_DOWNLOAD,
  FINAL_UPDATE,
  FINAL_OPEN,
  FINAL_PAUSE,
  FINAL_INSTALL,
  FINAL_INSTALL_ING,
  FINAL_DOWNLOAD_ING,
  FINAL_WAITING,
};
//刷新按钮状态
function refreshButtonDisplay(obj, value){
	$(obj).attr('data',value);
	if(value == '领取'){
		$(obj).removeClass('blue');
		$(obj).addClass('get');
	}else{
		$(obj).removeClass('get');
		$(obj).addClass('blue');
	}
}

//刷进度调
function refreshProgressDisplay(obj, value){
//	if($(obj).parent().attr('data') == '安装中'){
//		$(obj).css({width: '100%'});
//		return;
//	};
	if(value == '0%'){
		$(obj).hide();
	}else{
		$(obj).show();
	}
	$(obj).css({width: value});
}

//刷新应用按钮状态，公共部份提取
function initAppStatusForEach(objButton,objSpan,app,i){
	var istatus = JsCallApp.getAppStatus(app.packageName,app.id,app.versionCode);
	if(istatus == FINAL_OPEN){//打开
		if(app.istatus == 0){
			app.action = "get";
			refreshButtonDisplay(objButton,'领取');
			refreshProgressDisplay(objSpan,'0%');
		}else{
			app.action = "open";
			refreshProgressDisplay(objSpan,'0%');
			refreshButtonDisplay(objButton,'打开');
		}
	}else if(istatus == FINAL_UPDATE){//更新
		//app.action = "update";//继续下载
		//refreshButtonDisplay(objButton, '更新');
		app.action = "open";
		refreshButtonDisplay(objButton, '打开');
	}else if(istatus == FINAL_DOWNLOAD){ //下载
		app.action = "download";//继续下载
		if(JsCallApp.isSystemAppstore()){
			refreshButtonDisplay(objButton,'安装');
		}else{
			refreshButtonDisplay(objButton, '下载');
		}
	}else if(istatus == FINAL_PAUSE){//暂停
		app.action = "continue";//继续下载
		refreshButtonDisplay(objButton, '继续');
		var progress = JsCallApp.getAppProcess(app.packageName);
		refreshProgressDisplay(objSpan, progress.toFixed(1)+'%');
	}else if(istatus == FINAL_INSTALL){ //安装
		app.action = "install";//继续下载
		if(JsCallApp.isSystemAppstore()){
			refreshProgressDisplay(objSpan, '100%');
			refreshButtonDisplay(objButton,'安装中');
		}else{
			refreshProgressDisplay(objSpan, '0%');
			refreshButtonDisplay(objButton, '安装');
		}
	}else if(istatus == FINAL_INSTALL_ING){
		app.action = "install"; //安装中
		refreshProgressDisplay(objSpan, '100%');
		refreshButtonDisplay(objButton,'安装中');
	}else if(istatus == FINAL_DOWNLOAD_ING){
		app.action = "pause";//继续下载
		//refreshButtonDisplay(objButton, '暂停');
		var progress = JsCallApp.getAppProcess(app.packageName);
		refreshButtonDisplay(objButton, progress.toFixed(1)+'%');
		refreshProgressDisplay(objSpan, progress.toFixed(1)+'%');
	}else if(istatus == FINAL_WAITING){
		app.action = "pause";//等待下载
		refreshButtonDisplay(objButton, '等待中');
	}
}

//刷新应用按钮状态，公共部份提取
function javaCallJsChangeStatusForEach(objButton,objSpan,app,packName,status,progress){
	if(packName == app.packageName){
		if(status == 1){//下载完成
			app.action = "install"; //安装
			refreshProgressDisplay(objSpan,'100%');
			refreshButtonDisplay(objButton, '安装');
		}else if(status == 6){//安装成功
			if(app.istatus == 0){
				app.action = "get";
				refreshButtonDisplay(objButton,'领取');
				refreshProgressDisplay(objSpan,'0%');
			}else{
				app.action = "open";
				refreshProgressDisplay(objSpan,'0%');
				refreshButtonDisplay(objButton,'打开');
			}
		}else if(status == 5){//进度通知
			app.action = "pause"; //暂停
			refreshProgressDisplay(objSpan, progress.toFixed(1)+'%');
			//refreshButtonDisplay(objButton, '暂停');
			refreshButtonDisplay(objButton, progress.toFixed(1)+'%');
		}else if(status == 4){//暂停
			app.action = "continue";//继续下载
			refreshProgressDisplay(objSpan, progress.toFixed(1)+'%');
			refreshButtonDisplay(objButton, '继续');
		}else if(status == 0){
			app.action = "pause";//继续下载
			refreshButtonDisplay(objButton, '等待中');
		}
	}
}

//请求服务器获得抽奖结果
function callServerGetAwardResp(){
	let person = JSON.parse(JsCallApp.getUserLoginInfo());
	if(person!=null && person.userId != null){
		let resp = JSON.parse(JsCallApp.requestServerByAsync('/web/draw', 'accountId='+person.userId+'&tel='+person.phone+'&activityId='+detail.id, 'draw'));
		return resp;
	}
	return null;
}

function alertObj(myObject){
	let text = '';
	for (prop in myObject)
	{
		text +=  prop + ' = '+ myObject[prop]+'\n';
	}
	alert(text);
}

export default JsCallApp;

