import re

categories = ["food", "hospitality", "room", "shelter", "housing", "health"]

def parseMessage(message):
	#Parse the requests
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