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
    //requests states for friendships
    REQUEST_STATES :
    {
        REQUESTED : 0,
        APPROVED :1,
        REJECTED :-1
        
    },
    //requests states for reservations
    REQUEST_STATES_RESERVATION :
    {
        SUBMITED : 0,
        APPROVED :1,
        COMPLETED :2,
        CANCELED :-1
        
    },
     //namespace for context value
    USER_CONTEXT_NAMESPACE : "USER_CONTEXT_NAMESPACE",
    //user for context value
    USER_CONTEXT :"USER_CONTEXT",
    //Gender
    USER_GENDER:
    {
        NEUTRAL :0,
        MALE : 1,
        FEMALE:2
    },
    //provider's workflow state
    USER_PROVIDER_STATES:
    {
        REQUESTED : 0,
        APPROVED :1,
        CANCELED :-1
    },
       //RATING
    RATING:
    {
        MIN :0,
        MAX:5
    }
    
	
};
module.exports =constants;