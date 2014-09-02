define(["jquery"],
function($)
{
    var Synchro = {
        baseUrl: 'http://www.myfuelapp.com/synchro/',
        //baseUrl: 'http://myfuel/synchro/',
        /**
         * @param String login
         * @param String pass
         * @param function success
         * @param function error
         * @returns int
         */
        createAccount: function(login, pass, success, error) {
            $.getJSON(this.baseUrl+'user/create/', {'login' : login, 'pass' : pass}).done(success).fail(error);
        },
                
        /**
         * @param String login
         * @param String pass
         * @param function success
         * @param function error
         * @returns int
         */
        login: function(login, pass, success, error) {
            $.getJSON(this.baseUrl+'user/login/', {'login' : login, 'pass' : pass}).done(success).fail(error);
        },
                
        setAutoData: function(autoData, success, error) {
            $.getJSON(this.baseUrl+'synchro/setAutoData/', {'json' : autoData}).done(success).fail(error);
        },
                
        clearAfterSetAutoData: function(success, error) {
            $.getJSON(this.baseUrl+'synchro/clearAfterSetAutoData/', {}).done(success).fail(error);
        },
                
        getAuta: function(success, error) {
            $.getJSON(this.baseUrl+'synchro/getAuta/', {}).done(success).fail(error);
        },
                
        getAutoData: function (autoId, success, error) {
            $.getJSON(this.baseUrl+'synchro/getAutoData/', {'autoId' : autoId}).done(success).fail(error);
        },
                
        setUstawieniaData: function(ustawieniaData, success, error) {
            $.getJSON(this.baseUrl+'synchro/setUstawieniaData/', {'json' : ustawieniaData}).done(success).fail(error);
        }
    };


    return Synchro;

});