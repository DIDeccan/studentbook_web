from rest_framework.response import Response
from datetime import timedelta

def api_response(message="", message_type="info", data=None, status_code=200):
    """
    Standardized API response format.
    
    message_type: success | warning | error | info
    """
    if data:
        return Response({
            "message": message,
            "message_type": message_type,
            "data": data
        }, status=status_code)
    else:
        return Response({   
            "message": message,
            "message_type": message_type
        }, status=status_code)




def parse_duration(duration_str):
    """
    Convert "MM:SS" or "HH:MM:SS" string to timedelta.
    """
    if not duration_str:
        return None
    parts = duration_str.split(":")
    if len(parts) == 2:  # MM:SS
        minutes, seconds = map(int, parts)
        return timedelta(minutes=minutes, seconds=seconds)
    elif len(parts) == 3:  # HH:MM:SS
        hours, minutes, seconds = map(int, parts)
        return timedelta(hours=hours, minutes=minutes, seconds=seconds)
    return None