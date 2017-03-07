#!/usr/bin/python

from flask import Flask, request, redirect
import twilio.twiml
import re
import firebase
import requests
import json

app = Flask(__name__)

categories = ["food", "hospitality", "room", "shelter", "housing", "health"]


@app.route("/", methods=['GET', 'POST'])
def respond():

    request_body = request.values.get('Body', None)
    if(request_body == None):
        resp = twilio.twiml.Response()
        resp.message("Please send a text like: \"Show me food in San Jose\"")
        return

    (request_category, request_city) = parse_message(request_body)
    message = get_database_results(request_category, request_city)

    resp = twilio.twiml.Response()
    resp.message(message)

    return str(resp)

def parse_message(message):
    tokens_list = re.split("[, .!?]", message)
    tokens = [x.lower() for x in tokens_list]
    print tokens

    current_category = "other"
    cityFlag = 0
    city = ""

    for token in tokens:
	    if token in categories:
		    current_category = token
		    if token == "room" or token == "shelter" or token == "housing":
			    current_category = "hospitality"
	    elif token == "in":
		    cityFlag = 1
	    elif cityFlag == 1:
		    city += (token + " ")

    city = city[:-1]

    return (current_category, city)

def get_database_results(category, city):
    r = requests.get("https://helping-hand-c061d.firebaseio.com/events.json")
    events_found = json.loads(r.text)
    events_to_return = []

    for key, value in events_found.iteritems():
    	if(category == value["category"] and city==None):
    		events_to_return.append(value)
    	elif category == value["category"] and city.lower() in value["address"].lower():
    		events_to_return.append(value)
    	if(len(events_to_return)>=3):
    		break

    return_str = ""
    count = 1
    for event in events_to_return:
        return_str += (str(count) + ".\nEvent Name: " + event["eventName"] + "\nDate: " + 
        			event["date"] + "\nTime: " + event["startTime"] + " - " + event["endTime"] + 
        			"\nDescription: " + event["description"] + "\nLocation: " + event["address"] + "\n\n")
        count += 1

    return return_str

 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


    """
    CombinedMultiDict([ImmutableMultiDict([]),
    	ImmutableMultiDict([('FromZip', u'95148'), ('From', u'+14088237153'),
    		('SmsMessageSid', u'SMf494a28da3f1eebd30fb8df6d845c605'),
    		('FromCity', u'SAN JOSE'), ('ApiVersion', u'2010-04-01'),
    		('To', u'+15623747798'), ('NumMedia', u'0'), ('NumSegments', u'1'),
    		('AccountSid', u'ACe6feb509ceefe78d8ae0c5a54b37a130'),
    		('SmsSid', u'SMf494a28da3f1eebd30fb8df6d845c605'), ('ToCity', u''),
    		('FromState', u'CA'), ('FromCountry', u'US'), ('Body', u'Hi'), 
    		('MessageSid', u'SMf494a28da3f1eebd30fb8df6d845c605'),
    	('SmsStatus', u'received'), ('ToZip', u''), ('ToCountry', u'US'), ('ToState', u'CA')])])
    """





