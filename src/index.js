import Vue from 'vue';
 
function component() {
    var element = document.createElement('div');
	var btn = document.createElement('button');
	element.innerHTML  ='hello webpack';
	btn.innerHTML = 'Click me and check the console';
	btn.onclick = function(){
		import('./ba.js').then(function(printMe){
			console.log(printMe);
			printMe.default();
		});
	};
    element.appendChild(btn);
    return element;
  }

document.body.appendChild(component());

new Vue({
	el:'#app',
	data:{
		name:'xianjian'
	}
});