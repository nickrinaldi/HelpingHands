import re
import math

categories = ["food", "hospitality", "room", "shelter", "housing", "health"]
keyboardDic = {}

def buildKeyboardDic():
	keyboardDic['q'] = (1, 1)
	keyboardDic['w'] = (1, 2)
	keyboardDic['e'] = (1, 3)
	keyboardDic['r'] = (1, 4)
	keyboardDic['t'] = (1, 5)
	keyboardDic['y'] = (1, 6)
	keyboardDic['u'] = (1, 7)
	keyboardDic['i'] = (1, 8)
	keyboardDic['o'] = (1, 9)
	keyboardDic['p'] = (1, 10)
	keyboardDic['a'] = (2, 1)
	keyboardDic['s'] = (2, 2)
	keyboardDic['d'] = (2, 3)
	keyboardDic['f'] = (2, 4)
	keyboardDic['g'] = (2, 5)
	keyboardDic['h'] = (2, 6)
	keyboardDic['j'] = (2, 7)
	keyboardDic['k'] = (2, 8)
	keyboardDic['l'] = (2, 9)
	keyboardDic['z'] = (3, 1)
	keyboardDic['x'] = (3, 2)
	keyboardDic['c'] = (3, 3)
	keyboardDic['v'] = (3, 4)
	keyboardDic['b'] = (3, 5)
	keyboardDic['n'] = (3, 6)
	keyboardDic['m'] = (3, 7)

def characterDistance(char1, char2):
	coord1 = keyboardDic[char1]
	coord2 = keyboardDic[char2]

	yDistance = abs(coord1[0] - coord2[0])
	xDistance = abs(coord1[1] - coord2[1])
	return xDistance + yDistance

# returns the manhattan distance between a word and the closest category
def wordManhattanDistance(word):
	result = (None, None)

	if not re.match(r'[a-z]*', word):
		return result

	if len(keyboardDic) == 0:
		buildKeyboardDic()

	for category in categories:
		distance = 0
		for categoryChar, wordChar in zip(category, word):
			distance += characterDistance(categoryChar, wordChar)

		distance += abs(len(category) - len(word))

		if distance < 4:
			result = (category, distance)


	return result