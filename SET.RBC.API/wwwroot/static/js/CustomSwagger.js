(function () {

    function getJwt(user, pass, success, error, complete) {
        //console.log('getJwt ', user);
        $.ajax({
            url: '/api/Account/Authenticate',
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                username: user,
                password: pass
            }),
            success: function (data) {
                success && success(data.token);
            },
            error: function (jqXhr, err, msg) {
                error && error(JSON.parse(jqXhr.responseText).error_description);

            },
            complete: complete
        });
    }

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        
        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
          valueSetter.call(element, value);
        }
    }

    function setJwt(key) {
        //console.log("setJwt ", key);
        var inputAuth = $('.auth-container :input[type=text]')[0];
        //inputAuth.off().val("Bearer " + key).change();
        //inputAuth.attr('value', 'Bearer ' + key);
        try {
            setNativeValue(inputAuth, 'Bearer ' + key);
            inputAuth.dispatchEvent(new Event('input', { bubbles: true }));
        }
        catch (err) {
            //console.log(err.message);
        }
    }

    $(function () {        
        setTimeout(() => {    
           
            //$('.btn.authorize').click(function () {
            $(document).on("click", '.btn.authorize', function () {
                window.localStorage.removeItem('key');
                var autBtnWrapper = $('.auth-btn-wrapper');
                //if (autBtnWrapper.length > 1) {
                //    $('.auth-btn-wrapper').first().remove();
                //}
                var inputAuth = $('.auth-container :input[type=text]').eq(1);
                inputAuth.val('Bearer ');

                var inputEvent = $(':input[name=username],:input[name=password]');
                //inputEvent.off().on('change', function () {
                    var user = $(':input[name=username]').val();
                    var pass = $(':input[name=password]').val();
                    if (user && pass) {
                        inputAuth.prop("disabled", true);
                        inputAuth.val("Please wait as we get your token...");
                        getJwt(user, pass,
                            function (jwt) {
                                if (jwt !== undefined) {
                                    inputAuth.css('background', '#65f30f');
                                    setJwt(jwt);
                                    window.localStorage.setItem('key', jwt);
                                } else {
                                    console.log('Check the json response for typo and casing...');
                                }
                            },
                            function (err) {
                                inputAuth.css('background', '#fd7474');
                                alert('Invalid login. ', err);
                                inputAuth.val('');
                                inputEvent.eq(1).val('');
                                inputEvent.eq(1).focus();
                            }, function () {
                                inputAuth.prop("disabled", false);
                                $(".auth-container:last form .auth-btn-wrapper .authorize").click();
                            });
                    }
                //});

                setTimeout(() => {
                   
                    var oldKey = window.localStorage.getItem('key');
                    if (oldKey) {
                        setJwt(oldKey);
                    }
                }, 2000);
            });

        }, 2000);
    });
})();