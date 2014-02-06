console.log("Loading PageModel class");
    //$ = $ || jQuery || document.querySelectorAll;

$('#sound-label').click(function () {
	if ($(this).text() == 'sound on') {
		$('#sound').get(0).pause();
		$(this).text('sound off');
	} else if ($(this).text() == 'sound off') {
		$('#sound').get(0).play();
		$(this).text('sound on');
	}
});
	
function PageModel(options) {
    options = options || {};
    // Privates
    var veilClass = options.veilClass || "loadingVeil";
    var waitingVeilClass = options.waitingVeilClass || "waitingVeil";
    var wrapperClass = options.wrapperClass || "wrapper";

    var removeLoadingVeil = function() {
        $("." + veilClass).hide();
        return this;
    };

    var removeWaitingVeil = function() {
        $("." + wrapperClass).show();
        $("." + waitingVeilClass).hide();
        return this;
    };

    var showVeil = function(){
        $("." + veilClass).show();
        $("." + wrapperClass).hide();
        return this;
    };

    var setWaitingVeil = function(){
        $("." + waitingVeilClass).show();
        $("." + veilClass).hide();
        $("." + wrapperClass).hide();
        return this;
    };

    return {
        // Publics
        removeLoadingVeil: removeLoadingVeil,
        removeWaitingVeil: removeWaitingVeil,
        showLoadingVeil: showVeil,
        showWaitingVeil: setWaitingVeil
    };
}

module.exports = PageModel;