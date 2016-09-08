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
        NEUTRAL :' ',
        MALE : 'M',
        FEMALE:'F'
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
    },
    //Facebook app ids 
    FACEBOOK_ID:
    {
        FACEBOOK_APP_ID : "1667420520161039",
        FACEBOOK_APP_SECRET: "bb797891d7fdc9702963821570a4900d"
    },
    //Facebook information for inteligent analysis
    FACEBOOK_INFORMATION :
    ['likes.limit(100){about}','posts.limit(100){message,message_tags}','feed.limit(100){story,message}','quotes'],
    //search by location , KM: 6371 , MILES 3959
    LOCATION_SEARCH:
    {
        TYPE : "KM",
        VALUE : 6371
    },
    //MAX value for coordinates
    COORDINATES_MAX:
    {
       LATITUDE_MAX:90,
       LATITUDE_MIN:-90,
       LONGITUDE_MAX:180,
       LONGITUDE_MIN:-180
    }  
	
};
module.exports =constants;