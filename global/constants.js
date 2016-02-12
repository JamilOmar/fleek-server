const constants=
{
    //by user id
	REDIS_USER : "USER-",
    //by service type id - list
	REDIS_SERVICE_TYPE : "SERVICE_TYPE-LANGUAGE-",
    //by service  id - list
	REDIS_SERVICE : "SERVICE-",
    //by user id - list
	REDIS_USER_DEVICE : "USER_DEVICE-",
    //by user id - list
    REDIS_PROVIDER_SCHEDULE : "REDIS_PROVIDER_SCHEDULE-",
    //Language for service and service type
	LANGUAGE : "-LANGUAGE-",
    //requests states
    REQUEST_STATES :
    {
        REQUESTED : 0,
        APPROVED :1,
        REJECTED :-1
        
    }
    
	
};
module.exports =constants;