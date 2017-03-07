#!/usr/bin/python

import sys
from ast import literal_eval
from info_parser import parseMessage

response = parseMessage(sys.argv[1])
print response