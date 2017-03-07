#!/usr/bin/python

from flask import Flask, request, redirect
import twilio.twiml
import re
import firebase


app = Flask(__name__)

categories = set()
categories.add("food")
categories.add("hospitality")
categories.add("health")
categories.add("other")


@app.route("/", methods=['GET', 'POST'])
def respond():
    """Respond and greet the caller by name."""



    request_body = request.values.get('Body', None)
    request_city = request.values.get('FromCity', None)

    if(request_body != None):
    	#Parse the requests
    	tokens_list = re.split("[, .!?]", request_body)
    	tokens = set([x.lower() for x in tokens_list])
    	print tokens

    	current_category = "other"
    	for category in categories:
    		if(category in tokens):
    			current_category = category





    regex = re.compile('(^\w+\s+\d+\s\d+:\d+:\d+ )([\w_-]+ )(\d+\.\d+\.\d+\.\d+)( MACAUTH: Port )(\d+\/\d+\/\d+)( Mac )([0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{4})( - authentication failed.*)')
    
    from_number = request.values.get('From', None)
    from_message = request.values.get('message', None)

    message = "Monkey, thanks for the message!"

    resp = twilio.twiml.Response()
    resp.message(message)

    return str(resp)

if __name__ == "__main__":
    app.run(debug=True)



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
